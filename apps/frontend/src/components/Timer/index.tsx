import type { Round } from '@color-bet/shared-types';
import * as s from './styles.css';

interface Props {
  round: Round;
}

const PHASE_LABELS = {
  BETTING: 'Place your bets',
  CLOSING: 'Bets closed',
  RESULT: 'Result',
};

export function Timer({ round }: Props) {
  const isUrgent = round.timeLeft <= 5 && round.phase !== 'RESULT';

  return (
    <div className={s.wrapper}>
      <div className={`${s.phase} ${s.phaseLabel[round.phase] ?? ''}`}>
        {PHASE_LABELS[round.phase]}
      </div>
      <div className={`${s.countdown} ${isUrgent ? s.urgent : ''}`} data-testid="timer">
        {round.timeLeft}s
      </div>
    </div>
  );
}
