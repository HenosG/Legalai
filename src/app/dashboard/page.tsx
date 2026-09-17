"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, FileText, Briefcase, DollarSign, Plus, ArrowUpRight, Activity 
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeClients: 0,
    openProposals: 0,
    activeProjects: 0,
    outstandingRevenue: 0,
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard/metrics");
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Universal AI Command Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
        <span className="text-primary font-semibold text-sm px-2 py-1 bg-primary/10 rounded-md">AI</span>
        <input 
          type="text" 
          placeholder="Ask Reluno AI to draft a proposal, analyze a lead, or write a client update..." 
          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
        />
      </div>

      {/* 2. Greeting Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here is your agency's real-time operational overview.</p>
      </div>

      {/* 3. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-card border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Active Clients</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{loading ? "..." : stats.activeClients}</div>
        </div>
        <div className="p-5 bg-card border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Open Proposals</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{loading ? "..." : stats.openProposals}</div>
        </div>
        <div className="p-5 bg-card border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Active Projects</span>
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">{loading ? "..." : stats.activeProjects}</div>
        </div>
        <div className="p-5 bg-card border rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Outstanding Invoices</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mt-2">${loading ? "..." : stats.outstandingRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <a href="/clients/new" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90">
          <Plus className="w-4 h-4" /> New Lead / Client
        </a>
        <a href="/proposals" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium border shadow-sm hover:bg-muted">
          <FileText className="w-4 h-4" /> New Proposal
        </a>
        <a href="/invoices" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium border shadow-sm hover:bg-muted">
          <DollarSign className="w-4 h-4" /> Create Invoice
        </a>
      </div>

      {/* 5. Modules Grid Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/clients" className="p-6 bg-card border rounded-xl shadow-sm hover:border-primary transition group">
          <h3 className="font-semibold text-lg flex items-center justify-between">CRM Engine <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" /></h3>
          <p className="text-sm text-muted-foreground mt-1">Manage active relationships, accounts, and contact histories.</p>
        </a>
        <a href="/projects" className="p-6 bg-card border rounded-xl shadow-sm hover:border-primary transition group">
          <h3 className="font-semibold text-lg flex items-center justify-between">Project Delivery <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" /></h3>
          <p className="text-sm text-muted-foreground mt-1">Track deliverables, deadlines, and milestone progress.</p>
        </a>
        <a href="/invoices" className="p-6 bg-card border rounded-xl shadow-sm hover:border-primary transition group">
          <h3 className="font-semibold text-lg flex items-center justify-between">Billing & Stripe <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" /></h3>
          <p className="text-sm text-muted-foreground mt-1">Monitor revenue collection, unpaid bills, and payment links.</p>
        </a>
      </div>

      {/* 6. Activity Feed */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-primary" /> Recent System Activity</h3>
        <div className="space-y-3">
          {activityLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity logs recorded yet.</p>
          ) : (
            activityLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b last:border-none">
                <span className="font-medium text-foreground">{log.description}</span>
                <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}