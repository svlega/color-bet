import { pgTable, uuid, varchar, integer, boolean, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  balance: integer('balance').notNull().default(1000),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rounds = pgTable('rounds', {
  id: uuid('id').primaryKey(),
  result: varchar('result', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bets = pgTable('bets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  roundId: uuid('round_id')
    .notNull()
    .references(() => rounds.id),
  choice: varchar('choice', { length: 10 }).notNull(),
  amount: integer('amount').notNull(),
  won: boolean('won').notNull(),
  payout: integer('payout').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
