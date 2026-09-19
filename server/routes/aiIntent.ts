import express from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI, Type } from '@google/genai';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const getUserId = (req: any) => {
  const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
  return auth?.userId || req.query.userId as string;
};

// ── Helper: writes an ActivityLog row for the live feed. Uses `targetId`
// per the real schema (no dedicated intake-scoped log table exists).
const logActivity = (userId: string, action: string, description: string, targetId?: string) =>
  prisma.activityLog.create({
    data: { userId, action, description, module: 'ai-intake', targetId },
  }).catch((e) => console.error('Failed to log activity:', e));

// ── Gemini extraction schema — structured output, not free text parsing.
// ASSUMPTION: your AIIntake model has these columns. Adjust field names
// below (both here and in the Prisma calls) if your actual schema differs —
// I don't have it, so this is inferred from your feature spec, not verified.
const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    contactName: { type: Type.STRING },
    company: { type: Type.STRING, nullable: true },
    email: { type: Type.STRING, nullable: true },
    projectType: { type: Type.STRING },
    budgetMin: { type: Type.NUMBER, nullable: true },
    budgetMax: { type: Type.NUMBER, nullable: true },
    timeline: { type: Type.STRING, nullable: true },
    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    urgencySignal: { type: Type.STRING, description: 'low | medium | high' },
    confidence: {
      type: Type.OBJECT,
      properties: {
        contactName: { type: Type.NUMBER },
        budget: { type: Type.NUMBER },
        timeline: { type: Type.NUMBER },
        requirements: { type: Type.NUMBER },
      },
    },
  },
  required: ['contactName', 'projectType', 'requirements', 'urgencySignal', 'confidence'],
};

async function extractLeadData(rawMessage: string) {
  const response = await genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: [{
        text: `Extract structured lead information from this message. If a field isn't mentioned, omit it or use null. Give an honest 0-1 confidence score per field group based on how explicitly it was stated (not inferred/guessed).\n\nMessage:\n${rawMessage}`,
      }],
    }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: EXTRACTION_SCHEMA,
    },
  });
  return JSON.parse(response.text ?? '{}');
}

// ── Scoring: deterministic, not model-guessed — the model extracts facts,
// this function scores them, so the score is auditable and re-runnable.
function scoreLead(extracted: any): { total: number; breakdown: Record<string, number> } {
  let budgetFit = 0;
  if (extracted.budgetMin != null || extracted.budgetMax != null) {
    budgetFit = extracted.budgetMax >= 1000 ? 25 : extracted.budgetMax >= 300 ? 15 : 8;
  }

  let timelineFit = 0;
  if (extracted.timeline) {
    const t = extracted.timeline.toLowerCase();
    timelineFit = /week|asap|urgent/.test(t) ? 25 : /month/.test(t) ? 18 : 10;
  }

  const scopeClarity = Math.min(25, (extracted.requirements?.length || 0) * 6);

  const urgencyMap: Record<string, number> = { high: 25, medium: 14, low: 5 };
  const urgency = urgencyMap[extracted.urgencySignal?.toLowerCase()] ?? 5;

  const total = Math.round(budgetFit + timelineFit + scopeClarity + urgency);
  return { total, breakdown: { budgetFit, timelineFit, scopeClarity, urgency } };
}

// GET recent intakes (last 10 by default) for the list view
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const limit = parseInt((req.query.limit as string) || '10');

    const intakes = await prisma.aIIntake.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ intakes });
  } catch (error) {
    console.error('Error fetching intakes:', error);
    res.status(500).json({ error: 'Failed to fetch intakes' });
  }
});

// GET single intake detail
router.get('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const intake = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!intake) return res.status(404).json({ error: 'Intake not found' });
    res.json(intake);
  } catch (error) {
    console.error('Error fetching intake:', error);
    res.status(500).json({ error: 'Failed to fetch intake' });
  }
});

// POST create + process a new intake from a raw message (the command-bar flow)
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { rawMessage } = req.body;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!rawMessage || !rawMessage.trim()) {
      return res.status(400).json({ error: 'rawMessage is required' });
    }

    const extracted = await extractLeadData(rawMessage);
    const { total, breakdown } = scoreLead(extracted);

    const intake = await prisma.aIIntake.create({
      data: {
        userId,
        rawMessage,
        contactName: extracted.contactName || 'Unknown',
        company: extracted.company || null,
        email: extracted.email || null,
        projectType: extracted.projectType || 'Unspecified',
        budgetMin: extracted.budgetMin ?? null,
        budgetMax: extracted.budgetMax ?? null,
        timeline: extracted.timeline || null,
        requirements: extracted.requirements || [],
        score: total,
        scoreBreakdown: breakdown,
        confidence: extracted.confidence || {},
        status: total >= 80 ? 'HIGH_PRIORITY' : 'PENDING_REVIEW',
      },
    });

    await logActivity(userId, 'received', `New lead received: ${intake.contactName}`, intake.id);
    await logActivity(userId, 'extracted', `AI extracted details (score ${total}/100)`, intake.id);

    res.status(201).json(intake);
  } catch (error) {
    console.error('Error creating intake:', error);
    res.status(500).json({ error: 'Failed to process intake' });
  }
});

// PATCH manual override of extracted fields
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { contactName, company, email, projectType, budgetMin, budgetMax, timeline, requirements } = req.body;

    const existing = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Intake not found' });

    const intake = await prisma.aIIntake.update({
      where: { id },
      data: { contactName, company, email, projectType, budgetMin, budgetMax, timeline, requirements },
    });

    await logActivity(userId, 'edited', `Manually corrected fields for ${intake.contactName}`, id);
    res.json(intake);
  } catch (error) {
    console.error('Error updating intake:', error);
    res.status(500).json({ error: 'Failed to update intake' });
  }
});

// POST accept lead → creates a real Client record from the intake
router.post('/:id/accept', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const intake = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!intake) return res.status(404).json({ error: 'Intake not found' });

    const client = await prisma.client.create({
      data: {
        userId,
        name: intake.contactName,
        email: intake.email,
        company: intake.company,
        status: 'lead',
        tags: ['ai-intake'],
      },
    });

    await prisma.aIIntake.update({ where: { id }, data: { status: 'ACCEPTED', clientId: client.id } });
    await logActivity(userId, 'accepted', `${intake.contactName} accepted → client created`, client.id);

    res.json({ intake: { ...intake, status: 'ACCEPTED', clientId: client.id }, client });
  } catch (error) {
    console.error('Error accepting intake:', error);
    res.status(500).json({ error: 'Failed to accept intake' });
  }
});

// POST reject / mark unqualified
router.post('/:id/reject', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const intake = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!intake) return res.status(404).json({ error: 'Intake not found' });

    await prisma.aIIntake.update({ where: { id }, data: { status: 'REJECTED' } });
    await logActivity(userId, 'rejected', `${intake.contactName} marked unqualified`, id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting intake:', error);
    res.status(500).json({ error: 'Failed to reject intake' });
  }
});

// POST generate a proposal draft from intake data
router.post('/:id/generate-proposal', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const intake = await prisma.aIIntake.findFirst({ where: { id, userId } });
    if (!intake) return res.status(404).json({ error: 'Intake not found' });

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{
        role: 'user',
        parts: [{
          text: `Generate a project proposal based on this qualified lead.
Project type: ${intake.projectType}
Requirements: ${(intake.requirements as string[]).join(', ')}
Budget range: $${intake.budgetMin ?? '?'} - $${intake.budgetMax ?? '?'}
Timeline: ${intake.timeline ?? 'not specified'}

Return JSON with: scope (array of {phase, description, estimatedHours}), timeline (array of {phase, durationDays}), pricing (array of {item, amount}, total). Keep total within the stated budget range if one was given.`,
        }],
      }],
      config: { responseMimeType: 'application/json' },
    });

    const proposalDraft = JSON.parse(response.text ?? '{}');
    await logActivity(userId, 'proposal_drafted', `Proposal draft generated for ${intake.contactName}`, id);

    res.json({ proposalDraft });
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({ error: 'Failed to generate proposal' });
  }
});

export default router;