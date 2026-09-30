import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Send,
  TrendingUp,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";
import ProposalCard from "../components/proposals/ProposalCard";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Proposal {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  amount: number;
  status: string;
  documentUrl?: string;
  scopeOfWork?: any;
  timeline?: any;
  pricing?: any;
  terms?: any;
  caseStudies?: string[];
  testimonials?: string[];
  version?: number;
  sentAt?: string;
  viewedAt?: string;
  signedAt?: string;
  rejectedAt?: string;
  expiredAt?: string;
  sentCount?: number;
  viewedCount?: number;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  };
}

type ProposalStatus =
  | "all"
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "rejected"
  | "expired";

interface ProposalStats {
  total: number;
  drafts: number;
  active: number;
  signed: number;
  pipelineValue: number;
  signedValue: number;
}

interface StatusChartPoint {
  label: string;
  value: number;
  color: string;
}

interface TrendChartPoint {
  label: string;
  proposals: number;
}

const STATUS_TABS: {
  value: ProposalStatus;
  label: string;
}[] = [
  { value: "all", label: "All proposals" },
  { value: "draft", label: "Drafts" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "signed", label: "Signed" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

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
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeStatus(status?: string) {
  return String(status || "draft")
    .trim()
    .toLowerCase();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatCompactCurrency(value: number) {
  const safeValue = Number(value || 0);

  if (safeValue >= 1000000) {
    return `$${(safeValue / 1000000).toFixed(1)}M`;
  }

  if (safeValue >= 1000) {
    return `$${(safeValue / 1000).toFixed(1)}k`;
  }

  return `$${Math.round(safeValue)}`;
}

function getProposalDate(proposal: Proposal) {
  const value =
    proposal.createdAt ||
    proposal.updatedAt ||
    proposal.sentAt ||
    proposal.viewedAt ||
    proposal.signedAt ||
    null;

  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function buildProposalTrendData(proposals: Proposal[]): TrendChartPoint[] {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

    return {
      date,
      label: date.toLocaleDateString("en-CA", {
        month: "short",
      }),
      proposals: 0,
    };
  });

  const datedProposals = proposals
    .map((proposal) => ({
      proposal,
      date: getProposalDate(proposal),
    }))
    .filter(
      (
        item
      ): item is {
        proposal: Proposal;
        date: Date;
      } => Boolean(item.date)
    );

  if (!datedProposals.length) {
    const total = proposals.length;

    return months.map((month, index) => ({
      label: month.label,
      proposals:
        index === months.length - 1
          ? total
          : Math.max(0, Math.round((total / 6) * (index + 1))),
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
      proposals: datedProposals.filter(
        ({ date }) => date.getTime() <= monthEnd.getTime()
      ).length,
    };
  });
}

function getStatusStyle(status: string) {
  switch (normalizeStatus(status)) {
    case "signed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "sent":
    case "viewed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "draft":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "rejected":
    case "expired":
      return "border-zinc-200 bg-zinc-100 text-zinc-500";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600";
  }
}

// ─── Components ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  prefix,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  prefix?: string;
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
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-zinc-100" />
      ) : (
        <p className="mt-4 font-serif text-3xl font-bold leading-none tracking-tight text-zinc-900">
          {prefix === "$"
            ? formatCompactCurrency(value)
            : value.toLocaleString()}
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
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="mt-5 h-8 w-20 animate-pulse rounded bg-zinc-100" />
    </div>
  );
}

function ProposalCardSkeleton() {
  return (
    <div className="h-[210px] animate-pulse rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-3.5 w-24 rounded bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>

      <div className="mt-5 h-4 w-4/5 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100" />
      <div className="mt-5 h-7 w-24 rounded bg-zinc-100" />

      <div className="mt-6 flex gap-2">
        <div className="h-8 w-20 rounded-lg bg-zinc-100" />
        <div className="h-8 w-20 rounded-lg bg-zinc-100" />
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
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600">
        <AlertCircle size={20} />
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-800">
        Could not load proposals
      </p>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}

function EmptyState({
  hasSearchOrFilter,
  onClear,
  onCreate,
}: {
  hasSearchOrFilter: boolean;
  onClear: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        {hasSearchOrFilter ? <Search size={20} /> : <FileText size={20} />}
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-800">
        {hasSearchOrFilter ? "No matching proposals" : "No proposals yet"}
      </p>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {hasSearchOrFilter
          ? "Try changing the status filter or search for a different proposal."
          : "Create a proposal manually or turn an accepted AI Intake into one."}
      </p>

      {hasSearchOrFilter ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          <X size={14} />
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          <Plus size={14} />
          Create proposal
        </button>
      )}
    </div>
  );
}

function ProposalStatusChart({
  data,
  total,
}: {
  data: StatusChartPoint[];
  total: number;
}) {
  const activeData = data.filter((item) => item.value > 0);
  const hasData = activeData.length > 0;

  const chartData = hasData
    ? activeData
    : [
        {
          label: "No proposals",
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
                  `${Number(value || 0)} proposal${
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
            Proposals
          </span>

          <span className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900">
            {total}
          </span>
        </div>
      </div>

      <div className="min-w-[132px] space-y-3">
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
            Proposal stages will appear here once added.
          </p>
        )}
      </div>
    </div>
  );
}

function ProposalTrendChart({
  data,
}: {
  data: TrendChartPoint[];
}) {
  const hasData = data.some((item) => item.proposals > 0);

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
            `${Number(value || 0)} proposal${
              Number(value || 0) === 1 ? "" : "s"
            }`,
            "Total proposals",
          ]}
        />

        <Bar
          dataKey="proposals"
          radius={[5, 5, 0, 0]}
          fill={hasData ? "#18181b" : "#e4e4e7"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Proposals() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<ProposalStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actingOn, setActingOn] = useState<Record<string, string>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);

  const getApi = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const loadAllProposals = useCallback(async () => {
    const client = await getApi();
    const response = await client.get<{ proposals: Proposal[] }>(
      "/api/proposals"
    );

    return response.proposals || [];
  }, [getApi]);

  const load = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const client = await getApi();

        const endpoint =
          statusFilter !== "all"
            ? `/api/proposals?status=${encodeURIComponent(statusFilter)}`
            : "/api/proposals";

        const [filteredResponse, fullProposalList] = await Promise.all([
          client.get<{ proposals: Proposal[] }>(endpoint),
          loadAllProposals(),
        ]);

        setProposals(filteredResponse.proposals || []);
        setAllProposals(fullProposalList);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load proposals."
        );

        setProposals([]);
        setAllProposals([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getApi, loadAllProposals, statusFilter]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return proposals;

    const query = debouncedSearch.toLowerCase();

    return proposals.filter((proposal) => {
      return (
        proposal.title?.toLowerCase().includes(query) ||
        proposal.client?.name?.toLowerCase().includes(query) ||
        proposal.client?.company?.toLowerCase().includes(query) ||
        proposal.client?.email?.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearch, proposals]);

  const stats = useMemo<ProposalStats>(() => {
    const drafts = allProposals.filter(
      (proposal) => normalizeStatus(proposal.status) === "draft"
    );

    const active = allProposals.filter((proposal) => {
      const status = normalizeStatus(proposal.status);

      return status === "draft" || status === "sent" || status === "viewed";
    });

    const signed = allProposals.filter(
      (proposal) => normalizeStatus(proposal.status) === "signed"
    );

    return {
      total: allProposals.length,
      drafts: drafts.length,
      active: active.length,
      signed: signed.length,
      pipelineValue: active.reduce(
        (total, proposal) => total + Number(proposal.amount || 0),
        0
      ),
      signedValue: signed.reduce(
        (total, proposal) => total + Number(proposal.amount || 0),
        0
      ),
    };
  }, [allProposals]);

  const statusChartData = useMemo<StatusChartPoint[]>(() => {
    const drafts = allProposals.filter(
      (proposal) => normalizeStatus(proposal.status) === "draft"
    ).length;

    const sent = allProposals.filter((proposal) => {
      const status = normalizeStatus(proposal.status);

      return status === "sent" || status === "viewed";
    }).length;

    const signed = allProposals.filter(
      (proposal) => normalizeStatus(proposal.status) === "signed"
    ).length;

    const closed = allProposals.filter((proposal) => {
      const status = normalizeStatus(proposal.status);

      return status === "rejected" || status === "expired";
    }).length;

    return [
      {
        label: "Drafts",
        value: drafts,
        color: "#18181b",
      },
      {
        label: "Sent / viewed",
        value: sent,
        color: "#71717a",
      },
      {
        label: "Signed",
        value: signed,
        color: "#a1a1aa",
      },
      {
        label: "Closed",
        value: closed,
        color: "#d4d4d8",
      },
    ];
  }, [allProposals]);

  const trendChartData = useMemo(
    () => buildProposalTrendData(allProposals),
    [allProposals]
  );

  const winRate =
    allProposals.length > 0
      ? Math.round((stats.signed / allProposals.length) * 100)
      : 0;

  const handleSend = async (proposal: Proposal) => {
    setActingOn((previous) => ({
      ...previous,
      [proposal.id]: "send",
    }));

    try {
      const client = await getApi();

      await client.post(`/api/proposals/${proposal.id}/send`, {
        clientEmail: proposal.client?.email,
      });

      toast.success("Proposal sent successfully.");

      await load(true);
    } catch (requestError) {
      console.error("Error sending proposal:", requestError);

      toast.error(
        `Failed to send proposal: ${
          requestError instanceof Error
            ? requestError.message
            : "Unknown error"
        }`
      );
    } finally {
      setActingOn((previous) => {
        const next = { ...previous };
        delete next[proposal.id];
        return next;
      });
    }
  };

  const handleDuplicate = async (proposal: Proposal) => {
    setActingOn((previous) => ({
      ...previous,
      [proposal.id]: "duplicate",
    }));

    try {
      const client = await getApi();

      const created = await client.post<Proposal>("/api/proposals", {
        clientId: proposal.clientId,
        title: `${proposal.title} (Copy)`,
        amount: proposal.amount,
        scopeOfWork: proposal.scopeOfWork,
        timeline: proposal.timeline,
        pricing: proposal.pricing,
        terms: proposal.terms,
        caseStudies: proposal.caseStudies,
        testimonials: proposal.testimonials,
      });

      toast.success("Proposal duplicated successfully.");

      navigate(`/proposals/${created.id}`);
    } catch (requestError) {
      console.error("Error duplicating proposal:", requestError);

      toast.error(
        `Failed to duplicate proposal: ${
          requestError instanceof Error
            ? requestError.message
            : "Unknown error"
        }`
      );
    } finally {
      setActingOn((previous) => {
        const next = { ...previous };
        delete next[proposal.id];
        return next;
      });
    }
  };

  const handleDelete = async (proposal: Proposal) => {
    const confirmed = window.confirm(
      `Delete "${proposal.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setActingOn((previous) => ({
      ...previous,
      [proposal.id]: "delete",
    }));

    try {
      const client = await getApi();

      await client.delete(`/api/proposals/${proposal.id}`);

      toast.success("Proposal deleted successfully.");

      await load(true);
    } catch (requestError) {
      console.error("Error deleting proposal:", requestError);

      toast.error(
        `Failed to delete proposal: ${
          requestError instanceof Error
            ? requestError.message
            : "Unknown error"
        }`
      );
    } finally {
      setActingOn((previous) => {
        const next = { ...previous };
        delete next[proposal.id];
        return next;
      });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const hasSearchOrFilter =
    Boolean(search.trim()) || statusFilter !== "all";

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

        .hide-scrollbar {
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
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
              Sales documents and client approvals
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Proposals
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Create client-ready proposals, follow the approval process, and
              keep your active pipeline visible.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/ai-intake")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <ArrowUpRight size={14} className="text-zinc-500" />
              New intake
            </button>

            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : undefined}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/proposals/new")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Plus size={14} />
              New proposal
            </button>
          </div>
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
                label="Total proposals"
                value={stats.total}
                icon={FileText}
                loading={false}
                onClick={() => setStatusFilter("all")}
              />

              <MetricCard
                label="Drafts"
                value={stats.drafts}
                icon={Copy}
                loading={false}
                onClick={() => setStatusFilter("draft")}
              />

              <MetricCard
                label="Active pipeline"
                value={stats.active}
                icon={Send}
                loading={false}
                onClick={() => setStatusFilter("sent")}
              />

              <MetricCard
                label="Pipeline value"
                value={stats.pipelineValue}
                prefix="$"
                icon={TrendingUp}
                loading={false}
                onClick={() => setStatusFilter("all")}
              />
            </>
          )}
        </motion.section>

        {/* Search and Filters */}
        <motion.section variants={itemVariants} className="mb-6">
          <div className="rounded-xl border border-zinc-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/40 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full max-w-md">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search proposals, clients, or companies…"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-[13px] text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label="Clear proposal search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="hide-scrollbar -mx-1 overflow-x-auto px-1">
                <div className="inline-flex min-w-max items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
                  {STATUS_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setStatusFilter(tab.value)}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                        statusFilter === tab.value
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {!loading && (
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-xs text-zinc-500">
                  Showing{" "}
                  <span className="font-medium text-zinc-800">
                    {filtered.length}
                  </span>{" "}
                  proposal{filtered.length === 1 ? "" : "s"}
                  {statusFilter !== "all" && (
                    <>
                      {" "}
                      in{" "}
                      <span className="font-medium text-zinc-800">
                        {STATUS_TABS.find(
                          (item) => item.value === statusFilter
                        )?.label.toLowerCase()}
                      </span>
                    </>
                  )}
                </p>

                {hasSearchOrFilter && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    <X size={13} />
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Proposal Grid */}
        <motion.section variants={itemVariants}>
          {error ? (
            <ErrorState message={error} onRetry={() => void load()} />
          ) : loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProposalCardSkeleton key={index} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              hasSearchOrFilter={hasSearchOrFilter}
              onClear={clearFilters}
              onCreate={() => navigate("/proposals/new")}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onViewOrEdit={() => navigate(`/proposals/${proposal.id}`)}
                  onSend={() => void handleSend(proposal)}
                  onDuplicate={() => void handleDuplicate(proposal)}
                  onDelete={() => void handleDelete(proposal)}
                  actingOn={actingOn[proposal.id] || null}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Insights */}
        <motion.section variants={itemVariants} className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Proposal insights
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Monitor proposal activity, active pipeline, and the value moving
                toward a client decision.
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
                    Proposal volume
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Cumulative proposal records over the latest six months.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <TrendingUp size={14} />
                  {stats.total} total proposals
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <ProposalTrendChart data={trendChartData} />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Volume is calculated from proposal creation dates. It represents
                your workspace record history, not invoice revenue.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Proposal outcomes
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  The current balance of drafts, client-facing proposals, signed
                  work, and closed opportunities.
                </p>
              </div>

              <ProposalStatusChart
                data={statusChartData}
                total={stats.total}
              />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Signed rate
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {winRate}%
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  {stats.total === 0
                    ? "Create a proposal to start measuring approval outcomes."
                    : `${stats.signed} of ${stats.total} proposal${
                        stats.total === 1 ? "" : "s"
                      } have been signed, representing ${formatCurrency(
                        stats.signedValue
                      )} in signed work.`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Operational Hint */}
        <motion.section variants={itemVariants} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <Clock size={16} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-xs font-semibold text-zinc-800">
                Keep the next proposal action visible.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Draft a proposal, send it to the client, watch for views and
                signatures, then move approved work into Projects and Invoices.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}