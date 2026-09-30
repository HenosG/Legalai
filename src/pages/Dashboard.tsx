import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  FileText,
  FolderKanban,
  KanbanSquare,
  LineChart as LineChartIcon,
  Loader2,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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

interface AnalyticsPoint {
  label: string;
  revenue: number;
  pipeline: number;
  clients: number;
  projects: number;
  invoices: number;
}

interface AttentionItem {
  id: string;
  title: string;
  detail: string;
  type: "invoice" | "proposal" | "project" | "client";
  href: string;
  priority: "high" | "medium" | "low";
}

interface SnapshotAnalytics {
  source: "snapshot";
  revenueTrend: AnalyticsPoint[];
  pipelineBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
  attentionItems: AttentionItem[];
}

// ─── Intent Classification ───────────────────────────────────────────────────

type IntentType = "internal" | "external" | "uncertain";

interface IntentClassification {
  type: IntentType;
  confidence: number;
  reason: string;
}

const INTERNAL_KEYWORDS = [
  "show",
  "display",
  "list",
  "what is",
  "how many",
  "total",
  "revenue",
  "invoice",
  "client",
  "project",
  "task",
  "dashboard",
  "analytics",
  "report",
  "stats",
  "active",
  "pending",
  "overdue",
  "my",
  "our",
  "we",
  "us",
];

const EXTERNAL_KEYWORDS = [
  "i need",
  "i want",
  "i am looking",
  "i require",
  "we need",
  "we want",
  "looking for",
  "hire",
  "services",
  "help",
  "quote",
  "price",
  "cost",
  "budget",
  "timeline",
  "deadline",
  "launch",
];

const BUDGET_PATTERNS = [
  /\$\d+/,
  /\d+\s*k/i,
  /budget/i,
  /around\s*\$/i,
  /approximately\s*\$/i,
];

const TIMELINE_PATTERNS = [
  /deadline/i,
  /launch/i,
  /by\s+\w+\s+\d{4}/i,
  /within\s+\d+\s+weeks/i,
  /q[1-4]\s*\d{4}/i,
];

function classifyIntent(query: string): IntentClassification {
  const lowerQuery = query.toLowerCase().trim();

  const hasExternalKeywords = EXTERNAL_KEYWORDS.some((keyword) =>
    lowerQuery.includes(keyword)
  );

  const hasBudgetPattern = BUDGET_PATTERNS.some((pattern) =>
    pattern.test(lowerQuery)
  );

  const hasTimelinePattern = TIMELINE_PATTERNS.some((pattern) =>
    pattern.test(lowerQuery)
  );

  const hasInternalKeywords = INTERNAL_KEYWORDS.some((keyword) =>
    lowerQuery.includes(keyword)
  );

  let externalScore = 0;
  let internalScore = 0;

  if (hasExternalKeywords) externalScore += 0.4;
  if (hasBudgetPattern) externalScore += 0.3;
  if (hasTimelinePattern) externalScore += 0.3;
  if (hasInternalKeywords) internalScore += 0.5;

  if (
    lowerQuery.startsWith("show") ||
    lowerQuery.startsWith("display") ||
    lowerQuery.startsWith("list") ||
    lowerQuery.startsWith("what is") ||
    lowerQuery.startsWith("how many")
  ) {
    internalScore += 0.5;
  }

  if (externalScore > internalScore && externalScore >= 0.4) {
    return {
      type: "external",
      confidence: externalScore,
      reason: "Detected lead inquiry",
    };
  }

  if (internalScore > externalScore && internalScore >= 0.3) {
    return {
      type: "internal",
      confidence: internalScore,
      reason: "Detected internal workspace command",
    };
  }

  return {
    type: "uncertain",
    confidence: 0.5,
    reason: "Could not determine intent",
  };
}

// ─── Motion ──────────────────────────────────────────────────────────────────

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useRollingValue(target: number, duration = 700) {
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

function RollingNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const display = useRollingValue(value);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }

  return `$${Math.round(value || 0)}`;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function getActivityIcon(entityType: string) {
  switch (entityType?.toLowerCase()) {
    case "client":
      return Building2;
    case "lead":
    case "intake":
      return Sparkles;
    case "proposal":
      return FileText;
    case "project":
      return FolderKanban;
    case "invoice":
      return Receipt;
    case "payment":
      return CreditCard;
    case "task":
      return CheckCircle2;
    default:
      return Activity;
  }
}

function getActivityColor(entityType: string) {
  switch (entityType?.toLowerCase()) {
    case "client":
      return "bg-zinc-100 text-zinc-700";
    case "lead":
    case "intake":
      return "bg-zinc-100 text-zinc-700";
    case "proposal":
      return "bg-zinc-100 text-zinc-700";
    case "project":
      return "bg-zinc-100 text-zinc-700";
    case "invoice":
      return "bg-zinc-100 text-zinc-700";
    case "payment":
      return "bg-zinc-100 text-zinc-700";
    case "task":
      return "bg-zinc-100 text-zinc-700";
    default:
      return "bg-zinc-100 text-zinc-500";
  }
}

function buildSnapshotAnalytics(metrics: DashboardMetrics): SnapshotAnalytics {
  const currentRevenue = Math.max(metrics.monthlyRevenue || 0, 0);
  const currentPipeline = Math.max(metrics.pipelineValue || 0, 0);
  const currentClients = Math.max(metrics.activeClients || 0, 0);
  const currentProjects = Math.max(metrics.activeProjects || 0, 0);
  const currentInvoices = Math.max(metrics.outstandingInvoices || 0, 0);

  const revenueTrend: AnalyticsPoint[] = [
    {
      label: "Week 1",
      revenue: Math.round(currentRevenue * 0.25),
      pipeline: Math.round(currentPipeline * 0.3),
      clients: Math.max(0, Math.round(currentClients * 0.55)),
      projects: Math.max(0, Math.round(currentProjects * 0.45)),
      invoices: Math.round(currentInvoices * 0.4),
    },
    {
      label: "Week 2",
      revenue: Math.round(currentRevenue * 0.42),
      pipeline: Math.round(currentPipeline * 0.52),
      clients: Math.max(0, Math.round(currentClients * 0.7)),
      projects: Math.max(0, Math.round(currentProjects * 0.6)),
      invoices: Math.round(currentInvoices * 0.6),
    },
    {
      label: "Week 3",
      revenue: Math.round(currentRevenue * 0.68),
      pipeline: Math.round(currentPipeline * 0.75),
      clients: Math.max(0, Math.round(currentClients * 0.85)),
      projects: Math.max(0, Math.round(currentProjects * 0.8)),
      invoices: Math.round(currentInvoices * 0.8),
    },
    {
      label: "This week",
      revenue: currentRevenue,
      pipeline: currentPipeline,
      clients: currentClients,
      projects: currentProjects,
      invoices: currentInvoices,
    },
  ];

  const proposalValue = Math.round(currentPipeline * 0.55);
  const activeDeliveryValue = Math.round(currentPipeline * 0.3);
  const earlyOpportunityValue = Math.max(
    0,
    currentPipeline - proposalValue - activeDeliveryValue
  );

  return {
    source: "snapshot",
    revenueTrend,
    pipelineBreakdown:
  currentPipeline > 0
    ? [
        {
          name: "Proposal stage",
          value: proposalValue,
          color: "#18181b",
        },
        {
          name: "Active delivery",
          value: activeDeliveryValue,
          color: "#71717a",
        },
        {
          name: "Early opportunity",
          value: earlyOpportunityValue,
          color: "#d4d4d8",
        },
      ]
    : [],
    attentionItems: [
      ...(currentInvoices > 0
        ? [
            {
              id: "outstanding-invoices",
              title: "Outstanding invoice balance",
              detail: `${formatCurrency(
                currentInvoices
              )} is still awaiting payment.`,
              type: "invoice" as const,
              href: "/invoices",
              priority: "high" as const,
            },
          ]
        : []),
      ...(metrics.openProposals > 0
        ? [
            {
              id: "open-proposals",
              title: "Open proposals need review",
              detail: `${metrics.openProposals} proposal${
                metrics.openProposals === 1 ? "" : "s"
              } still in progress.`,
              type: "proposal" as const,
              href: "/proposals",
              priority: "medium" as const,
            },
          ]
        : []),
      ...(metrics.activeProjects > 0
        ? [
            {
              id: "active-projects",
              title: "Active project delivery",
              detail: `${metrics.activeProjects} project${
                metrics.activeProjects === 1 ? "" : "s"
              } currently moving through delivery.`,
              type: "project" as const,
              href: "/projects",
              priority: "low" as const,
            },
          ]
        : []),
      ...(metrics.activeClients === 0
        ? [
            {
              id: "no-clients",
              title: "Create your first client record",
              detail:
                "Start from CRM or accept an opportunity from AI Intake.",
              type: "client" as const,
              href: "/crm",
              priority: "medium" as const,
            },
          ]
        : []),
    ],
  };
}

// ─── Chart Config ────────────────────────────────────────────────────────────

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#18181b",
  },
  pipeline: {
    label: "Pipeline",
    color: "#71717a",
  },
} satisfies ChartConfig;

const activityChartConfig = {
  clients: {
    label: "Clients",
    color: "#18181b",
  },
  projects: {
    label: "Projects",
    color: "#71717a",
  },
} satisfies ChartConfig;

// ─── Components ──────────────────────────────────────────────────────────────

function AICommandBar({
  onSubmit,
}: {
  onSubmit: (query: string) => void;
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async () => {
    if (!value.trim() || isProcessing) return;

    setIsProcessing(true);

    const intentClassification = classifyIntent(value.trim());

    if (intentClassification.type === "external") {
      window.location.assign(
        `/ai-intake?query=${encodeURIComponent(
          value.trim()
        )}&channel=command`
      );
      return;
    }

    await onSubmit(value.trim());
    setValue("");
    setIsProcessing(false);
  }, [isProcessing, onSubmit, value]);

  const suggestions = [
    "Summarize this week's pipeline",
    "Show outstanding invoices",
    "Draft a proposal for a client",
    "What needs attention today?",
  ];

  return (
    <motion.div variants={itemVariants} className="w-full max-w-3xl">
      <div
        className={cn(
          "relative rounded-xl border bg-white transition-all duration-200",
          focused
            ? "border-zinc-400 shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
            : "border-zinc-200 shadow-sm"
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <Search size={17} className="shrink-0 text-zinc-400" />

          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleSubmit();
              }
            }}
            placeholder="Ask about your clients, projects, invoices, or pipeline…"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />

          <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[10px] font-medium text-zinc-400 sm:inline-flex">
            ⌘ K
          </span>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!value.trim() || isProcessing}
            className={cn(
              "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all",
              value.trim() && !isProcessing
                ? "bg-zinc-900 text-white hover:bg-zinc-700"
                : "bg-zinc-100 text-zinc-400"
            )}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Ask
                <ArrowUpRight size={14} />
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl"
            >
              <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Suggested actions
              </p>

              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={() => {
                    setValue(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Sparkles size={14} className="text-zinc-400" />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function KPICard({
  label,
  value,
  prefix,
  suffix,
  icon: Icon,
  detail,
  onClick,
  index,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  detail: string;
  onClick?: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      whileHover={{ y: -2 }}
      transition={{ ...springTransition, delay: index * 0.04 }}
      onClick={onClick}
      className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-500">
          {label}
        </span>

        <Icon
          size={15}
          strokeWidth={1.8}
          className="text-zinc-400 transition-colors group-hover:text-zinc-700"
        />
      </div>

      <p className="mt-4 font-serif text-3xl font-bold tracking-tight text-zinc-900">
        <RollingNumber value={value} prefix={prefix} suffix={suffix} />
      </p>

      <p className="mt-2 text-[11px] leading-5 text-zinc-400">
        {detail}
      </p>
    </motion.button>
  );
}

function KPISkeleton() {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-zinc-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="mt-5 h-8 w-20 animate-pulse rounded bg-zinc-100" />
      <div className="mt-3 h-3 w-36 animate-pulse rounded bg-zinc-100" />
    </motion.div>
  );
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  accent?: "default" | "blue" | "violet" | "emerald" | "amber";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
    >
      <Icon
        size={14}
        strokeWidth={1.8}
        className="text-zinc-400 transition-colors group-hover:text-zinc-700"
      />
      {label}
    </button>
  );
}

function ActivityItem({ activity }: { activity: ActivityLogEntry }) {
  const Icon = getActivityIcon(activity.entityType);
  const colors = getActivityColor(activity.entityType);

  return (
    <motion.div variants={fadeInUp} className="flex items-start gap-4 py-4">
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          colors
        )}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-snug text-zinc-800">
          <span className="font-semibold">{activity.userName || "You"}</span>{" "}
          {activity.action}{" "}
          <span className="font-semibold text-zinc-900">
            {activity.entityName}
          </span>
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="capitalize text-[11px] text-zinc-400">
            {activity.entityType}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-[11px] text-zinc-400">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-zinc-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle size={22} className="text-red-400" />
      </div>

      <p className="mb-1 text-sm font-semibold text-zinc-700">
        Something went wrong
      </p>

      <p className="mb-4 text-xs text-zinc-400">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        Try again
      </button>
    </motion.div>
  );
}

function AttentionList({
  items,
  navigate,
}: {
  items: AttentionItem[];
  navigate: (path: string) => void;
}) {
  const getItemIcon = (type: AttentionItem["type"]) => {
    switch (type) {
      case "invoice":
        return Receipt;
      case "proposal":
        return FileText;
      case "project":
        return FolderKanban;
      case "client":
      default:
        return Users;
    }
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <CheckCircle2 size={20} />
        </div>

        <p className="mt-4 text-sm font-bold text-zinc-700">
          Your workspace is clear.
        </p>

        <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-400">
          New client work, projects, proposals, and invoices that need
          attention will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100">
      {items.slice(0, 4).map((item) => {
        const Icon = getItemIcon(item.type);

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => navigate(item.href)}
            className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-zinc-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <Icon size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-zinc-800">
                {item.title}
              </p>

              <p className="mt-1 truncate text-[11px] text-zinc-500">
                {item.detail}
              </p>
            </div>

            <ChevronRight
              size={15}
              className="shrink-0 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600"
            />
          </button>
        );
      })}
    </div>
  );
}

function RevenueTrendChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <ChartContainer
      config={revenueChartConfig}
      className="h-[250px] min-h-[250px] w-full"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
          </linearGradient>

          <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#71717a" stopOpacity={0.16} />
            <stop offset="95%" stopColor="#71717a" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e4e4e7"
        />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={52}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
          tickFormatter={(value) => formatCompactCurrency(Number(value))}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(label) => String(label)}
              formatter={(value, name) => [
                formatCurrency(Number(value || 0)),
                name === "revenue" ? "Revenue" : "Pipeline",
              ]}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="pipeline"
          stroke="#71717a"
          strokeWidth={2}
          fill="url(#pipelineFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#18181b"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function WorkspaceGrowthChart({ data }: { data: AnalyticsPoint[] }) {
  return (
    <ChartContainer
      config={activityChartConfig}
      className="h-[220px] min-h-[220px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
        barGap={5}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="#e4e4e7"
        />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
        />

        <ChartTooltip
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
          content={<ChartTooltipContent indicator="dashed" />}
        />

        <Bar
          dataKey="clients"
          fill="#18181b"
          radius={[5, 5, 0, 0]}
          maxBarSize={32}
        />

        <Bar
          dataKey="projects"
          fill="#a1a1aa"
          radius={[5, 5, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ChartContainer>
  );
}

function PipelineDistribution({
  data,
}: {
  data: SnapshotAnalytics["pipelineBreakdown"];
}) {
  const nonZeroData = data.filter((item) => Number(item.value) > 0);
  const hasPipeline = nonZeroData.length > 0;
  const totalPipeline = nonZeroData.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  const chartData = hasPipeline
    ? nonZeroData
    : [
        {
          name: "No pipeline data",
          value: 100,
          color: "#e4e4e7",
        },
      ];

  return (
    <div className="flex h-[250px] items-center gap-4">
      {/* Fixed aspect-square wrapper ensures the chart stays a 100% perfect circle */}
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={hasPipeline ? 3 : 0}
              stroke="none"
              isAnimationActive={hasPipeline}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
                  fill={entry.color || "#18181b"}
                />
              ))}
            </Pie>
            {hasPipeline && (
              <RechartsTooltip
                cursor={false}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e4e4e7",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  fontSize: "12px",
                }}
                formatter={(value: number | string, name: string) => [
                  formatCurrency(Number(value || 0)),
                  name,
                ]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Pipeline
          </span>
          <span className="mt-1 font-serif text-xl font-bold tracking-tight text-zinc-900">
            {hasPipeline ? formatCompactCurrency(totalPipeline) : "—"}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-3 pr-1">
        {hasPipeline ? (
          nonZeroData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: item.color || "#18181b",
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-zinc-700">
                  {item.name}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {formatCompactCurrency(Number(item.value || 0))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="pr-2">
            <p className="text-[11px] font-semibold text-zinc-700">
              No proposal value yet
            </p>
            <p className="mt-1 text-[11px] leading-5 text-zinc-400">
              Create or update a proposal to see your pipeline here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AIResultPanel({
  result,
  onClose,
}: {
  result: any;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      transition={{ duration: 0.2 }}
      className="mt-6 w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <Sparkles size={13} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Reluno Assistant
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Close assistant result"
        >
          <X size={16} />
        </button>
      </div>

      <p className="mb-4 text-sm leading-6 text-zinc-800">
        {result.message || result.data?.message}
      </p>

      {result.type === "client_list" && result.data?.length > 0 && (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {result.data.map((client: any) => (
            <div
              key={client.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {client.name}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500">
                  {client.email || "No email provided"} ·{" "}
                  {client.company || "Independent"}
                </p>
              </div>

              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                {client.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {result.type === "invoice_summary" && result.data && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total revenue
            </p>
            <p className="mt-2 font-serif text-xl font-bold text-zinc-900">
              {formatCurrency(result.data.total || 0)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Paid
            </p>
            <p className="mt-2 font-serif text-xl font-bold text-zinc-900">
              {formatCurrency(result.data.paid || 0)}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Unpaid
            </p>
            <p className="mt-2 font-serif text-xl font-bold text-zinc-900">
              {formatCurrency(result.data.unpaid || 0)}
            </p>
          </div>
        </div>
      )}

      {result.type === "project_list" && result.data?.length > 0 && (
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {result.data.map((project: any) => (
            <div
              key={project.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {project.name}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Budget: {formatCurrency(project.budget || 0)}
                </p>
              </div>

              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                {project.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [greeting, setGreeting] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [analyticsMode, setAnalyticsMode] = useState<"revenue" | "workspace">(
    "revenue"
  );

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/");
    }
  }, [isLoaded, navigate, user]);

  useEffect(() => {
    const hour = new Date().getHours();

    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 17
        ? "Good afternoon"
        : "Good evening"
    );
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

      return createApiClient(token).get<DashboardMetrics>(
        "/api/dashboard/metrics"
      );
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

      return createApiClient(token).get<ActivityFeedResponse>(
        "/api/dashboard/activity?limit=20"
      );
    },
    enabled: isLoaded && !!isSignedIn,
    refetchInterval: 45000,
    staleTime: 20000,
    retry: 2,
  });

  const handleAIQuery = useCallback(
    async (query: string) => {
      try {
        const token = await getToken();

        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("AI Assistant failed");
        }

        const data = await response.json();
        setAiResult(data);
      } catch (error) {
        console.error("AI Assistant error:", error);

        setAiResult({
          type: "ai_response",
          message:
            "I could not process that workspace question right now. Please try again.",
        });
      }
    },
    [getToken]
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] text-sm text-zinc-400">
        Loading workspace…
      </div>
    );
  }

  const currentMetrics = metrics || {
    activeClients: 0,
    openProposals: 0,
    activeProjects: 0,
    outstandingInvoices: 0,
    monthlyRevenue: 0,
    pipelineValue: 0,
  };

  const analytics = useMemo(
    () => buildSnapshotAnalytics(currentMetrics),
    [
      currentMetrics.activeClients,
      currentMetrics.activeProjects,
      currentMetrics.monthlyRevenue,
      currentMetrics.openProposals,
      currentMetrics.outstandingInvoices,
      currentMetrics.pipelineValue,
    ]
  );

  const growthData = analytics.revenueTrend;
  const attentionItems = analytics.attentionItems;
  const pipelineBreakdown = analytics.pipelineBreakdown;
  const activeActivity = activityData?.activities || [];

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

        .font-serif {
          font-family: "DM Serif Display", serif;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }
      `}</style>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-12"
      >
        {/* Dashboard Header */}
        <section className="mb-10">
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-zinc-400">
                {greeting}
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                Your workspace
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Track client work, delivery, invoices, and the next action that
                needs your attention.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/ai-intake")}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <Sparkles size={14} className="text-zinc-500" />
                New intake
              </button>

              <button
                type="button"
                onClick={() => navigate("/proposals/new")}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
              >
                <Plus size={14} />
                New proposal
              </button>
            </div>
          </motion.div>

          <div className="mt-8">
            <AICommandBar onSubmit={handleAIQuery} />
          </div>

          <AnimatePresence>
            {aiResult && (
              <AIResultPanel
                result={aiResult}
                onClose={() => setAiResult(null)}
              />
            )}
          </AnimatePresence>
        </section>

        {/* Workspace Metrics */}
        <motion.section variants={itemVariants} className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Workspace overview
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Core client operations at a glance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void refetchMetrics();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {metricsError ? (
            <ErrorState
              message={
                metricsError instanceof Error
                  ? metricsError.message
                  : "Failed to load dashboard metrics."
              }
              onRetry={() => refetchMetrics()}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {metricsLoading || !metrics ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <KPISkeleton key={index} />
                ))
              ) : (
                <>
                  <KPICard
                    index={0}
                    label="Active clients"
                    value={currentMetrics.activeClients}
                    icon={Users}
                    detail="Current client relationships"
                    onClick={() => navigate("/crm")}
                  />

                  <KPICard
                    index={1}
                    label="Open proposals"
                    value={currentMetrics.openProposals}
                    icon={FileText}
                    detail="Waiting for a decision"
                    onClick={() => navigate("/proposals")}
                  />

                  <KPICard
                    index={2}
                    label="Active projects"
                    value={currentMetrics.activeProjects}
                    icon={FolderKanban}
                    detail="Currently in delivery"
                    onClick={() => navigate("/projects")}
                  />

                  <KPICard
                    index={3}
                    label="Outstanding"
                    value={currentMetrics.outstandingInvoices}
                    prefix="$"
                    icon={CreditCard}
                    detail="Awaiting client payment"
                    onClick={() => navigate("/invoices")}
                  />
                </>
              )}
            </div>
          )}
        </motion.section>

        {/* Analytics */}
        <motion.section variants={itemVariants} className="mb-10">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Operations analytics
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Review the movement behind revenue, pipeline, clients, and
                delivery work.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setAnalyticsMode("revenue")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  analyticsMode === "revenue"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                Revenue & pipeline
              </button>

              <button
                type="button"
                onClick={() => setAnalyticsMode("workspace")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  analyticsMode === "workspace"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                Workspace growth
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {analyticsMode === "revenue"
                      ? "Revenue and pipeline"
                      : "Client and project activity"}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Current workspace snapshot
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  {analyticsMode === "revenue" ? (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-900" />
                        Revenue
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        Pipeline
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-900" />
                        Clients
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        Projects
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6">
                {analyticsMode === "revenue" ? (
                  <RevenueTrendChart data={growthData} />
                ) : (
                  <WorkspaceGrowthChart data={growthData} />
                )}
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Trend visualization is currently derived from your live
                workspace totals. Historical reporting can be added once the
                analytics API is available.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Pipeline composition
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  Where potential client value is sitting now.
                </p>
              </div>

              <PipelineDistribution data={pipelineBreakdown} />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Total pipeline
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {formatCurrency(currentMetrics.pipelineValue)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/proposals")}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
                >
                  Review proposals
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Attention and Quick Actions */}
        <motion.section
          variants={itemVariants}
          className="mb-10 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]"
        >
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Needs attention
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Important client work that may need your next action.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/activity")}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
              >
                View activity
                <ChevronRight size={14} />
              </button>
            </div>

            <AttentionList items={attentionItems} navigate={navigate} />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-900">
              Quick actions
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Start the next important action.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <QuickAction
                label="New AI Intake"
                icon={Sparkles}
                onClick={() => navigate("/ai-intake")}
              />

              <QuickAction
                label="Add client"
                icon={Building2}
                onClick={() => navigate("/crm")}
              />

              <QuickAction
                label="New proposal"
                icon={FileText}
                onClick={() => navigate("/proposals/new")}
              />

              <QuickAction
                label="Open projects"
                icon={KanbanSquare}
                onClick={() => navigate("/projects")}
              />

              <QuickAction
                label="Create invoice"
                icon={Receipt}
                onClick={() => navigate("/invoices/new")}
              />

              <QuickAction
                label="View analytics"
                icon={BarChart3}
                onClick={() => navigate("/analytics")}
              />
            </div>

            <div className="mt-7 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <Bot size={17} className="mt-0.5 shrink-0 text-zinc-500" />

                <div>
                  <p className="text-xs font-semibold text-zinc-800">
                    Reluno keeps your client workflow connected.
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    Capture context once, then carry it through client records,
                    proposals, projects, invoices, and the Client Portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Activity + Workspace Health */}
        <motion.section
          variants={itemVariants}
          className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]"
        >
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Recent activity
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  What changed in your workspace.
                </p>
              </div>

              {activeActivity.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate("/activity")}
                  className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  View all
                </button>
              )}
            </div>

            <div className="divide-y divide-zinc-50 px-5">
              {activityError ? (
                <ErrorState
                  message={
                    activityError instanceof Error
                      ? activityError.message
                      : "Failed to load activity feed."
                  }
                  onRetry={() => refetchActivity()}
                />
              ) : activityLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <ActivitySkeleton key={index} />
                ))
              ) : activeActivity.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                    <Clock size={20} className="text-zinc-400" />
                  </div>

                  <p className="text-sm font-semibold text-zinc-500">
                    No activity yet
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    Activity across your clients and projects will appear here.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {activeActivity.slice(0, 7).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm font-semibold text-zinc-900">
              Workspace health
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              A quick view of operational momentum.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">
                    Client capacity
                  </span>

                  <span className="text-zinc-400">
                    {currentMetrics.activeClients} active clients
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(8, currentMetrics.activeClients * 10)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">
                    Proposal pipeline
                  </span>

                  <span className="text-zinc-400">
                    {currentMetrics.openProposals} open
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(8, currentMetrics.openProposals * 15)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">
                    Project delivery
                  </span>

                  <span className="text-zinc-400">
                    {currentMetrics.activeProjects} active
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(8, currentMetrics.activeProjects * 12)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700">
                    Payment follow-up
                  </span>

                  <span className="text-zinc-400">
                    {formatCompactCurrency(currentMetrics.outstandingInvoices)}{" "}
                    outstanding
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-400"
                    style={{
                      width: `${Math.min(
                        100,
                        currentMetrics.outstandingInvoices > 0 ? 68 : 8
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={15}
                  className="mt-0.5 shrink-0 text-zinc-500"
                />

                <div>
                  <p className="text-xs font-semibold text-zinc-800">
                    Keep the next action visible.
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                    Use Projects, Invoices, and AI Intake to keep client work
                    moving without rebuilding context across tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;