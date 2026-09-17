"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProposalPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    title: "",
    clientId: "",
    amount: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Failed to load clients", err);
      }
    }
    fetchClients();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/proposals");
      } else {
        alert("Failed to create proposal.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/proposals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Proposals
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Draft New Proposal</h1>
        <p className="text-muted-foreground text-sm">Create a commercial scope of work and price deck for a client account.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Proposal Title *</label>
          <input 
            type="text" 
            required
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Full-Stack Web App Development Sprint" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Target Client *</label>
          <select 
            required
            value={form.clientId} 
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          >
            <option value="">Select a client...</option>
            {clients.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company || "Independent"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Proposed Amount ($ CAD / USD) *</label>
          <input 
            type="number" 
            required
            step="0.01"
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="5500.00" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scope / Content Summary</label>
          <textarea 
            rows={4}
            value={form.content} 
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Outline deliverables, technical stack specifications, milestones, and payment terms..." 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition mt-4"
        >
          {submitting ? "Generating..." : "Save Proposal Draft"}
        </button>
      </form>
    </div>
  );
}