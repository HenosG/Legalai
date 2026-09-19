"use client";

import React, { useState } from "react";
import { ArrowLeft, CreditCard, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BillingSettingsPage() {
  const [loading, setLoading] = useState(false);

  async function handleStripePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "GET" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm">Manage your plan tiers and payment methods.</p>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current Plan</span>
            <h2 className="text-xl font-bold text-primary">Pro Agency Tier</h2>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-semibold">Active</span>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your subscription renews automatically. Manage your credit cards, download past receipts, or change subscription tiers securely via the Stripe Customer Portal.
          </p>

          <button
            onClick={handleStripePortal}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-medium shadow hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" /> {loading ? "Loading Portal..." : "Open Stripe Billing Portal"} <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}