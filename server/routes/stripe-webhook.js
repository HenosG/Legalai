import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = new PrismaClient();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id; // This matches the ID you just sent!

    if (userId) {
      await db.user.update({
        where: { id: userId }, // Ensure this matches your Prisma schema ID field
        data: { plan: session.metadata.planName || 'starter' }
      });
      console.log(`✅ User ${userId} upgraded to ${session.metadata.planName}`);
    }
  }

  res.json({ received: true });
});

export default router;