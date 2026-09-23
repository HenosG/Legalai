import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../../src/server/middleware/clerk.js';

const prisma = new PrismaClient();
const router = express.Router();

const getUserId = (req: any) => {
  const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
  return auth?.userId || req.query.userId as string;
};
const getOrgId = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.clerkOrgId || null;
};
const toNum = (d: any) => (d == null ? null : Number(d));

const updateMilestoneSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  amount: z.number().nullable().optional(),
  position: z.number().optional(),
});

// PATCH /api/milestones/:id
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const existing = await prisma.milestone.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });
    if (!existing) return res.status(404).json({ error: 'Milestone not found' });

    const parsed = updateMilestoneSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
    if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const milestone = await prisma.milestone.update({ where: { id }, data: updateData });
    res.json({ ...milestone, amount: toNum(milestone.amount) });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ error: 'Failed to update milestone' });
  }
});

// DELETE /api/milestones/:id
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const existing = await prisma.milestone.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });
    if (!existing) return res.status(404).json({ error: 'Milestone not found' });

    await prisma.milestone.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
});

export default router;