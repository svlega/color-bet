import { useQuery } from '@tanstack/react-query';
import { fetchHistory } from '../../api/history';
import * as s from './styles.css';

export function History() {
  const { data: history = [] } = useQuery({
    queryKey: ['history'],
    queryFn: () => fetchHistory(),
  });

  return (
    <div className={s.container}>
      <div className={s.header}>Your bet history</div>
      {history.length === 0 ? (
        <div className={s.empty}>No bets yet — place your first bet!</div>
      ) : (
        history.map((item) => (
          <div key={item.id} className={`${s.row} ${item.won ? s.winRow : s.lossRow}`}>
            <span className={`${s.badge} ${item.choice === 'RED' ? s.redBadge : s.blackBadge}`}>
              {item.choice}
            </span>
            <span className={`${s.badge} ${item.result === 'RED' ? s.redBadge : s.blackBadge}`}>
              {item.result}
            </span>
            <span>{item.amount}</span>
            <span className={item.won ? s.winText : s.lossText}>
              {item.won ? `+${item.payout - item.amount}` : `-${item.amount}`}
            </span>
            <span style={{ color: '#888', fontSize: '11px' }}>
              {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
