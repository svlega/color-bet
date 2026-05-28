import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import type { ServerToClientEvents, ClientToServerEvents } from '@color-bet/shared-types';
import { redis, redisPub, redisSub } from './redis';
import { pool } from './db';
import { setupSocketHandlers } from './socket';
import { gameLoop } from './game/loop';
import authRouter from './routes/auth';
import walletRouter from './routes/wallet';
import historyRouter from './routes/history';
import { authLimiter, apiLimiter } from './middleware/rateLimit';

const app = express();
const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
io.adapter(createAdapter(redisPub, redisSub));

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/history', historyRouter);

app.get('/health', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    ok: true,
    uptime: process.uptime(),
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
  });
});


async function shutdown(signal: string) {
  console.log(`\n[${signal}] Graceful shutdown initiated...`);

  // Hard timeout — if anything below hangs, force exit after 10s.
  // In production you'd alert/page on this because it means a resource
  // isn't closing cleanly (e.g. an open DB transaction blocking pool drain).
  const forceExit = setTimeout(() => {
    console.error('[shutdown] Timed out — forcing exit');
    process.exit(1);
  }, 10_000);

  // Don't let the timeout itself keep the event loop alive
  forceExit.unref();

  try {
    // 1. Stop the game loop — clears the setInterval reference
    gameLoop.stop();

    // 2 + 3. Stop HTTP server — no new connections, wait for active ones
    await new Promise<void>((resolve) => server.close(() => resolve()));
    console.log('✓ HTTP server closed');

    // 4. Close Socket.io — sends disconnect to all clients
    await io.close();
    console.log('✓ Socket.io closed');

    // 5. Quit Redis — sends QUIT command, waits for ACK, closes socket
    await Promise.all([redis.quit(), redisPub.quit(), redisSub.quit()]);
    console.log('✓ Redis connections closed');

    // 6. Drain DB pool — waits for active queries, then closes connections
    await pool.end();
    console.log('✓ DB pool drained');

    console.log('[shutdown] Clean exit ✓');
    process.exit(0);
  } catch (err) {
    console.error('[shutdown] Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // sent by Kubernetes/Docker on pod stop
process.on('SIGINT',  () => shutdown('SIGINT'));  // sent by Ctrl+C in local dev

// ─── Leader election ─────────────────────────────────────────────────────────
async function tryBecomeLeader(): Promise<void> {
  const acquired = await redis.set('game:leader', process.pid.toString(), 'EX', 15, 'NX');
  if (acquired === 'OK') {
    gameLoop.start(io);
    setInterval(() => redis.expire('game:leader', 15), 10_000);
  } else {
    setTimeout(tryBecomeLeader, 16_000);
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
setupSocketHandlers(io, gameLoop);

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, async () => {
  console.log(`✓ Server listening on :${PORT}`);
  await tryBecomeLeader();
});
