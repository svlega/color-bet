import { useEffect, useState } from 'react';
import * as s from './styles.css';

interface Props {
  balance: number;
  lastResult: { won: boolean; delta: number } | null;
}

export function Wallet({ balance, lastResult }: Props) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!lastResult) return;
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 300);
    return () => clearTimeout(t);
  }, [lastResult]);

  return (
    <div className={s.container}>
      <span className={s.label}>Balance</span>
      <span className={`${s.balance} ${animating ? s.animating : ''}`}>
        {balance.toLocaleString()}
      </span>
      {lastResult && (
        <span className={`${s.delta} ${lastResult.won ? s.win : s.loss}`}>
          {lastResult.delta > 0 ? '+' : ''}{lastResult.delta}
        </span>
      )}
    </div>
  );
}
