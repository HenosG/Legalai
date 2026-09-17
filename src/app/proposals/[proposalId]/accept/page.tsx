"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, XCircle, Building2, FileText } from "lucide-react";

export default function ProposalAcceptancePage() {
  const params = useParams();
  const proposalId = params.proposalId as string;
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    if (!proposalId) return;
    async function fetchDetails() {
      try {
        const res = await fetch("/api/proposals");
        const data = await res.json();
        const found = data.find((p: any) => p.id === proposalId);
        setProposal(found || null);
        if (found?.status === "ACCEPTED" || found?.status === "DECLINED") {
          setActionDone(found.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [proposalId]);

  async function handleAction(decision: "accept" | "decline") {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/${decision}`, { method: "POST" });
      if (res.ok) {
        setActionDone(decision === "accept" ? "ACCEPTED" : "DECLINED");
      } else {
        alert("Action failed.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading proposal agreement...</div>;
  if (!proposal) return <div className="p-12 text-center text-muted-foreground">Proposal agreement not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="bg-card border rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{proposal.title}</h1>
          </div>
          <span className="text-lg font-bold text-primary">${Number(proposal.amount || 0).toLocaleString()}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">Scope & Terms</h3>
          <div className="text-sm bg-muted/30 p-4 rounded-lg whitespace-pre-wrap font-mono leading-relaxed border">
            {proposal.scope || "No detailed scope narrative provided."}
          </div>
        </div>

        {actionDone ? (
          <div className={`p-4 rounded-lg text-center font-semibold text-sm ${
            actionDone === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200" : "bg-red-500/10 text-red-600 border border-red-200"
          }`}>
            This proposal has been marked as **{actionDone}**. Thank you!
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => handleAction("decline")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border text-red-600 hover:bg-red-50 transition"
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
            <button
              onClick={() => handleAction("accept")}
              className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow hover:bg-emerald-700 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Proposal & Start Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}