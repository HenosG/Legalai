import { Router } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const router = Router();

/**
 * Separate webhook from the RelunoOS subscription webhook
 * (server/routes/stripe-webhook.ts). Mounted on its own path in server.ts,
 * BEFORE express.json(), using express.raw() so the signature can be verified
 * against the untouched request body.
 *
 * This handles Stripe Connect account updates and invoice-payment events
 * that occur on CONNECTED accounts. Connect webhook events arrive with an
 * `account` field identifying which connected account they belong to.
 */

const CONNECT_WEBHOOK_SECRET = process.env.STRIPE_CONNECT_WEBHOOK_SECRET || "";

function toNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "object" && value !== null && "toNumber" in (value as any)) {
    return (value as any).toNumber();
  }
  return Number(value);
}

async function recalculateInvoiceFromPayments(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (!invoice) return;

  const amountPaid = invoice.payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + toNumber(p.amount), 0);

  const total = toNumber(invoice.amount);
  let status = invoice.status;

  if (amountPaid <= 0) {
    status = invoice.status === "DRAFT" ? "DRAFT" : invoice.status === "VOID" ? "VOID" : "OPEN";
  } else if (amountPaid >= total) {
    status = "PAID";
  } else {
    status = "PARTIALLY_PAID";
  }

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      amountPaid,
      status,
      paidAt: status === "PAID" ? new Date() : invoice.paidAt,
    },
  });
}

router.post("/", async (req: any, res) => {
  const stripe: Stripe = req.app.get("stripe");
  const signature = req.headers["stripe-signature"] as string | undefined;

  if (!CONNECT_WEBHOOK_SECRET) {
    console.error("STRIPE_CONNECT_WEBHOOK_SECRET is not configured");
    return res.status(500).send("Webhook not configured");
  }
  if (!signature) {
    return res.status(400).send("Missing Stripe signature header");
  }

  let event: Stripe.Event;
  try {
    // req.body MUST be the raw Buffer here — mount this route with
    // express.raw({ type: "application/json" }) BEFORE express.json().
    event = stripe.webhooks.constructEvent(req.body, signature, CONNECT_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error("Connect webhook signature verification failed:", error?.message || error);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const invoiceId = session.metadata?.relunoInvoiceId;
        if (!invoiceId) break;

        const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
        if (!invoice) break;

        // Idempotency: skip if we've already recorded a payment for this
        // specific Checkout Session (webhook can be redelivered by Stripe).
        const existingPayment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: (session.payment_intent as string) || undefined },
        });
        if (existingPayment) break;

        await prisma.payment.create({
          data: {
            userId: invoice.userId,
            organizationId: invoice.organizationId,
            invoiceId: invoice.id,
            amount: (session.amount_total || 0) / 100,
            method: "card",
            status: "completed",
            stripePaymentIntentId: (session.payment_intent as string) || null,
          },
        });

        await recalculateInvoiceFromPayments(invoice.id);

        await prisma.activityLog.create({
          data: {
            userId: invoice.userId,
            organizationId: invoice.organizationId,
            action: "INVOICE_PAID",
            description: `Payment received for invoice ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`,
            module: "invoices",
            targetId: invoice.id,
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn(`Connect payment failed: ${intent.id} — ${intent.last_payment_error?.message}`);
        // No invoice state change on failure — the invoice stays OPEN so the
        // client can retry. Nothing to reconcile here beyond logging.
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string | undefined;
        if (!paymentIntentId) break;

        const payment = await prisma.payment.findFirst({
          where: { stripePaymentIntentId: paymentIntentId },
        });
        if (!payment) break;

        const refundedAmount = charge.amount_refunded / 100;
        const fullyRefunded = charge.amount_refunded >= charge.amount;

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: fullyRefunded ? "refunded" : "partially_refunded",
            amount: fullyRefunded ? 0 : toNumber(payment.amount) - refundedAmount,
          },
        });

        await recalculateInvoiceFromPayments(payment.invoiceId);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;

        const connection = await prisma.integrationConnection.findFirst({
          where: { provider: "STRIPE", externalAccountId: account.id },
        });
        if (!connection) break;

        const chargesEnabled = Boolean(account.charges_enabled);
        const payoutsEnabled = Boolean(account.payouts_enabled);
        const nextStatus = chargesEnabled && payoutsEnabled ? "CONNECTED" : "PENDING";

        await prisma.integrationConnection.update({
          where: { id: connection.id },
          data: {
            status: nextStatus,
            lastSyncedAt: new Date(),
            connectedAt: nextStatus === "CONNECTED" ? connection.connectedAt ?? new Date() : connection.connectedAt,
          },
        });
        break;
      }

      default:
        // Unhandled event types are ignored, not errors.
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Error processing Connect webhook event:", error?.message || error);
    // Return 500 so Stripe retries — we don't want to silently drop a
    // payment reconciliation event due to a transient DB error.
    return res.status(500).send("Webhook handler error");
  }
});

export default router;