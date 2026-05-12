// src/pages/Export.tsx
// Professional Document Export Suite — PDF, Word, Analytics exports
// Gated behind "pro" plan via FeatureGuard

import React, { useState, useEffect } from "react";


import { FeatureGuard } from "@/components/FeatureGuard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { exportApi, type ExportJob } from "@/lib/api";
import {
  Download, FileText, BarChart3, Cpu, CheckCircle2,
  Clock, AlertTriangle, X, RefreshCw, FileDown,
  Layers, Sparkles, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Export type config ───────────────────────────────────────────────────────
const EXPORT_TYPES = [
  {
    id: "pdf",
    label: "Professional PDF",
    description: "Export case summaries, briefs, and documents as formatted, court-ready PDFs with your firm's branding.",
    icon: FileDown,
    accent: "bg-red-50 border-red-100",
    iconColor: "text-red-500",
    buttonColor: "bg-red-600 hover:bg-red-500",
    features: ["Letterhead & firm branding", "Table of contents", "Page numbering", "Digital signature ready"],
  },
  {
    id: "word",
    label: "Word Document",
    description: "Export editable Word (.docx) files for further editing, collaboration, and submission to clients or courts.",
    icon: FileText,
    accent: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    buttonColor: "bg-blue-700 hover:bg-blue-600",
    features: ["Fully editable DOCX", "Tracked-changes ready", "Style templates", "Table formatting"],
  },
  {
    id: "analytics",
    label: "Analytics Report",
    description: "Export your Workload Intelligence dashboard as a comprehensive practice performance report.",
    icon: BarChart3,
    accent: "bg-blue-50 border-cyan-100",
    iconColor: "text-blue-700",
    buttonColor: "bg-cyan-700 hover:bg-blue-700",
    features: ["Charts & visualizations", "Resolution velocity data", "Case load metrics", "Executive summary"],
  },
] as const;

type ExportTypeId = (typeof EXPORT_TYPES)[number]["id"];

// ─── Template options ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "standard",    label: "Standard Legal"    },
  { id: "brief",       label: "Court Brief"       },
  { id: "contract",    label: "Contract Review"   },
  { id: "settlement",  label: "Settlement Summary" },
  { id: "client",      label: "Client Report"     },
];

// ─── Date range options ───────────────────────────────────────────────────────
const DATE_RANGES = [
  { id: "7d",  label: "Last 7 Days"   },
  { id: "30d", label: "Last 30 Days"  },
  { id: "90d", label: "Last Quarter"  },
  { id: "1y",  label: "This Year"     },
  { id: "all", label: "All Time"      },
];

// ─── Export Card ──────────────────────────────────────────────────────────────
interface ExportCardProps {
  type: (typeof EXPORT_TYPES)[number];
  onExport: (typeId: ExportTypeId, options: Record<string, string>) => void;
  loading: boolean;
}

const ExportCard: React.FC<ExportCardProps> = ({ type, onExport, loading }) => {
  const [template, setTemplate] = useState("standard");
  const [dateRange, setDateRange] = useState("30d");

  return (
    <div className={cn("rounded-2xl border p-6 space-y-5 bg-white transition-shadow hover:shadow-sm", type.accent)}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white border", type.accent)}>
          <type.icon className={cn("w-6 h-6", type.iconColor)} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-0.5">{type.label}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
        </div>
      </div>

      {/* Features list */}
      <div className="grid grid-cols-2 gap-2">
        {type.features.map(f => (
          <div key={f} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="space-y-3 border-t border-white/60 pt-4">
        {type.id !== "analytics" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template</label>
            <select
              value={template}
              onChange={e => setTemplate(e.target.value)}
              className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-cyan-300 cursor-pointer"
            >
              {TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
        )}
        {type.id === "analytics" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-cyan-300 cursor-pointer"
            >
              {DATE_RANGES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Export button */}
      <button
        onClick={() => onExport(type.id, { template, range: dateRange, format: type.id })}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
          type.buttonColor
        )}
      >
        {loading ? (
          <><Cpu className="w-4 h-4 animate-pulse" /> Generating...</>
        ) : (
          <><Download className="w-4 h-4" /> Export {type.label}</>
        )}
      </button>
    </div>
  );
};

// ─── Job status badge ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: ExportJob["status"] }) => {
  const config = {
    pending:    { label: "Queued",     color: "text-slate-500 bg-slate-100 border-slate-200" },
    processing: { label: "Processing", color: "text-amber-600 bg-amber-50 border-amber-100"  },
    done:       { label: "Ready",      color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    error:      { label: "Failed",     color: "text-red-600 bg-red-50 border-red-100"        },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border", c.color)}>
      {c.label}
    </span>
  );
};

// ─── Export Content ───────────────────────────────────────────────────────────
const ExportContent: React.FC = () => {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loadingType, setLoadingType] = useState<ExportTypeId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    exportApi.getJobs()
      .then(data => { if (Array.isArray(data)) setJobs(data); })
      .catch(() => {}); // non-critical — just the history
  }, []);

  const handleExport = async (typeId: ExportTypeId, options: Record<string, string>) => {
    setLoadingType(typeId);
    setError(null);
    try {
      let job: ExportJob;
      if (typeId === "pdf") {
        job = await exportApi.exportPdf({ documentIds: [], template: options.template });
      } else if (typeId === "word") {
        job = await exportApi.exportWord({ documentIds: [], template: options.template });
      } else {
        job = await exportApi.exportAnalytics({ range: options.range, format: options.format });
      }
      setJobs(prev => [job, ...prev]);

      // If already done (sync backend), trigger download
      if (job.status === "done" && job.url) {
        window.open(job.url, "_blank");
      }
    } catch {
      setError(`Export failed. Ensure the backend is running on port 5000.`);
    } finally {
      setLoadingType(null);
    }
  };

  const refreshJob = async (id: string) => {
    try {
      const updated = await exportApi.getJob(id);
      setJobs(prev => prev.map(j => j.id === id ? updated : j));
      if (updated.status === "done" && updated.url) {
        window.open(updated.url, "_blank");
      }
    } catch {}
  };

  return (
    <div className="space-y-10">
      {/* Hero info */}
      <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Professional Export Suite</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Generate court-ready PDFs, editable Word documents, and comprehensive analytics reports directly from your case data.
            All exports are branded, formatted, and ready for professional use.
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5 text-red-400" /></button>
        </div>
      )}

      {/* Export cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {EXPORT_TYPES.map(type => (
          <ExportCard
            key={type.id}
            type={type}
            onExport={handleExport}
            loading={loadingType === type.id}
          />
        ))}
      </div>

      {/* Job history */}
      {jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Export History</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["File", "Type", "Status", "Created", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.slice(0, 10).map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{job.filename}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{job.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {job.status === "done" && job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] font-black text-blue-700 hover:text-cyan-700 uppercase tracking-wider"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        )}
                        {job.status === "processing" && (
                          <button
                            onClick={() => refreshJob(job.id)}
                            className="flex items-center gap-1 text-[10px] font-black text-slate-500 hover:text-slate-700 uppercase tracking-wider"
                          >
                            <RefreshCw className="w-3 h-3" /> Check
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
export default function Export() {
  const { subscription } = useSubscription();

  return (
    
      <div className="flex min-h-screen w-full bg-white text-slate-900">
        
        

          <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4">
              
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Professional Export Suite</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 text-slate-500">
              {subscription?.plan ?? "free"} plan
            </span>
          </header>

          <main className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Professional Export Suite</h1>
              <p className="text-sm text-slate-500">Generate court-ready PDFs, editable Word documents, and analytics reports.</p>
            </div>

            <FeatureGuard
              featureName="Professional Export Suite"
              requiredPlan="pro"
              description="Export case documents as branded PDFs, editable Word files, and comprehensive analytics reports."
            >
              <ExportContent />
            </FeatureGuard>
          </main>
        
      </div>
    
  );
}