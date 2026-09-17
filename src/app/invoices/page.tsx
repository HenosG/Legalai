"use client";

import React, { useEffect, useState } from "react";
import { Plus, Receipt, Building2, ExternalLink, DollarSign } from "lucide-react";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/invoices");
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to fetch invoices", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices & Billing</h1>
          <p className="text-muted-foreground text-sm">Monitor receivables, track payment statuses, and generate client bills.</p>
        </div>
        <Link 
          href="/invoices/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground text-xs font-semibold uppercase">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">Loading invoices...</td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">No invoices found. Click "New Invoice" to issue one.</td>
              </tr>
            ) : (
              invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" /> {inv.invoiceNumber || inv.id.slice(0, 8)}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {inv.client?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    ${inv.amount?.toLocaleString()}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    ${inv.amountPaid?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4">
                    <span className={`inline-px px-2.5 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-600" :
                      inv.status === "OVERDUE" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/invoices/${inv.id}`} 
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                    >
                      View Bill <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}