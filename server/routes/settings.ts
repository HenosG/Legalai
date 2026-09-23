import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { clerkClient, getAuth } from '@clerk/express';

const router = express.Router();
const prisma = new PrismaClient();

const getUserId = (req: any) => {
  const { userId } = getAuth(req);
  return userId || req.query.userId as string;
};

async function resolveUserAndOrg(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { user: null, organization: null };
  const organization = user.organizationId
    ? await prisma.organization.findUnique({ where: { id: user.organizationId } })
    : null;
  return { user, organization };
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── GET /api/settings — aggregated payload ─────────────────────────────
router.get('/', async (req: any, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { user, organization } = await resolveUserAndOrg(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (e) {
      console.error('Clerk lookup failed:', e);
    }

    const workspace = await prisma.workspace.findUnique({ where: { userId } });

    let workspaceSettings = organization
      ? await prisma.workspaceSettings.findUnique({ where: { organizationId: organization.id } })
      : null;

    if (!workspaceSettings) {
      workspaceSettings = {
        id: '', organizationId: organization?.id || '',
        timezone: 'America/Toronto', locale: 'en-CA', dateFormat: 'MMM d, yyyy', weekStartsOn: 1,
        defaultCurrency: 'CAD', defaultProposalExpiryDays: 30, defaultPaymentTermsDays: 14,
        proposalDefaults: null,
        defaultProjectStatus: 'PLANNING', defaultProjectHealth: 'UNKNOWN', defaultTaskPriority: 'MEDIUM',
        projectWorkingDays: null, projectDefaultView: 'board',
        createdAt: new Date(), updatedAt: new Date(),
      } as any;
    }

    const clientPortal = organization
      ? await prisma.clientPortalSettings.findUnique({ where: { organizationId: organization.id } })
      : null;

    const notifications = organization
      ? await prisma.notificationPreference.findMany({
          where: { OR: [{ organizationId: organization.id }, { userId }] },
        })
      : await prisma.notificationPreference.findMany({ where: { userId } });

    const integrations = organization
      ? await prisma.integrationConnection.findMany({ where: { organizationId: organization.id } })
      : [];

    res.json({
      clerk: {
        userId,
        fullName: clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null : null,
        firstName: clerkUser?.firstName || null,
        lastName: clerkUser?.lastName || null,
        primaryEmail: clerkUser?.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress || null,
        imageUrl: clerkUser?.imageUrl || null,
      },
      organization: organization
        ? { id: organization.id, name: organization.name, plan: organization.plan, clerkOrgId: organization.clerkOrgId }
        : null,
      workspace,
      workspaceSettings,
      clientPortal,
      notifications,
      integrations,
      billing: {
        plan: organization?.plan || user.plan || 'free',
        stripeCustomerId: organization?.stripeCustomerId || null,
        stripeConnected: !!organization?.stripeCustomerId,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// ─── PATCH /api/settings/workspace ───────────────────────────────────────
const workspacePatchSchema = z.object({
  organizationName: z.string().min(1).optional(),
  businessName: z.string().min(1).optional(),
  businessSlug: z.string().min(1).optional(),
  defaultCurrency: z.string().optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  dateFormat: z.string().optional(),
  weekStartsOn: z.number().min(0).max(6).optional(),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  agentName: z.string().optional(),
});

router.patch('/workspace', async (req: any, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { user, organization } = await resolveUserAndOrg(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const parsed = workspacePatchSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    if (data.businessSlug) {
      const existing = await prisma.workspace.findFirst({
        where: { businessSlug: data.businessSlug, userId: { not: userId } },
      });
      if (existing) return res.status(409).json({ error: 'That business slug is already taken' });
    }

    const [organizationResult, workspaceResult, workspaceSettingsResult] = await prisma.$transaction([
      organization && data.organizationName
        ? prisma.organization.update({ where: { id: organization.id }, data: { name: data.organizationName } })
        : prisma.organization.findUnique({ where: { id: organization?.id || '__none__' } }),
      prisma.workspace.upsert({
        where: { userId },
        update: {
          businessName: data.businessName,
          businessSlug: data.businessSlug,
          currency: data.defaultCurrency,
          industry: data.industry,
          businessType: data.businessType,
          agentName: data.agentName,
        },
        create: {
          userId,
          businessName: data.businessName || 'My Agency',
          businessSlug: data.businessSlug || `agency-${userId.slice(0, 8)}`,
          currency: data.defaultCurrency || 'USD',
          industry: data.industry || 'general',
          businessType: data.businessType || 'freelancer',
          agentName: data.agentName || 'Rulo',
        },
      }),
      organization
        ? prisma.workspaceSettings.upsert({
            where: { organizationId: organization.id },
            update: {
              timezone: data.timezone, locale: data.locale, dateFormat: data.dateFormat, weekStartsOn: data.weekStartsOn,
              defaultCurrency: data.defaultCurrency,
            },
            create: {
              organizationId: organization.id,
              timezone: data.timezone || 'America/Toronto',
              locale: data.locale || 'en-CA',
              dateFormat: data.dateFormat || 'MMM d, yyyy',
              weekStartsOn: data.weekStartsOn ?? 1,
              defaultCurrency: data.defaultCurrency || 'CAD',
            },
          })
        : Promise.resolve(null),
    ]);

    res.json({ organization: organizationResult, workspace: workspaceResult, workspaceSettings: workspaceSettingsResult });
  } catch (error) {
    console.error('Error updating workspace settings:', error);
    res.status(500).json({ error: 'Failed to update workspace settings' });
  }
});

// ─── GET/PATCH /api/settings/client-portal ───────────────────────────────
router.get('/client-portal', async (req: any, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { organization } = await resolveUserAndOrg(userId);
    if (!organization) return res.json({ clientPortal: null });

    const clientPortal = await prisma.clientPortalSettings.findUnique({ where: { organizationId: organization.id } });
    res.json({ clientPortal });
  } catch (error) {
    console.error('Error fetching client portal settings:', error);
    res.status(500).json({ error: 'Failed to fetch client portal settings' });
  }
});

const clientPortalSchema = z.object({
  enabled: z.boolean().optional(),
  portalName: z.string().optional(),
  portalSlug: z.string().regex(SLUG_REGEX, 'Slug must be lowercase letters, numbers, and hyphens only').optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  welcomeTitle: z.string().optional(),
  welcomeMessage: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal('')),
  supportUrl: z.string().url().optional().or(z.literal('')),
  accessMode: z.enum(['INVITE_ONLY', 'CLIENT_EMAIL', 'PUBLIC_LINK']).optional(),
  allowClientMessages: z.boolean().optional(),
  showProjectProgress: z.boolean().optional(),
  showInvoices: z.boolean().optional(),
  showProposals: z.boolean().optional(),
  showDocuments: z.boolean().optional(),
});

router.patch('/client-portal', async (req: any, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { organization } = await resolveUserAndOrg(userId);
    if (!organization) return res.status(400).json({ error: 'No organization/workspace found for this user' });

    const parsed = clientPortalSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    if (data.portalSlug) {
      const existing = await prisma.clientPortalSettings.findFirst({
        where: { portalSlug: data.portalSlug, organizationId: { not: organization.id } },
      });
      if (existing) return res.status(409).json({ error: 'That portal link is already taken' });
    }

    const clientPortal = await prisma.clientPortalSettings.upsert({
      where: { organizationId: organization.id },
      update: data,
      create: {
        organizationId: organization.id,
        portalSlug: data.portalSlug || `agency-${organization.id.slice(0, 8)}`,
        ...data,
      },
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:8080';
    res.json({ clientPortal, portalUrl: `${FRONTEND_URL}/portal/${clientPortal.portalSlug}` });
  } catch (error) {
    console.error('Error updating client portal settings:', error);
    res.status(500).json({ error: 'Failed to update client portal settings' });
  }
});

export default router;