import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, ArrowUpRight, Users, FileText,
  FolderKanban, CreditCard, Activity, Clock, CheckCircle2,
  AlertCircle, ChevronRight, TrendingUp,
  Briefcase, Receipt, Building2, KanbanSquare, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";


// ─── Types ───────────────────────────────────────────────────────────────────


interface DashboardMetrics {
  activeClients: number;
  openProposals: number;
  activeProjects: number;
  outstandingInvoices: number;
  monthlyRevenue: number;
  pipelineValue: number;
}


interface ActivityLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  userName: string;
  createdAt: string;
}


interface ActivityFeedResponse {
  activities: ActivityLogEntry[];
}


// ─── Intent Classification ───────────────────────────────────────────────────


type IntentType = 'internal' | 'external' | 'uncertain';

interface IntentClassification {
  type: IntentType;
  confidence: number;
  reason: string;
}

const INTERNAL_KEYWORDS = [
  'show', 'display', 'list', 'what is', 'how many', 'total', 'revenue',
  'invoice', 'client', 'project', 'task', 'dashboard', 'analytics', 'report',
  'stats', 'active', 'pending', 'overdue', 'my', 'our', 'we', 'us',
];

const EXTERNAL_KEYWORDS = [
  'i need', 'i want', 'i am looking', 'i require', 'we need', 'we want',
  'looking for', 'hire', 'services', 'help', 'quote', 'price', 'cost',
  'budget', 'timeline', 'deadline', 'launch',
];

const BUDGET_PATTERNS = [/\$\d+/, /\d+\s*k/i, /budget/i, /around\s*\$/i, /approximately\s*\$/i];
const TIMELINE_PATTERNS = [/deadline/i, /launch/i, /by\s+\w+\s+\d{4}/i, /within\s+\d+\s+weeks/i, /q[1-4]\s*\d{4}/i];

function classifyIntent(query: string): IntentClassification {
  const lowerQuery = query.toLowerCase().trim();

  const hasExternalKeywords = EXTERNAL_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
  const hasBudgetPattern = BUDGET_PATTERNS.some(pattern => pattern.test(lowerQuery));
  const hasTimelinePattern = TIMELINE_PATTERNS.some(pattern => pattern.test(lowerQuery));
  const hasInternalKeywords = INTERNAL_KEYWORDS.some(keyword => lowerQuery.includes(keyword));

  let externalScore = 0;
  let internalScore = 0;

  if (hasExternalKeywords) externalScore += 0.4;
  if (hasBudgetPattern) externalScore += 0.3;
  if (hasTimelinePattern) externalScore += 0.3;
  if (hasInternalKeywords) internalScore += 0.5;

  if (lowerQuery.startsWith('show') || lowerQuery.startsWith('display') || lowerQuery.startsWith('list') || lowerQuery.startsWith('what is') || lowerQuery.startsWith('how many')) {
    internalScore += 0.5;
  }

  if (externalScore > internalScore && externalScore >= 0.4) {
    return { type: 'external', confidence: externalScore, reason: 'Detected lead inquiry' };
  }

  if (internalScore > externalScore && internalScore >= 0.3) {
    return { type: 'internal', confidence: internalScore, reason: 'Detected internal agency command' };
  }

  return { type: 'uncertain', confidence: 0.5, reason: 'Could not determine intent, defaulting to internal' };
}


// ─── Motion Presets ──────────────────────────────────────────────────────────


const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};


const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};


const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


// ─── Rolling Number ───────────────────────────────────────────────────────── 


function useRollingValue(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);


  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;
    const start = performance.now();
    let raf: number;


    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);


  return display;
}


const RollingNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const display = useRollingValue(value);
  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
};


// ─── Formatting Helpers ───────────────────────────────────────────────────── 


const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};


// ─── Activity Icon Resolver ─────────────────────────────────────────────────


const getActivityIcon = (entityType: string) => {
  switch (entityType?.toLowerCase()) {
    case "client": return Building2;
    case "proposal": return FileText;
    case "project": return FolderKanban;
    case "invoice": return Receipt;
    case "payment": return CreditCard;
    case "task": return CheckCircle2;
    default: return Activity;
  }
};


const getActivityColor = (entityType: string) => {
  switch (entityType?.toLowerCase()) {
    case "client": return "text-blue-600 bg-blue-50";
    case "proposal": return "text-purple-600 bg-purple-50";
    case "project": return "text-emerald-600 bg-emerald-50";
    case "invoice": return "text-amber-600 bg-amber-50";
    case "payment": return "text-green-600 bg-green-50";
    default: return "text-zinc-500 bg-zinc-100";
  }
};


// ─── Sub-Components ───────────────────────────────────────────────────────── 


const AICommandBar = ({ onSubmit }: { onSubmit: (query: string) => void }) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [intent, setIntent] = useState<IntentClassification | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleSubmit = useCallback(async () => {
    if (!value.trim()) return;
    
    setIsProcessing(true);
    
    // Classify intent
    const intentClassification = classifyIntent(value.trim());
    setIntent(intentClassification);
    
    // Route based on intent
    if (intentClassification.type === 'external') {
      // Redirect to AI Intake page
      window.location.href = `/ai-intake?query=${encodeURIComponent(value.trim())}&channel=command`;
    } else {
      // Call AI Assistant API (internal query)
      onSubmit(value.trim());
    }
    
    setValue("");
    setIsProcessing(false);
  }, [value, onSubmit]);


  const suggestions = [
    "Summarize this week's pipeline",
    "Show overdue invoices",
    "Draft a proposal for Acme Corp",
    "What's the status of active projects?",
  ];


  return (
    <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "relative rounded-2xl border bg-white transition-all duration-300",
          focused
            ? "border-zinc-300 shadow-[0_0_0_4px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)]"
            : "border-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <Sparkles size={18} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask Reluno anything about your agency…"
            className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!value.trim() || isProcessing}
            className={cn(
              "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              value.trim() && !isProcessing ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
            )}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ArrowUpRight size={15} />
            )}
          </motion.button>
        </div>

        {/* Intent Indicator (Optional, for debugging) */}
        {intent && (
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                intent.type === 'external'
                  ? 'bg-green-100 text-green-800'
                  : intent.type === 'internal'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {intent.type === 'external' ? 'Lead' : intent.type === 'internal' ? 'Internal' : 'Uncertain'}
            </span>
          </div>
        )}

        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 p-2 z-50"
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => { setValue(s); inputRef.current?.focus(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <Search size={13} className="text-zinc-400 shrink-0" />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


interface KPICardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: number;
  index: number;
}


const KPICard = ({ label, value, prefix, suffix, icon: Icon, iconColor, iconBg, trend, index }: KPICardProps) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3 }}
    transition={{ ...springTransition, delay: index * 0.05 }}
    className="group rounded-2xl border border-zinc-100 bg-white p-5 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
        <Icon size={16} className={iconColor} />
      </div>
      {trend !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
          trend >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
        )}>
          <TrendingUp size={11} />
          {trend >= 0 ? "+" : ""}{trend}%
        </div>
      )}
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 mb-1.5">{label}</p>
    <p className="font-serif text-[28px] font-bold text-zinc-900 leading-none tracking-tight">
      <RollingNumber value={value} prefix={prefix} suffix={suffix} />
    </p>
  </motion.div>
);


const KPISkeleton = () => (
  <motion.div variants={itemVariants} className="rounded-2xl border border-zinc-100 bg-white p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse" />
      <div className="w-12 h-5 rounded-full bg-zinc-100 animate-pulse" />
    </div>
    <div className="h-3 w-20 rounded bg-zinc-100 animate-pulse mb-3" />
    <div className="h-7 w-16 rounded bg-zinc-100 animate-pulse" />
  </motion.div>
);


interface QuickActionPillProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color?: string;
  bg?: string;
}


const QuickActionPill = ({ label, icon: Icon, onClick, color = "text-zinc-600", bg = "bg-zinc-50 hover:bg-zinc-100" }: QuickActionPillProps) => (
  <motion.button
    variants={itemVariants}
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-zinc-100 text-[13px] font-semibold transition-all duration-200",
      bg, color
    )}
  >
    <Icon size={15} />
    {label}
    <ChevronRight size={13} className="opacity-40" />
  </motion.button>
);


const ActivityItem = ({ activity }: { activity: ActivityLogEntry }) => {
  const Icon = getActivityIcon(activity.entityType);
  const colors = getActivityColor(activity.entityType);


  return (
    <motion.div variants={fadeInUp} className="flex items-start gap-4 py-4 group">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", colors)}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-zinc-800 leading-snug">
          <span className="font-semibold">{activity.userName}</span>
          {" "}{activity.action}{" "}
          <span className="font-semibold text-zinc-900">{activity.entityName}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-zinc-400 capitalize">{activity.entityType}</span>
          <span className="text-zinc-300">·</span>
          <span className="text-[11px] text-zinc-400">{formatRelativeTime(activity.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};


const ActivitySkeleton = () => (
  <div className="flex items-start gap-4 py-4">
    <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/4 rounded bg-zinc-100 animate-pulse" />
      <div className="h-3 w-1/3 rounded bg-zinc-100 animate-pulse" />
    </div>
  </div>
);


const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <AlertCircle size={22} className="text-red-400" />
    </div>
    <p className="text-sm font-semibold text-zinc-700 mb-1">Something went wrong</p>
    <p className="text-xs text-zinc-400 mb-4">{message}</p>
    <button onClick={onRetry} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-700 transition-colors">
      Try again
    </button>
  </motion.div>
);


// ─── Main Dashboard ───────────────────────────────────────────────────────── 


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [greeting, setGreeting] = useState("");


  useEffect(() => {
    if (isLoaded && !user) navigate("/");
  }, [isLoaded, user, navigate]);


  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);


  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const token = await getToken();
      return createApiClient(token).get<DashboardMetrics>("/api/dashboard/metrics");
    },
    enabled: isLoaded && !!isSignedIn,
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 2,
  });


  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: async () => {
      const token = await getToken();
      return createApiClient(token).get<ActivityFeedResponse>("/api/dashboard/activity?limit=20");
    },
    enabled: isLoaded && !!isSignedIn,
    refetchInterval: 45000,
    staleTime: 20000,
    retry: 2,
  });


  const handleAIQuery = useCallback(async (query: string) => {
    // Call AI Assistant API (internal query)
    try {
      const token = await getToken();
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('AI Assistant failed');

      const data = await response.json();
      
      // Show AI Assistant response (for now, just alert - you'll build UI later)
      alert(`AI Assistant: ${data.message}`);
    } catch (error) {
      console.error('AI Assistant error:', error);
      alert('Failed to process query. Please try again.');
    }
  }, [getToken]);


  if (!isLoaded) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-zinc-400 text-sm">Loading...</div>;
  }


  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-200 flex flex-col">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>


      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full px-6 sm:px-12 pt-20 pb-24 flex-1 transition-all duration-300"
      >
        {/* ── Greeting + AI Command Bar ── */}
        <div className="flex flex-col items-center mb-16">
          <motion.p
            variants={itemVariants}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3"
          >
            {greeting}
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight text-center mb-10 leading-[1.1]"
          >
            What would you like
            <br />
            <span className="text-zinc-400">to accomplish today?</span>
          </motion.h1>


          <AICommandBar onSubmit={handleAIQuery} />
        </div>


        {/* ── KPI Metrics Row ── */}
        <motion.section variants={itemVariants} className="mb-16">
          {metricsError ? (
            <ErrorState message={(metricsError as Error)?.message || "Failed to load dashboard metrics"} onRetry={() => refetchMetrics()} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metricsLoading || !metrics ? (
                Array.from({ length: 4 }).map((_, i) => <KPISkeleton key={i} />)
              ) : (
                <>
                  <KPICard index={0} label="Active Clients" value={metrics.activeClients} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
                  <KPICard index={1} label="Open Proposals" value={metrics.openProposals} icon={FileText} iconColor="text-purple-600" iconBg="bg-purple-50" />
                  <KPICard index={2} label="Active Projects" value={metrics.activeProjects} icon={FolderKanban} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
                  <KPICard index={3} label="Outstanding" value={metrics.outstandingInvoices} prefix="$" icon={CreditCard} iconColor="text-amber-600" iconBg="bg-amber-50" />
                </>
              )}
            </div>
          )}
        </motion.section>


        {/* ── Quick Actions ── */}
        <motion.section variants={itemVariants} className="mb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-5 px-1">
            Quick Actions
          </p>
          <div className="flex flex-wrap gap-3">
            <QuickActionPill label="CRM Engine" icon={Briefcase} onClick={() => navigate("/crm")} color="text-blue-700" bg="bg-blue-50 hover:bg-blue-100 border-blue-100" />
            <QuickActionPill label="Project Boards" icon={KanbanSquare} onClick={() => navigate("/projects")} color="text-emerald-700" bg="bg-emerald-50 hover:bg-emerald-100 border-emerald-100" />
            <QuickActionPill label="Billing & Stripe" icon={Receipt} onClick={() => navigate("/billing")} color="text-purple-700" bg="bg-purple-50 hover:bg-purple-100 border-purple-100" />
            <QuickActionPill label="Analytics" icon={BarChart3} onClick={() => navigate("/analytics")} />
            <QuickActionPill label="New Proposal" icon={FileText} onClick={() => navigate("/proposals/new")} />
            <QuickActionPill label="Add Client" icon={Building2} onClick={() => navigate("/clients/new")} />
          </div>
        </motion.section>


        {/* ── Activity Feed ── */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">
              Recent Activity
            </p>
            {activityData?.activities && activityData.activities.length > 0 && (
              <button
                onClick={() => navigate("/activity")}
                className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-700 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={12} />
              </button>
            )}
          </div>


          <div className="rounded-2xl border border-zinc-100 bg-white divide-y divide-zinc-50 px-5">
            {activityError ? (
              <ErrorState message={(activityError as Error)?.message || "Failed to load activity feed"} onRetry={() => refetchActivity()} />
            ) : activityLoading ? (
              Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)
            ) : !activityData?.activities || activityData.activities.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} className="text-zinc-300" />
                </div>
                <p className="text-sm font-semibold text-zinc-500">No activity yet</p>
                <p className="text-xs text-zinc-400 mt-1">Actions across your agency will appear here.</p>
              </div>
            ) : (
              <AnimatePresence>
                {activityData.activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};


export default Dashboard;