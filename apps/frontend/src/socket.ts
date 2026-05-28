import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@color-bet/shared-types';

const WS_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(WS_URL, {
  autoConnect: false,

  // Without a reconnection limit, a server outage causes infinite retries.
  // Each attempt registers a timer — under a long outage this fills the
  // event queue and leaks memory proportional to time offline.
  reconnectionAttempts: 5,

  // Exponential backoff — 1s, 2s, 4s, 8s, 16s then gives up.
  // Prevents thundering-herd: if 10,000 clients all retry simultaneously
  // the backend would be crushed the moment it comes back online.
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 16_000,

  auth: (cb) => cb({ token: localStorage.getItem('token') }),
});

// Surface connection errors to the user rather than silently retrying forever
socket.on('connect_error', (err) => {
  console.warn('[Socket] connection error:', err.message);
});

socket.io.on('reconnect_failed', () => {
  console.error('[Socket] gave up reconnecting after 5 attempts — reload the page');
});
