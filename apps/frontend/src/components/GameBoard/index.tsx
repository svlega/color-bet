import type { Round } from '@color-bet/shared-types';
import * as s from './styles.css';

interface Props {
  round: Round;
}

export function GameBoard({ round }: Props) {
  if (round.phase === 'RESULT' && round.result) {
    return (
      <div className={s.board}>
        <div
          className={`${s.resultBadge} ${round.result === 'RED' ? s.redResult : s.blackResult}`}
          data-testid="result"
        >
          {round.result}
        </div>
      </div>
    );
  }

  return (
    <div className={s.board}>
      <div className={s.waitingText} data-testid="phase">
        {round.phase === 'BETTING' ? '? ? ?' : 'Calculating...'}
      </div>
      {round.totalBets > 0 && (
        <div className={s.totalBets}>{round.totalBets} bets placed</div>
      )}
    </div>
  );
}
