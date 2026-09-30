import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  UserX,
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
import { clientsApi, Client } from "../lib/api";
import ClientDrawer from "../components/ClientDrawer";

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

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientStats {
  total: number;
  leads: number;
  active: number;
  inactive: number;
}

type ClientStatusFilter = "all" | "lead" | "active" | "inactive";

interface StatusChartPoint {
  name: string;
  value: number;
  color: string;
}

interface GrowthChartPoint {
  label: string;
  clients: number;
}

const STATUS_TABS: {
  value: ClientStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All clients" },
  { value: "lead", label: "Leads" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const safeName = name?.trim() || "Client";

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "lead":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "inactive":
      return "border-zinc-200 bg-zinc-100 text-zinc-600";

    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-600";
  }
}

function getClientSubtitle(client: Client) {
  if (client.company) return client.company;
  if (client.title) return client.title;
  return "Independent";
}

function getClientCreatedAt(client: Client) {
  const possibleValue =
    (client as Client & { createdAt?: string }).createdAt ||
    (client as Client & { created_at?: string }).created_at ||
    (client as Client & { updatedAt?: string }).updatedAt;

  if (!possibleValue) return null;

  const date = new Date(possibleValue);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-CA", {
    month: "short",
  });
}

function buildClientGrowthData(clients: Client[]): GrowthChartPoint[] {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: formatMonthLabel(date),
      date,
      clients: 0,
    };
  });

  const createdClients = clients
    .map((client) => ({
      client,
      createdAt: getClientCreatedAt(client),
    }))
    .filter(
      (
        entry
      ): entry is {
        client: Client;
        createdAt: Date;
      } => Boolean(entry.createdAt)
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  if (!createdClients.length) {
    const total = clients.length;

    return months.map((month, index) => ({
      label: month.label,
      clients:
        index === months.length - 1
          ? total
          : Math.max(0, Math.round((total / months.length) * (index + 1))),
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

    const clientCount = createdClients.filter(
      ({ createdAt }) => createdAt.getTime() <= monthEnd.getTime()
    ).length;

    return {
      label: month.label,
      clients: clientCount,
    };
  });
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
      <motion.div
        variants={itemVariants}
        className="group rounded-xl border border-zinc-200 bg-white p-4"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      variants={itemVariants}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
    >
      {content}
    </motion.button>
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

function ClientRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-100" />

          <div>
            <div className="h-3.5 w-28 rounded bg-zinc-100" />
            <div className="mt-2 h-3 w-20 rounded bg-zinc-100" />
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="h-3.5 w-36 rounded bg-zinc-100" />
        <div className="mt-2 h-3 w-24 rounded bg-zinc-100" />
      </td>

      <td className="px-4 py-4">
        <div className="h-6 w-16 rounded-full bg-zinc-100" />
      </td>

      <td className="px-4 py-4">
        <div className="h-5 w-20 rounded bg-zinc-100" />
      </td>

      <td className="px-6 py-4 text-right">
        <div className="ml-auto h-8 w-8 rounded bg-zinc-100" />
      </td>
    </tr>
  );
}

function ClientActionMenu({
  client,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const positionMenu = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setCoords({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      positionMenu();
    }

    setIsOpen((current) => !current);
  };

  const handleStatusToggle = () => {
    const nextStatus = client.status === "active" ? "inactive" : "active";

    setIsOpen(false);
    onStatusChange(client.id, nextStatus);
  };

  return (
    <div className="inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        aria-label={`Actions for ${client.name}`}
        aria-expanded={isOpen}
      >
        <MoreVertical size={16} />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -4 }}
                transition={{ duration: 0.14 }}
                style={{
                  top: coords.top,
                  right: coords.right,
                }}
                className="fixed z-[9999] w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl shadow-zinc-900/10"
              >
                <div className="border-b border-zinc-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Client actions
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onEdit(client);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Edit3 size={14} className="text-zinc-400" />
                  Edit client
                </button>

                <button
                  type="button"
                  onClick={handleStatusToggle}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <CheckCircle2 size={14} className="text-zinc-400" />
                  {client.status === "active"
                    ? "Mark inactive"
                    : "Mark active"}
                </button>

                <div className="my-1 h-px bg-zinc-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);

                    const confirmed = window.confirm(
                      `Delete ${client.name}? This cannot be undone.`
                    );

                    if (confirmed) {
                      onDelete(client.id);
                    }
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete client
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function EmptyClientsState({
  onCreate,
  hasSearchOrFilter,
  onClear,
}: {
  onCreate: () => void;
  hasSearchOrFilter: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        {hasSearchOrFilter ? <Search size={20} /> : <Users size={20} />}
      </div>

      <p className="mt-4 text-sm font-semibold text-zinc-800">
        {hasSearchOrFilter ? "No matching clients" : "No clients yet"}
      </p>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {hasSearchOrFilter
          ? "Try changing your search or filters to find a different client."
          : "Add your first client to begin tracking contacts, opportunities, and delivery work."}
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
          Add first client
        </button>
      )}
    </div>
  );
}

function ClientStatusChart({
  data,
  total,
}: {
  data: StatusChartPoint[];
  total: number;
}) {
  const hasData = data.some((item) => item.value > 0);

  const chartData = hasData
    ? data.filter((item) => item.value > 0)
    : [
        {
          name: "No clients",
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
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={hasData ? 3 : 0}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.name}-${index}`}
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
                  `${Number(value || 0)} client${
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
            Clients
          </span>

          <span className="mt-1 font-serif text-2xl font-bold tracking-tight text-zinc-900">
            {total}
          </span>
        </div>
      </div>

      <div className="min-w-[132px] space-y-3">
        {hasData ? (
          data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="truncate text-[11px] font-medium text-zinc-600">
                  {item.name}
                </span>
              </div>

              <span className="text-[11px] font-semibold tabular-nums text-zinc-900">
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <p className="pr-3 text-[11px] leading-5 text-zinc-400">
            Add clients to see a breakdown of many records.
          </p>
        )}
      </div>
    </div>
  );
}

function ClientGrowthChart({ data }: { data: GrowthChartPoint[] }) {
  const hasClients = data.some((item) => item.clients > 0);

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
            `${Number(value || 0)} client${
              Number(value || 0) === 1 ? "" : "s"
            }`,
            "Total clients",
          ]}
        />

        <Bar
          dataKey="clients"
          radius={[5, 5, 0, 0]}
          fill={hasClients ? "#18181b" : "#e4e4e7"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── CRM Page ────────────────────────────────────────────────────────────────

export default function CRM() {
  const { isLoaded } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ClientStatusFilter>("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);

  const [stats, setStats] = useState<ClientStats>({
    total: 0,
    leads: 0,
    active: 0,
    inactive: 0,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const loadClients = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const [response, allResponse] = await Promise.all([
          clientsApi.getAll(debouncedSearch, statusFilter, page, 20),
          clientsApi.getAll("", "all", 1, 1000),
        ]);

        const clientList = response.clients || [];
        const completeClientList = allResponse.clients || [];

        setClients(clientList);
        setAllClients(completeClientList);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalClients(response.pagination?.total || 0);

        setStats({
          total: allResponse.pagination?.total || 0,
          leads: completeClientList.filter(
            (client) => client.status === "lead"
          ).length,
          active: completeClientList.filter(
            (client) => client.status === "active"
          ).length,
          inactive: completeClientList.filter(
            (client) => client.status === "inactive"
          ).length,
        });
      } catch (error) {
        console.error("Error loading clients:", error);

        setClients([]);
        setAllClients([]);
        setTotalPages(1);
        setTotalClients(0);
        setStats({
          total: 0,
          leads: 0,
          active: 0,
          inactive: 0,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, page, statusFilter]
  );

  useEffect(() => {
    if (!isLoaded) return;

    void loadClients();
  }, [isLoaded, loadClients]);

  const handleSaveClient = async (data: Partial<Client>) => {
    const payload = {
      name: data.name ?? "",
      company: data.company ?? null,
      email: data.email ?? "",
      phone: data.phone ?? null,
      title: data.title ?? null,
      status: data.status ?? "lead",
      tags: data.tags ?? [],
      metadata: data.metadata ?? {},
    };

    if (drawerMode === "create") {
      await clientsApi.create(payload);
    } else if (editingClient) {
      await clientsApi.update(editingClient.id, payload);
    }

    setDrawerOpen(false);
    setEditingClient(null);

    await loadClients(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientsApi.delete(id);

      if (clients.length === 1 && page > 1) {
        setPage((currentPage) => Math.max(1, currentPage - 1));
      }

      await loadClients(true);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleQuickStatusChange = async (id: string, status: string) => {
    try {
      await clientsApi.update(id, { status });
      await loadClients(true);
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  const openCreateDrawer = () => {
    setDrawerMode("create");
    setEditingClient(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (client: Client) => {
    setDrawerMode("edit");
    setEditingClient(client);
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const showingFrom =
    totalClients === 0 ? 0 : Math.min((page - 1) * 20 + 1, totalClients);

  const showingTo = Math.min(page * 20, totalClients);

  const hasSearchOrFilter = Boolean(search.trim()) || statusFilter !== "all";

  const statusChartData = useMemo<StatusChartPoint[]>(
    () => [
      {
        name: "Active",
        value: stats.active,
        color: "#18181b",
      },
      {
        name: "Leads",
        value: stats.leads,
        color: "#71717a",
      },
      {
        name: "Inactive",
        value: stats.inactive,
        color: "#d4d4d8",
      },
    ],
    [stats.active, stats.inactive, stats.leads]
  );

  const growthChartData = useMemo(
    () => buildClientGrowthData(allClients),
    [allClients]
  );

  const conversionRate =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

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
              Customer relationship management
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Clients
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              Keep client relationships, contact details, and opportunities
              organized in one place.
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
              onClick={() => void loadClients(true)}
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
              onClick={openCreateDrawer}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Plus size={14} />
              Add client
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
                label="Total clients"
                value={stats.total}
                icon={Users}
                loading={false}
                onClick={() => {
                  setStatusFilter("all");
                  setPage(1);
                }}
              />

              <MetricCard
                label="Leads"
                value={stats.leads}
                icon={UserPlus}
                loading={false}
                onClick={() => {
                  setStatusFilter("lead");
                  setPage(1);
                }}
              />

              <MetricCard
                label="Active clients"
                value={stats.active}
                icon={CheckCircle2}
                loading={false}
                onClick={() => {
                  setStatusFilter("active");
                  setPage(1);
                }}
              />

              <MetricCard
                label="Inactive"
                value={stats.inactive}
                icon={UserX}
                loading={false}
                onClick={() => {
                  setStatusFilter("inactive");
                  setPage(1);
                }}
              />
            </>
          )}
        </motion.section>

        {/* Client Directory */}
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
        >
          {/* Controls */}
          <div className="flex flex-col gap-4 border-b border-zinc-100 bg-zinc-50/40 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search clients, companies, or email…"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-[13px] text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Clear client search"
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
                    onClick={() => {
                      setStatusFilter(tab.value);
                      setPage(1);
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      statusFilter === tab.value
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-100 bg-white text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Tags</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <ClientRowSkeleton key={index} />
                  ))
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyClientsState
                        onCreate={openCreateDrawer}
                        hasSearchOrFilter={hasSearchOrFilter}
                        onClear={clearFilters}
                      />
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="group transition-colors hover:bg-zinc-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                            {getInitials(client.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-zinc-900">
                              {client.name}
                            </p>

                            <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                              {getClientSubtitle(client)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="min-w-[190px]">
                          <p className="flex items-center gap-1.5 truncate text-[12px] text-zinc-700">
                            <Mail size={12} className="shrink-0 text-zinc-400" />
                            {client.email || "No email"}
                          </p>

                          {client.phone && (
                            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <Phone
                                size={11}
                                className="shrink-0 text-zinc-400"
                              />
                              {client.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusStyle(
                            client.status
                          )}`}
                        >
                          {client.status || "unknown"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex max-w-[220px] flex-wrap gap-1">
                          {client.tags?.length ? (
                            <>
                              {client.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600"
                                >
                                  {tag}
                                </span>
                              ))}

                              {client.tags.length > 3 && (
                                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                                  +{client.tags.length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-zinc-400">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <ClientActionMenu
                          client={client}
                          onEdit={openEditDrawer}
                          onDelete={handleDeleteClient}
                          onStatusChange={handleQuickStatusChange}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="divide-y divide-zinc-100 lg:hidden">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-100" />

                    <div className="flex-1">
                      <div className="h-3.5 w-28 rounded bg-zinc-100" />
                      <div className="mt-2 h-3 w-40 rounded bg-zinc-100" />
                      <div className="mt-3 h-5 w-16 rounded-full bg-zinc-100" />
                    </div>
                  </div>
                </div>
              ))
            ) : clients.length === 0 ? (
              <EmptyClientsState
                onCreate={openCreateDrawer}
                hasSearchOrFilter={hasSearchOrFilter}
                onClear={clearFilters}
              />
            ) : (
              clients.map((client) => (
                <div key={client.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                      {getInitials(client.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-zinc-900">
                            {client.name}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                            {getClientSubtitle(client)}
                          </p>
                        </div>

                        <ClientActionMenu
                          client={client}
                          onEdit={openEditDrawer}
                          onDelete={handleDeleteClient}
                          onStatusChange={handleQuickStatusChange}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getStatusStyle(
                            client.status
                          )}`}
                        >
                          {client.status || "unknown"}
                        </span>

                        {client.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="flex items-center gap-1.5 truncate text-[11px] text-zinc-500">
                          <Mail size={12} className="shrink-0 text-zinc-400" />
                          {client.email || "No email"}
                        </p>

                        {client.phone && (
                          <p className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                            <Phone size={12} className="shrink-0" />
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && clients.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-500">
                Showing{" "}
                <span className="font-medium text-zinc-800">
                  {showingFrom}–{showingTo}
                </span>{" "}
                of{" "}
                <span className="font-medium text-zinc-800">
                  {totalClients}
                </span>{" "}
                clients
              </p>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <span className="min-w-[52px] text-center text-xs font-medium tabular-nums text-zinc-500">
                  {page} / {Math.max(1, totalPages)}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.section>

        {/* Insights */}
        <motion.section variants={itemVariants} className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Client insights
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                A quick view of relationship health and how your client base is
                developing.
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
                    Client growth
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Total client records over the most recent six months.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <TrendingUp size={14} />
                  {stats.total} total clients
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <ClientGrowthChart data={growthChartData} />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Growth is calculated from client creation dates when available.
                If your API does not return `createdAt`, the chart uses a
                simple workspace snapshot instead.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Relationship mix
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  The current balance of leads, active clients, and inactive
                  records.
                </p>
              </div>

              <ClientStatusChart data={statusChartData} total={stats.total} />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Active relationship rate
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {conversionRate}%
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  {stats.total === 0
                    ? "Add client records to start measuring relationship activity."
                    : `${stats.active} of ${stats.total} client${
                        stats.total === 1 ? "" : "s"
                      } are currently active.`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Operational Hint */}
        <motion.section variants={itemVariants} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <Building2
              size={16}
              className="mt-0.5 shrink-0 text-zinc-400"
            />

            <div>
              <p className="text-xs font-semibold text-zinc-800">
                Keep client context connected.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Add clients here, then move their work into proposals, projects,
                invoices, and the Client Portal without rebuilding details.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <ClientDrawer
        open={drawerOpen}
        mode={drawerMode}
        client={editingClient}
        onClose={() => {
          setDrawerOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
      />
    </div>
  );
}