"use client";

import React, { useEffect, useState } from "react";
import { Plus, Flame, Sparkles, ArrowRight, Building2, User } from "lucide-react";
import Link from "next/link";

const COLUMNS = [
  { id: "NEW", label: "New Inquiries", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { id: "QUALIFIED", label: "AI Qualified", color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  { id: "CONTACTED", label: "Contacted", color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  { id: "CONVERTED", label: "Converted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { id: "LOST", label: "Archived / Lost", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        setLeads(data);
      } catch (error) {
        console.error("Failed to fetch leads", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Lead Intake Pipeline</h1>
          <p className="text-muted-foreground text-sm">Manage incoming prospect inquiries, automated scoring, and client onboarding.</p>
        </div>
        <Link 
          href="/leads/new" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Manual Lead Entry
        </Link>
      </div>

      {/* Kanban Board Grid */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Loading lead pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const columnLeads = leads.filter((l: any) => (l.status || "NEW") === col.id);
            return (
              <div key={col.id} className="bg-muted/30 border rounded-xl p-4 flex flex-col gap-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground bg-card px-2 py-0.5 rounded-full border">
                    {columnLeads.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {columnLeads.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8">No leads in this stage</div>
                  ) : (
                    columnLeads.map((lead: any) => (
                      <Link 
                        key={lead.id} 
                        href={`/leads/${lead.id}`}
                        className="bg-card border rounded-lg p-3.5 shadow-sm hover:shadow-md transition space-y-2 block group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-sm group-hover:text-primary transition">{lead.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                            lead.score === "HOT" ? "bg-red-500/10 text-red-600" :
                            lead.score === "WARM" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"
                          }`}>
                            <Flame className="w-3 h-3" /> {lead.score || "WARM"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {lead.company || lead.email}
                        </div>
                        <div className="text-[11px] text-muted-foreground/80 line-clamp-2 pt-1 border-t">
                          {lead.notes || lead.projectScope || "No initial brief summary provided."}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}