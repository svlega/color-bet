import { useQuery } from '@tanstack/react-query';
import { useGame } from '../hooks/useGame';
import { fetchWallet } from '../api/wallet';
import { GameBoard } from '../components/GameBoard';
import { Timer } from '../components/Timer';
import { BetPanel } from '../components/BetPanel';
import { History } from '../components/History';
import { Wallet } from '../components/Wallet';
import type { User } from '@color-bet/shared-types';
import * as s from './Game.css';

interface Props {
  user: User;
  onLogout: () => void;
}

export function Game({ user, onLogout }: Props) {
  const { round, online, lastResult, placeBet } = useGame();

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
    initialData: { balance: user.balance },
  });

  if (!round) {
    return <div className={s.connecting}>Connecting...</div>;
  }

  return (
    <div className={s.layout}>
      <header className={s.header}>
        <div className={s.logo}>COLOR BET</div>
        <div className={s.headerRight}>
          <div className={s.onlinePill}>{online} online</div>
          <Wallet balance={wallet.balance} lastResult={lastResult} />
          <span className={s.username}>{user.username}</span>
          <button className={s.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className={s.main}>
        <div className={s.leftCol}>
          <Timer round={round} />
          <GameBoard round={round} />
          <BetPanel round={round} balance={wallet.balance} onBet={placeBet} />
        </div>
        <div className={s.rightCol}>
          <History />
        </div>
      </main>
    </div>
  );
}
