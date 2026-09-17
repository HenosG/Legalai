"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Receipt, Building2, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;
    async function fetchDetails() {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        const found = data.find((i: any) => i.id === invoiceId);
        setInvoice(found || null);
      } catch (err) {
        console.error("Failed to load invoice details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [invoiceId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading invoice...</div>;
  if (!invoice) return <div className="p-8 text-center text-muted-foreground">Invoice not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      <div className="bg-card border rounded-xl p-6 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber || invoice.id.slice(0, 8)}</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Client: {invoice.client?.name} ({invoice.client?.company || "Independent"})
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          invoice.status === "PAID" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
        }`}>
          {invoice.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Total Amount Due</span>
            <div className="text-2xl font-bold mt-1">${invoice.amount?.toLocaleString()}</div>
          </div>
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Amount Paid</span>
            <div className="text-2xl font-bold mt-1 text-emerald-600">${invoice.amountPaid?.toLocaleString() || "0"}</div>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}