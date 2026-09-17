"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewLeadPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
    projectScope: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/leads");
      } else {
        alert("Failed to create lead.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manual Lead Intake</h1>
        <p className="text-muted-foreground text-sm">Add a prospective client inquiry to run AI qualification and begin pipeline tracking.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prospect Name *</label>
          <input 
            type="text" 
            required
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Sarah Jenkins" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input 
              type="email" 
              required
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="s.jenkins@company.com" 
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company / Organization</label>
            <input 
              type="text" 
              value={form.company} 
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Jenkins Digital" 
              className="w-full border rounded-lg p-2.5 text-sm bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project Scope & Initial Inquiry Notes</label>
          <textarea 
            rows={4}
            value={form.notes} 
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Looking for a full-stack React/Node MVP built out within 4 weeks..." 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition mt-4 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> {submitting ? "Analyzing & Saving..." : "Save Lead & Run AI Scoring"}
        </button>
      </form>
    </div>
  );
}