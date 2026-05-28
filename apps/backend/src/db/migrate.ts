import 'dotenv/config';
import { Pool } from 'pg';

const DDL = `
  CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username    VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    balance     INTEGER NOT NULL DEFAULT 1000,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id         UUID PRIMARY KEY,
    result     VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS bets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id),
    round_id   UUID NOT NULL REFERENCES rounds(id),
    choice     VARCHAR(10) NOT NULL,
    amount     INTEGER NOT NULL,
    won        BOOLEAN NOT NULL,
    payout     INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
  CREATE INDEX IF NOT EXISTS idx_bets_round_id ON bets(round_id);
`;

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query(DDL);
    console.log('✓ Migrations applied');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
