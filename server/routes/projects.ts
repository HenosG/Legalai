import express from 'express';
import { PrismaClient, ProjectStatus, ProjectHealth } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from '../../src/server/middleware/clerk.js';

const router = express.Router();
const prisma = new PrismaClient();

const getUserId = (req: any) => {
  const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
  return auth?.userId || req.query.userId as string;
};

const getOrgId = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.clerkOrgId || null;
};

const toNum = (d: any) => (d == null ? null : Number(d));

// Serializes Decimal fields for JSON output
function serializeProject(p: any) {
  return {
    ...p,
    budget: toNum(p.budget),
    milestones: p.milestones?.map((m: any) => ({ ...m, amount: toNum(m.amount) })),
    tasks: p.tasks?.map((t: any) => ({
      ...t,
      estimatedHours: toNum(t.estimatedHours),
      actualHours: toNum(t.actualHours),
    })),
  };
}

const createProjectSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  health: z.nativeEnum(ProjectHealth).optional(),
  budget: z.number().optional(),
  currency: z.string().optional(),
  startDate: z.string().datetime().optional(),
  targetDate: z.string().datetime().optional(),
  proposalId: z.string().optional(),
});

const updateProjectSchema = createProjectSchema.partial().extend({
  progress: z.number().min(0).max(100).optional(),
});

// Recalculates progress = completed tasks / total tasks * 100 for a project.
async function recalcProjectProgress(tx: any, projectId: string) {
  const tasks = await tx.task.findMany({ where: { projectId }, select: { status: true } });
  if (tasks.length === 0) {
    await tx.project.update({ where: { id: projectId }, data: { progress: 0 } });
    return;
  }
  const done = tasks.filter((t: any) => t.status === 'DONE').length;
  const progress = Math.round((done / tasks.length) * 100);
  await tx.project.update({ where: { id: projectId }, data: { progress } });
}

// ─── GET /api/projects ──────────────────────────────────────────────────────
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const orgId = await getOrgId(userId);
    const { status, clientId, search } = req.query;

    const where: any = orgId ? { organizationId: orgId } : { userId };
    if (status) where.status = status as ProjectStatus;
    if (clientId) where.clientId = clientId as string;
    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, company: true } },
        _count: { select: { tasks: true, milestones: true } },
        tasks: { select: { status: true, dueDate: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const result = projects.map((p) => {
      const completedTasks = p.tasks.filter((t) => t.status === 'DONE').length;
      const upcomingTasks = p.tasks.filter(
        (t) => t.dueDate && t.status !== 'DONE' && t.dueDate >= now && t.dueDate <= weekFromNow
      ).length;
      const { tasks, ...rest } = p;
      return {
        ...serializeProject(rest),
        taskCount: p._count.tasks,
        milestoneCount: p._count.milestones,
        completedTaskCount: completedTasks,
        upcomingTaskCount: upcomingTasks,
      };
    });

    res.json({ projects: result });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ─── POST /api/projects ─────────────────────────────────────────────────────
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const orgId = await getOrgId(userId);

    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const project = await prisma.project.create({
      data: {
        userId,
        organizationId: orgId,
        clientId: data.clientId,
        name: data.name,
        description: data.description,
        status: data.status,
        health: data.health,
        budget: data.budget,
        currency: data.currency,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        proposalId: data.proposalId,
      },
      include: { client: { select: { id: true, name: true, company: true } } },
    });

    res.status(201).json(serializeProject(project));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);
    const where: any = orgId ? { id, organizationId: orgId } : { id, userId };

    const project = await prisma.project.findFirst({
      where,
      include: {
        client: true,
        proposal: true,
        milestones: {
          orderBy: { position: 'asc' },
          include: { tasks: { orderBy: { position: 'asc' } } },
        },
        tasks: {
          where: { milestoneId: null },
          orderBy: { position: 'asc' },
          include: { assignee: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(serializeProject(project));
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ─── PATCH /api/projects/:id ─────────────────────────────────────────────────
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);
    const where: any = orgId ? { id, organizationId: orgId } : { id, userId };

    const existing = await prisma.project.findFirst({ where });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.targetDate) updateData.targetDate = new Date(data.targetDate);
    if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { client: { select: { id: true, name: true, company: true } } },
    });

    res.json(serializeProject(project));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);
    const where: any = orgId ? { id, organizationId: orgId } : { id, userId };

    const existing = await prisma.project.findFirst({ where });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ─── POST /api/projects/:projectId/milestones ────────────────────────────────
const createMilestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  amount: z.number().optional(),
  position: z.number().optional(),
});

router.post('/:projectId/milestones', requireAuth, async (req: any, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const project = await prisma.project.findFirst({
      where: orgId ? { id: projectId, organizationId: orgId } : { id: projectId, userId },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const parsed = createMilestoneSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const count = await prisma.milestone.count({ where: { projectId } });
    const milestone = await prisma.milestone.create({
      data: {
        userId,
        organizationId: orgId,
        projectId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        amount: data.amount,
        position: data.position ?? count,
      },
    });

    res.status(201).json({ ...milestone, amount: toNum(milestone.amount) });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Failed to create milestone' });
  }
});

// ─── POST /api/projects/:projectId/tasks ─────────────────────────────────────
const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigneeId: z.string().optional(),
  clientId: z.string().optional(),
  milestoneId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().optional(),
  labels: z.array(z.string()).optional(),
  position: z.number().optional(),
});

router.post('/:projectId/tasks', requireAuth, async (req: any, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);
    const orgId = await getOrgId(userId);

    const project = await prisma.project.findFirst({
      where: orgId ? { id: projectId, organizationId: orgId } : { id: projectId, userId },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    const count = await prisma.task.count({ where: { projectId } });

    const [task] = await prisma.$transaction(async (tx) => {
      const t = await tx.task.create({
        data: {
          userId,
          organizationId: orgId,
          projectId,
          clientId: data.clientId ?? project.clientId,
          milestoneId: data.milestoneId,
          assigneeId: data.assigneeId,
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          estimatedHours: data.estimatedHours,
          labels: data.labels ?? [],
          position: data.position ?? count,
        },
      });
      await recalcProjectProgress(tx, projectId);
      return [t];
    });

    res.status(201).json({ ...task, estimatedHours: toNum(task.estimatedHours), actualHours: toNum(task.actualHours) });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;