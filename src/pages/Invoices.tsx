import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";
import type {
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceStatus,
} from "@/types/invoices";

type InvoiceFilter =
  | "ALL"
  | "DRAFT"
  | "OPEN"
  | "PAID"
  | "OVERDUE"
  | "VOID";

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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

function formatCurrency(value: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function isOverdue(invoice: InvoiceListItem) {
  if (invoice.status?.toUpperCase() === "OVERDUE") return true;

  if (
    invoice.status?.toUpperCase() === "PAID" ||
    invoice.status?.toUpperCase() === "VOID" ||
    invoice.status?.toUpperCase() === "DRAFT" ||
    !invoice.dueDate
  ) {
    return false;
  }

  return new Date(invoice.dueDate).getTime() < Date.now();
}

function normalizeStatus(invoice: InvoiceListItem): InvoiceFilter {
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

function StatusBadge({ invoice }: { invoice: InvoiceListItem }) {
  const status = normalizeStatus(invoice);
  const styles = getStatusStyles(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        styles.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
      {styles.label}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
  detail,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconClassName: string;
  iconBackgroundClassName: string;
  detail: string;
  loading?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={springTransition}
      className="rounded-2xl border border-zinc-100 bg-white p-5 transition-all duration-300 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            iconBackgroundClassName
          )}
        >
          <Icon size={17} className={iconClassName} />
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Invoices
        </span>
      </div>

      {loading ? (
        <>
          <div className="mt-5 h-8 w-28 animate-pulse rounded bg-zinc-100" />
          <div className="mt-3 h-3 w-36 animate-pulse rounded bg-zinc-100" />
        </>
      ) : (
        <>
          <p className="mt-5 font-serif text-3xl font-bold tracking-tight text-zinc-900">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-500">{detail}</p>
        </>
      )}
    </motion.div>
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
              index === 0 ? "w-24" : index === 1 ? "w-36" : "w-20"
            )}
          />
        </td>
      ))}
    </tr>
  );
}

function EmptyInvoices({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#063ee2]">
        <Receipt size={24} />
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">
        No invoices yet.
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Create your first invoice to collect payment from a client and keep
        your delivery and billing workflow connected.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(6,62,226,0.18)] transition-colors hover:bg-blue-700"
      >
        <Plus size={16} />
        Create invoice
      </button>
    </motion.div>
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
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <X size={24} />
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">
        We could not load invoices.
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-700"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}

export default function Invoices() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<InvoiceFilter>("ALL");
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
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

  const invoices = data?.invoices ?? [];
  const metrics = data?.metrics;

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const currentStatus = normalizeStatus(invoice);

      const matchesFilter =
        activeFilter === "ALL" || currentStatus === activeFilter;

      const matchesSearch =
        !normalizedSearch ||
        invoice.client.name.toLowerCase().includes(normalizedSearch) ||
        invoice.client.company
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        invoice.client.email?.toLowerCase().includes(normalizedSearch) ||
        invoice.id.toLowerCase().includes(normalizedSearch) ||
        invoice.stripeInvoiceId?.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, invoices, search]);

  const filterCounts = useMemo(() => {
    return {
      ALL: invoices.length,
      DRAFT: invoices.filter((invoice) => normalizeStatus(invoice) === "DRAFT")
        .length,
      OPEN: invoices.filter((invoice) => normalizeStatus(invoice) === "OPEN")
        .length,
      PAID: invoices.filter((invoice) => normalizeStatus(invoice) === "PAID")
        .length,
      OVERDUE: invoices.filter(
        (invoice) => normalizeStatus(invoice) === "OVERDUE"
      ).length,
      VOID: invoices.filter((invoice) => normalizeStatus(invoice) === "VOID")
        .length,
    };
  }, [invoices]);

  const invoiceFilters: {
    key: InvoiceFilter;
    label: string;
  }[] = [
    { key: "ALL", label: "All" },
    { key: "DRAFT", label: "Draft" },
    { key: "OPEN", label: "Open" },
    { key: "PAID", label: "Paid" },
    { key: "OVERDUE", label: "Overdue" },
    { key: "VOID", label: "Void" },
  ];

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] text-sm text-zinc-400">
        Loading invoices…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900">
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
        className="w-full px-6 pb-24 pt-20 sm:px-12"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#063ee2]">
              <CircleDollarSign size={13} />
              Billing workflow
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Invoices
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
              Create, send, and track client payments from the same workspace
              where the work gets delivered.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/settings/billing")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <Settings2 size={16} />
              Billing settings
            </button>

            <button
              type="button"
              onClick={() => navigate("/invoices/new")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#063ee2] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(6,62,226,0.18)] transition-colors hover:bg-blue-700"
            >
              <Plus size={16} />
              Create invoice
            </button>
          </div>
        </motion.div>

        {/* Stripe information banner */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#063ee2] shadow-sm">
              <CreditCard size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-zinc-900">
                Client payments through Stripe
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Create invoices in RelunoOS, then use Stripe to collect online
                payments and sync payment status back to your workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/settings/integrations")}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#063ee2] transition-colors hover:text-blue-800"
          >
            Manage Stripe
            <ArrowUpRight size={14} />
          </button>
        </motion.div>

        {/* Summary cards */}
        <motion.section
          variants={itemVariants}
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <SummaryCard
            label="Outstanding"
            value={formatCurrency(metrics?.outstanding ?? 0)}
            detail="Open invoices still awaiting payment"
            icon={WalletCards}
            iconClassName="text-amber-600"
            iconBackgroundClassName="bg-amber-50"
            loading={isLoading}
          />

          <SummaryCard
            label="Paid this month"
            value={formatCurrency(metrics?.paidThisMonth ?? 0)}
            detail="Payments received in the current month"
            icon={CheckCircle2}
            iconClassName="text-emerald-600"
            iconBackgroundClassName="bg-emerald-50"
            loading={isLoading}
          />

          <SummaryCard
            label="Overdue"
            value={formatCurrency(metrics?.overdue ?? 0)}
            detail="Invoices past their due date"
            icon={Clock3}
            iconClassName="text-red-500"
            iconBackgroundClassName="bg-red-50"
            loading={isLoading}
          />

          <SummaryCard
            label="Draft invoices"
            value={String(metrics?.drafts ?? 0)}
            detail="Invoices not yet finalized or sent"
            icon={FileText}
            iconClassName="text-blue-600"
            iconBackgroundClassName="bg-blue-50"
            loading={isLoading}
          />
        </motion.section>

        {/* Invoice table */}
        <motion.section
          variants={itemVariants}
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white"
        >
          <div className="border-b border-zinc-100 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                  Invoice history
                </h2>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Review drafts, sent invoices, payments, and overdue balances.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search invoices or clients"
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-800 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-3 text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-50"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {invoiceFilters.map((filter) => {
                const selected = activeFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition-all",
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                    )}
                  >
                    {filter.key === "ALL" ? (
                      <Filter size={13} />
                    ) : filter.key === "PAID" ? (
                      <CheckCircle2 size={13} />
                    ) : filter.key === "OVERDUE" ? (
                      <Clock3 size={13} />
                    ) : filter.key === "DRAFT" ? (
                      <FileText size={13} />
                    ) : (
                      <Receipt size={13} />
                    )}

                    {filter.label}

                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px]",
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
            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full">
                <tbody>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <InvoiceRowSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <EmptyInvoices onCreate={() => navigate("/invoices/new")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full">
                <thead className="border-b border-zinc-100 bg-zinc-50/70">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Invoice
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Client
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Amount
                    </th>

                    <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Due date
                    </th>

                    <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence initial={false}>
                    {filteredInvoices.map((invoice) => {
                      const amountDue = Math.max(
                        Number(invoice.amount || 0) -
                          Number(invoice.amountPaid || 0),
                        0
                      );

                      const isActionMenuOpen = openActionId === invoice.id;

                      return (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="group border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50/70"
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/invoices/${invoice.id}`)}
                              className="group/invoice flex items-center gap-3 text-left"
                            >
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                                <Receipt size={16} />
                              </span>

                              <span>
                                <span className="block text-sm font-bold text-zinc-900 group-hover/invoice:text-[#063ee2]">
                                  INV-{invoice.id.slice(-6).toUpperCase()}
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
                                navigate(`/clients/${invoice.clientId}`)
                              }
                              className="text-left"
                            >
                              <span className="block text-sm font-semibold text-zinc-800 transition-colors hover:text-[#063ee2]">
                                {invoice.client.name}
                              </span>

                              <span className="mt-0.5 block max-w-[180px] truncate text-[11px] text-zinc-400">
                                {invoice.client.company ||
                                  invoice.client.email ||
                                  "Client"}
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge invoice={invoice} />
                          </td>

                          <td className="px-5 py-4 text-right">
                            <p className="text-sm font-bold text-zinc-900">
                              {formatCurrency(invoice.amount)}
                            </p>

                            {amountDue > 0 &&
                              normalizeStatus(invoice) !== "DRAFT" &&
                              normalizeStatus(invoice) !== "VOID" && (
                                <p className="mt-0.5 text-[11px] text-zinc-400">
                                  {formatCurrency(amountDue)} due
                                </p>
                              )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                              <CalendarDays size={14} className="text-zinc-400" />
                              {formatDate(invoice.dueDate)}
                            </div>
                          </td>

                          <td className="relative px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenActionId((current) =>
                                  current === invoice.id ? null : invoice.id
                                )
                              }
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                              aria-label={`Actions for invoice ${invoice.id}`}
                            >
                              <MoreHorizontal size={17} />
                            </button>

                            <AnimatePresence>
                              {isActionMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                  className="absolute right-5 top-12 z-20 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1.5 text-left shadow-xl shadow-zinc-900/10"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(`/invoices/${invoice.id}`)
                                    }
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                                  >
                                    <FileText size={14} />
                                    View invoice
                                  </button>

                                  {normalizeStatus(invoice) === "DRAFT" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(`/invoices/${invoice.id}/edit`)
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                                    >
                                      <Sparkles size={14} />
                                      Edit draft
                                    </button>
                                  )}

                                  {normalizeStatus(invoice) === "OPEN" && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigate(`/invoices/${invoice.id}`)
                                      }
                                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                                    >
                                      <Send size={14} />
                                      Payment options
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        {/* Bottom information section */}
        <motion.section
          variants={itemVariants}
          className="mt-8 grid gap-4 lg:grid-cols-2"
        >
          <div className="rounded-2xl border border-zinc-100 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Keep delivery and payment connected.
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Link an invoice to a client, project, or proposal so your
                  team can see the business context behind every payment.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                <CreditCard size={17} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Payment processing stays transparent.
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  RelunoOS invoice records and Stripe payment processing work
                  together, while applicable platform and processor fees remain
                  visible before collection is enabled.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}