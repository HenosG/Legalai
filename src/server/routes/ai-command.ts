// src/server/routes/ai-command.ts

import express from 'express';
import { requireAuth } from '../middleware/clerk';
import { intentRouter, IntentRouterRequest } from '../middleware/intent-router';
import { handleInternalQuery } from './ai-assistant';
import { handleExternalLead } from './ai-intake';

const router = express.Router();

// Unified command endpoint (handles both internal and external)
router.post('/command', requireAuth, intentRouter, async (req: IntentRouterRequest, res) => {
  try {
    const { query } = req.body;
    const intent = req.intent!;

    if (intent.type === 'external') {
      // Route to AI Intake
      const result = await handleExternalLead(req, query);
      res.json({
        intent: 'external',
        data: result,
        redirect: `/ai-intake/${result.id}`,
      });
    } else {
      // Route to AI Assistant
      const result = await handleInternalQuery(req, query);
      res.json({
        intent: 'internal',
        data: result,
      });
    }
  } catch (error) {
    console.error('AI Command error:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

export default router;