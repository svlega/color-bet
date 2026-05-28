// ─── Domain ──────────────────────────────────────────────────────────────────

export type GamePhase = 'BETTING' | 'CLOSING' | 'RESULT';
export type BetChoice = 'RED' | 'BLACK';

export interface Round {
  id: string;
  phase: GamePhase;
  timeLeft: number;
  result: BetChoice | null;
  totalBets: number;
}

export interface User {
  id: string;
  username: string;
  balance: number;
}

export interface BetHistoryItem {
  id: string;
  roundId: string;
  choice: BetChoice;
  amount: number;
  result: BetChoice;
  won: boolean;
  payout: number;
  createdAt: string;
}

// ─── Socket.io typed events ───────────────────────────────────────────────────
// Defining event maps here keeps both server and client in sync — if one side
// changes an event signature, TypeScript will catch the mismatch immediately.

export interface ServerToClientEvents {
  'round:update': (round: Round) => void;
  'wallet:update': (payload: { balance: number; delta: number; won: boolean }) => void;
  'players:online': (count: number) => void;
}

export interface ClientToServerEvents {
  'bet:place': (
    bet: { choice: BetChoice; amount: number },
    ack: (res: { ok: boolean; error?: string }) => void
  ) => void;
}

// ─── HTTP payloads ────────────────────────────────────────────────────────────

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
