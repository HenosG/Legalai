import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  MoreHorizontal,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings2,
  TrendingUp,
  WalletCards,
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
import type {
  InvoiceListItem,
  InvoiceListResponse,
} from "@/types/invoices";

// ─── Types ───────────────────────────────────────────────────────────────────

type InvoiceFilter =
  | "ALL"
  | "DRAFT"
  | "OPEN"
  | "PAID"
  | "OVERDUE"
  | "VOID";

interface InvoiceMetrics {
  outstanding: number;
  paidThisMonth: number;
  overdue: number;
  drafts: number;
}

interface InvoiceTrendPoint {
  label: string;
  paid: number;
  outstanding: number;
}

interface InvoiceStatusPoint {
  label: string;
  value: number;
  color: string;
}

interface InvoiceWithOptionalFields extends InvoiceListItem {
  sentAt?: string | null;
  paidAt?: string | null;
  updatedAt?: string | null;
  currency?: string | null;
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

function formatCurrency(value: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
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

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatShortDate(value?: string | null) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getInvoiceCurrency(invoice: InvoiceWithOptionalFields) {
  return invoice.currency || "CAD";
}

function getInvoiceAmountDue(invoice: InvoiceWithOptionalFields) {
  return Math.max(
    Number(invoice.amount || 0) - Number(invoice.amountPaid || 0),
    0
  );
}

function isOverdue(invoice: InvoiceWithOptionalFields) {
  const status = invoice.status?.toUpperCase();

  if (status === "OVERDUE") return true;

  if (
    status === "PAID" ||
    status === "VOID" ||
    status === "DRAFT" ||
    status === "UNCOLLECTIBLE" ||
    !invoice.dueDate
  ) {
    return false;
  }

  const dueDate = new Date(invoice.dueDate);

  if (Number.isNaN(dueDate.getTime())) return false;

  return dueDate.getTime() < Date.now();
}

function normalizeStatus(invoice: InvoiceWithOptionalFields): InvoiceFilter {
  const status = invoice.status?.toUpperCase();

  if (isOverdue(invoice)) return "OVERDUE";
  if (status === "DRAFT") return "DRAFT";
  if (status === "PAID") return "PAID";
  if (status === "VOID" || status === "UNCOLLECTIBLE") return "VOID";

  return "OPEN";
}

function getStatusStyles(status: InvoiceFilter) {
  switch (status) {
    case "DRAFT":
      return {
        label: "Draft",
        className: "border-zinc-200 bg-zinc-100 text-zinc-600",
        dot: "bg-zinc-400",
      };

    case "PAID":
      return {
        label: "Paid",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
      };

    case "OVERDUE":
      return {
        label: "Overdue",
        className: "border-red-200 bg-red-50 text-red-700",
        dot: "bg-red-500",
      };

    case "VOID":
      return {
        label: "Void",
        className: "border-zinc-200 bg-zinc-50 text-zinc-500",
        dot: "bg-zinc-400",
      };

    default:
      return {
        label: "Open",
        className: "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
      };
  }
}

function getInvoiceReference(invoice: InvoiceWithOptionalFields) {
  const record = invoice as InvoiceWithOptionalFields & {
    invoiceNumber?: string | null;
    number?: string | null;
  };

  if (record.invoiceNumber) return record.invoiceNumber;
  if (record.number) return record.number;

  return `INV-${invoice.id.slice(-6).toUpperCase()}`;
}

function getInvoiceTrendDate(invoice: InvoiceWithOptionalFields) {
  const value =
    invoice.paidAt ||
    invoice.createdAt ||
    invoice.sentAt ||
    invoice.updatedAt ||
    null;

  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function buildInvoiceTrendData(
  invoices: InvoiceWithOptionalFields[]
): InvoiceTrendPoint[] {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

    return {
      date,
      label: date.toLocaleDateString("en-CA", {
        month: "short",
      }),
      paid: 0,
      outstanding: 0,
    };
  });

  return months.map((month) => {
    const monthStart = new Date(
      month.date.getFullYear(),
      month.date.getMonth(),
      1
    );

    const monthEnd = new Date(
      month.date.getFullYear(),
      month.date.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const invoicesInMonth = invoices.filter((invoice) => {
      const invoiceDate = getInvoiceTrendDate(invoice);

      if (!invoiceDate) return false;

      return invoiceDate >= monthStart && invoiceDate <= monthEnd;
    });

    return {
      label: month.label,
      paid: invoicesInMonth
        .filter((invoice) => normalizeStatus(invoice) === "PAID")
        .reduce(
          (sum, invoice) =>
            sum +
            Math.max(
              Number(invoice.amountPaid || 0),
              Number(invoice.amount || 0)
            ),
          0
        ),
      outstanding: invoicesInMonth
        .filter((invoice) => {
          const status = normalizeStatus(invoice);

          return status === "OPEN" || status === "OVERDUE";
        })
        .reduce((sum, invoice) => sum + getInvoiceAmountDue(invoice), 0),
    };
  });
}

// ─── Components ──────────────────────────────────────────────────────────────

function StatusBadge({
  invoice,
}: {
  invoice: InvoiceWithOptionalFields;
}) {
  const status = normalizeStatus(invoice);
  const styles = getStatusStyles(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        styles.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {styles.label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  loading,
  onClick,
}: {
  label: string;
  value: string;
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
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-zinc-100" />
      ) : (
        <p className="mt-4 font-serif text-3xl font-bold leading-none tracking-tight text-zinc-900">
          {value}
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

function InvoiceRowSkeleton() {
  return (
    <tr className="border-b border-zinc-100 last:border-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <td key={index} className="px-5 py-5">
          <div
            className={cn(
              "h-4 animate-pulse rounded bg-zinc-100",
              index === 0 ? "w-28" : index === 1 ? "w-36" : "w-20"
            )}
          />
        </td>
      ))}
    </tr>
  );
}

function MobileInvoiceSkeleton() {
  return (
    <div className="animate-pulse border-b border-zinc-100 p-5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-zinc-100" />

        <div className="flex-1">
          <div className="h-3.5 w-24 rounded bg-zinc-100" />
          <div className="mt-2 h-3 w-36 rounded bg-zinc-100" />
          <div className="mt-4 h-5 w-16 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

function EmptyInvoices({
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
        {hasSearchOrFilter ? <Search size={20} /> : <Receipt size={20} />}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-zinc-800">
        {hasSearchOrFilter ? "No matching invoices" : "No invoices yet"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
        {hasSearchOrFilter
          ? "Try changing your search or invoice status filter."
          : "Create an invoice to collect payment from a client and keep billing connected to your delivery work."}
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
          Create invoice
        </button>
      )}
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
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <AlertCircle size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-zinc-800">
        Could not load invoices
      </h3>

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

function InvoiceActionMenu({
  invoice,
  onClose,
}: {
  invoice: InvoiceWithOptionalFields;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const status = normalizeStatus(invoice);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 shadow-xl shadow-zinc-900/10">
      <div className="border-b border-zinc-100 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Invoice actions
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          onClose();
          navigate(`/invoices/${invoice.id}`);
        }}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <FileText size={14} className="text-zinc-400" />
        View invoice
      </button>

      {status === "DRAFT" && (
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(`/invoices/${invoice.id}/edit`);
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <FileText size={14} className="text-zinc-400" />
          Edit draft
        </button>
      )}

      {(status === "OPEN" || status === "OVERDUE") && (
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(`/invoices/${invoice.id}`);
          }}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <Send size={14} className="text-zinc-400" />
          Payment options
        </button>
      )}
    </div>
  );
}

function InvoiceStatusChart({
  data,
  total,
}: {
  data: InvoiceStatusPoint[];
  total: number;
}) {
  const activeData = data.filter((item) => item.value > 0);
  const hasData = activeData.length > 0;

  const chartData = hasData
    ? activeData
    : [
        {
          label: "No invoices",
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
                  `${Number(value || 0)} invoice${
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
            Invoices
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
            Send your first invoice to view activity.
          </p>
        )}
      </div>
    </div>
  );
}

function InvoiceTrendChart({
  data,
}: {
  data: InvoiceTrendPoint[];
}) {
  const hasData = data.some(
    (item) => item.paid > 0 || item.outstanding > 0
  );

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{
          top: 12,
          right: 6,
          left: -16,
          bottom: 0,
        }}
        barGap={5}
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
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={52}
          tick={{
            fill: "#a1a1aa",
            fontSize: 11,
          }}
          tickFormatter={(value) => formatCompactCurrency(Number(value))}
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
          formatter={(value: number | string, name: string) => [
            formatCurrency(Number(value || 0)),
            name === "paid" ? "Paid" : "Outstanding",
          ]}
        />

        <Bar
          dataKey="paid"
          radius={[5, 5, 0, 0]}
          fill={hasData ? "#18181b" : "#e4e4e7"}
          maxBarSize={30}
        />

        <Bar
          dataKey="outstanding"
          radius={[5, 5, 0, 0]}
          fill={hasData ? "#a1a1aa" : "#e4e4e7"}
          maxBarSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Invoices() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<InvoiceFilter>("ALL");
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState({
    top: 0,
    right: 0,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {}
  );

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const token = await getToken();

      return createApiClient(token).get<InvoiceListResponse>("/api/invoices");
    },
    enabled: isLoaded && !!isSignedIn,
    staleTime: 15000,
    retry: 2,
  });

  const invoices = (data?.invoices ?? []) as InvoiceWithOptionalFields[];
  const apiMetrics = data?.metrics as Partial<InvoiceMetrics> | undefined;

  const calculatedMetrics = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => {
        const status = normalizeStatus(invoice);

        return status === "OPEN" || status === "OVERDUE";
      })
      .reduce((sum, invoice) => sum + getInvoiceAmountDue(invoice), 0);

    const overdue = invoices
      .filter((invoice) => normalizeStatus(invoice) === "OVERDUE")
      .reduce((sum, invoice) => sum + getInvoiceAmountDue(invoice), 0);

    const drafts = invoices.filter(
      (invoice) => normalizeStatus(invoice) === "DRAFT"
    ).length;

    const now = new Date();
    const paidThisMonth = invoices
      .filter((invoice) => {
        if (normalizeStatus(invoice) !== "PAID") return false;

        const paidDate =
          invoice.paidAt ||
          invoice.updatedAt ||
          invoice.createdAt ||
          null;

        if (!paidDate) return false;

        const date = new Date(paidDate);

        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (sum, invoice) =>
          sum +
          Math.max(
            Number(invoice.amountPaid || 0),
            Number(invoice.amount || 0)
          ),
        0
      );

    return {
      outstanding,
      overdue,
      drafts,
      paidThisMonth,
    };
  }, [invoices]);

  const metrics = {
    outstanding:
      apiMetrics?.outstanding ?? calculatedMetrics.outstanding,
    overdue: apiMetrics?.overdue ?? calculatedMetrics.overdue,
    drafts: apiMetrics?.drafts ?? calculatedMetrics.drafts,
    paidThisMonth:
      apiMetrics?.paidThisMonth ?? calculatedMetrics.paidThisMonth,
  };

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const currentStatus = normalizeStatus(invoice);

      const matchesFilter =
        activeFilter === "ALL" || currentStatus === activeFilter;

      const matchesSearch =
        !normalizedSearch ||
        invoice.client?.name?.toLowerCase().includes(normalizedSearch) ||
        invoice.client?.company
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        invoice.client?.email?.toLowerCase().includes(normalizedSearch) ||
        invoice.id?.toLowerCase().includes(normalizedSearch) ||
        invoice.stripeInvoiceId?.toLowerCase().includes(normalizedSearch) ||
        getInvoiceReference(invoice).toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, invoices, search]);

  const filterCounts = useMemo(() => {
    return {
      ALL: invoices.length,
      DRAFT: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "DRAFT"
      ).length,
      OPEN: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "OPEN"
      ).length,
      PAID: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "PAID"
      ).length,
      OVERDUE: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "OVERDUE"
      ).length,
      VOID: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "VOID"
      ).length,
    };
  }, [invoices]);

  const invoiceFilters: {
    key: InvoiceFilter;
    label: string;
  }[] = [
    { key: "ALL", label: "All invoices" },
    { key: "DRAFT", label: "Drafts" },
    { key: "OPEN", label: "Open" },
    { key: "PAID", label: "Paid" },
    { key: "OVERDUE", label: "Overdue" },
    { key: "VOID", label: "Void" },
  ];

  const statusChartData = useMemo<InvoiceStatusPoint[]>(
    () => [
      {
        label: "Drafts",
        value: filterCounts.DRAFT,
        color: "#18181b",
      },
      {
        label: "Open",
        value: filterCounts.OPEN,
        color: "#71717a",
      },
      {
        label: "Paid",
        value: filterCounts.PAID,
        color: "#a1a1aa",
      },
      {
        label: "Overdue",
        value: filterCounts.OVERDUE,
        color: "#d4d4d8",
      },
    ],
    [
      filterCounts.DRAFT,
      filterCounts.OPEN,
      filterCounts.OVERDUE,
      filterCounts.PAID,
    ]
  );

  const trendChartData = useMemo(
    () => buildInvoiceTrendData(invoices),
    [invoices]
  );

  const paidInvoiceValue = useMemo(
    () =>
      invoices
        .filter((invoice) => normalizeStatus(invoice) === "PAID")
        .reduce(
          (sum, invoice) =>
            sum +
            Math.max(
              Number(invoice.amountPaid || 0),
              Number(invoice.amount || 0)
            ),
          0
        ),
    [invoices]
  );

  const paymentRate = useMemo(() => {
    const paymentEligible = invoices.filter((invoice) => {
      const status = normalizeStatus(invoice);

      return (
        status === "PAID" ||
        status === "OPEN" ||
        status === "OVERDUE"
      );
    });

    if (!paymentEligible.length) return 0;

    const paidCount = paymentEligible.filter(
      (invoice) => normalizeStatus(invoice) === "PAID"
    ).length;

    return Math.round((paidCount / paymentEligible.length) * 100);
  }, [invoices]);

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("ALL");
    setOpenActionId(null);

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const openActionMenu = (invoiceId: string) => {
    const button = actionButtonRefs.current[invoiceId];

    if (!button) {
      setOpenActionId(invoiceId);
      return;
    }

    const rect = button.getBoundingClientRect();

    setActionMenuPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });

    setOpenActionId((current) =>
      current === invoiceId ? null : invoiceId
    );
  };

  useEffect(() => {
    const closeMenu = () => setOpenActionId(null);

    window.addEventListener("resize", closeMenu);
    window.addEventListener("scroll", closeMenu, true);

    return () => {
      window.removeEventListener("resize", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  const hasSearchOrFilter =
    Boolean(search.trim()) || activeFilter !== "ALL";

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] text-sm text-zinc-400">
        Loading invoices…
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
              Client billing and payment collection
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Invoices
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Create invoices, keep payment follow-up visible, and connect
              billing activity to the client work already happening in your
              workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/settings/billing")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Settings2 size={14} className="text-zinc-500" />
              Billing settings
            </button>

            <button
              type="button"
              onClick={() => navigate("/invoices/new")}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              <Plus size={14} />
              Create invoice
            </button>
          </div>
        </motion.section>

        {/* Metrics */}
        <motion.section
          variants={itemVariants}
          className="mb-10 grid grid-cols-2 gap-3 xl:grid-cols-4"
        >
          {isLoading ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                label="Outstanding"
                value={formatCompactCurrency(metrics.outstanding)}
                icon={WalletCards}
                loading={false}
                onClick={() => setActiveFilter("OPEN")}
              />

              <MetricCard
                label="Paid this month"
                value={formatCompactCurrency(metrics.paidThisMonth)}
                icon={CheckCircle2}
                loading={false}
                onClick={() => setActiveFilter("PAID")}
              />

              <MetricCard
                label="Overdue"
                value={formatCompactCurrency(metrics.overdue)}
                icon={Clock3}
                loading={false}
                onClick={() => setActiveFilter("OVERDUE")}
              />

              <MetricCard
                label="Draft invoices"
                value={String(metrics.drafts)}
                icon={FileText}
                loading={false}
                onClick={() => setActiveFilter("DRAFT")}
              />
            </>
          )}
        </motion.section>

        {/* Invoice Directory */}
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
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoices, clients, or companies…"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-9 text-[13px] text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Clear invoice search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isFetching ? "animate-spin" : undefined}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => navigate("/settings/integrations")}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                <CreditCard size={14} />
                Payments
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="hide-scrollbar overflow-x-auto border-b border-zinc-100 px-4 py-3 sm:px-5">
            <div className="inline-flex min-w-max items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1">
              {invoiceFilters.map((filter) => {
                const selected = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter.key);
                      setOpenActionId(null);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      selected
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    {filter.label}

                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] tabular-nums",
                        selected
                          ? "bg-white/15 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      )}
                    >
                      {filterCounts[filter.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table meta */}
          {!isLoading && !error && (
            <div className="flex items-center justify-between px-5 py-3">
              <p className="text-xs text-zinc-500">
                Showing{" "}
                <span className="font-medium text-zinc-800">
                  {filteredInvoices.length}
                </span>{" "}
                invoice{filteredInvoices.length === 1 ? "" : "s"}
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

          {error ? (
            <ErrorState
              message={
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred."
              }
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-[900px] w-full">
                  <tbody>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <InvoiceRowSkeleton key={index} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-zinc-100 lg:hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                  <MobileInvoiceSkeleton key={index} />
                ))}
              </div>
            </>
          ) : filteredInvoices.length === 0 ? (
            <EmptyInvoices
              onCreate={() => navigate("/invoices/new")}
              hasSearchOrFilter={hasSearchOrFilter}
              onClear={clearFilters}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-[900px] w-full text-left">
                  <thead className="border-y border-zinc-100 bg-zinc-50/40">
                    <tr className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      <th className="px-5 py-3.5">Invoice</th>
                      <th className="px-5 py-3.5">Client</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Amount</th>
                      <th className="px-5 py-3.5">Due date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100">
                    {filteredInvoices.map((invoice) => {
                      const amountDue = getInvoiceAmountDue(invoice);
                      const status = normalizeStatus(invoice);

                      return (
                        <tr
                          key={invoice.id}
                          className="group transition-colors hover:bg-zinc-50/70"
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/invoices/${invoice.id}`)
                              }
                              className="group/invoice flex items-center gap-3 text-left"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover/invoice:bg-zinc-200">
                                <Receipt size={16} />
                              </span>

                              <span>
                                <span className="block text-[13px] font-semibold text-zinc-900 transition-colors group-hover/invoice:text-zinc-600">
                                  {getInvoiceReference(invoice)}
                                </span>

                                <span className="mt-0.5 block text-[11px] text-zinc-400">
                                  Created {formatDate(invoice.createdAt)}
                                </span>
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/crm/${invoice.clientId}`)
                              }
                              className="text-left"
                            >
                              <span className="block text-[13px] font-semibold text-zinc-800 transition-colors hover:text-zinc-600">
                                {invoice.client?.name || "Client"}
                              </span>

                              <span className="mt-0.5 block max-w-[185px] truncate text-[11px] text-zinc-400">
                                {invoice.client?.company ||
                                  invoice.client?.email ||
                                  "Independent"}
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge invoice={invoice} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <p className="text-[13px] font-semibold text-zinc-900">
                              {formatCurrency(
                                Number(invoice.amount || 0),
                                getInvoiceCurrency(invoice)
                              )}
                            </p>

                            {amountDue > 0 &&
                              status !== "DRAFT" &&
                              status !== "VOID" && (
                                <p className="mt-0.5 text-[11px] text-zinc-400">
                                  {formatCurrency(
                                    amountDue,
                                    getInvoiceCurrency(invoice)
                                  )}{" "}
                                  due
                                </p>
                              )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-[12px] text-zinc-600">
                              <CalendarDays
                                size={14}
                                className="text-zinc-400"
                              />
                              {formatShortDate(invoice.dueDate)}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              ref={(element) => {
                                actionButtonRefs.current[invoice.id] = element;
                              }}
                              type="button"
                              onClick={() => openActionMenu(invoice.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                              aria-label={`Actions for ${getInvoiceReference(
                                invoice
                              )}`}
                            >
                              <MoreHorizontal size={17} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Invoice List */}
              <div className="divide-y divide-zinc-100 lg:hidden">
                {filteredInvoices.map((invoice) => {
                  const amountDue = getInvoiceAmountDue(invoice);
                  const status = normalizeStatus(invoice);

                  return (
                    <div key={invoice.id} className="p-5">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600"
                        >
                          <Receipt size={17} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/invoices/${invoice.id}`)
                              }
                              className="min-w-0 text-left"
                            >
                              <p className="truncate text-[13px] font-semibold text-zinc-900">
                                {getInvoiceReference(invoice)}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                                {invoice.client?.name || "Client"} ·{" "}
                                {invoice.client?.company ||
                                  invoice.client?.email ||
                                  "Independent"}
                              </p>
                            </button>

                            <button
                              ref={(element) => {
                                actionButtonRefs.current[invoice.id] = element;
                              }}
                              type="button"
                              onClick={() => openActionMenu(invoice.id)}
                              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                              aria-label={`Actions for ${getInvoiceReference(
                                invoice
                              )}`}
                            >
                              <MoreHorizontal size={17} />
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge invoice={invoice} />

                            <span className="text-[11px] text-zinc-400">
                              Due {formatShortDate(invoice.dueDate)}
                            </span>
                          </div>

                          <div className="mt-3 flex items-end justify-between">
                            <span className="text-[12px] text-zinc-500">
                              Created {formatShortDate(invoice.createdAt)}
                            </span>

                            <div className="text-right">
                              <p className="text-[13px] font-semibold text-zinc-900">
                                {formatCurrency(
                                  Number(invoice.amount || 0),
                                  getInvoiceCurrency(invoice)
                                )}
                              </p>

                              {amountDue > 0 &&
                                status !== "DRAFT" &&
                                status !== "VOID" && (
                                  <p className="mt-0.5 text-[10px] text-zinc-400">
                                    {formatCurrency(
                                      amountDue,
                                      getInvoiceCurrency(invoice)
                                    )}{" "}
                                    due
                                  </p>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.section>

        {/* Insights */}
        <motion.section variants={itemVariants} className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Billing insights
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Review payment collection, outstanding balances, and the current
                mix of billing activity in your workspace.
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
                    Payment activity
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Paid and outstanding invoice value across the latest six
                    months.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    Paid
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                    Outstanding
                  </span>
                </div>
              </div>

              <div className="mt-5 h-[250px]">
                <InvoiceTrendChart data={trendChartData} />
              </div>

              <p className="mt-3 text-[11px] leading-5 text-zinc-400">
                Payment activity uses invoice creation or payment dates when
                available. It is a workspace summary, not accounting advice.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Collection status
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  The current balance between draft, open, paid, and overdue
                  invoices.
                </p>
              </div>

              <InvoiceStatusChart
                data={statusChartData}
                total={invoices.length}
              />

              <div className="border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">
                    Payment completion rate
                  </span>

                  <span className="font-serif text-xl font-bold text-zinc-900">
                    {paymentRate}%
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  {invoices.length === 0
                    ? "Create an invoice to start tracking collection activity."
                    : `${formatCurrency(
                        paidInvoiceValue
                      )} has been recorded as paid. ${formatCurrency(
                        metrics.outstanding
                      )} remains outstanding.`}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Workflow Hint */}
        <motion.section variants={itemVariants} className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
            <CreditCard size={16} className="mt-0.5 shrink-0 text-zinc-400" />

            <div>
              <p className="text-xs font-semibold text-zinc-800">
                Keep billing connected to delivery.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                Link invoices to the right client, proposal, or project so your
                team can understand the context behind every payment and
                outstanding balance.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.main>

      {createPortal(
        <AnimatePresence>
          {openActionId &&
            (() => {
              const invoice = invoices.find(
                (item) => item.id === openActionId
              );

              if (!invoice) return null;

              return (
                <>
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setOpenActionId(null)}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -4 }}
                    transition={{ duration: 0.14 }}
                    style={{
                      top: actionMenuPosition.top,
                      right: actionMenuPosition.right,
                    }}
                    className="fixed z-[9999] w-52"
                  >
                    <InvoiceActionMenu
                      invoice={invoice}
                      onClose={() => setOpenActionId(null)}
                    />
                  </motion.div>
                </>
              );
            })()}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}