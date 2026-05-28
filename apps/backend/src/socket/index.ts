import type { Server, Socket } from 'socket.io';
import type { ServerToClientEvents, ClientToServerEvents } from '@color-bet/shared-types';
import { verifyToken } from '../auth/jwt';
import type { GameLoop } from '../game/loop';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

let onlineCount = 0;

export function setupSocketHandlers(io: IoServer, game: GameLoop) {
  // ─── Auth middleware — runs before every connection ───────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error('No token'));
    try {
      socket.data.user = verifyToken(token);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: IoSocket) => {
    const { userId, username } = socket.data.user;
    socket.join(`user:${userId}`);

    onlineCount++;
    io.emit('players:online', onlineCount);
    socket.emit('round:update', game.getState());

    socket.on('bet:place', async ({ choice, amount }, ack) => {
      const result = await game.addBet(userId, amount, choice);
      ack(result);
    });

    socket.on('disconnect', () => {
      onlineCount = Math.max(0, onlineCount - 1);
      io.emit('players:online', onlineCount);
    });
  });
}
