import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
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
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";
import AIIntakeCard, { Intake } from "../components/AIIntakeCard";
import ActivityFeed, { ActivityEntry } from "../components/ActivityFeed";

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
      delayChildren: 0.05,
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

// ─── Types ───────────────────────────────────────────────────────────────────

type IntakeAction = "proposal" | "accept" | "reject";

interface IntakeStatusMetric {
  label: string;
  value: number;
  color: string;
}

interface IntakeChartPoint {
  label: string;
  intakes: number;
}

interface IntakeDateFields {
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeStatus(status?: string) {
  return String(status || "pending")
    .trim()
    .toUpperCase();
}

function getIntakeCreatedAt(intake: Intake) {
  const data = intake as Intake & IntakeDateFields;

  const possibleDate =
    data.createdAt ||
    data.created_at ||
    data.updatedAt ||
    data.updated_at ||
    null;

  if (!possibleDate) return null;

  const date = new Date(possibleDate);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function formatRelativeTime(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  const difference = Date.now() - date.getTime();
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function getIntakeSummary(intake: Intake) {
  const record = intake as Intake & {
    rawMessage?: string;
    message?: string;
    summary?: string;
    company?: string;
    name?: string;
  };

  return (
    record.summary ||
    record.rawMessage ||
    record.message ||
    record.company ||
    record.name ||
    "New intake inquiry"
  );
}

function formatStatusLabel(status?: string) {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "NEW":
      return "New";

    case "PENDING":
      return "Pending";

    case "REVIEW":
    case "IN_REVIEW":
      return "In review";

    case "ACCEPTED":
      return "Accepted";

    case "REJECTED":
      return "Rejected";

    case "PROPOSAL_CREATED":
    case "PROPOSAL":
      return "Proposal created";

    case "QUALIFIED":
      return "Qualified";

    default:
      return normalized
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}

function getStatusPillClass(status?: string) {
  const normalized = normalizeStatus(status);

  if (
    normalized === "ACCEPTED" ||
    normalized === "QUALIFIED" ||
    normalized === "PROPOSAL_CREATED"
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "REJECTED") {
    return "border-zinc-200 bg-zinc-100 text-zinc-500";
  }

  if (normalized === "REVIEW" || normalized === "IN_REVIEW") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function buildIntakeTrendData(intakes: Intake[]): IntakeChartPoint[] {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

    return {
      date,
      label: date.toLocaleDateString("en-CA", {
        month: "short",
      }),
      intakes: 0,
    };
  });

  const datedIntakes = intakes
    .map((intake) => ({
      intake,
      date: getIntakeCreatedAt(intake),
    }))
    .filter(
      (
        item
      ): item is {
        intake: Intake;
        date: Date;
      } => Boolean(item.date)
    );

  if (datedIntakes.length === 0) {
    const currentTotal = intakes.length;

    return months.map((month, index) => ({
      label: month.label,
      intakes:
        index === months.length - 1
          ? currentTotal
          : Math.max(0, Math.round((currentTotal / 6) * (index + 1))),
    }));
  }

  return months.map((month) => {
    const monthEnd = new Date(
      month.date.getFullYear(),
      month.date.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    return {
      label: month.label,
      intakes: datedIntakes.filter(
        ({ date }) => date.getTime() <= monthEnd.getTime()
      ).length,
    };
  });
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
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

      {loading ? (
        <div className="mt-4 h-8 w-16 animate-pulse rounded bg-zinc-100" />
      ) : (
        <p className="mt-4 font-serif text-3xl font-bold leading-none tracking-tight text-zinc-900">
          {value.toLocaleString()}
        </p>
      )}
    </>
  );

  if (!onClick) {
    return (
      <div className="group rounded-xl border border-zinc-200 bg-white p-4">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      {content}
    </button>
  );
}

function MetricSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="mt-5 h-8 w-14 animate-pulse rounded bg-zinc-100" />
    </div>
  );
}

function IntakeCardSkeleton() {
  return (
    <div className="h-[178px] animate-pulse rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-3.5 w-24 rounded bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>

      <div className="mt-5 h-4 w-4/5 rounded bg-zinc-100" />
      <div className="mt-3 h-3 w-full rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-3/4 rounded bg-zinc-100" />

      <div className="mt-6 flex gap-2">
        <div className="h-8 w-20 rounded-lg bg-zinc-100" />
        <div className="h-8 w-20 rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
}

function ErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />

        <div>
          <p className="text-xs font-semibold text-red-800">
            Unable to load AI Intake
          </p>

          <p className="mt-1 text-xs leading-5 text-red-700">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyIntakes({
  onFocusInput,
}: {
  onFocusInput: () => void;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        <Sparkles size={20} />
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-800">
        No intakes yet
      </p>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        Add an inquiry above to capture its details and move it into your client
        workflow.
      </p>

      <button
        type="button"
        onClick={onFocusInput}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        <Plus size={14} />
        Add an intake
      </button>
    </div>
  );
}

function IntakeStatusChart({
  data,
  total,
}: {
  data: IntakeStatusMetric[];
  total: number;
}) {
  const activeData = data.filter((item) => item.value > 0);
  const hasData = activeData.length > 0;

  const chartData = hasData
    ? activeData
    : [
        {
          label: "No intakes",
          value: 100,
          color: "#e4e4e7",
        },
      ];

  return (
    <div className="flex h-[250px] items-center gap-3">
      <div className="relative h-[230px] min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={hasData ? 3 : 0}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.label}-${index}`}
                  fill={entry.color || "#18181b"}
                />
              ))}
            </Pie>

            {hasData && (
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
                  `${Number(value || 0)} intake${
                    Number(value || 0) === 1 ? "" : "s"
                  }`,
                  name,
                ]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Intakes
          </span>

          <span className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900">
            {total}
          </span>
        </div>
      </div>

      <div className="min-w-[134px] space-y-3">
        {hasData ? (
          activeData.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="truncate text-[11px] font-medium text-zinc-600">
                  {item.label}
                </span>
              </div>

              <span className="text-[11px] font-semibold tabular-nums text-zinc-900">
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <p className="pr-3 text-[11px] leading-5 text-zinc-400">
Inquiries will appear here once added.          </p>
        )}
      </div>
    </div>
  );
}

function IntakeTrendChart({
  data,
}: {
  data: IntakeChartPoint[];
}) {
  const hasData = data.some((item) => item.intakes > 0);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 12,
          right: 6,
          left: -20,
          bottom: 0,
        }}
        barSize={28}
      >
        <CartesianGrid
          vertical={false}
          stroke="#e4e4e7"
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tick={{
            fill: "#a1a1aa",
            fontSize: 11,
          }}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          tick={{
            fill: "#a1a1aa",
            fontSize: 11,
          }}
        />

        <RechartsTooltip
          cursor={{
            fill: "rgba(0, 0, 0, 0.03)",
          }}
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #e4e4e7",
            backgroundColor: "#ffffff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            fontSize: "12px",
          }}
          formatter={(value: number | string) => [
            `${Number(value || 0)} intake${
              Number(value || 0) === 1 ? "" : "s"
            }`,
            "Total intakes",
          ]}
        />

        <Bar
          dataKey="intakes"
          radius={[5, 5, 0, 0]}
          fill={hasData ? "#18181b" : "#e4e4e7"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── AI Intake Page ──────────────────────────────────────────────────────────

export default function AIIntake() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const [inputValue, setInputValue] = useState(
    searchParams.get("query") ?? ""
  );
  const [inputFocused, setInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actingOn, setActingOn] = useState<Record<string, string>>({});

  const hasAutoSubmitted = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const api = useCallback(
    async () => createApiClient(await getToken()),
    [getToken]
  );

  const loadIntakes = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await (
          await api()
        ).get<{ intakes: Intake[] }>("/api/ai-intake");

        setIntakes(response.intakes || []);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load intake records."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api]
  );

  const loadActivity = useCallback(async () => {
    setActivityLoading(true);

    try {
      const response = await (
        await api()
      ).get<{ activities: ActivityEntry[] }>("/api/ai-intake/activity");

      setActivity(response.activities || []);
    } catch (requestError) {
      console.error("Error loading AI Intake activity:", requestError);
    } finally {
      setActivityLoading(false);
    }
  }, [api]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadIntakes(true), loadActivity()]);
  }, [loadActivity, loadIntakes]);

  const submitIntake = useCallback(
    async (rawMessage: string, channel = "manual") => {
      const message = rawMessage.trim();

      if (!message || submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        await (
          await api()
        ).post("/api/ai-intake", {
          rawMessage: message,
          channel,
        });

        setInputValue("");
        setSearchParams({}, { replace: true });

        await Promise.all([loadIntakes(true), loadActivity()]);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to submit inquiry."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [api, loadActivity, loadIntakes, setSearchParams, submitting]
  );

  useEffect(() => {
    void Promise.all([loadIntakes(), loadActivity()]);

    const interval = window.setInterval(() => {
      void loadActivity();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadActivity, loadIntakes]);

  useEffect(() => {
    const query = searchParams.get("query");

    if (query && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;

      void submitIntake(query, searchParams.get("channel") || "command");
    }
  }, [searchParams, submitIntake]);

  const handleAction = async (intake: Intake, action: IntakeAction) => {
    setActingOn((previous) => ({
      ...previous,
      [intake.id]: action,
    }));

    setError(null);

    try {
      if (action === "proposal") {
        const response = await (
          await api()
        ).post<any>(`/api/ai-intake/${intake.id}/proposal`, {});

        const proposalId =
          response?.proposal?.id || response?.id || response?.proposalId;

        if (proposalId) {
          navigate(`/proposals/${proposalId}`);
        } else {
          navigate("/proposals");
        }

        return;
      }

      if (action === "accept") {
        const response = await (
          await api()
        ).post<{ client: { id: string } }>(
          `/api/ai-intake/${intake.id}/accept`,
          {}
        );

        if (response?.client?.id) {
          navigate(`/crm/${response.client.id}`);
        } else {
          navigate("/crm");
        }

        return;
      }

      if (action === "reject") {
        await (await api()).post(`/api/ai-intake/${intake.id}/reject`, {});

        setIntakes((previous) =>
          previous.filter((item) => item.id !== intake.id)
        );

        await loadActivity();
      }
    } catch (requestError) {
      console.error(`AI Intake ${action} action failed:`, requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : `Failed to ${action} this intake.`
      );
    } finally {
      setActingOn((previous) => {
        const next = { ...previous };
        delete next[intake.id];
        return next;
      });
    }
  };

  const activeIntakes = useMemo(
    () =>
      intakes.filter(
        (intake) => normalizeStatus(intake.status) !== "REJECTED"
      ),
    [intakes]
  );

  const metrics = useMemo(() => {
    const pending = activeIntakes.filter((intake) => {
      const status = normalizeStatus(intake.status);

      return (
        status === "NEW" ||
        status === "PENDING" ||
        status === "REVIEW" ||
        status === "IN_REVIEW"
      );
    }).length;

    const accepted = intakes.filter((intake) => {
      const status = normalizeStatus(intake.status);

      return status === "ACCEPTED" || status === "QUALIFIED";
    }).length;

    const proposals = intakes.filter((intake) => {
      const status = normalizeStatus(intake.status);

      return status === "PROPOSAL_CREATED" || status === "PROPOSAL";
    }).length;

    return {
      total: activeIntakes.length,
      pending,
      accepted,
      proposals,
    };
  }, [activeIntakes, intakes]);

  const statusChartData = useMemo<IntakeStatusMetric[]>(
    () => [
      {
        label: "Pending",
        value: metrics.pending,
        color: "#18181b",
      },
      {
        label: "Accepted",
        value: metrics.accepted,
        color: "#71717a",
      },
      {
        label: "Proposals",
        value: metrics.proposals,
        color: "#d4d4d8",
      },
    ],
    [metrics.accepted, metrics.pending, metrics.proposals]
  );

  const intakeTrendData = useMemo(
    () => buildIntakeTrendData(intakes),
    [intakes]
  );

  const acceptedRate =
    intakes.length > 0
      ? Math.round((metrics.accepted / intakes.length) * 100)
      : 0;

  const suggestions = [
    "I need a website redesign for my company",
    "We need help building a mobile app",
    "Looking for branding and product strategy",
  ];

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
        {/* Header */}
        <motion.section
          variants={itemVariants}
          className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-zinc-400">
              Lead intake and qualification
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              AI Intake
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Capture new opportunities, review their context, and turn
              qualified inquiries into clients or proposals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/crm")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Users size={14} className="text-zinc-500" />
              View clients
            </button>

            <button
              type="button"
              onClick={() => void refreshAll()}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : undefined}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </motion.section>

        {/* Intake Command Bar */}
        <motion.section variants={itemVariants} className="mb-10">
          <div
            className={cn(
              "relative max-w-4xl rounded-xl border bg-white transition-all duration-200",
              inputFocused
                ? "border-zinc-400 shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
                : "border-zinc-200 shadow-sm"
            )}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {submitting ? (
                <Loader2
                  size={17}
                  className="shrink-0 animate-spin text-zinc-400"
                />
              ) : (
                <Search size={17} className="shrink-0 text-zinc-400" />
              )}

              <input
                ref={inputRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 150)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void submitIntake(inputValue);
                  }
                }}
                disabled={submitting}
                placeholder="Paste a client inquiry or describe a new opportunity…"
                className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:opacity-60"
              />

              <span className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[10px] font-medium text-zinc-400 sm:inline-flex">
                Enter
              </span>

              <button
                type="button"
                onClick={() => void submitIntake(inputValue)}
                disabled={!inputValue.trim() || submitting}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all",
                  inputValue.trim() && !submitting
                    ? "bg-zinc-900 text-white hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-400"
                )}
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    Add
                    <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {inputFocused && !inputValue.trim() && !submitting && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-xl shadow-zinc-900/10"
                >
                  <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Example inquiries
                  </p>

                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => {
                        setInputValue(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      <Sparkles size={14} className="shrink-0 text-zinc-400" />
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-3 text-[11px] text-zinc-400">
            Add a raw lead message, a call note, or a client request. Review it
            below before turning it into a client or proposal.
          </p>

          {error && (
            <div className="mt-4 max-w-4xl">
              <ErrorNotice message={error} onRetry={() => void refreshAll()} />
            </div>
          )}
        </motion.section>

        {/* Metrics */}
        <motion.section
          variants={itemVariants}
          className="mb-10 grid grid-cols-2 gap-3 xl:grid-cols-4"
        >
          {loading ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                label="Open intakes"
                value={metrics.total}
                icon={Sparkles}
                loading={false}
                onClick={() => inputRef.current?.focus()}
              />

              <MetricCard
                label="Pending review"
                value={metrics.pending}
                icon={Clock}
                loading={false}
                onClick={() => inputRef.current?.focus()}
              />

              <MetricCard
                label="Accepted"
                value={metrics.accepted}
                icon={CheckCircle2}
                loading={false}
                onClick={() => navigate("/crm")}
              />

              <MetricCard
                label="Proposals created"
                value={metrics.proposals}
                icon={FileText}
                loading={false}
                onClick={() => navigate("/proposals")}
              />
            </>
          )}
        </motion.section>

        {/* Intake Feed + Activity */}
        <motion.section
          variants={itemVariants}
          className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]"
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Recent intakes
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Review and move qualified opportunities forward.
                </p>
              </div>

              {activeIntakes.length > 10 && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  View all
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <IntakeCardSkeleton key={index} />
                ))}
              </div>
            ) : activeIntakes.length === 0 ? (
              <EmptyIntakes
                onFocusInput={() => {
                  inputRef.current?.focus();
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {activeIntakes.slice(0, 10).map((intake) => (
                  <AIIntakeCard
                    key={intake.id}
                    intake={intake}
                    onReview={() => navigate(`/ai-intake/${intake.id}`)}
                    onProposal={() => void handleAction(intake, "proposal")}
                    onAccept={() => void handleAction(intake, "accept")}
                    onReject={() => void handleAction(intake, "reject")}
                    actingOn={actingOn[intake.id] || null}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-zinc-900">
                Live activity
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                The latest changes across intake processing.
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <ActivityFeed entries={activity} loading={activityLoading} />
            </div>
          </div>
        </motion.section>

{/* Insights */}
<motion.section variants={itemVariants} className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Intake insights
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Track the current intake mix and how new opportunities are
                entering your workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
            >
              View analytics
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Intake volume
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Cumulative intake records over the latest six months.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <TrendingUp size={14} />
                  {intakes.length} total records
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <IntakeTrendChart data={intakeTrendData} />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Volume is based on intake creation dates when the API provides
                them. Otherwise, this is a workspace snapshot.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Intake outcomes
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  The current balance between work awaiting review and completed
                  next steps.
                </p>
              </div>

              <IntakeStatusChart
                data={statusChartData}
                total={metrics.total}
              />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Accepted rate
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {acceptedRate}%
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  {intakes.length === 0
                    ? "Submit an inquiry to begin tracking qualification outcomes."
                    : `${metrics.accepted} of ${intakes.length} intake${
                        intakes.length === 1 ? "" : "s"
                      } have been accepted into your workflow.`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Helpful Workflow Note */}
        <motion.section variants={itemVariants} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <Activity size={16} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-xs font-semibold text-zinc-800">
                A simple intake workflow.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Submit an inquiry, review the captured details, accept it into
                CRM, or create a proposal directly from the intake record.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}