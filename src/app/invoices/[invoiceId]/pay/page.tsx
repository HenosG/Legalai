"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

export default function InvoicePaymentPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;
    async function fetchInvoice() {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        const found = data.find((i: any) => i.id === invoiceId);
        setInvoice(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [invoiceId]);

  async function handleStripeCheckout() {
    setPaying(true);
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, amount: invoice.amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize Stripe checkout.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  }

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading payment portal...</div>;
  if (!invoice) return <div className="p-12 text-center text-muted-foreground">Invoice not found.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Secure Client Payment</h1>
          </div>
          <span className="text-xl font-extrabold text-primary">${Number(invoice.amount || 0).toLocaleString()}</span>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex justify-between py-1 border-b">
            <span>Invoice Reference:</span>
            <span className="font-mono text-foreground">{invoice.id}</span>
          </div>
          <div className="flex justify-between py-1 border-b">
            <span>Status:</span>
            <span className="font-semibold text-foreground">{invoice.status || "UNPAID"}</span>
          </div>
        </div>

        {invoice.status === "PAID" ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-200 text-emerald-600 rounded-lg text-center font-semibold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> This invoice has been fully paid. Thank you!
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <button
              onClick={handleStripeCheckout}
              disabled={paying}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold shadow hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" /> {paying ? "Redirecting to Stripe..." : "Pay with Stripe Secure Checkout"}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-bit Encrypted SSL Payment Processing via Stripe
            </div>
          </div>
        )}
      </div>
    </div>
  );
}