import { Router, type IRouter } from 'express';
import { requireAuth, type AuthRequest } from '../auth/middleware';
import { db } from '../db';
import { bets, rounds } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

const router: IRouter = Router();

router.get('/', requireAuth, async (req, res) => {
  const { userId } = (req as AuthRequest).user;
  const page = Number(req.query.page ?? 1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: bets.id,
      roundId: bets.roundId,
      choice: bets.choice,
      amount: bets.amount,
      won: bets.won,
      payout: bets.payout,
      createdAt: bets.createdAt,
      result: rounds.result,
    })
    .from(bets)
    .innerJoin(rounds, eq(bets.roundId, rounds.id))
    .where(eq(bets.userId, userId))
    .orderBy(desc(bets.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(rows);
});

export default router;
