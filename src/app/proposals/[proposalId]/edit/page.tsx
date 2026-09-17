"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.proposalId as string;
  const [form, setForm] = useState({ title: "", amount: "", scope: "", status: "DRAFT" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!proposalId) return;
    async function fetchProposal() {
      try {
        const res = await fetch("/api/proposals");
        const data = await res.json();
        const found = data.find((p: any) => p.id === proposalId);
        if (found) {
          setForm({
            title: found.title || "",
            amount: found.amount ? String(found.amount) : "",
            scope: found.scope || "",
            status: found.status || "DRAFT",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [proposalId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) || 0 }),
      });
      if (res.ok) {
        router.push(`/proposals/${proposalId}`);
      } else {
        alert("Failed to update proposal.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading proposal editor...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link href={`/proposals/${proposalId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Proposal
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Proposal</h1>
        <p className="text-muted-foreground text-sm">Modify scope, budget parameters, and proposal status.</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Proposal Title</label>
          <input 
            type="text" 
            required
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              required
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="DECLINED">DECLINED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scope of Work</label>
          <textarea 
            rows={6}
            value={form.scope} 
            onChange={(e) => setForm({ ...form, scope: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background font-mono text-xs"
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition mt-4 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Update Proposal"}
        </button>
      </form>
    </div>
  );
}