import express from 'express';

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, planName, billingCycle, email, userId } = req.body;
    
    const stripe = req.app.get('stripe');
    if (!stripe) {
      throw new Error('Stripe instance not initialized.');
    }

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing priceId or userId.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true, // <--- ADD THIS LINE HERE
      success_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/dashboard?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:8080'}/pricing?checkout=canceled`,
      customer_email: email || undefined,
      metadata: { planName, billingCycle, email },
      // This is the critical ID link:
      client_reference_id: userId, 
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('STRIPE CHECKOUT ERROR:', error.message);
    res.status(500).json({ error: 'Failed to build checkout session', details: error.message });
  }
});

export default router;