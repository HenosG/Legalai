"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Building } from "lucide-react";
import Link from "next/link";

export default function WorkspaceSettingsPage() {
  const [org, setOrg] = useState({ name: "Reluno Legal AI Agency" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch("/api/organization");
        const data = await res.json();
        if (data && data.name) setOrg({ name: data.name });
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrg();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });
      if (res.ok) {
        alert("Workspace updated successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your agency branding and organization name.</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Organization / Agency Name</label>
          <input
            type="text"
            value={org.name}
            onChange={(e) => setOrg({ name: e.target.value })}
            className="w-full border rounded-lg p-2.5 text-sm bg-background"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium shadow hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Workspace"}
        </button>
      </form>
    </div>
  );
}