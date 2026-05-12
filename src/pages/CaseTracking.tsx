// src/pages/CaseTracking.tsx
// Monday.com-style Kanban + Table toggle
// Priority flags (High/Med/Low), Assigned Attorney avatars, mobile-scrollable

import React, { useState } from "react";


import {
  FolderKanban, Plus, Search, Filter, LayoutGrid, List,
  ChevronDown, Flag, Clock, Calendar, MoreHorizontal,
  ArrowUpRight, AlertTriangle, CheckCircle2, Circle, Pause,
  SortAsc, Tag, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "New" | "Discovery" | "In Progress" | "Review" | "Closed";
type Priority = "High" | "Medium" | "Low";
type PracticeArea = "Contract" | "Family Law" | "Personal Injury" | "Employment" | "IP" | "Real Estate" | "Criminal";

interface Attorney {
  initials: string;
  name: string;
  color: string;
}

interface Case {
  id: string;
  caseRef: string;
  title: string;
  client: string;
  status: Status;
  priority: Priority;
  practiceArea: PracticeArea;
  attorney: Attorney;
  nextDeadline?: string;
  openedDate: string;
  estimatedValue?: string;
  daysOpen: number;
}

// ─── Config maps ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; icon: React.ElementType; dot: string }> = {
  "New":         { color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    icon: Circle,       dot: "bg-blue-500"    },
  "Discovery":   { color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200",  icon: Search,       dot: "bg-violet-500"  },
  "In Progress": { color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   icon: Pause,        dot: "bg-amber-500"   },
  "Review":      { color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200",  icon: AlertTriangle,dot: "bg-orange-500"  },
  "Closed":      { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", icon: CheckCircle2, dot: "bg-emerald-500" },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; border: string }> = {
  "High":   { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
  "Medium": { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  "Low":    { color: "text-slate-500",   bg: "bg-slate-50",   border: "border-slate-200"   },
};

const STATUSES: Status[] = ["New", "Discovery", "In Progress", "Review", "Closed"];

// ─── Sample data ──────────────────────────────────────────────────────────────
const ATTORNEYS: Attorney[] = [
  { initials: "SK", name: "Sarah Kim",     color: "bg-blue-500"    },
  { initials: "MT", name: "Marcus Torres", color: "bg-violet-500"  },
  { initials: "PN", name: "Priya Nair",    color: "bg-emerald-500" },
  { initials: "JR", name: "James Reed",    color: "bg-orange-500"  },
];

const CASES: Case[] = [
  { id: "1",  caseRef: "#2847", title: "Henderson v. Marsh Properties LLC",        client: "Henderson Family Trust", status: "In Progress", priority: "High",   practiceArea: "Real Estate",     attorney: ATTORNEYS[0], nextDeadline: "2025-05-14", openedDate: "2025-01-10", estimatedValue: "$840,000",  daysOpen: 124 },
  { id: "2",  caseRef: "#2801", title: "Apex Holdings — Breach of MSA",            client: "Apex Holdings Corp",     status: "Discovery",   priority: "High",   practiceArea: "Contract",        attorney: ATTORNEYS[1], nextDeadline: "2025-05-20", openedDate: "2025-02-01", estimatedValue: "$1.2M",     daysOpen: 103 },
  { id: "3",  caseRef: "#2750", title: "Rivera v. Consolidated Transport Inc",     client: "Maria Rivera",           status: "Review",      priority: "High",   practiceArea: "Personal Injury", attorney: ATTORNEYS[2], nextDeadline: "2025-05-18", openedDate: "2024-11-15", estimatedValue: "$320,000",  daysOpen: 181 },
  { id: "4",  caseRef: "#2900", title: "NovaTech IP Assignment Dispute",           client: "NovaTech Solutions",     status: "New",         priority: "Medium", practiceArea: "IP",              attorney: ATTORNEYS[0], nextDeadline: "2025-06-02", openedDate: "2025-04-20", estimatedValue: "Unliquidated", daysOpen: 20 },
  { id: "5",  caseRef: "#2720", title: "Chen Divorce Proceedings",                 client: "Diana Chen",             status: "In Progress", priority: "Medium", practiceArea: "Family Law",      attorney: ATTORNEYS[3], nextDeadline: "2025-05-25", openedDate: "2024-12-01", estimatedValue: "$580,000",  daysOpen: 165 },
  { id: "6",  caseRef: "#2880", title: "Whistleblower Retaliation — Morrison",     client: "Brett Morrison",         status: "New",         priority: "High",   practiceArea: "Employment",      attorney: ATTORNEYS[1], nextDeadline: "2025-05-30", openedDate: "2025-04-05", estimatedValue: "$180,000",  daysOpen: 35  },
  { id: "7",  caseRef: "#2760", title: "Greenfield Residential Purchase Dispute",  client: "Greenfield Partners",    status: "Closed",      priority: "Low",    practiceArea: "Real Estate",     attorney: ATTORNEYS[2], nextDeadline: undefined,    openedDate: "2024-10-01", estimatedValue: "$420,000",  daysOpen: 0   },
  { id: "8",  caseRef: "#2810", title: "SkyNet Software License Breach",           client: "SkyNet Systems Inc",     status: "Discovery",   priority: "Medium", practiceArea: "Contract",        attorney: ATTORNEYS[3], nextDeadline: "2025-06-10", openedDate: "2025-02-15", estimatedValue: "$95,000",   daysOpen: 89  },
  { id: "9",  caseRef: "#2855", title: "Lang Criminal Defense — DUI",             client: "Thomas Lang",            status: "In Progress", priority: "High",   practiceArea: "Criminal",        attorney: ATTORNEYS[0], nextDeadline: "2025-05-22", openedDate: "2025-03-01", estimatedValue: "N/A",       daysOpen: 75  },
  { id: "10", caseRef: "#2892", title: "Patel Patent Infringement Claim",         client: "Patel Technologies",     status: "New",         priority: "Low",    practiceArea: "IP",              attorney: ATTORNEYS[1], nextDeadline: "2025-07-01", openedDate: "2025-04-28", estimatedValue: "$2.4M",     daysOpen: 12  },
];

// ─── Priority flag ────────────────────────────────────────────────────────────
const PriorityFlag: React.FC<{ priority: Priority }> = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span className={cn("flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border", cfg.bg, cfg.color, cfg.border)}>
      <Flag className="w-2 h-2" />
      {priority}
    </span>
  );
};

// ─── Attorney avatar ──────────────────────────────────────────────────────────
const AttorneyAvatar: React.FC<{ attorney: Attorney; showName?: boolean }> = ({ attorney, showName }) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[8px] font-black", attorney.color)}>
      {attorney.initials}
    </div>
    {showName && <span className="text-[10px] font-bold text-zinc-600">{attorney.name}</span>}
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border", cfg.bg, cfg.color, cfg.border)}>
      <Icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
};

// ─── Kanban card ──────────────────────────────────────────────────────────────
const KanbanCard: React.FC<{ c: Case }> = ({ c }) => {
  const pri = PRIORITY_CONFIG[c.priority];
  return (
    <div className={cn(
      "bg-white border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer group space-y-3",
      c.priority === "High" ? "border-red-100 hover:border-red-200" : "border-zinc-200 hover:border-cyan-200"
    )}>
      {/* Ref + priority */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{c.caseRef}</span>
        <PriorityFlag priority={c.priority} />
      </div>

      {/* Title */}
      <p className="text-[11px] font-black text-zinc-900 leading-snug">{c.title}</p>

      {/* Client */}
      <p className="text-[10px] text-zinc-400 font-medium">{c.client}</p>

      {/* Practice area chip */}
      <span className="text-[8px] font-black text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded uppercase tracking-widest">
        {c.practiceArea}
      </span>

      {/* Deadline */}
      {c.nextDeadline && (
        <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-medium">
          <Calendar className="w-2.5 h-2.5" />
          {new Date(c.nextDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        <AttorneyAvatar attorney={c.attorney} showName />
        {c.estimatedValue && (
          <span className="text-[9px] font-black text-emerald-600">{c.estimatedValue}</span>
        )}
      </div>
    </div>
  );
};

// ─── Kanban board ─────────────────────────────────────────────────────────────
const KanbanBoard: React.FC<{ cases: Case[] }> = ({ cases }) => (
  <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]" style={{ scrollbarWidth: "thin" }}>
    {STATUSES.map((status) => {
      const colCases = cases.filter((c) => c.status === status);
      const cfg = STATUS_CONFIG[status];
      return (
        <div key={status} className="flex-shrink-0 w-72">
          {/* Column header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{status}</span>
              <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full">{colCases.length}</span>
            </div>
            <button className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {colCases.map((c) => <KanbanCard key={c.id} c={c} />)}
            {colCases.length === 0 && (
              <div className="border-2 border-dashed border-zinc-200 rounded-2xl h-24 flex items-center justify-center">
                <span className="text-[10px] text-zinc-300 font-bold">No cases</span>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── Table row ────────────────────────────────────────────────────────────────
const TableRow: React.FC<{ c: Case }> = ({ c }) => (
  <tr className="border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors group">
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-[10px] font-black text-zinc-400">{c.caseRef}</span>
    </td>
    <td className="px-4 py-3 min-w-[240px]">
      <p className="text-[11px] font-black text-zinc-900 leading-snug">{c.title}</p>
      <p className="text-[10px] text-zinc-400 font-medium">{c.client}</p>
    </td>
    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
    <td className="px-4 py-3 whitespace-nowrap"><PriorityFlag priority={c.priority} /></td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-[9px] font-black text-zinc-500 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded uppercase tracking-widest">{c.practiceArea}</span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <AttorneyAvatar attorney={c.attorney} showName />
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      {c.nextDeadline ? (
        <span className="text-[10px] font-bold text-zinc-600 flex items-center gap-1">
<Calendar className="w-2.5 h-2.5" />
          {new Date(c.nextDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ) : <span className="text-zinc-300">—</span>}
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-[10px] font-bold text-emerald-600">{c.estimatedValue ?? "—"}</span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-[10px] font-bold text-zinc-400">{c.daysOpen > 0 ? `${c.daysOpen}d` : "Closed"}</span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-100">
        <ArrowUpRight className="w-3 h-3 text-zinc-500" />
      </button>
    </td>
  </tr>
);

// ─── Table view ───────────────────────────────────────────────────────────────
const TableView: React.FC<{ cases: Case[] }> = ({ cases }) => (
  <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
    <table className="w-full min-w-[900px]">
      <thead>
        <tr className="border-b border-zinc-200 bg-zinc-50">
          {["Ref", "Case / Client", "Status", "Priority", "Practice Area", "Attorney", "Next Deadline", "Est. Value", "Days Open", ""].map((h) => (
            <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {cases.map((c) => <TableRow key={c.id} c={c} />)}
      </tbody>
    </table>
    {cases.length === 0 && (
      <div className="py-16 text-center">
        <FolderKanban className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
        <p className="text-sm font-bold text-zinc-400">No cases found</p>
      </div>
    )}
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CaseTracking() {
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");

  const filtered = CASES.filter((c) => {
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.caseRef.includes(search);
    const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  const stats = {
    total: CASES.length,
    open: CASES.filter((c) => c.status !== "Closed").length,
    high: CASES.filter((c) => c.priority === "High" && c.status !== "Closed").length,
    attorneys: [...new Set(CASES.map((c) => c.attorney.initials))].length,
  };

  return (
    
      <div className="flex min-h-screen w-full bg-[#F9FAFB] text-zinc-900">
        
        

          <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-3">
              
              <div className="h-4 w-px bg-zinc-200" />
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Case Tracking</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Case
            </button>
          </header>

          <main className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Cases",     val: stats.total,     icon: FolderKanban, color: "text-blue-600",    bg: "bg-blue-50"    },
                { label: "Open Cases",      val: stats.open,      icon: Circle,       color: "text-blue-700",    bg: "bg-blue-50"    },
                { label: "Urgent (High)",   val: stats.high,      icon: AlertTriangle,color: "text-red-600",     bg: "bg-red-50"     },
                { label: "Attorneys",       val: stats.attorneys, icon: Users,        color: "text-violet-600",  bg: "bg-violet-50"  },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                      <Icon className={cn("w-4 h-4", s.color)} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-zinc-900 tracking-tight">{s.val}</div>
                      <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:border-cyan-300 transition-colors">
              <Search className="w-4 h-4" />
              <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cases..."
                  className="flex-1 text-sm text-zinc-700 placeholder:text-zinc-400 bg-transparent outline-none"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
                className="text-[10px] font-black text-zinc-600 bg-white border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none uppercase tracking-wider cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
                className="text-[10px] font-black text-zinc-600 bg-white border border-zinc-200 rounded-xl px-3 py-2 focus:outline-none uppercase tracking-wider cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* View toggle */}
              <div className="flex items-center border border-zinc-200 rounded-xl p-0.5 bg-zinc-50 ml-auto">
                <button
                  onClick={() => setView("kanban")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", view === "kanban" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
                >
                  <LayoutGrid className="w-3 h-3" /> Board
                </button>
                <button
                  onClick={() => setView("table")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", view === "table" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
                >
                  <List className="w-3 h-3" /> Table
                </button>
              </div>
            </div>

            {/* Board / Table */}
            {view === "kanban" ? <KanbanBoard cases={filtered} /> : <TableView cases={filtered} />}
          </main>
        
      </div>
    
  );
}