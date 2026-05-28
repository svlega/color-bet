import { describe, it, expect } from 'vitest';
import {
  resolveResult,
  calculatePayout,
  getNextPhase,
  isValidBetAmount,
  PAYOUT_MULTIPLIER,
  PHASE_DURATIONS,
} from './index';

describe('resolveResult', () => {
  it('returns only RED or BLACK', () => {
    const results = new Set(Array.from({ length: 100 }, resolveResult));
    expect(results).toEqual(new Set(['RED', 'BLACK']));
  });

  it('is roughly 50/50 over many trials', () => {
    const trials = 10_000;
    const reds = Array.from({ length: trials }, resolveResult).filter((r) => r === 'RED').length;
    // Allow 5% deviation from 50%
    expect(reds).toBeGreaterThan(trials * 0.45);
    expect(reds).toBeLessThan(trials * 0.55);
  });
});

describe('calculatePayout', () => {
  it('returns 0 on a loss', () => {
    expect(calculatePayout(500, false)).toBe(0);
  });

  it('returns floored payout on a win', () => {
    expect(calculatePayout(100, true)).toBe(Math.floor(100 * PAYOUT_MULTIPLIER));
  });

  it('floors fractional payouts', () => {
    // 33 * 1.9 = 62.7 → should floor to 62
    expect(calculatePayout(33, true)).toBe(62);
  });
});

describe('getNextPhase', () => {
  it('cycles BETTING → CLOSING → RESULT → BETTING', () => {
    expect(getNextPhase('BETTING')).toBe('CLOSING');
    expect(getNextPhase('CLOSING')).toBe('RESULT');
    expect(getNextPhase('RESULT')).toBe('BETTING');
  });
});

describe('isValidBetAmount', () => {
  it('accepts valid bets', () => {
    expect(isValidBetAmount(100, 1000)).toBe(true);
    expect(isValidBetAmount(10, 10)).toBe(true);
  });

  it('rejects bets below minimum', () => {
    expect(isValidBetAmount(9, 1000)).toBe(false);
  });

  it('rejects bets exceeding balance', () => {
    expect(isValidBetAmount(500, 400)).toBe(false);
  });

  it('rejects non-integer amounts', () => {
    expect(isValidBetAmount(99.5, 1000)).toBe(false);
  });
});

describe('PHASE_DURATIONS', () => {
  it('has durations for all phases', () => {
    expect(PHASE_DURATIONS.BETTING).toBeGreaterThan(0);
    expect(PHASE_DURATIONS.CLOSING).toBeGreaterThan(0);
    expect(PHASE_DURATIONS.RESULT).toBeGreaterThan(0);
  });
});
