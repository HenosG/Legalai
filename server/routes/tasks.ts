import express from 'express';
import { PrismaClient, TaskStatus } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../../src/server/middleware/clerk.js';

const prisma = new PrismaClient();
const router = express.Router();

const getUserId = (req: any) => {
  const auth =
    req.auth
      ? typeof req.auth === 'function'
        ? req.auth()
        : req.auth
      : null;

  return auth?.userId || (req.query.userId as string | undefined);
};

/**
 * Project.organizationId and Task.organizationId reference the internal
 * Prisma Organization.id — not the Clerk organization ID.
 */
const getOrgId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  });

  return user?.organizationId || null;
};

const toNum = (value: any) => (value == null ? null : Number(value));

/**
 * Calculates progress using all non-cancelled project tasks:
 *
 * completed non-cancelled tasks / all non-cancelled tasks * 100
 *
 * Cancelled work should not reduce a project's completion percentage.
 */
async function recalcProjectProgress(tx: any, projectId: string | null) {
  if (!projectId) return;

  const tasks = await tx.task.findMany({
    where: {
      projectId,
      status: {
        not: 'CANCELLED',
      },
    },
    select: {
      status: true,
    },
  });

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((task: { status: TaskStatus }) => task.status === 'DONE').length /
            tasks.length) *
            100,
        );

  await tx.project.update({
    where: { id: projectId },
    data: { progress },
  });
}

/**
 * `completed` exists specifically to support the existing frontend toggle:
 *
 * PATCH /api/tasks/:id
 * { completed: true }
 *
 * It maps to TaskStatus.DONE; false maps to TaskStatus.TODO.
 *
 * If both `completed` and `status` are sent, `completed` takes precedence,
 * so a checkbox always has deterministic behavior.
 */
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z
    .enum([
      'BACKLOG',
      'TODO',
      'IN_PROGRESS',
      'IN_REVIEW',
      'DONE',
      'CANCELLED',
    ])
    .optional(),
  completed: z.boolean().optional(),
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

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orgId = await getOrgId(userId);

    const existing = await prisma.task.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const parsed = updateTaskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { completed, dueDate, ...taskData } = parsed.data;

    const updateData: any = {
      ...taskData,
    };

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    /**
     * Support the checkbox contract used by ProjectDetail.tsx.
     * `completed: false` returns a previously completed task to TODO.
     */
    if (completed !== undefined) {
      updateData.status = completed ? 'DONE' : 'TODO';
    }

    const nextStatus = updateData.status as TaskStatus | undefined;

    if (nextStatus === 'DONE' && existing.status !== 'DONE') {
      updateData.completedAt = new Date();
    } else if (nextStatus && nextStatus !== 'DONE' && existing.status === 'DONE') {
      updateData.completedAt = null;
    }

    const task = await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id },
        data: updateData,
      });

      await recalcProjectProgress(tx, updatedTask.projectId);

      return updatedTask;
    });

    res.json({
      ...task,
      completed: task.status === 'DONE',
      estimatedHours: toNum(task.estimatedHours),
      actualHours: toNum(task.actualHours),
    });
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

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orgId = await getOrgId(userId);

    const existing = await prisma.task.findFirst({
      where: orgId ? { id, organizationId: orgId } : { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.task.delete({
        where: { id },
      });

      await recalcProjectProgress(tx, existing.projectId);
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;