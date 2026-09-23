import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../src/server/middleware/clerk';

const router = express.Router();
const prisma = new PrismaClient();

const getUserId = (req: any) => {
  const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
  return auth?.userId || req.query.userId as string;
};

const logActivity = (userId: string, action: string, description: string, targetId?: string) =>
  prisma.activityLog.create({
    data: { userId, action, description, module: 'proposals', targetId },
  }).catch((e) => console.error('Failed to log activity:', e));

// Computes total dollar value from pricing.tiers — used for the "Value"
// shown on proposal cards. Falls back to `amount` if pricing isn't set yet.
function computeValue(proposal: { amount: number; pricing: any }): number {
  const recommended = proposal.pricing?.tiers?.find((t: any) => t.recommended);
  return recommended?.price ?? proposal.pricing?.tiers?.[0]?.price ?? proposal.amount;
}

// GET all proposals — filterable by status/clientId, includes client info
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { status, clientId } = req.query;

    const where: any = { userId };
    if (status && status !== 'all') where.status = status as string;
    if (clientId) where.clientId = clientId as string;

    const proposals = await prisma.proposal.findMany({
      where,
      include: { client: { select: { id: true, name: true, company: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ proposals: proposals.map((p) => ({ ...p, value: computeValue(p) })) });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// --- STATIC META ROUTES (Must be above /:id) ---
router.get('/meta/case-studies', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.clerkOrgId) return res.json({ caseStudies: [] });
    const caseStudies = await prisma.caseStudy.findMany({ where: { organizationId: user.clerkOrgId } });
    res.json({ caseStudies });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
});

router.get('/meta/testimonials', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.clerkOrgId) return res.json({ testimonials: [] });
    const testimonials = await prisma.testimonial.findMany({ where: { organizationId: user.clerkOrgId } });
    res.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// GET single proposal — includes client, resolved case studies/testimonials
router.get('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;

    // Safety guard: Prevent looking up database IDs for client-side creation routes
    if (id === 'new') {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const userId = getUserId(req);

    const proposal = await prisma.proposal.findFirst({
      where: { id, userId },
      include: { client: true },
    });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const [caseStudies, testimonials] = await Promise.all([
      proposal.caseStudies && Array.isArray(proposal.caseStudies) && proposal.caseStudies.length > 0
        ? prisma.caseStudy.findMany({ where: { id: { in: proposal.caseStudies as string[] } } })
        : [],
      proposal.testimonials && Array.isArray(proposal.testimonials) && proposal.testimonials.length > 0
        ? prisma.testimonial.findMany({ where: { id: { in: proposal.testimonials as string[] } } })
        : [],
    ]);

    res.json({ ...proposal, value: computeValue(proposal), caseStudyDetails: caseStudies, testimonialDetails: testimonials });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// POST create new proposal (Supports direct creation or generation from AI Intake)
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    let { clientId, intakeId, title, amount, scopeOfWork, timeline, pricing, terms, caseStudies, testimonials } = req.body;

    // If generated from an AI intake lead without a pre-existing clientId, resolve or create client automatically
    if (!clientId && intakeId) {
      const intake = await prisma.aIIntake.findUnique({ where: { id: intakeId } });
      if (intake) {
        clientId = intake.clientId;
        if (!clientId) {
          const fallbackClient = await prisma.client.create({
            data: {
              userId,
              name: intake.contactName || intake.projectType || "New Prospect",
              email: intake.email || "client@example.com",
            },
          });
          clientId = fallbackClient.id;
        }
      }
    }

    if (!clientId) return res.status(400).json({ error: 'clientId is required' });
    if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });

    const proposal = await prisma.proposal.create({
      data: {
        userId,
        clientId,
        intakeId: intakeId || null,
        title: title.trim(),
        amount: amount ?? pricing?.tiers?.[0]?.price ?? 0,
        status: 'draft',
        scopeOfWork: scopeOfWork ?? null,
        timeline: timeline ?? null,
        pricing: pricing ?? null,
        terms: terms ?? null,
        caseStudies: caseStudies ?? [],
        testimonials: testimonials ?? [],
      },
    });

    await logActivity(userId, 'created', `Proposal "${proposal.title}" created`, proposal.id);
    res.status(201).json({ proposal });
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: error?.message || 'Failed to create proposal' });
  }
});

// PATCH update proposal (edit draft)
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { title, amount, scopeOfWork, timeline, pricing, terms, caseStudies, testimonials } = req.body;

    const existing = await prisma.proposal.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Proposal not found' });

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        title: title?.trim(),
        amount,
        scopeOfWork,
        timeline,
        pricing,
        terms,
        caseStudies,
        testimonials,
        version: { increment: 1 },
      },
    });

    res.json(proposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// POST send proposal to client
router.post('/:id/send', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { clientEmail } = req.body;

    const proposal = await prisma.proposal.findFirst({ where: { id, userId }, include: { client: true } });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: 'sent' },
    });

    await logActivity(userId, 'sent', `Proposal "${proposal.title}" sent to ${clientEmail || proposal.client.email}`, id);

    res.json(updated);
  } catch (error) {
    console.error('Error sending proposal:', error);
    res.status(500).json({ error: 'Failed to send proposal' });
  }
});

// POST track a client view — PUBLIC route, no requireAuth
router.post('/:id/view', async (req: any, res) => {
  try {
    const { id } = req.params;
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const updated = await prisma.proposal.update({
      where: { id },
      data: {
        status: proposal.status === 'sent' ? 'viewed' : proposal.status,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// POST client signs — PUBLIC route. Creates Project + deposit Invoice.
router.post('/:id/sign', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientEmail, clientSignature } = req.body;

    const proposal = await prisma.proposal.findUnique({ where: { id }, include: { client: true } });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    if (!clientSignature) return res.status(400).json({ error: 'clientSignature is required' });

    const signature = {
      clientName, clientEmail, clientSignature,
      clientSignedAt: new Date().toISOString(),
    };

    const [updated, project] = await prisma.$transaction([
      prisma.proposal.update({
        where: { id },
        data: { status: 'signed', signature },
      }),
      prisma.project.create({
        data: {
          userId: proposal.userId,
          organizationId: (proposal as any).organizationId,
          clientId: proposal.clientId,
          name: proposal.title,
          budget: proposal.amount,
          proposalId: proposal.id,
        },
      }),
    ]);

    const depositAmount = Math.round(proposal.amount * 0.5 * 100) / 100;
    await prisma.invoice.create({
      data: {
        userId: proposal.userId,
        organizationId: (proposal as any).organizationId,
        clientId: proposal.clientId,
        amount: depositAmount,
        status: 'UNPAID',
      },
    });

    await logActivity(proposal.userId, 'signed', `Proposal "${proposal.title}" signed — project created`, id);
    res.json({ proposal: updated, project });
  } catch (error) {
    console.error('Error signing proposal:', error);
    res.status(500).json({ error: 'Failed to sign proposal' });
  }
});

// POST reject — PUBLIC route
router.post('/:id/reject', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status: 'rejected' },
    });

    await logActivity(proposal.userId, 'rejected', `Proposal "${proposal.title}" rejected${reason ? `: ${reason}` : ''}`, id);
    res.json(updated);
  } catch (error) {
    console.error('Error rejecting proposal:', error);
    res.status(500).json({ error: 'Failed to reject proposal' });
  }
});

// DELETE proposal — returns JSON response to prevent frontend JSON parse crash
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const existing = await prisma.proposal.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Proposal not found' });

    await prisma.proposal.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});

export default router;