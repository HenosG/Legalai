import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FolderKanban,
  ListTodo,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  TriangleAlert,
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
import ProjectCard, {
  ProjectListItem,
} from "../components/projects/ProjectCard";
import CreateProjectDialog from "../components/projects/CreateProjectDialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectStatus =
  | "all"
  | "ACTIVE"
  | "AT_RISK"
  | "ON_HOLD"
  | "COMPLETED";

interface ProjectListItemWithOptionalDates extends ProjectListItem {
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  dueDate?: string;
  endDate?: string;
  startDate?: string;
  health?: string;
  upcomingTaskCount?: number;
  openTaskCount?: number;
  completedTaskCount?: number;
  totalTaskCount?: number;
  client?: {
    id?: string;
    name?: string;
    company?: string;
  };
}

interface ProjectStats {
  total: number;
  active: number;
  atRisk: number;
  onHold: number;
  completed: number;
  dueThisWeek: number;
  completedThisMonth: number;
  activeTaskCount: number;
}

interface StatusChartPoint {
  label: string;
  value: number;
  color: string;
}

interface TrendChartPoint {
  label: string;
  projects: number;
}

const STATUS_TABS: {
  value: ProjectStatus;
  label: string;
}[] = [
  { value: "all", label: "All projects" },
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At risk" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "COMPLETED", label: "Completed" },
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
  return String(status || "ACTIVE")
    .trim()
    .toUpperCase();
}

function normalizeHealth(health?: string) {
  return String(health || "")
    .trim()
    .toUpperCase();
}

function getDateValue(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function isSameMonth(date: Date, referenceDate: Date) {
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

function isWithinNextSevenDays(date: Date) {
  const now = new Date();
  const weekFromNow = new Date();

  now.setHours(0, 0, 0, 0);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  weekFromNow.setHours(23, 59, 59, 999);

  return date >= now && date <= weekFromNow;
}

function getProjectDate(project: ProjectListItemWithOptionalDates) {
  return (
    getDateValue(project.createdAt) ||
    getDateValue(project.updatedAt) ||
    getDateValue(project.startDate) ||
    null
  );
}

function buildProjectTrendData(
  projects: ProjectListItemWithOptionalDates[]
): TrendChartPoint[] {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

    return {
      date,
      label: date.toLocaleDateString("en-CA", {
        month: "short",
      }),
      projects: 0,
    };
  });

  const datedProjects = projects
    .map((project) => ({
      project,
      date: getProjectDate(project),
    }))
    .filter(
      (
        item
      ): item is {
        project: ProjectListItemWithOptionalDates;
        date: Date;
      } => Boolean(item.date)
    );

  if (!datedProjects.length) {
    const total = projects.length;

    return months.map((month, index) => ({
      label: month.label,
      projects:
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
      projects: datedProjects.filter(
        ({ date }) => date.getTime() <= monthEnd.getTime()
      ).length,
    };
  });
}

function getProjectSearchText(project: ProjectListItemWithOptionalDates) {
  const projectRecord = project as ProjectListItemWithOptionalDates & {
    name?: string;
    description?: string;
    clientName?: string;
  };

  return [
    projectRecord.name,
    projectRecord.title,
    projectRecord.description,
    projectRecord.clientName,
    projectRecord.client?.name,
    projectRecord.client?.company,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// ─── Components ──────────────────────────────────────────────────────────────

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
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="mt-5 h-8 w-14 animate-pulse rounded bg-zinc-100" />
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="h-[210px] animate-pulse rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-3.5 w-24 rounded bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>

      <div className="mt-5 h-4 w-4/5 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100" />
      <div className="mt-5 h-2 w-full rounded-full bg-zinc-100" />

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
        Could not load projects
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
        {hasSearchOrFilter ? <Search size={20} /> : <FolderKanban size={20} />}
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-800">
        {hasSearchOrFilter ? "No matching projects" : "No projects yet"}
      </p>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {hasSearchOrFilter
          ? "Try changing the status filter or search for a different project."
          : "Start a project manually or create one once a proposal is signed."}
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
          Create project
        </button>
      )}
    </div>
  );
}

function ProjectStatusChart({
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
          label: "No projects",
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
                  `${Number(value || 0)} project${
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
            Projects
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
            Start delivery work to view status.
          </p>
        )}
      </div>
    </div>
  );
}

function ProjectTrendChart({
  data,
}: {
  data: TrendChartPoint[];
}) {
  const hasData = data.some((item) => item.projects > 0);

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
            `${Number(value || 0)} project${
              Number(value || 0) === 1 ? "" : "s"
            }`,
            "Total projects",
          ]}
        />

        <Bar
          dataKey="projects"
          radius={[5, 5, 0, 0]}
          fill={hasData ? "#18181b" : "#e4e4e7"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Projects() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [projects, setProjects] = useState<ProjectListItemWithOptionalDates[]>(
    []
  );
  const [allProjects, setAllProjects] = useState<
    ProjectListItemWithOptionalDates[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<ProjectStatus>("all");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const api = useCallback(
    async () => createApiClient(await getToken()),
    [getToken]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const loadAllProjects = useCallback(async () => {
    const response = await (
      await api()
    ).get<{ projects: ProjectListItemWithOptionalDates[] }>("/api/projects");

    return response.projects || [];
  }, [api]);

  const load = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const params = new URLSearchParams();

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const query = params.toString();
        const filteredEndpoint = query
          ? `/api/projects?${query}`
          : "/api/projects";

        const [filteredResponse, fullProjectList] = await Promise.all([
          (
            await api()
          ).get<{ projects: ProjectListItemWithOptionalDates[] }>(
            filteredEndpoint
          ),
          loadAllProjects(),
        ]);

        setProjects(filteredResponse.projects || []);
        setAllProjects(fullProjectList);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load projects."
        );

        setProjects([]);
        setAllProjects([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [api, debouncedSearch, loadAllProjects, statusFilter]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const filteredProjects = useMemo(() => {
    if (!debouncedSearch) return projects;

    const query = debouncedSearch.toLowerCase();

    return projects.filter((project) =>
      getProjectSearchText(project).includes(query)
    );
  }, [debouncedSearch, projects]);

  const metrics = useMemo<ProjectStats>(() => {
    const now = new Date();

    const active = allProjects.filter(
      (project) => normalizeStatus(project.status) === "ACTIVE"
    );

    const atRisk = allProjects.filter((project) => {
      const status = normalizeStatus(project.status);
      const health = normalizeHealth(project.health);

      return (
        status === "AT_RISK" ||
        health === "AT_RISK" ||
        health === "OFF_TRACK"
      );
    });

    const onHold = allProjects.filter(
      (project) => normalizeStatus(project.status) === "ON_HOLD"
    );

    const completed = allProjects.filter(
      (project) => normalizeStatus(project.status) === "COMPLETED"
    );

    const dueThisWeek = allProjects.filter((project) => {
      const dueDate = getDateValue(project.dueDate || project.endDate);

      return dueDate ? isWithinNextSevenDays(dueDate) : false;
    }).length;

    const completedThisMonth = completed.filter((project) => {
      const completedDate =
        getDateValue(project.completedAt) ||
        getDateValue(project.updatedAt);

      return completedDate ? isSameMonth(completedDate, now) : false;
    }).length;

    const activeTaskCount = allProjects.reduce((total, project) => {
      const taskCount =
        Number(project.upcomingTaskCount || 0) ||
        Number(project.openTaskCount || 0);

      return total + taskCount;
    }, 0);

    return {
      total: allProjects.length,
      active: active.length,
      atRisk: atRisk.length,
      onHold: onHold.length,
      completed: completed.length,
      dueThisWeek,
      completedThisMonth,
      activeTaskCount,
    };
  }, [allProjects]);

  const statusChartData = useMemo<StatusChartPoint[]>(
    () => [
      {
        label: "Active",
        value: metrics.active,
        color: "#18181b",
      },
      {
        label: "At risk",
        value: metrics.atRisk,
        color: "#71717a",
      },
      {
        label: "On hold",
        value: metrics.onHold,
        color: "#a1a1aa",
      },
      {
        label: "Completed",
        value: metrics.completed,
        color: "#d4d4d8",
      },
    ],
    [metrics.active, metrics.atRisk, metrics.completed, metrics.onHold]
  );

  const trendChartData = useMemo(
    () => buildProjectTrendData(allProjects),
    [allProjects]
  );

  const completedRate =
    metrics.total > 0
      ? Math.round((metrics.completed / metrics.total) * 100)
      : 0;

  const handleCreated = async () => {
    setCreateOpen(false);
    toast.success("Project created.");

    await load(true);
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
              Client delivery and project operations
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Projects
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Track delivery across active engagements, keep work moving, and
              identify the projects that need attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/proposals")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <ArrowUpRight size={14} className="text-zinc-500" />
              View proposals
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
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Plus size={14} />
              New project
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
                label="Active projects"
                value={metrics.active}
                icon={FolderKanban}
                loading={false}
                onClick={() => setStatusFilter("ACTIVE")}
              />

              <MetricCard
                label="At risk"
                value={metrics.atRisk}
                icon={TriangleAlert}
                loading={false}
                onClick={() => setStatusFilter("AT_RISK")}
              />

              <MetricCard
                label="Due this week"
                value={metrics.dueThisWeek}
                icon={Clock}
                loading={false}
                onClick={() => setStatusFilter("ACTIVE")}
              />

              <MetricCard
                label="Completed"
                value={metrics.completed}
                icon={CheckCircle2}
                loading={false}
                onClick={() => setStatusFilter("COMPLETED")}
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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects or client names…"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-[13px] text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label="Clear project search"
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
                    {filteredProjects.length}
                  </span>{" "}
                  project{filteredProjects.length === 1 ? "" : "s"}
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

        {/* Project Grid */}
        <motion.section variants={itemVariants}>
          {error ? (
            <ErrorState message={error} onRetry={() => void load()} />
          ) : loading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              hasSearchOrFilter={hasSearchOrFilter}
              onClear={clearFilters}
              onCreate={() => setCreateOpen(true)}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/projects/${project.id}`)}
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
                Delivery insights
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                See delivery volume, project health, and the balance of work
                across your active engagements.
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
                    Project volume
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Cumulative projects created over the latest six months.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <TrendingUp size={14} />
                  {metrics.total} total projects
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <ProjectTrendChart data={trendChartData} />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Project volume is calculated from creation dates when available.
                If your list API does not return dates, this chart uses the
                current workspace snapshot.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Delivery health
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  Current balance of active delivery, at-risk work, paused
                  projects, and completed engagements.
                </p>
              </div>

              <ProjectStatusChart
                data={statusChartData}
                total={metrics.total}
              />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Completion rate
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {completedRate}%
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  {metrics.total === 0
                    ? "Create a project to start tracking delivery outcomes."
                    : `${metrics.completed} of ${metrics.total} project${
                        metrics.total === 1 ? "" : "s"
                      } are complete. ${
                        metrics.atRisk > 0
                          ? `${metrics.atRisk} need${
                              metrics.atRisk === 1 ? "s" : ""
                            } attention.`
                          : "No projects are currently marked at risk."
                      }`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Workflow Hint */}
        <motion.section variants={itemVariants} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <ListTodo size={16} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-xs font-semibold text-zinc-800">
                Keep delivery work connected.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Convert signed proposals into projects, track progress and
                tasks, then invoice completed work without rebuilding client
                context.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}