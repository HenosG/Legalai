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

async function recalcProjectProgress(tx: any, projectId: string | null) {
  if (!projectId) return;
  const tasks = await tx.task.findMany({ where: { projectId }, select: { status: true } });
  if (tasks.length === 0) {
    await tx.project.update({ where: { id: projectId }, data: { progress: 0 } });
    return;
  }
  const done = tasks.filter((t: any) => t.status === 'DONE').length;
  await tx.project.update({ where: { id: projectId }, data: { progress: Math.round((done / tasks.length) * 100) } });
}

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigneeId: z.string().nullable().optional(),
  milestoneId: z.string().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  estimatedHours: z.number().nullable().optional(),
  actualHours: z.number().nullable().optional(),
  labels: z.array(z.string()).optional(),
  position: z.number().optional(),
});

// PATCH /api/tasks/:id
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const existing = await prisma.task.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const updateData: any = { ...data };
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate);

    if (data.status === 'DONE' && existing.status !== 'DONE') {
      updateData.completedAt = new Date();
    } else if (data.status && data.status !== 'DONE' && existing.status === 'DONE') {
      updateData.completedAt = null;
    }

    const [task] = await prisma.$transaction(async (tx) => {
      const t = await tx.task.update({ where: { id }, data: updateData });
      await recalcProjectProgress(tx, t.projectId);
      return [t];
    });

    res.json({ ...task, estimatedHours: toNum(task.estimatedHours), actualHours: toNum(task.actualHours) });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const existing = await prisma.task.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await prisma.$transaction(async (tx) => {
      await tx.task.delete({ where: { id } });
      await recalcProjectProgress(tx, existing.projectId);
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;