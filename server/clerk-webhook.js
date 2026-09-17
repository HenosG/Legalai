import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Webhook } from 'svix';

const router = express.Router();
const db = new PrismaClient();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;

  try {
    // Verify that the request actually came from Clerk
    evt = wh.verify(payload, headers);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // If user is created, save to your database
  if (evt.type === 'user.created') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0].email_address;

    await db.user.create({
      data: {
        id: id,
        email: email,
        plan: 'free', // New users start on free
      },
    });
    console.log(`👤 New user synced to Neon: ${email}`);
  }

  res.json({ received: true });
});

export default router;