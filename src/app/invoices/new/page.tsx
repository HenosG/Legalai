"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    clientId: "",
    amount: "1500",
    status: "UNPAID",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, clientId: data[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchClients();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount) || 0,
        }),
      });
      if (res.ok) {
        router.push("/invoices");
      } else {
        alert("Failed to create invoice.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/invoices" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
        <p className="text-muted-foreground text-sm">Issue a billing statement and generate a client payment link.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target Client *</label>
          <select
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          >
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Amount ($ CAD/USD) *</label>
          <input 
            type="number" 
            step="0.01"
            required
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition mt-4"
        >
          {submitting ? "Generating..." : "Generate Invoice"}
        </button>
      </form>
    </div>
  );
}