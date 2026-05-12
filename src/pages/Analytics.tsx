// src/pages/Analytics.tsx
// Workload Intelligence Dashboard — matter resolution velocity, query trends, case load
// Gated behind "pro" plan via FeatureGuard

import React, { useState, useEffect } from "react";


import { FeatureGuard } from "@/components/FeatureGuard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { analyticsApi, type AnalyticsData } from "@/lib/api";
import {
  TrendingUp, Cpu, BarChart3, Activity, Zap,
  Clock, FileText, MessageSquare, Gavel,
  ArrowUpRight, ArrowDownRight, Minus, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mini bar chart (CSS-only, no library deps) ───────────────────────────────
const BarChart = ({
  data, color = "bg-blue-600", label,
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
  label: string;
}) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn("w-full rounded-t-lg transition-all duration-700 hover:opacity-80 cursor-default", color)}
              style={{ height: `${(d.value / max) * 96}px`, minHeight: d.value > 0 ? "4px" : "2px" }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="text-[9px] text-slate-400 font-bold truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Dual bar chart (opened vs resolved) ──────────────────────────────────────
const DualBarChart = ({
  data, label,
}: {
  data: Array<{ month: string; resolved: number; opened: number }>;
  label: string;
}) => {
  const max = Math.max(...data.flatMap(d => [d.resolved, d.opened]), 1);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</p>
        <div className="flex gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />Resolved</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block" />Opened</span>
        </div>
      </div>
      <div className="flex items-end gap-3 h-28">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 w-full">
              <div
                className="flex-1 rounded-t-lg bg-blue-600 transition-all duration-700 hover:opacity-80"
                style={{ height: `${(d.resolved / max) * 88}px`, minHeight: d.resolved > 0 ? "4px" : "2px" }}
                title={`Resolved: ${d.resolved}`}
              />
              <div
                className="flex-1 rounded-t-lg bg-slate-200 transition-all duration-700 hover:opacity-80"
                style={{ height: `${(d.opened / max) * 88}px`, minHeight: d.opened > 0 ? "4px" : "2px" }}
                title={`Opened: ${d.opened}`}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-bold truncate w-full text-center">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number; // positive = up, negative = down, 0 = neutral
  color: string;
  bg: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color, bg, suffix }) => {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === undefined || trend === 0 ? "text-slate-400" : trend > 0 ? "text-emerald-500" : "text-red-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-[10px] font-black", trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">
        {value}{suffix && <span className="text-base font-bold text-slate-400 ml-1">{suffix}</span>}
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
};

// ─── Velocity gauge ───────────────────────────────────────────────────────────
const VelocityGauge = ({ score }: { score: number }) => {
  const clamp = Math.min(Math.max(score, 0), 100);
  const level = clamp >= 75 ? { label: "High Velocity", color: "text-emerald-600", bar: "bg-emerald-500" }
              : clamp >= 40 ? { label: "Moderate",       color: "text-amber-600",   bar: "bg-amber-500"   }
              :               { label: "Low Velocity",   color: "text-red-500",     bar: "bg-red-500"     };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Matter Resolution Velocity</p>
          <p className={cn("text-xl font-black tracking-tight mt-1", level.color)}>{level.label}</p>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-slate-900 tracking-tight">{clamp}</span>
          <span className="text-slate-400 text-sm font-bold ml-1">/ 100</span>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", level.bar)}
          style={{ width: `${clamp}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Velocity score reflects the ratio of matters resolved vs. opened over the last 30 days, weighted by complexity.
        Higher scores indicate your practice is resolving cases faster than new ones arrive.
      </p>
    </div>
  );
};

// ─── Analytics Content ────────────────────────────────────────────────────────
const AnalyticsContent: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await analyticsApi.getDashboard();
      setData(d);
      setLastUpdated(new Date());
    } catch {
      setError("Could not load analytics. Check backend connection on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Cpu className="w-8 h-8 text-blue-600 animate-pulse" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading intelligence data...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 bg-red-50/30 rounded-2xl border border-red-100">
      <Activity className="w-8 h-8 text-red-300" />
      <p className="text-sm font-bold text-red-500">{error ?? "No data available"}</p>
      <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-100 text-xs font-black text-red-600 uppercase tracking-wider hover:bg-red-50 transition-colors">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );

  // Normalise 7-day data
  const week7 = (data.last7Days ?? []).map(d => ({
    label: d.date,
    value: d.count,
  }));

  // Normalise matter type data
  const matterTypes = (data.mattersByType ?? []).map(m => ({
    label: m.type,
    value: m.count,
  }));

  const resolutionTrend = data.resolutionTrend ?? [];

  return (
    <div className="space-y-8">
      {/* Refresh row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Intelligence Feed</span>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 uppercase tracking-wider transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Queries This Month" value={data.queriesThisMonth ?? 0} icon={MessageSquare} color="text-blue-600"    bg="bg-blue-50"    trend={12} />
        <StatCard label="Total Documents"     value={data.totalDocuments ?? 0}   icon={FileText}      color="text-emerald-600" bg="bg-emerald-50" trend={5}  />
        <StatCard label="Open Cases"          value={data.openClaims ?? 0}       icon={Gavel}         color="text-blue-700"    bg="bg-blue-50"    trend={-3} />
        <StatCard label="Avg Case Duration"   value={data.avgCaseDuration ?? 0}  icon={Clock}         color="text-orange-600"  bg="bg-orange-50"  suffix="days" />
      </div>

      {/* Resolution velocity */}
      <VelocityGauge score={data.workloadScore ?? data.resolutionVelocity ?? 0} />

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 7-day query volume */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <BarChart
            data={week7.length > 0 ? week7 : Array(7).fill(0).map((_, i) => ({ label: `D${i+1}`, value: 0 }))}
            color="bg-blue-600"
            label="Query Volume — Last 7 Days"
          />
        </div>

        {/* Matters by type */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <BarChart
            data={matterTypes.length > 0 ? matterTypes : [{ label: "Civil", value: 0 }, { label: "Criminal", value: 0 }, { label: "Family", value: 0 }, { label: "Contract", value: 0 }]}
            color="bg-blue-500"
            label="Matters by Practice Area"
          />
        </div>
      </div>

      {/* Resolution trend */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <DualBarChart
          data={resolutionTrend.length > 0 ? resolutionTrend : [
            { month: "Jan", resolved: 0, opened: 0 },
            { month: "Feb", resolved: 0, opened: 0 },
            { month: "Mar", resolved: 0, opened: 0 },
            { month: "Apr", resolved: 0, opened: 0 },
            { month: "May", resolved: 0, opened: 0 },
            { month: "Jun", resolved: 0, opened: 0 },
          ]}
          label="Matter Resolution Trend — 6 Months"
        />
      </div>

      {/* Workload score breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Query Efficiency",    score: Math.min((data.queriesThisMonth ?? 0) / 2, 100), color: "bg-blue-600" },
          { label: "Case Load Balance",   score: Math.max(100 - (data.openClaims ?? 0) * 5, 0), color: "bg-blue-500"  },
          { label: "Document Throughput", score: Math.min((data.totalDocuments ?? 0) * 10, 100), color: "bg-emerald-500" },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
              <span className="text-sm font-black text-slate-900">{Math.round(m.score)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", m.color)}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
export default function Analytics() {
  const { subscription } = useSubscription();

  return (
    
      <div className="flex min-h-screen w-full bg-white text-slate-900">
        
        

          <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4">
              
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workload Intelligence</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 text-slate-500">
              {subscription?.plan ?? "free"} plan
            </span>
          </header>

          <main className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Workload Intelligence</h1>
              <p className="text-sm text-slate-500">Real-time matter resolution velocity, query analytics, and practice workload scoring.</p>
            </div>

            <FeatureGuard
              featureName="Workload Intelligence"
              requiredPlan="pro"
              description="Access real-time analytics, resolution velocity tracking, and workload scoring for your practice."
            >
              <AnalyticsContent />
            </FeatureGuard>
          </main>
        
      </div>
    
  );
}