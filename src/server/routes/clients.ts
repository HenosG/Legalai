import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/clerk';

const router = express.Router();
const prisma = new PrismaClient();

const getUserId = (req: any) => {
  const auth = req.auth ? (typeof req.auth === 'function' ? req.auth() : req.auth) : null;
  return auth?.userId || req.query.userId as string;
};

// GET all clients (scoped to authenticated user, paginated, searchable, filterable)
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const { search, status, page = '1', limit = '20' } = req.query;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'all') where.status = status as string;

    const [clients, total] = await Promise.all([
      prisma.client.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.client.count({ where }),
    ]);

    res.json({
      clients,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET single client — full detail workspace payload: profile, projects,
// invoices, notes, and an activity feed assembled from ActivityLog rows
// where targetId = this client's id. ActivityLog has no clientId column,
// so we query by targetId instead (confirm activity-writing code elsewhere
// sets targetId to the client id when it logs client-related actions —
// this route can't populate a feed that nothing ever wrote to).
router.get('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const client = await prisma.client.findFirst({
      where: { id, userId },
      include: {
        projects: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        proposals: { orderBy: { createdAt: 'desc' } },
        clientNotes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!client) return res.status(404).json({ error: 'Client not found' });

    const activity = await prisma.activityLog.findMany({
      where: { userId, targetId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // If assignedUserId is set, resolve it to a display name for the UI
    // rather than making the frontend show a raw Clerk ID.
    let assignedUser = null;
    if (client.assignedUserId) {
      assignedUser = await prisma.user.findUnique({
        where: { id: client.assignedUserId },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    }

    res.json({ ...client, activity, assignedUser });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST create new client
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { name, email, phone, company, status, tags, notes } = req.body;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!name || name.trim() === '') return res.status(400).json({ error: 'Name is required' });

    const client = await prisma.client.create({
      data: {
        userId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        status: status || 'active', // matches schema default
        tags: tags || [],
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PATCH update client — now also accepts assignedUserId for team assignment
router.patch('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, company, status, tags, notes, assignedUserId } = req.body;
    const userId = getUserId(req);

    const existing = await prisma.client.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Client not found' });

    const data: any = {
      name: name?.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      status,
      tags,
      notes: notes?.trim() || null,
    };
    // Only touch assignedUserId if the caller actually sent it, so a plain
    // status-change PATCH (e.g. the bulk-status action) doesn't accidentally
    // unassign the client by sending assignedUserId: undefined.
    if (assignedUserId !== undefined) data.assignedUserId = assignedUserId || null;

    const client = await prisma.client.update({ where: { id }, data });
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// POST add a note — uses the real ClientNote model
router.post('/:id/notes', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const userId = getUserId(req);

    if (!body || !body.trim()) return res.status(400).json({ error: 'Note body is required' });

    const client = await prisma.client.findFirst({ where: { id, userId } });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const note = await prisma.clientNote.create({
      data: { clientId: id, body: body.trim() },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// GET org users — for the Team Assignment dropdown. Scoped to the same
// organization as the requesting user; falls back to just the requesting
// user if they have no organizationId (solo workspace).
router.get('/:id/assignable-users', requireAuth, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const requester = await prisma.user.findUnique({ where: { id: userId } });
    if (!requester) return res.status(404).json({ error: 'User not found' });

    const users = requester.clerkOrgId
      ? await prisma.user.findMany({
          where: { clerkOrgId: requester.clerkOrgId },
          select: { id: true, firstName: true, lastName: true, email: true },
        })
      : [{ id: requester.id, firstName: requester.firstName, lastName: requester.lastName, email: requester.email }];

    res.json({ users });
  } catch (error) {
    console.error('Error fetching assignable users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE client
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const existing = await prisma.client.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Client not found' });

    await prisma.client.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;