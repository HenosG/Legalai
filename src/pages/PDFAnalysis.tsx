// src/pages/PDFAnalysis.tsx
// AI PDF Risk Assessment & Neural Document Analysis
// Gated behind "pro" plan via FeatureGuard

import React, { useState, useCallback } from "react";
import { FeatureGuard } from "@/components/FeatureGuard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { pdfApi, type PdfAnalysisResult } from "@/lib/api";
import {
  Upload, FileText, AlertTriangle, ShieldCheck, Cpu,
  ChevronRight, X, BarChart3, Eye, Clock, Zap,
  CheckCircle2, AlertCircle, Info, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Risk level config ────────────────────────────────────────────────────────
const RISK_CONFIG = {
  low:      { label: "Low Risk",      color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", bar: "bg-emerald-500", icon: ShieldCheck },
  medium:   { label: "Medium Risk",   color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   bar: "bg-amber-500",   icon: Info         },
  high:     { label: "High Risk",     color: "text-orange-600",  bg: "bg-orange-50",   border: "border-orange-200",  bar: "bg-orange-500",  icon: AlertCircle  },
  critical: { label: "Critical Risk", color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200",     bar: "bg-red-500",     icon: AlertTriangle},
} as const;

// ─── Drop Zone ────────────────────────────────────────────────────────────────
interface DropZoneProps {
  onFile: (file: File) => void;
  loading: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFile, loading }) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && document.getElementById("pdf-input")?.click()}
      className={cn(
        "relative border-2 border-dashed rounded-[2.5rem] p-16 text-center cursor-pointer transition-all duration-300 group overflow-hidden bg-white shadow-sm",
        dragging
          ? "border-cyan-400 bg-blue-50/40 scale-[1.01]"
          : "border-slate-200 hover:border-cyan-300 hover:shadow-xl hover:scale-[1.01]",
        loading && "pointer-events-none"
      )}
    >
      <input
        id="pdf-input"
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />

      {loading ? (
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            <Cpu className="w-14 h-14 text-blue-600 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-300 border-t-transparent animate-spin" />
          </div>
          <div>
            <p className="text-base font-black text-slate-700 uppercase tracking-tight">Neural Analysis Active</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Processing document structure & risk vectors...</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className={cn(
            "w-20 h-20 rounded-3xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm",
            dragging ? "bg-cyan-100 border-2 border-cyan-300" : "bg-slate-50 border-2 border-slate-100"
          )}>
            <Upload className={cn("w-8 h-8 transition-colors", dragging ? "text-blue-600" : "text-slate-400")} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {dragging ? "Release to Analyze" : "Drop Legal Document"}
            </p>
            <p className="text-slate-400 font-medium mt-1 text-lg">or click to browse local storage</p>
          </div>
          <div className="flex gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">.PDF</span>
            <span className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">.DOCX</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Risk Score Gauge ─────────────────────────────────────────────────────────
const RiskGauge = ({ score, level }: { score: number; level: string }) => {
  const config = RISK_CONFIG[level as keyof typeof RISK_CONFIG] ?? RISK_CONFIG.medium;
  const RiskIcon = config.icon;

  return (
    <div className={cn("rounded-[2rem] border p-8 flex items-center gap-8 shadow-sm", config.bg, config.border)}>
      <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-sm")}>
        <RiskIcon className={cn("w-10 h-10", config.color)} />
      </div>
      <div className="flex-1">
        <div className={cn("text-[10px] font-black uppercase tracking-[0.2em] mb-1", config.color)}>
          Intelligence Scoring: {config.label}
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-black text-slate-900 tracking-tighter">{score}</span>
          <span className="text-slate-400 text-lg font-bold mb-1">/ 100</span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", config.bar)}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Results Panel ────────────────────────────────────────────────────────────
const ResultsPanel = ({ result, onClear }: { result: PdfAnalysisResult; onClear: () => void }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-black text-slate-900 text-xl tracking-tight truncate max-w-[300px]">
            {result.filename}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-100 bg-white shadow-sm"
        >
          <X className="w-4 h-4" /> Reset Analysis
        </button>
      </div>

      <RiskGauge score={result.riskScore} level={result.riskLevel} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Summary</span>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">{result.summary}</p>
        </div>

        {result.keyRisks?.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Vectors</span>
            </div>
            <div className="space-y-4">
              {result.keyRisks.map((risk, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-black text-slate-400 mt-0.5">0{i + 1}</span>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {result.clauses?.length > 0 && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clause Breakdown</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.clauses.map((clause, i) => {
              const sev = clause.severity === "high" || clause.severity === "critical"
                ? "text-red-600 bg-red-50 border-red-100"
                : clause.severity === "medium"
                ? "text-amber-600 bg-amber-50 border-amber-100"
                : "text-blue-600 bg-blue-50 border-blue-100";
              return (
                <div key={i} className="p-6 rounded-[1.5rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-sm font-black text-slate-900 leading-tight">{clause.text}</span>
                    <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border flex-shrink-0", sev)}>
                      {clause.severity}
                    </span >
                  </div>
                  {clause.risk && (
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{clause.risk}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PDF Analysis Content ─────────────────────────────────────────────────────
const PDFAnalysisContent: React.FC = () => {
  const [result, setResult] = useState<PdfAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const data = await pdfApi.analyze({ content, filename: file.name });
        setResult(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Analysis failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => { setError("File read error."); setLoading(false); };
    reader.readAsText(file);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4 space-y-8">
        <DropZone onFile={handleFile} loading={loading} />

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Neural Pipeline</p>
          {[
            { icon: Upload, label: "Capture", desc: "Upload agreements or court filings" },
            { icon: Cpu, label: "Deconstruct", desc: "AI parses clause structure for anomalies" },
            { icon: BarChart3, label: "Quantify", desc: "Risk level calculation & insight generation" },
          ].map((step) => (
            <div key={step.label} className="flex items-start gap-5 mb-6 last:mb-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.label}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-red-50 border border-red-100 shadow-sm animate-in fade-in zoom-in duration-300">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-black text-red-600 uppercase tracking-tight">Logic Fault Detected</p>
              <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)}><X className="w-4 h-4 text-red-400 hover:text-red-600" /></button>
          </div>
        )}
      </div>

      <div className="lg:col-span-8">
        {result ? (
          <ResultsPanel result={result} onClear={() => setResult(null)} />
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-slate-50/40 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <FileText className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Awaiting Input</p>
            <p className="text-slate-400 font-medium mt-2">Analysis engine idle</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
export default function PDFAnalysis() {
  const { subscription } = useSubscription();

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural Engine v1.0</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            {subscription?.plan ?? "free"} access active
          </span>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8 relative">
        {/* Reluno Signature Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-100/30 blur-[120px] rounded-full -z-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">
              Intelligence
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg">
              Deconstruct complex legal assets with neural risk vectoring.
            </p>
          </div>
          
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl">
            <Plus className="w-4 h-4" /> NEW ANALYSIS
          </button>
        </div>

        <FeatureGuard
          featureName="AI PDF Risk Analysis"
          requiredPlan="pro"
          description="Upload contracts and legal documents for instant AI-powered risk scoring and clause analysis."
        >
          <PDFAnalysisContent />
        </FeatureGuard>
      </main>
    </div>
  );
}