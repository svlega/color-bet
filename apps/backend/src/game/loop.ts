import type { Server } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents, BetChoice, GamePhase } from '@color-bet/shared-types';
import { resolveResult, PHASE_DURATIONS, calculatePayout, isValidBetAmount } from '@color-bet/game-engine';
import { db } from '../db';
import { rounds as roundsTable, bets as betsTable, users } from '../db/schema';
import { redis } from '../redis';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents>;

// ─── Key design: bets are stored in Redis, not in-memory ─────────────────────
// When running multiple backend instances, bets placed on any instance are
// written to a shared Redis hash. Only the "leader" instance runs the loop,
// but it can read all bets regardless of which instance received them.

export class GameLoop {
  private phase: GamePhase = 'BETTING';
  private timeLeft: number = PHASE_DURATIONS.BETTING;
  private roundId: string = uuidv4();
  private result: BetChoice | null = null;
  private io: IoServer | null = null;
  private ticking = false;
  private intervalId: NodeJS.Timeout | null = null;

  start(io: IoServer) {
    this.io = io;
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.broadcast();
    console.log('✓ Game loop started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('✓ Game loop stopped');
    }
  }

  async addBet(userId: string, amount: number, choice: BetChoice): Promise<{ ok: boolean; error?: string }> {
    if (this.phase !== 'BETTING') {
      return { ok: false, error: 'Betting is closed for this round' };
    }

    // Fetch current balance for validation
    const [user] = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId));
    if (!user) return { ok: false, error: 'User not found' };
    if (!isValidBetAmount(amount, user.balance)) {
      return { ok: false, error: `Bet must be between 10 and ${user.balance}` };
    }
    const betKey = `game:bets:${this.roundId}`;
    const placed = await redis.hsetnx(betKey, userId, JSON.stringify({ choice, amount }));
    await redis.expire(betKey, 120);

    if (placed === 0) {
      return { ok: false, error: 'You already placed a bet this round' };
    }

    return { ok: true };
  }

  getState() {
    return {
      id: this.roundId,
      phase: this.phase,
      timeLeft: this.timeLeft,
      result: this.result,
      totalBets: 0,
    };
  }

  private async tick() {
    if (this.ticking) return; // guard against slow async ticks stacking up
    this.ticking = true;
    try {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        await this.advancePhase();
      } else {
        this.broadcast();
      }
    } finally {
      this.ticking = false;
    }
  }

  private async advancePhase() {
    if (this.phase === 'BETTING') {
      this.phase = 'CLOSING';
      this.timeLeft = PHASE_DURATIONS.CLOSING;
    } else if (this.phase === 'CLOSING') {
      this.result = resolveResult();
      this.phase = 'RESULT';
      this.timeLeft = PHASE_DURATIONS.RESULT;
      await this.settleRound();
    } else {
      // Start a fresh round
      this.phase = 'BETTING';
      this.timeLeft = PHASE_DURATIONS.BETTING;
      this.roundId = uuidv4();
      this.result = null;
    }
    this.broadcast();
  }

  private async settleRound() {
    if (!this.result) return;
    const result = this.result;
    const betKey = `game:bets:${this.roundId}`;

    try {
      await db.insert(roundsTable).values({ id: this.roundId, result });

      const rawBets = await redis.hgetall(betKey);

      for (const [userId, betJson] of Object.entries(rawBets)) {
        const bet = JSON.parse(betJson) as { choice: BetChoice; amount: number };
        const won = bet.choice === result;
        const payout = calculatePayout(bet.amount, won);
        const delta = won ? payout - bet.amount : -bet.amount;

        await db.insert(betsTable).values({
          userId,
          roundId: this.roundId,
          choice: bet.choice,
          amount: bet.amount,
          won,
          payout,
        });

        const [updated] = await db
          .update(users)
          .set({ balance: sql`balance + ${delta}` })
          .where(eq(users.id, userId))
          .returning({ balance: users.balance });

        this.io?.to(`user:${userId}`).emit('wallet:update', {
          balance: updated.balance,
          delta,
          won,
        });
      }
    } catch (err) {
      console.error('[GameLoop] settle error:', err);
    }
  }

  private broadcast() {
    // io.emit goes to all connected clients across all instances via Redis adapter
    this.io?.emit('round:update', this.getState());
  }
}

export const gameLoop = new GameLoop();
