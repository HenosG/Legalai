// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, Gavel, Activity, ArrowUpRight, ShieldCheck,
  Sparkles, TrendingUp, Cpu, Zap, Lock, ArrowRight, Plus,
  CheckCircle2, Clock, Circle, FileText, Download, BarChart3,
  Calendar, Mail, AlertTriangle, CheckCheck, Trash2, Upload,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Locked feature overlay ───────────────────────────────────────────────────
const LockedOverlay = ({
  feature,
  requiredPlan,
  compact = false,
}: {
  feature: string;
  requiredPlan: "starter" | "pro";
  compact?: boolean;
}) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
        <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center">
          <Lock size={18} className="text-slate-400" />
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{feature}</p>
        <p className="text-[10px] text-slate-400">
          {requiredPlan === "pro" ? "Pro" : "Starter"} plan required
        </p>
        <button
          onClick={() => navigate("/pricing")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors"
        >
          Upgrade <ArrowRight size={10} />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-[3px] rounded-[2rem]">
      <div className="max-w-xs bg-white border border-slate-100 p-8 rounded-3xl shadow-2xl text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Lock size={22} className="text-slate-400" />
        </div>
        <p className="font-black text-slate-900 mb-1 uppercase tracking-tight text-sm">{feature}</p>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Available on the{" "}
          <span className="font-bold text-blue-700 capitalize">{requiredPlan}</span> plan and above.
        </p>
        <Button
          onClick={() => navigate("/pricing")}
          className="w-full bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
        >
          Unlock Now <ArrowRight size={12} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

// ─── Query limit bar (Free tier) ──────────────────────────────────────────────
const QueryLimitBar = ({ used, limit }: { used: number; limit: number }) => {
  const pct = Math.min((used / limit) * 100, 100);
  const isNearLimit = pct >= 80;
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
          Monthly AI Queries
        </span>
        <span className={`text-xs font-black ${isNearLimit ? "text-red-600" : "text-amber-700"}`}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? "bg-red-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center gap-1">
          <AlertTriangle size={10} /> {limit - used} queries remaining this month
        </p>
      )}
    </div>
  );
};

// ─── Analytics panel ─────────────────────────────────────────────────────────
const AnalyticsPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Cpu size={20} className="text-blue-600 animate-pulse" />
    </div>
  );

  if (!data || data.error) return null;

  const maxCount = Math.max(...(data.last7Days?.map((d: any) => d.count) || [1]), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Queries This Month", val: data.queriesThisMonth, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Documents",    val: data.totalDocuments,   icon: FileText,      color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Open Cases",         val: data.openClaims,       icon: Gavel,         color: "text-blue-700",  bg: "bg-blue-50" },
          { label: "Total Queries",      val: data.totalQueries,     icon: TrendingUp,    color: "text-orange-600", bg: "bg-orange-50" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.val ?? 0}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 7-day bar chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">
          Query Volume — Last 7 Days
        </p>
        <div className="flex items-end gap-2 h-24">
          {data.last7Days?.map((day: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-cyan-400"
                style={{ height: `${(day.count / maxCount) * 80}px`, minHeight: day.count > 0 ? "4px" : "2px" }}
              />
              <span className="text-[9px] text-slate-400 font-bold">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Tasks panel ──────────────────────────────────────────────────────────────
const TasksPanel = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tasks`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setTasks(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: newTask }),
    });
    const task = await res.json();
    if (task.id) { setTasks(prev => [task, ...prev]); setNewTask(""); }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <Cpu size={18} className="text-blue-600 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Add task input */}
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a reminder or task..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 bg-white"
        />
        <button
          onClick={addTask}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCheck size={24} className="text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">No tasks yet — add your first reminder</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-cyan-100 transition-colors group"
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0">
                {task.completed
                  ? <CheckCircle2 size={16} className="text-blue-600" />
                  : <Circle size={16} className="text-slate-300 group-hover:text-slate-400" />
                }
              </button>
              <span className={`flex-1 text-sm font-medium ${task.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                {task.title}
              </span>
              {task.dueDate && (
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock size={10} />{new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PDF Analysis panel ───────────────────────────────────────────────────────
const PdfAnalysisPanel = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const analyzeFile = async (file: File) => {
    setLoading(true);
    setResult(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const res = await fetch(`${API_BASE_URL}/api/pdf-analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content, filename: file.name }),
        });
        const data = await res.json();
        setResult(data);
      } catch { setResult({ error: "Analysis failed" }); }
      finally { setLoading(false); }
    };
    reader.readAsText(file);
  };

  const riskColor = (level: string) => {
    if (level === "critical") return "text-red-600 bg-red-50 border-red-200";
    if (level === "high")     return "text-orange-600 bg-orange-50 border-orange-200";
    if (level === "medium")   return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault(); setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) analyzeFile(file);
        }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragging ? "border-cyan-400 bg-blue-50/50" : "border-slate-200 hover:border-cyan-300 hover:bg-slate-50/50"
        }`}
        onClick={() => document.getElementById("pdf-upload")?.click()}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf,.txt,.doc"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) analyzeFile(f); }}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Cpu size={24} className="text-blue-600 animate-pulse" />
            <p className="text-sm text-slate-500 font-medium">Analyzing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Drop a document here</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">PDF, TXT, or DOC</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && !result.error && (
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-4 rounded-xl border ${riskColor(result.riskLevel)}`}>
            <span className="text-sm font-black uppercase tracking-wider">{result.filename}</span>
            <span className="text-lg font-black">{result.riskScore}/100</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
          {result.keyRisks?.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Key Risks</p>
              {result.keyRisks.map((risk: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  {risk}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, loading, can, isFree, isPaid, isPro, isStarter } = useSubscription();

  const currentPlan = subscription?.plan ?? "free";

  const planLabel = isPro ? "Ultra Pro" : isStarter ? "Starter" : "Base Tier";
  const planColor = isPro
    ? "border-cyan-200 bg-blue-50 text-blue-700"
    : isStarter
    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
    : "border-slate-200 bg-slate-50 text-slate-500";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="size-10 text-blue-700 animate-pulse" />
          <div className="text-slate-400 font-bold tracking-[0.3em] uppercase text-[10px]">
            Initializing Legal Neural Core...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 selection:bg-blue-600/30">
      {/* ── Top Nav ── */}
      <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Console v3.0</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            Link Established
          </div>
          <Badge variant="outline" className={`font-bold uppercase text-[10px] px-3 ${planColor}`}>
            {planLabel}
          </Badge>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-100/30 blur-[120px] rounded-full -z-10" />

        {/* ── Hero ── */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 group relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 p-10 transition-all hover:shadow-xl hover:shadow-slate-200/50">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <Zap className="size-3 text-blue-700" /> System Active
              </div>
              <h1 className="text-5xl font-bold tracking-tighter text-slate-900">
                Welcome back,{" "}
                <span className="text-blue-700">{user?.email?.split("@")[0]}</span>.
              </h1>
              <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                Neural engines are warm. What legal matters shall we accelerate today?
              </p>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate("/legalquestionai")}
                  className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8 py-3.5 font-black text-sm transition-all shadow-lg"
                >
                  NEW QUERY
                </button>
                <button
                  onClick={() => navigate("/documentgenerator")}
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-8 py-3.5 font-black text-sm transition-all"
                >
                  DOCUMENT HUB
                </button>
              </div>
            </div>
            <TrendingUp className="absolute -bottom-10 -right-10 size-64 text-blue-600/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
          </div>

          <Card className="lg:col-span-4 rounded-[2rem] border border-cyan-100 bg-blue-50/50 p-8 flex flex-col justify-between overflow-hidden relative group shadow-none">
            <div className="space-y-4 relative z-10">
              <ShieldCheck className="size-10 text-blue-700" />
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Priority Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Direct line to our senior legal tech architects.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = "mailto:support@reluno.ai"}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-bold relative z-10 border-none shadow-md shadow-cyan-200"
            >
              CONTACT SUPPORT
            </Button>
          </Card>
        </div>

            {/* ── Free tier query limit warning ── */}
            {isFree && <QueryLimitBar used={0} limit={5} />}

            {/* ── Quick Actions ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "AI Analysis",  icon: MessageSquare, color: "text-blue-600",    bg: "bg-blue-50",    url: "/legalquestionai",    locked: false },
                { label: "Risk Report",  icon: ShieldCheck,   color: "text-emerald-600", bg: "bg-emerald-50", url: "/documentgenerator",  locked: false },
                { label: "Case Vault",   icon: Gavel,         color: "text-blue-700",    bg: "bg-blue-50",    url: "/my-cases",           locked: false },
                {
                  label: "Export Data",
                  icon: Activity,
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                  url: "/dashboard-analytics",
                  locked: !can("exportSuite"),
                  lockedLabel: "Export Suite",
                  requiredPlan: "pro" as const,
                },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => action.locked ? navigate("/pricing") : navigate(action.url)}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-cyan-200 hover:shadow-lg transition-all group overflow-hidden relative"
                >
                  <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="size-5" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                    {action.label}
                  </span>
                  {action.locked ? (
                    <Lock size={13} className="ml-auto text-slate-300" />
                  ) : (
                    <ArrowUpRight size={14} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Smart Reminders & Tasks (Starter+) ── */}
            <Card className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Smart Reminders & Tasks</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {can("smartReminders") ? "Active — Starter Plan" : "Starter plan required"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-300" />
                  {!can("smartReminders") && (
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </div>
              </div>
              <CardContent className="p-8 relative min-h-[200px]">
                {!can("smartReminders") ? (
                  <LockedOverlay feature="Smart Reminders & Tasks" requiredPlan="starter" compact />
                ) : (
                  <TasksPanel />
                )}
              </CardContent>
            </Card>

            {/* ── PDF Analysis (Pro only) ── */}
            <Card className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">AI PDF Analysis & Risk Reports</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {can("pdfAnalysis") ? "Active — Pro Plan" : "Pro plan required"}
                  </p>
                </div>
                {!can("pdfAnalysis") && (
                  <button
                    onClick={() => window.location.href = "/pricing"}
                    className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 border border-cyan-100 px-4 py-2 rounded-full hover:bg-cyan-100 transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
              <CardContent className="p-8 relative min-h-[200px]">
                {!can("pdfAnalysis") ? (
                  <LockedOverlay feature="AI PDF Analysis" requiredPlan="pro" compact />
                ) : (
                  <PdfAnalysisPanel />
                )}
              </CardContent>
            </Card>

            {/* ── Calendar & Email Integrations (Starter+) ── */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Calendar Sync</h3>
                  <Calendar size={16} className={can("calendarSync") ? "text-blue-600" : "text-slate-200"} />
                </div>
                <CardContent className="p-6 min-h-[140px] flex items-center justify-center">
                  {!can("calendarSync") ? (
                    <LockedOverlay feature="Calendar Sync" requiredPlan="starter" compact />
                  ) : (
                    <div className="w-full text-center space-y-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                        <Calendar size={18} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Connect your calendar</p>
                      <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">
                        Connect Google Calendar
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Email Integrations</h3>
                  <Mail size={16} className={can("emailIntegrations") ? "text-blue-600" : "text-slate-200"} />
                </div>
                <CardContent className="p-6 min-h-[140px] flex items-center justify-center">
                  {!can("emailIntegrations") ? (
                    <LockedOverlay feature="Email Integrations" requiredPlan="starter" compact />
                  ) : (
                    <div className="w-full text-center space-y-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                        <Mail size={18} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Connect your inbox</p>
                      <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">
                        Connect Gmail
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Advanced Analytics (Pro only) ── */}
            <Card className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Workload Intelligence</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Real-time processing metrics
                  </p>
                </div>
                {!can("analyticsLevel") && (
                  <Button
                    onClick={() => navigate("/pricing")}
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] px-6 rounded-full"
                  >
                    Unlock Pro Analytics
                  </Button>
                )}
              </div>
              <CardContent className="p-8 relative min-h-[300px]">
                {!can("analyticsLevel") ? (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                    <div className="max-w-xs bg-white border border-slate-100 p-8 rounded-3xl shadow-2xl text-center">
                      <Sparkles className="size-8 text-blue-700 mx-auto mb-4" />
                      <p className="font-bold text-slate-900 mb-2 uppercase tracking-tighter">Premium Analytics Locked</p>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed uppercase">
                        Upgrade to visualize matter resolution velocity and neural query efficiency.
                      </p>
                      <Button
                        onClick={() => navigate("/pricing")}
                        className="w-full bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-black"
                      >
                        UPGRADE NOW
                      </Button>
                    </div>
                  </div>
                ) : (
                  <AnalyticsPanel />
                )}
              </CardContent>
            </Card>

            {/* ── Export Suite (Pro only) ── */}
            <Card className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Professional Export Suite</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {can("exportSuite") ? "PDF & Word export active" : "Pro plan required"}
                  </p>
                </div>
                <Download size={16} className={can("exportSuite") ? "text-blue-600" : "text-slate-200"} />
              </div>
              <CardContent className="p-6 min-h-[100px] flex items-center">
                {!can("exportSuite") ? (
                  <LockedOverlay feature="Professional Export Suite" requiredPlan="pro" compact />
                ) : (
                  <div className="flex gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">
                      <Download size={13} /> Export as PDF
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:border-cyan-300 transition-colors">
                      <FileText size={13} /> Export as Word
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:border-cyan-300 transition-colors">
                      <BarChart3 size={13} /> Export Analytics
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            </main>
        
      </div>
    
  );
}