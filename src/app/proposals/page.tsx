"use client";

import React, { useEffect, useState } from "react";
import { Plus, FileText, Building2, ExternalLink, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const url = filter ? `/api/proposals?status=${filter}` : "/api/proposals";
        const res = await fetch(url);
        const data = await res.json();
        setProposals(data);
      } catch (error) {
        console.error("Failed to fetch proposals", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, [filter]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals & Agreements</h1>
          <p className="text-muted-foreground text-sm">Manage client pitches, scopes of work, and contract statuses.</p>
        </div>
        <Link 
          href="/proposals/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New Proposal
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <button 
          onClick={() => setFilter("")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          All Proposals
        </button>
        <button 
          onClick={() => setFilter("DRAFT,SENT")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "DRAFT,SENT" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          Open / Pending
        </button>
        <button 
          onClick={() => setFilter("SIGNED")} 
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === "SIGNED" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          Signed
        </button>
      </div>

      {/* Proposals Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground text-xs font-semibold uppercase">
              <th className="p-4">Proposal Title</th>
              <th className="p-4">Client / Company</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">Loading proposals...</td>
              </tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">No proposals found. Click "New Proposal" to create one.</td>
              </tr>
            ) : (
              proposals.map((prop: any) => (
                <tr key={prop.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> {prop.title}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {prop.client?.name || "Unassigned"} ({prop.client?.company || "N/A"})
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    ${prop.amount?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-px px-2.5 py-1 rounded-full text-xs font-semibold ${
                      prop.status === "SIGNED" ? "bg-emerald-500/10 text-emerald-600" :
                      prop.status === "SENT" ? "bg-blue-500/10 text-blue-600" : "bg-gray-500/10 text-gray-600"
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/proposals/${prop.id}`} 
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                    >
                      View Pitch <ExternalLink className="w-3 h-3" />
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