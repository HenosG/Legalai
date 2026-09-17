"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Building2, Mail, Phone, Flame, CheckCircle2, UserCheck } from "lucide-react";
import Link from "next/link";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [qualifying, setQualifying] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    async function fetchLead() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        const found = data.find((l: any) => l.id === leadId);
        setLead(found || null);
      } catch (err) {
        console.error("Failed to fetch lead details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId]);

  async function handleQualifyAI() {
    setQualifying(true);
    try {
      const res = await fetch(`/api/ai/qualify-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead(updated);
      } else {
        alert("AI qualification failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQualifying(false);
    }
  }

  async function handleConvert() {
    setConverting(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/clients");
      } else {
        alert("Failed to convert lead.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConverting(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading lead profile...</div>;
  if (!lead) return <div className="p-8 text-center text-muted-foreground">Lead not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/leads" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </Link>

      {/* Header & Actions */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
              lead.score === "HOT" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
            }`}>
              <Flame className="w-3.5 h-3.5" /> {lead.score || "WARM"} Priority
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> {lead.company || "Independent Organization"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQualifyAI}
            disabled={qualifying}
            className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3.5 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition"
          >
            <Sparkles className="w-4 h-4 text-purple-500" /> {qualifying ? "Scoring..." : "Run AI Qualify"}
          </button>
          <button
            onClick={handleConvert}
            disabled={converting}
            className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-95 transition"
          >
            <UserCheck className="w-4 h-4" /> {converting ? "Converting..." : "Convert to Client + Proposal"}
          </button>
        </div>
      </div>

      {/* Contact Info & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">Contact Channels</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" /> {lead.email}
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="w-4 h-4 text-muted-foreground" /> {lead.phone || "No phone provided"}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">Pipeline Status</h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {lead.status || "NEW"}
            </span>
          </div>
        </div>
      </div>

      {/* Inquiry Notes & Scope */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
        <h3 className="font-semibold text-lg">Inquiry & Project Scope</h3>
        <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border">
          {lead.notes || lead.projectScope || "No scope notes recorded."}
        </div>
      </div>
    </div>
  );
}