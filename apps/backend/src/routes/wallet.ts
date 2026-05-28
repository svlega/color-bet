import { Router, type IRouter } from 'express';
import { requireAuth, type AuthRequest } from '../auth/middleware';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const router: IRouter = Router();

router.get('/', requireAuth, async (req, res) => {
  const { userId } = (req as AuthRequest).user;
  const [user] = await db
    .select({ balance: users.balance })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ balance: user.balance });
});

export default router;
