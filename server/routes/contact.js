// server/routes/contact.js
//
// New route — your contact form currently sends nothing anywhere. This is
// intentionally NOT gated behind req.auth?.userId like tasks.js/
// documents.js — visitors shouldn't need an account to contact sales.
// clerkMiddleware() can stay mounted globally; it simply won't populate
// req.auth for anonymous requests, and this route never checks it.

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    const submission = await db.contactSubmission.create({
      data: { firstName, lastName, email, subject, message },
    });

    // This only persists the submission — it does not email anyone yet.
    // Wire a transactional email provider (Resend, Postmark, SendGrid...)
    // here before launch, or every message just sits in the database
    // until someone checks it manually in Prisma Studio.
    res.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Contact API Error:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

export default router;