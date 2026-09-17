import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const db = new PrismaClient();

// This route expects req.auth to be populated by global clerkMiddleware
router.get('/status', async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user session found' });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    res.json({
      subscribed: user.plan !== 'free',
      tier: user.plan,
      status: 'active',
      currentPeriodEnd: null,
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;