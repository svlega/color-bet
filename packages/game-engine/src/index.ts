import type { BetChoice, GamePhase } from '@color-bet/shared-types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const PHASE_DURATIONS: Record<GamePhase, number> = {
  BETTING: 20,
  CLOSING: 5,
  RESULT: 5,
};

// 1.9x payout = 5% house edge. Industry-standard for simple binary bets.
export const PAYOUT_MULTIPLIER = 1.9;

// ─── Pure functions — easy to unit-test, zero side effects ───────────────────

export function resolveResult(): BetChoice {
  return Math.random() < 0.5 ? 'RED' : 'BLACK';
}

export function calculatePayout(amount: number, won: boolean): number {
  if (!won) return 0;
  return Math.floor(amount * PAYOUT_MULTIPLIER);
}

export function getNextPhase(current: GamePhase): GamePhase {
  const sequence: GamePhase[] = ['BETTING', 'CLOSING', 'RESULT'];
  return sequence[(sequence.indexOf(current) + 1) % sequence.length];
}

export function isValidBetAmount(amount: number, balance: number): boolean {
  return Number.isInteger(amount) && amount >= 10 && amount <= balance;
}
