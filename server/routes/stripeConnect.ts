import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

/**
 * Separate from RelunoOS subscription billing. Nothing here touches
 * checkout.ts / stripe-webhook.ts or the Organization.stripeCustomerId
 * field used for platform subscriptions. This is exclusively about each
 * agency's OWN connected Stripe account, used to collect payment on their
 * own invoices from their own clients.
 */

function getAuth(req: any) {
  const auth = req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
  return { userId: auth?.userId as string | undefined };
}

async function resolveTenant(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { organizationId: true },
  });
  return user?.organizationId ?? null;
}

// ─── POST /api/stripe-connect/onboarding-link ──────────────────────────────
// Creates (or reuses) one Express connected account for this organization,
// then returns a fresh, single-use Account Link URL to Stripe-hosted onboarding.

router.post("/onboarding-link", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const organizationId = await resolveTenant(userId);
    if (!organizationId) {
      return res.status(400).json({ error: "This account is not part of an organization/workspace" });
    }

    const stripe = req.app.get("stripe");

    let connection = await prisma.integrationConnection.findUnique({
      where: { organizationId_provider: { organizationId, provider: "STRIPE" } },
    });

    let accountId = connection?.externalAccountId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        metadata: { relunoOrganizationId: organizationId },
      });
      accountId = account.id;

      connection = await prisma.integrationConnection.upsert({
        where: { organizationId_provider: { organizationId, provider: "STRIPE" } },
        create: {
          organizationId,
          provider: "STRIPE",
          status: "PENDING",
          externalAccountId: accountId,
          metadata: {},
        },
        update: {
          externalAccountId: accountId,
          status: "PENDING",
        },
      });
    }

    const clientUrl = process.env.CLIENT_URL || "";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${clientUrl}/settings/integrations?stripe_connect=refresh`,
      return_url: `${clientUrl}/settings/integrations?stripe_connect=return`,
      type: "account_onboarding",
    });

    return res.status(200).json({ url: accountLink.url });
  } catch (error: any) {
    console.error("Error creating Stripe Connect onboarding link:", error?.message || error);
    return res.status(500).json({ error: "Failed to create onboarding link" });
  }
});

// ─── GET /api/stripe-connect/status ─────────────────────────────────────────
// Always re-verifies against Stripe's own account object — never infers
// readiness from a frontend query param alone.

router.get("/status", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const organizationId = await resolveTenant(userId);
    if (!organizationId) {
      return res.status(400).json({ error: "This account is not part of an organization/workspace" });
    }

    const connection = await prisma.integrationConnection.findUnique({
      where: { organizationId_provider: { organizationId, provider: "STRIPE" } },
    });

    if (!connection?.externalAccountId) {
      return res.status(200).json({ connected: false, chargesEnabled: false, payoutsEnabled: false });
    }

    const stripe = req.app.get("stripe");
    const account = await stripe.accounts.retrieve(connection.externalAccountId);

    const chargesEnabled = Boolean(account.charges_enabled);
    const payoutsEnabled = Boolean(account.payouts_enabled);
    const detailsSubmitted = Boolean(account.details_submitted);

    const nextStatus = chargesEnabled && payoutsEnabled ? "CONNECTED" : "PENDING";

    if (nextStatus !== connection.status) {
      await prisma.integrationConnection.update({
        where: { id: connection.id },
        data: {
          status: nextStatus,
          externalAccountName: account.business_profile?.name || account.email || null,
          connectedAt: nextStatus === "CONNECTED" ? connection.connectedAt ?? new Date() : connection.connectedAt,
          lastSyncedAt: new Date(),
        },
      });
    }

    return res.status(200).json({
      connected: nextStatus === "CONNECTED",
      chargesEnabled,
      payoutsEnabled,
      detailsSubmitted,
      requirementsDue: account.requirements?.currently_due || [],
    });
  } catch (error: any) {
    console.error("Error checking Stripe Connect status:", error?.message || error);
    return res.status(500).json({ error: "Failed to check Stripe Connect status" });
  }
});

export default router;