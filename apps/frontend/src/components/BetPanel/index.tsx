import { useState } from 'react';
import type { BetChoice, Round } from '@color-bet/shared-types';
import * as s from './styles.css';

interface Props {
  round: Round;
  balance: number;
  onBet: (choice: BetChoice, amount: number) => Promise<{ ok: boolean; error?: string }>;
}

export function BetPanel({ round, balance, onBet }: Props) {
  const [choice, setChoice] = useState<BetChoice | null>(null);
  const [amount, setAmount] = useState('100');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  const canBet = round.phase === 'BETTING' && !betPlaced;

  // Reset when a new round starts
  if (round.phase === 'BETTING' && betPlaced && round.timeLeft === 20) {
    setBetPlaced(false);
    setChoice(null);
    setStatus(null);
  }

  async function handleSubmit() {
    if (!choice || !canBet) return;
    const parsed = parseInt(amount, 10);
    if (!parsed || parsed < 10) {
      setStatus({ type: 'error', text: 'Minimum bet is 10' });
      return;
    }

    setLoading(true);
    const result = await onBet(choice, parsed);
    setLoading(false);

    if (result.ok) {
      setBetPlaced(true);
      setStatus({ type: 'success', text: `Bet placed! ${parsed} on ${choice}` });
    } else {
      setStatus({ type: 'error', text: result.error ?? 'Failed to place bet' });
    }
  }

  return (
    <div className={s.container}>
      <div className={s.colorButtons}>
        <button
          className={`${s.colorBtn} ${s.redBtn} ${choice === 'RED' ? s.selected : ''}`}
          onClick={() => setChoice('RED')}
          disabled={!canBet}
          data-testid="bet-red"
        >
          RED
        </button>
        <button
          className={`${s.colorBtn} ${s.blackBtn} ${choice === 'BLACK' ? s.selected : ''}`}
          onClick={() => setChoice('BLACK')}
          disabled={!canBet}
          data-testid="bet-black"
        >
          BLACK
        </button>
      </div>

      <div className={s.quickAmounts}>
        {[50, 100, 250, 500].map((v) => (
          <button key={v} className={s.quickBtn} onClick={() => setAmount(String(v))} disabled={!canBet}>
            {v}
          </button>
        ))}
      </div>

      <div className={s.amountRow}>
        <input
          className={s.input}
          type="number"
          min={10}
          max={balance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!canBet}
          data-testid="bet-amount"
        />
        <button
          className={s.submitBtn}
          onClick={handleSubmit}
          disabled={!choice || !canBet || loading}
          data-testid="place-bet"
        >
          {loading ? '...' : 'BET'}
        </button>
      </div>

      {status && (
        <div
          className={`${s.message} ${status.type === 'success' ? s.successMsg : s.errorMsg}`}
          data-testid={status.type === 'success' ? 'bet-placed' : 'bet-error'}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}
