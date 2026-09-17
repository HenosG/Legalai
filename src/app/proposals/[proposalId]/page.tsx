"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Building2, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.proposalId as string;
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!proposalId) return;
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/proposals`);
        const data = await res.json();
        const found = data.find((p: any) => p.id === proposalId);
        setProposal(found || null);
      } catch (err) {
        console.error("Failed to load proposal details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [proposalId]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading proposal...</div>;
  if (!proposal) return <div className="p-8 text-center text-muted-foreground">Proposal not found.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/proposals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Proposals
      </Link>

      {/* Header */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{proposal.title}</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Client: {proposal.client?.name} ({proposal.client?.company || "Independent"})
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600">
          {proposal.status}
        </span>
      </div>

      {/* Financials & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Agreed Value</span>
            <div className="text-2xl font-bold mt-1">${proposal.amount?.toLocaleString()}</div>
          </div>
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Created Date</span>
            <div className="text-lg font-semibold mt-1">{new Date(proposal.createdAt).toLocaleDateString()}</div>
          </div>
          <Calendar className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* Content / Scope */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
        <h3 className="font-semibold text-lg">Detailed Scope of Work</h3>
        <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border">
          {proposal.content || "No detailed scope narrative provided."}
        </div>
      </div>
    </div>
  );
}