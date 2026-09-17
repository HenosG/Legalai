"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/clients");
      } else {
        alert("Failed to create client.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/clients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
        <p className="text-muted-foreground text-sm">Register a new business entity or contact into your CRM system.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input 
            type="text" 
            required
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Sarah Jenkins" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input 
            type="text" 
            value={form.company} 
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="e.g., Apex Ventures" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input 
            type="email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="sarah@apexventures.com" 
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input 
            type="text" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (555) 019-2834" 
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
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="LEAD">LEAD</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition mt-4"
        >
          {submitting ? "Saving..." : "Save Client Account"}
        </button>
      </form>
    </div>
  );
}