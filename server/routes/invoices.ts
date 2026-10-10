import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAuth(req: any) {
  const auth = req.auth && typeof req.auth === "function" ? req.auth() : req.auth;
  return {
    userId: auth?.userId as string | undefined,
    orgId: auth?.orgId as string | undefined,
  };
}

async function resolveTenant(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, organizationId: true },
  });
  return { userId, organizationId: user?.organizationId ?? null };
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  // Prisma.Decimal has a toNumber() method; plain numbers pass through.
  if (typeof value === "object" && value !== null && "toNumber" in (value as any)) {
    return (value as any).toNumber();
  }
  return Number(value);
}

function serializeInvoice(invoice: any) {
  return {
    ...invoice,
    subtotal: toNumber(invoice.subtotal),
    taxAmount: toNumber(invoice.taxAmount),
    discountAmount: toNumber(invoice.discountAmount),
    amount: toNumber(invoice.amount),
    amountPaid: toNumber(invoice.amountPaid),
    items: Array.isArray(invoice.items)
      ? invoice.items.map((item: any) => ({
          ...item,
          quantity: toNumber(item.quantity),
          unitPrice: toNumber(item.unitPrice),
          amount: toNumber(item.amount),
        }))
      : undefined,
    payments: Array.isArray(invoice.payments)
      ? invoice.payments.map((p: any) => ({ ...p, amount: toNumber(p.amount) }))
      : undefined,
  };
}

/**
 * Recompute subtotal/amount from line items server-side. The client-sent
 * totals are NEVER trusted — this is the single source of truth.
 */
function computeTotals(
  items: { quantity: number; unitPrice: number }[],
  taxAmount: number,
  discountAmount: number
) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const amount = Math.max(subtotal + taxAmount - discountAmount, 0);
  return {
    subtotal: round2(subtotal),
    amount: round2(amount),
  };
}

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function nextInvoiceNumber(userId: string) {
  const count = await prisma.invoice.count({ where: { userId } });
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

// ─── Validation ──────────────────────────────────────────────────────────────

const lineItemSchema = z.object({
  id: z.string().optional(), // present on PATCH for existing items, absent for new ones
  description: z.string().min(1, "Line item description is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  position: z.number().int().min(0).optional(),
  projectId: z.string().optional().nullable(),
  milestoneId: z.string().optional().nullable(),
});

const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional().nullable(),
  milestoneId: z.string().optional().nullable(),
  invoiceNumber: z.string().optional(),
  title: z.string().optional(),
  currency: z.string().length(3).default("CAD"),
  issueDate: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  items: z.array(lineItemSchema).optional(),
});

// ─── GET /api/invoices ─────────────────────────────────────────────────────
// Matches the response shape Invoices.tsx already expects:
// { invoices: InvoiceListItem[], metrics: InvoiceMetrics }

router.get("/", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: { select: { id: true, name: true, company: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const serialized = invoices.map(serializeInvoice);

    const now = new Date();
    const outstanding = serialized
      .filter((inv) => !["PAID", "VOID", "DRAFT", "UNCOLLECTIBLE"].includes(inv.status))
      .reduce((sum, inv) => sum + Math.max(inv.amount - inv.amountPaid, 0), 0);

    const overdue = serialized
      .filter(
        (inv) =>
          !["PAID", "VOID", "DRAFT", "UNCOLLECTIBLE"].includes(inv.status) &&
          inv.dueDate &&
          new Date(inv.dueDate) < now
      )
      .reduce((sum, inv) => sum + Math.max(inv.amount - inv.amountPaid, 0), 0);

    const drafts = serialized.filter((inv) => inv.status === "DRAFT").length;

    const paidThisMonth = serialized
      .filter((inv) => {
        if (inv.status !== "PAID" || !inv.paidAt) return false;
        const paidDate = new Date(inv.paidAt);
        return (
          paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, inv) => sum + inv.amount, 0);

    return res.status(200).json({
      invoices: serialized,
      metrics: { outstanding, paidThisMonth, overdue, drafts, totalInvoices: serialized.length },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// ─── GET /api/invoices/:id ───────────────────────────────────────────────────

router.get("/:id", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId },
      include: {
        client: { select: { id: true, name: true, company: true, email: true, phone: true } },
        items: { orderBy: { position: "asc" } },
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    return res.status(200).json(serializeInvoice(invoice));
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

// ─── POST /api/invoices — create draft + items transactionally ─────────────

router.post("/", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { organizationId } = await resolveTenant(userId);

    const parsed = createInvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Tenant checks — the client (and project/milestone, if given) must
    // belong to this same user/organization. Never trust client-sent IDs blindly.
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
      select: { id: true },
    });
    if (!client) return res.status(400).json({ error: "Client not found for this account" });

    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, userId, clientId: data.clientId },
        select: { id: true },
      });
      if (!project) {
        return res.status(400).json({ error: "Project does not belong to this client/account" });
      }
    }

    if (data.milestoneId) {
      const milestone = await prisma.milestone.findFirst({
        where: { id: data.milestoneId, userId, projectId: data.projectId ?? undefined },
        select: { id: true },
      });
      if (!milestone) {
        return res.status(400).json({ error: "Milestone does not belong to this project/account" });
      }
    }

    const { subtotal, amount } = computeTotals(
      data.items.map((i) => ({ quantity: i.quantity, unitPrice: i.unitPrice })),
      data.taxAmount,
      data.discountAmount
    );

    const invoiceNumber = data.invoiceNumber?.trim() || (await nextInvoiceNumber(userId));

    const invoice = await prisma.$transaction(async (tx) => {
      const created = await tx.invoice.create({
        data: {
          userId,
          organizationId,
          clientId: data.clientId,
          invoiceNumber,
          title: data.title?.trim() || null,
          currency: data.currency || "CAD",
          subtotal,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          amount,
          amountPaid: 0,
          status: "DRAFT",
          issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          notes: data.notes?.trim() || null,
          terms: data.terms?.trim() || null,
        },
      });

      await tx.invoiceItem.createMany({
        data: data.items.map((item, index) => ({
          invoiceId: created.id,
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: round2(item.quantity * item.unitPrice),
          position: item.position ?? index,
          projectId: item.projectId || data.projectId || null,
          milestoneId: item.milestoneId || data.milestoneId || null,
        })),
      });

      await tx.activityLog.create({
        data: {
          userId,
          organizationId,
          action: "INVOICE_CREATED",
          description: `Created draft invoice ${invoiceNumber}`,
          module: "invoices",
          targetId: created.id,
        },
      });

      return tx.invoice.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          client: { select: { id: true, name: true, company: true, email: true } },
          items: { orderBy: { position: "asc" } },
        },
      });
    });

    return res.status(201).json(serializeInvoice(invoice));
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({ error: "Failed to create invoice" });
  }
});

// ─── PATCH /api/invoices/:id — edit drafts only ─────────────────────────────

router.patch("/:id", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const existing = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId },
      include: { items: true },
    });
    if (!existing) return res.status(404).json({ error: "Invoice not found" });

    if (existing.status !== "DRAFT") {
      return res.status(409).json({ error: "Only draft invoices can be edited" });
    }

    const parsed = updateInvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    }
    const data = parsed.data;

    if (data.clientId) {
      const client = await prisma.client.findFirst({
        where: { id: data.clientId, userId },
        select: { id: true },
      });
      if (!client) return res.status(400).json({ error: "Client not found for this account" });
    }

    const items = data.items ?? existing.items.map((i) => ({
      description: i.description,
      quantity: toNumber(i.quantity),
      unitPrice: toNumber(i.unitPrice),
      position: i.position,
      projectId: i.projectId,
      milestoneId: i.milestoneId,
    }));

    const taxAmount = data.taxAmount ?? toNumber(existing.taxAmount);
    const discountAmount = data.discountAmount ?? toNumber(existing.discountAmount);
    const { subtotal, amount } = computeTotals(items, taxAmount, discountAmount);

    const updated = await prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: existing.id } });
        await tx.invoiceItem.createMany({
          data: data.items.map((item, index) => ({
            invoiceId: existing.id,
            description: item.description.trim(),
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: round2(item.quantity * item.unitPrice),
            position: item.position ?? index,
            projectId: item.projectId || null,
            milestoneId: item.milestoneId || null,
          })),
        });
      }

      return tx.invoice.update({
        where: { id: existing.id },
        data: {
          clientId: data.clientId ?? undefined,
          invoiceNumber: data.invoiceNumber?.trim() || undefined,
          title: data.title !== undefined ? data.title?.trim() || null : undefined,
          currency: data.currency ?? undefined,
          subtotal,
          taxAmount,
          discountAmount,
          amount,
          issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
          dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
          notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
          terms: data.terms !== undefined ? data.terms?.trim() || null : undefined,
        },
        include: {
          client: { select: { id: true, name: true, company: true, email: true } },
          items: { orderBy: { position: "asc" } },
        },
      });
    });

    return res.status(200).json(serializeInvoice(updated));
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({ error: "Failed to update invoice" });
  }
});

// ─── POST /api/invoices/:id/issue — issue/send ─────────────────────────────
// Idempotent: calling this twice on an already-issued invoice is a no-op
// that just returns the current state, rather than re-sending/duplicating.

router.post("/:id/issue", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId },
      include: { items: true, client: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    if (invoice.status !== "DRAFT") {
      // Already issued — return current state rather than erroring, so a
      // retried/duplicate click from the client is harmless.
      return res.status(200).json(serializeInvoice(invoice));
    }

    if (invoice.items.length === 0) {
      return res.status(400).json({ error: "Cannot issue an invoice with no line items" });
    }
    if (!invoice.client?.email) {
      return res.status(400).json({ error: "Client has no email on file to send the invoice to" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: "OPEN", sentAt: new Date() },
        include: {
          client: { select: { id: true, name: true, company: true, email: true } },
          items: { orderBy: { position: "asc" } },
        },
      });

      await tx.activityLog.create({
        data: {
          userId,
          organizationId: invoice.organizationId,
          action: "INVOICE_ISSUED",
          description: `Issued invoice ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`,
          module: "invoices",
          targetId: invoice.id,
        },
      });

      return result;
    });

    // NOTE: actually emailing the client (Resend, etc.) is not wired up here —
    // this endpoint flips the invoice to OPEN and stamps sentAt. Hook in your
    // email send here when that's ready; don't claim the email was sent until it is.

    return res.status(200).json(serializeInvoice(updated));
  } catch (error) {
    console.error("Error issuing invoice:", error);
    return res.status(500).json({ error: "Failed to issue invoice" });
  }
});

// ─── POST /api/invoices/:id/payment-session ────────────────────────────────
// Creates a Stripe Checkout Session on the agency's CONNECTED account
// (Direct charge model — see stripeConnect.ts for the full explanation).
// Returns 409 if the organization hasn't completed Connect onboarding.

router.post("/:id/payment-session", async (req: any, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { organizationId } = await resolveTenant(userId);
    if (!organizationId) {
      return res.status(400).json({ error: "This account is not part of an organization/workspace" });
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId },
      include: { client: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    if (!["OPEN", "OVERDUE", "PARTIALLY_PAID"].includes(invoice.status)) {
      return res.status(409).json({ error: "This invoice is not currently payable" });
    }

    const connection = await prisma.integrationConnection.findUnique({
      where: { organizationId_provider: { organizationId, provider: "STRIPE" } },
    });

    if (!connection || connection.status !== "CONNECTED" || !connection.externalAccountId) {
      return res.status(409).json({
        error: "Stripe Connect is not set up for this workspace yet. Complete onboarding first.",
      });
    }

    // Idempotency: reuse an in-flight session if one was created in the last
    // few minutes for this invoice, rather than creating a duplicate.
    const metadataKey = `invoice_payment_session:${invoice.id}`;
    const existingMeta = (connection.metadata as Record<string, any>) || {};
    const cachedSessionId = existingMeta[metadataKey];

    const amountDue = toNumber(invoice.amount) - toNumber(invoice.amountPaid);
    if (amountDue <= 0) {
      return res.status(400).json({ error: "This invoice has no remaining balance" });
    }

    const stripe = req.app.get("stripe");
    const feeBasisPoints = Number(process.env.STRIPE_CONNECT_APPLICATION_FEE_BPS || 0);
    const applicationFeeAmount = feeBasisPoints > 0
      ? Math.round(amountDue * 100 * (feeBasisPoints / 10000))
      : undefined;

    if (cachedSessionId) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(cachedSessionId, {
          stripeAccount: connection.externalAccountId,
        });
        if (existingSession.status === "open") {
          return res.status(200).json({ url: existingSession.url });
        }
      } catch {
        // Session expired/not found on Stripe's side — fall through and create a new one.
      }
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: invoice.client?.email || undefined,
        line_items: [
          {
            price_data: {
              currency: (invoice.currency || "cad").toLowerCase(),
              unit_amount: Math.round(amountDue * 100),
              product_data: {
                name: `Invoice ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`,
                description: invoice.title || undefined,
              },
            },
            quantity: 1,
          },
        ],
        payment_intent_data: applicationFeeAmount
          ? { application_fee_amount: applicationFeeAmount }
          : undefined,
        metadata: {
          relunoInvoiceId: invoice.id,
          relunoOrganizationId: organizationId,
        },
        success_url: `${process.env.CLIENT_URL}/invoices/${invoice.id}?payment=success`,
        cancel_url: `${process.env.CLIENT_URL}/invoices/${invoice.id}?payment=cancelled`,
      },
      { stripeAccount: connection.externalAccountId }
    );

    await prisma.integrationConnection.update({
      where: { id: connection.id },
      data: { metadata: { ...existingMeta, [metadataKey]: session.id } },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating invoice payment session:", error?.message || error);
    return res.status(500).json({ error: "Failed to create payment session" });
  }
});

export default router;