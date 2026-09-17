// server/routes/tasks.js
//
// Fixed:
//   1. DELETE /:id read `req.auth?.userIsd` (typo) instead of `userId` —
//      userId was therefore always undefined, so every delete request,
//      authenticated or not, hit the 401 branch.
//   2. update/toggle/delete all called Prisma with
//      `where: { id: req.params.id, userId }`. That's only valid if Task
//      has an explicit `@@unique([id, userId])` in schema.prisma — which
//      I haven't been shown, so I'm not assuming it exists. Replaced with
//      a lookup-by-id, verify-ownership-in-code, then mutate-by-id-alone
//      pattern. This is correct whether or not that compound unique
//      exists, and returns a clean 404 instead of a raw Prisma error for
//      someone trying to touch another user's task.
//
// Everything else (route shapes, response bodies, POST behavior) is
// unchanged from your version.

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

// Get Tasks
router.get('/', async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const tasks = await db.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Tasks API Error (GET /):", error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create Task
router.post('/', async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const newTask = await db.task.create({
      data: {
        title: req.body.title,
        userId,
        priority: req.body.priority || 'medium',
        dueDate: req.body.dueDate,
        completed: false,
      },
    });
    res.json(newTask);
  } catch (error) {
    console.error("Tasks API Error (POST /):", error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update Task
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await db.task.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await db.task.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        completed: req.body.completed,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Tasks API Error (PATCH /:id):", error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Toggle Task
router.patch('/:id/toggle', async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await db.task.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await db.task.update({
      where: { id: req.params.id },
      data: { completed: req.body.completed },
    });
    res.json(task);
  } catch (error) {
    console.error("Tasks API Error (PATCH /:id/toggle):", error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.auth?.userId; // was req.auth?.userIsd — fixed
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await db.task.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Tasks API Error (DELETE /:id):", error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;