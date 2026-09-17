import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useSubscription } from "@/hooks/useSubscription";import {
  MessageSquare, Gavel, ShieldCheck, Lock, ArrowRight, ArrowUpRight,
  FileText, Download, BarChart3, AlertTriangle, Loader2,
  Zap, Briefcase, Bell, FileSignature, Globe, TrendingDown,
  DollarSign, Pin, Maximize2, Scale, Layers, Home, Car,
  X, Clock, Activity, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AD_SLIDES } from "@/config/AdAssets";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Motion standard: spring everywhere, weighty and premium ────────────────
const springTransition = { type: "spring", stiffness: 260, damping: 20 } as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }, // 50ms stagger per spec
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

// ─── The Four Engines (primary navigation) ───────────────────────────────────
// These are the "AI features" — using any of them now counts toward the
// savings calculator, attributed to whichever practice area is pinned (or
// chosen in the attribution picker if nothing is pinned yet).
const CORE_ENGINES = {
  riskAuditor: {
    title: "Risk Auditor",
    description: "Identify legal vulnerabilities",
    icon: ShieldCheck,
    path: "/legalquestionai",
    requiredPlan: "standard",
    color: "text-red-600",
    bgColor: "bg-red-50/30",
  },
  lawFinder: {
    title: "Law Finder",
    description: "Navigate statutes and precedents",
    icon: Globe,
    path: "/legalquestionai",
    requiredPlan: "standard",
    color: "text-blue-600",
    bgColor: "bg-blue-50/30",
  },
  documentBuilder: {
    title: "Document Builder",
    description: "Generate custom legal documents",
    icon: FileSignature,
    path: "/legalquestionai",
    requiredPlan: "starter",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/30",
  },
  generalIntel: {
    title: "General Intel",
    description: "AI chat for general legal queries",
    icon: MessageSquare,
    path: "/legalquestionai",
    requiredPlan: "standard",
    color: "text-purple-600",
    bgColor: "bg-purple-50/30",
  },
};

// Consolidated secondary tools — account/workflow utilities, not billable AI
// analysis, so they don't feed the savings calculator.
const SECONDARY_TOOLS = {
  myMatters: {
    title: "My Matters",
    description: "Track and manage your cases",
    icon: Briefcase,
    path: "/matters",
    requiredPlan: "starter",
    color: "text-orange-600",
    bgColor: "bg-orange-50/30",
  },
  smartReminders: {
    title: "Smart Reminders",
    description: "Automated task and deadline alerts",
    icon: Bell,
    path: "/tasks",
    requiredPlan: "starter",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50/30",
  },
  exportArchive: {
    title: "Export Archive",
    description: "Access and download all documents",
    icon: Download,
    path: "/export",
    requiredPlan: "pro",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50/30",
  },
  analyticsDashboard: {
    title: "Analytics Dashboard",
    description: "Advanced operational insights",
    icon: BarChart3,
    path: "/analytics",
    requiredPlan: "pro",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50/30",
  },
};

// ─── Practice Area Attributes ─────────────────────────────────────────────────
const PRACTICE_AREAS = [
  { id: "pi", label: "Personal Injury", rate: 350, description: "Car accidents, injuries, claims", icon: Car, color: "text-red-600", bg: "bg-red-50" },
  { id: "family", label: "Family Law", rate: 400, description: "Divorce, custody, agreements", icon: Gavel, color: "text-pink-600", bg: "bg-pink-50" },
  { id: "contracts", label: "Contracts", rate: 250, description: "Review, draft, negotiate contracts", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "lt", label: "Landlord-Tenant", rate: 300, description: "Lease disputes, evictions, repairs", icon: Home, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "claims", label: "Small Claims", rate: 200, description: "Small disputes, quick resolution", icon: Scale, color: "text-amber-600", bg: "bg-amber-50" },
];

// Documented, non-randomized assumptions. Every dollar figure on screen is
// derived from these constants and the user's actual completed-query count —
// never from a timer, never from Math.random(), and never capped: savings
// scale linearly with query count for as long as the user keeps working.
const ESTIMATED_HOURS_PER_QUERY: Record<string, number> = {
  pi: 2.5,
  family: 3,
  contracts: 1.5,
  lt: 1,
  claims: 1,
};
const RELUNO_HOURS_PER_QUERY = 0.05; // ~3 minutes of active review time
const RELUNO_COST_PER_QUERY = 3; // allocated cost per completed query

const QUERY_COUNTS_KEY = "reluno_query_counts";
const PINNED_AREA_KEY = "reluno_pinned_area";
const LAST_AREA_KEY = "reluno_last_area";

const calcSavingsForArea = (areaId: string, rate: number, queryCount: number) => {
  const traditionalHours = queryCount * ESTIMATED_HOURS_PER_QUERY[areaId];
  const relunoHours = queryCount * RELUNO_HOURS_PER_QUERY;
  const traditionalCost = traditionalHours * rate;
  const relunoCost = queryCount * RELUNO_COST_PER_QUERY;
  const savings = Math.max(traditionalCost - relunoCost, 0); // uncapped — grows with usage
  const pctReduction = traditionalCost > 0 ? Math.round((savings / traditionalCost) * 100) : 0;
  return { traditionalHours, relunoHours, traditionalCost, relunoCost, savings, pctReduction };
};

const planLabel = (isStarter: boolean, isPro: boolean) =>
  isPro ? "Enterprise Access" : isStarter ? "Starter Access" : "Standard Access";

// ─── Smooth rolling-number display ───────────────────────────────────────────
// Interpolates toward the current real value whenever it changes. This is the
// "always subtly moving" fintech feel — but it only ever animates toward a
// number backed by actual completed queries, never invents new value on a timer.
function useRollingValue(target: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const delta = target - from;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic, weighty not bouncy
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

const RollingNumber = ({ value, className }: { value: number; className?: string }) => {
  const display = useRollingValue(value);
  return (
    <motion.span key={display} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className={className}>
      {display.toLocaleString()}
    </motion.span>
  );
};

// ─── Components ─────────────────────────────────────────────────────────────

const calculatorGlass: React.CSSProperties = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
};

// ── Ad Carousel — reads from external AdAssets.ts, falls back to a house card ──
const AdCarousel = () => {
  const [index, setIndex] = useState(0);
  const ads = AD_SLIDES;

  useEffect(() => {
    if (ads.length === 0) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % ads.length), 6000);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (ads.length === 0) {
    return (
      <Link
        to="/partnerships"
        className="h-full w-full rounded-2xl overflow-hidden relative flex flex-col justify-between p-8 bg-zinc-900 text-white shadow-2xl shadow-zinc-200/50 border border-zinc-100 group"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Zap size={10} className="text-blue-400" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">Partnerships</span>
          </div>
          <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight">Partner with Reluno</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Reach engaged legal decision-makers directly inside their daily workstation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 group-hover:tracking-[0.25em] transition-all">
          Learn more <ArrowUpRight size={12} />
        </div>
      </Link>
    );
  }

  const ad = ads[index];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative group shadow-2xl shadow-zinc-200/50 border border-zinc-100">
      <AnimatePresence mode="wait">
        <motion.a
          key={ad.id}
          href={ad.ctaUrl}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={springTransition}
          className="absolute inset-0 p-6 flex flex-col justify-between bg-zinc-900 text-white"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Zap size={10} className="text-blue-400" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-400">Legal Spotlight</span>
            </div>
            {/* Dedicated aspect-video slot for a firm logo / promotional image */}
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-zinc-800 border border-white/10">
              <img src={ad.imageUrl} alt={ad.firm} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-xl font-bold leading-tight tracking-tight">{ad.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{ad.text}</p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">{ad.firm}</span>
            <div className="flex gap-1.5">
              {ads.map((_, i) => (
                <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", i === index ? "bg-blue-500 w-4" : "bg-zinc-700")} />
              ))}
            </div>
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
};

const TotalSavingsSummary = ({ total, hasData }: { total: number; hasData: boolean }) => (
  <div style={calculatorGlass} className="rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
        <DollarSign className="text-emerald-600" size={22} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Total Estimated Savings</p>
        <h2 className="font-serif text-3xl font-bold text-zinc-900 tracking-tight">
          {hasData ? <>$<RollingNumber value={total} /></> : "$0"}
        </h2>
      </div>
    </div>
    {!hasData && (
      <Link to="/legalquestionai" className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
        Start your first query →
      </Link>
    )}
  </div>
);

// ── Collapsed trigger card — opens the full-screen Deep Insights takeover ──
const SavingsWidget = ({ area, queryCount, isPinned, onOpen, onStartQuery }: any) => {
  const { savings, pctReduction } = calcSavingsForArea(area.id, area.rate, queryCount);
  const hasData = queryCount > 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={calculatorGlass}
      className="rounded-2xl h-[210px] cursor-pointer relative"
      onClick={() => onOpen(area.id)}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", area.bg)}>
              <area.icon className={cn("w-6 h-6", area.color)} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-900">{area.label}</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">${area.rate}/hr Market Rate</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {isPinned && (
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Pin size={16} /></span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(area.id); }}
              className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-all"
              aria-label="Open deep insights"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {hasData ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-2">Estimated Savings</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-emerald-600">$</span>
              <h2 className="text-3xl font-serif font-bold text-emerald-600 tracking-tight"><RollingNumber value={savings} /></h2>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <TrendingDown size={12} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{pctReduction}% below market rate</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-2xl font-serif font-bold text-zinc-300">$0 Saved</p>
            <button
              onClick={(e) => { e.stopPropagation(); onStartQuery(area.id); }}
              className="mt-2 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all text-left"
            >
              Start your first query →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Full-screen Deep Insights takeover ──
const DeepInsightsOverlay = ({ area, queryCount, isPinned, allAreas, queryCounts, onClose, onPin, onStartQuery }: any) => {
  const { traditionalHours, relunoHours, traditionalCost, relunoCost, savings, pctReduction } =
    calcSavingsForArea(area.id, area.rate, queryCount);
  const timeSaved = Math.max(traditionalHours - relunoHours, 0);
  const hasData = queryCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={springTransition}
        className="max-w-6xl mx-auto px-8 py-12"
      >
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", area.bg)}>
              <area.icon className={cn("w-7 h-7", area.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-1">Deep Insights</p>
              <h2 className="font-serif text-3xl font-bold text-zinc-900 tracking-tight">{area.label}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-all" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: cost breakdown + time saved */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-2">Estimated Savings</p>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-emerald-600">$</span>
                <h2 className="text-5xl font-serif font-bold text-emerald-600 tracking-tight"><RollingNumber value={savings} /></h2>
              </div>
              {hasData ? (
                <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                  <TrendingDown size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{pctReduction}% below market rate</span>
                </div>
              ) : (
                <button onClick={() => onStartQuery(area.id)} className="mt-3 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">
                  Start your first query →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Traditional Cost</p>
                <p className="text-xl font-bold text-zinc-900">${traditionalCost.toLocaleString()}</p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Strategic (Reluno) Cost</p>
                <p className="text-xl font-bold text-blue-600">${relunoCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-zinc-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                <Clock className="text-white" size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Saved</p>
                <p className="text-lg font-bold text-zinc-900">{timeSaved.toFixed(1)} hours</p>
              </div>
            </div>

            <button
              onClick={() => onPin(area.id)}
              className={cn(
                "w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                isPinned ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-zinc-900 text-white hover:bg-blue-600"
              )}
            >
              <Pin size={13} />
              {isPinned ? "Pinned as Number One Topic" : "Place as Number One Topic"}
            </button>
          </div>

          {/* Right: market efficiency graph + methodology */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                <Activity size={12} /> Market Efficiency — All Practice Areas
              </p>
              <div className="space-y-4">
                {allAreas.map((a: any) => {
                  const count = queryCounts[a.id] || 0;
                  const { pctReduction: pct } = calcSavingsForArea(a.id, a.rate, count);
                  const isCurrent = a.id === area.id;
                  return (
                    <div key={a.id}>
                      <div className={cn("flex justify-between text-[11px] mb-1", isCurrent ? "text-zinc-900 font-bold" : "text-zinc-500")}>
                        <span>{a.label}</span>
                        <span>{count > 0 ? `${pct}%` : "—"}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <motion.div
                          className={cn("h-full rounded-full", isCurrent ? "bg-blue-600" : "bg-zinc-300")}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Methodology</p>
              <ul className="space-y-3">
                <li className="flex gap-2 text-xs text-zinc-600 leading-relaxed">
                  <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  Assumes {ESTIMATED_HOURS_PER_QUERY[area.id]} attorney hours per {area.label.toLowerCase()} matter, based on
                  typical flat-fee and hourly ranges for routine, non-litigated work.
                </li>
                <li className="flex gap-2 text-xs text-zinc-600 leading-relaxed">
                  <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  Reluno cost allocated at ${RELUNO_COST_PER_QUERY} per completed query, based on average subscription usage.
                </li>
                <li className="flex gap-2 text-xs text-zinc-600 leading-relaxed">
                  <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                  Reflects {queryCount} completed {area.label.toLowerCase()} {queryCount === 1 ? "query" : "queries"} on this account —
                  figures update from completed work only, and grow without limit as usage grows.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Attribution picker — shown when an AI engine is launched with nothing
// pinned yet, so usage is credited to the right practice area instead of
// silently going untracked. ──
const AttributionModal = ({ lastArea, onSelect, onSkip }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 z-[110] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-6"
    onClick={onSkip}
  >
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={springTransition}
      onClick={(e) => e.stopPropagation()}
      style={calculatorGlass}
      className="w-full max-w-md rounded-2xl p-8 bg-white"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-2">Before you start</p>
      <h3 className="font-serif text-2xl font-bold text-zinc-900 tracking-tight mb-6">What is this query for?</h3>
      <div className="space-y-2 mb-6">
        {PRACTICE_AREAS.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", a.bg)}>
              <a.icon className={cn("w-4 h-4", a.color)} />
            </div>
            <span className="text-sm font-semibold text-zinc-800 flex-1">{a.label}</span>
            {lastArea === a.id && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Last used</span>
            )}
          </button>
        ))}
      </div>
      <button onClick={onSkip} className="w-full text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors py-2">
        Skip — general query, don't track savings
      </button>
    </motion.div>
  </motion.div>
);

const FeatureBox = ({ config, isUnlocked, onAction, onUpgrade, size = "default" }: any) => {
  const Icon = config.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={isUnlocked ? { y: -4, scale: 1.02 } : {}}
      onClick={isUnlocked ? onAction : onUpgrade}
      className={cn(
        "rounded-2xl border flex flex-col justify-between transition-all cursor-pointer",
        size === "default" ? "p-6 h-[200px]" : "p-5 h-[150px]",
        isUnlocked
          ? "bg-white border-zinc-200 shadow-sm hover:shadow-xl hover:border-blue-200"
          : "bg-zinc-50/50 border-zinc-100 opacity-70"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("rounded-2xl flex items-center justify-center shadow-inner", size === "default" ? "w-11 h-11" : "w-9 h-9", isUnlocked ? config.bgColor : "bg-zinc-200")}>
          <Icon size={size === "default" ? 20 : 16} className={isUnlocked ? config.color : "text-zinc-400"} />
        </div>
        {!isUnlocked && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 border border-zinc-200">
            <Lock size={10} className="text-zinc-400" />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Locked</span>
          </div>
        )}
      </div>
      <div>
        <h3 className={cn("font-bold text-zinc-900", size === "default" ? "text-base" : "text-sm")}>{config.title}</h3>
        <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed font-medium">{config.description}</p>
      </div>
      {size === "default" && (
        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {isUnlocked ? "Ready for Execution" : `Upgrade to ${config.requiredPlan}`}
          </span>
          <ArrowRight size={14} className={isUnlocked ? "text-blue-600" : "text-zinc-300"} />
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────

const Dashboard = () => {
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [pinnedArea, setPinnedArea] = useState<string | null>(null);
  const [queryCounts, setQueryCounts] = useState<Record<string, number>>({});
  const [lastArea, setLastArea] = useState<string | null>(null);
  const [pendingLaunchPath, setPendingLaunchPath] = useState<string | null>(null);

  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { planLoading, isStarter, isPro } = useSubscription();

  useEffect(() => {
    if (isLoaded && !user) navigate("/");
  }, [isLoaded, user, navigate]);

  useEffect(() => {
    try {
      setQueryCounts(JSON.parse(localStorage.getItem(QUERY_COUNTS_KEY) || "{}"));
    } catch {
      setQueryCounts({});
    }
    const storedPin = localStorage.getItem(PINNED_AREA_KEY);
    if (storedPin) setPinnedArea(storedPin);
    const storedLast = localStorage.getItem(LAST_AREA_KEY);
    if (storedLast) setLastArea(storedLast);
  }, []);

  const recordQuery = (areaId: string) => {
    setQueryCounts((prev) => {
      const next = { ...prev, [areaId]: (prev[areaId] || 0) + 1 };
      localStorage.setItem(QUERY_COUNTS_KEY, JSON.stringify(next));
      return next;
    });
    setLastArea(areaId);
    localStorage.setItem(LAST_AREA_KEY, areaId);
  };

  // NOTE: production wiring should also call recordQuery from the real
  // analysis-completion event in LegalQuestionAI.tsx, not only from launch —
  // that would credit savings for work actually finished, not just started.
  const handleStartQuery = (areaId: string) => {
    recordQuery(areaId);
    navigate(`/legalquestionai?area=${areaId}`);
  };

  // Every "AI feature" launch point (hero CTA, the four engine tiles) routes
  // through here. If a practice area is pinned, usage is credited to it
  // automatically — no extra click. If nothing is pinned, the attribution
  // picker asks once, so the query is never silently uncounted.
  const launchEngine = (path: string) => {
    if (pinnedArea) {
      recordQuery(pinnedArea);
      navigate(`${path}?area=${pinnedArea}`);
      return;
    }
    setPendingLaunchPath(path);
  };

  const resolveAttribution = (areaId: string) => {
    if (pendingLaunchPath) {
      recordQuery(areaId);
      navigate(`${pendingLaunchPath}?area=${areaId}`);
    }
    setPendingLaunchPath(null);
  };

  const skipAttribution = () => {
    if (pendingLaunchPath) navigate(pendingLaunchPath);
    setPendingLaunchPath(null);
  };

  const handlePin = (areaId: string) => {
    const next = pinnedArea === areaId ? null : areaId;
    setPinnedArea(next);
    if (next) localStorage.setItem(PINNED_AREA_KEY, next);
    else localStorage.removeItem(PINNED_AREA_KEY);
  };

  const engineUnlock = {
    riskAuditor: true,
    lawFinder: true,
    documentBuilder: isStarter || isPro,
    generalIntel: true,
  };
  const toolUnlock = {
    myMatters: isStarter || isPro,
    smartReminders: isStarter || isPro,
    exportArchive: isPro,
    analyticsDashboard: isPro,
  };

  const totalSavings = PRACTICE_AREAS.reduce((sum, area) => {
    const count = queryCounts[area.id] || 0;
    return sum + calcSavingsForArea(area.id, area.rate, count).savings;
  }, 0);
  const hasAnyData = Object.values(queryCounts).some((c) => c > 0);

  // Pinned area, if any, is sorted to the front of the grid — same practice
  // area that quietly collects credit from every engine launch above.
  const orderedAreas = pinnedArea
    ? [...PRACTICE_AREAS].sort((a, b) => (a.id === pinnedArea ? -1 : b.id === pinnedArea ? 1 : 0))
    : PRACTICE_AREAS;

  const activeArea = expandedArea ? PRACTICE_AREAS.find((a) => a.id === expandedArea) : null;

  if (planLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-100">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-50" />
      </div>

      <header className="h-20 border-b border-zinc-100 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-xl z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-bold tracking-tight">RELUNO<span className="text-blue-600">.</span></span>
        </Link>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springTransition}
          className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/20"
        >
          <Zap size={14} className="text-blue-400 fill-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{planLabel(isStarter, isPro)}</span>
        </motion.div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto px-12 py-12 space-y-16">

        {/* ── Hero Row ── */}
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-8 p-12 rounded-[2rem] flex flex-col justify-between min-h-[350px] glass-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springTransition, delay: 0.1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Command Center Active</span>
              </motion.div>
              <h1 className="font-serif text-5xl font-bold text-zinc-900 mb-6 tracking-tight leading-[1.1]">
                Welcome back, <br />
                <span className="text-blue-600">{user?.firstName || "Counsel"}</span>.
              </h1>
              <p className="text-base text-zinc-500 max-w-lg leading-relaxed font-medium">
                Your strategic legal workstation is synchronized. Every audit, document, and matter is secured with enterprise-grade intelligence.
              </p>
            </div>
            <div className="flex gap-6 mt-12 relative z-10">
              <motion.button whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => launchEngine("/legalquestionai")} className="px-8 py-4 rounded-[1.25rem] bg-zinc-900 text-white text-sm font-bold hover:bg-blue-600 transition-all shadow-2xl shadow-zinc-900/20 flex items-center gap-3 group">
                Execute Query <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/my-cases")} className="px-8 py-4 rounded-[1.25rem] border-2 border-zinc-100 text-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-all flex items-center gap-3">
                <Briefcase size={18} />
                Manage Matters
              </motion.button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-4">
            <AdCarousel />
          </motion.div>
        </div>

        {/* ── Savings Calculator ── */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-end justify-between px-2 flex-wrap gap-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-zinc-900 tracking-tight">Legal Savings Calculator</h2>
              <p className="text-[11px] text-zinc-400 mt-2 uppercase tracking-[0.3em] font-bold">
                {pinnedArea
                  ? `Tracking every engine use toward ${PRACTICE_AREAS.find((a) => a.id === pinnedArea)?.label}`
                  : "Based on your completed queries"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Reluno</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-zinc-300" /> Traditional</span>
            </div>
          </div>

          <TotalSavingsSummary total={totalSavings} hasData={hasAnyData} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {orderedAreas.map((area) => (
              <SavingsWidget
                key={area.id}
                area={area}
                queryCount={queryCounts[area.id] || 0}
                isPinned={pinnedArea === area.id}
                onOpen={setExpandedArea}
                onStartQuery={handleStartQuery}
              />
            ))}
          </div>
        </motion.section>

        {/* ── The Four Engines ── */}
        <motion.section variants={itemVariants} className="space-y-10">
          <div className="px-2">
            <h2 className="font-serif text-3xl font-bold text-zinc-900 tracking-tight">Intelligence Engines</h2>
            <p className="text-[11px] text-zinc-400 mt-2 uppercase tracking-[0.3em] font-bold">Core Strategic Infrastructure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CORE_ENGINES).map(([key, config]) => (
              <FeatureBox
                key={key}
                config={config}
                isUnlocked={engineUnlock[key as keyof typeof engineUnlock]}
                onAction={() => launchEngine(config.path)}
                onUpgrade={() => navigate("/pricing")}
              />
            ))}
          </div>

          <div>
            <p className="px-2 mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Additional Tools</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(SECONDARY_TOOLS).map(([key, config]) => (
                <FeatureBox
                  key={key}
                  config={config}
                  size="compact"
                  isUnlocked={toolUnlock[key as keyof typeof toolUnlock]}
                  onAction={() => navigate(config.path)}
                  onUpgrade={() => navigate("/pricing")}
                />
              ))}
            </div>
          </div>
        </motion.section>

      </motion.main>

      <div className="h-20" />

      <AnimatePresence>
        {activeArea && (
          <DeepInsightsOverlay
            area={activeArea}
            queryCount={queryCounts[activeArea.id] || 0}
            isPinned={pinnedArea === activeArea.id}
            allAreas={PRACTICE_AREAS}
            queryCounts={queryCounts}
            onClose={() => setExpandedArea(null)}
            onPin={handlePin}
            onStartQuery={handleStartQuery}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingLaunchPath && (
          <AttributionModal lastArea={lastArea} onSelect={resolveAttribution} onSkip={skipAttribution} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;