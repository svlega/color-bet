import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../socket';
import type { Round, BetChoice } from '@color-bet/shared-types';

export function useGame() {
  const queryClient = useQueryClient();
  const [round, setRound] = useState<Round | null>(null);
  const [online, setOnline] = useState(0);
  const [lastResult, setLastResult] = useState<{ won: boolean; delta: number } | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on('round:update', (r) => {
      setRound(r);
    });

    socket.on('players:online', setOnline);

    // When the server settles a round, invalidate the wallet query so
    // React-query refetches the updated balance automatically.
    socket.on('wallet:update', ({ balance, delta, won }) => {
      queryClient.setQueryData(['wallet'], { balance });
      setLastResult({ won, delta });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      setTimeout(() => setLastResult(null), 4000);
    });

    return () => {
      socket.off('round:update');
      socket.off('players:online');
      socket.off('wallet:update');
      socket.disconnect();
    };
  }, [queryClient]);

  const placeBet = (choice: BetChoice, amount: number): Promise<{ ok: boolean; error?: string }> =>
    new Promise((resolve) => {
      socket.emit('bet:place', { choice, amount }, resolve);
    });

  return { round, online, lastResult, placeBet };
}
