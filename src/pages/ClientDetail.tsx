import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Loader2,
  Mail,
  Send,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string | null;
  title: string | null;
  currency: string;
  amount: number;
  amountPaid: number;
  status: string;
  issueDate: string;
  dueDate: string | null;
  createdAt: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  status?: string | null;
}

interface ClientDetailResponse {
  client: Client;
  invoices: InvoiceSummary[];
  projects: ProjectSummary[];
  totals: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    invoiceCount: number;
    paidInvoiceCount: number;
    overdueInvoiceCount: number;
  };
  paymentsByMonth: {
    month: string;
    amount: number;
  }[];
}

interface AiResponse {
  answer: string;
}

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
} as const;

const invoiceStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "border-zinc-200 bg-zinc-100 text-zinc-600",
  },
  OPEN: {
    label: "Open",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  PARTIALLY_PAID: {
    label: "Partially paid",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Paid",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  OVERDUE: {
    label: "Overdue",
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
  VOID: {
    label: "Void",
    className: "border-zinc-200 bg-zinc-100 text-zinc-500",
  },
  UNCOLLECTIBLE: {
    label: "Uncollectible",
    className: "border-zinc-200 bg-zinc-100 text-zinc-500",
  },
};

function formatCurrency(amount: number, currency = "CAD") {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "CAD";

  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  } catch {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }
}

function formatShortDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatChartMonth(value: string) {
  const [year, month] = value.split("-");

  if (!year || !month) return value;

  const date = new Date(`${year}-${month}-01`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function getClientInitials(name: string) {
  const safeName = name.trim() || "Client";

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function ClientDetail() {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { getToken } = useAuth();

  const [data, setData] = useState<ClientDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const api = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  const loadClient = useCallback(async () => {
    if (!clientId) return;

    setLoading(true);
    setPageError(null);

    try {
      const client = await api();

      const response = await client.get<ClientDetailResponse>(
        `/api/clients/${clientId}/detail`
      );

      setData(response);
    } catch (error) {
      console.error("Failed to load client:", error);

      setPageError(
        error instanceof Error ? error.message : "Failed to load client."
      );
    } finally {
      setLoading(false);
    }
  }, [api, clientId]);

  useEffect(() => {
    void loadClient();
  }, [loadClient]);

  const handleAskAi = async () => {
    if (!data || !aiQuestion.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setAiAnswer(null);

    try {
      const client = await api();

      const response = await client.post<AiResponse>(
        `/api/clients/${data.client.id}/ai-viability`,
        {
          question: aiQuestion.trim(),
        }
      );

      setAiAnswer(response.answer || "No response was returned.");
    } catch (error) {
      console.error("AI request failed:", error);

      setAiError(
        error instanceof Error
          ? error.message
          : "Unable to analyze this client right now."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const maxMonthlyPayment = useMemo(() => {
    if (!data?.paymentsByMonth?.length) return 0;

    return Math.max(
      ...data.paymentsByMonth.map((month) => Number(month.amount) || 0),
      1
    );
  }, [data?.paymentsByMonth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-zinc-200" />

          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="mb-4 h-16 w-16 rounded-2xl bg-zinc-100" />
            <div className="mb-3 h-8 max-w-sm rounded bg-zinc-100" />
            <div className="h-4 w-64 rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={22} />
          </div>

          <h1 className="text-lg font-semibold text-zinc-900">
            Unable to load client
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {pageError || "This client could not be found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/crm")}
            className="mt-6 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Back to CRM
          </button>
        </div>
      </div>
    );
  }

  const client = data.client;
  const initials = getClientInitials(client.name);
  const totals = data.totals;

  const collectionRate =
    totals.totalInvoiced > 0
      ? Math.min(
          Math.round((totals.totalPaid / totals.totalInvoiced) * 100),
          100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

        .font-serif {
          font-family: "DM Serif Display", serif;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/crm")}
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-50">
              <ArrowLeft size={15} />
            </span>

            <span className="hidden sm:inline">All clients</span>
          </button>

          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
          >
            <FileText size={15} />
            New invoice
          </Link>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="mx-auto max-w-6xl px-5 py-8 sm:px-6"
      >
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => navigate("/crm")}
            className="transition-colors hover:text-zinc-700"
          >
            CRM
          </button>

          <span>/</span>

          <span className="max-w-[240px] truncate text-zinc-600">
            {client.name}
          </span>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-white px-6 py-8 sm:px-10">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-lg font-bold text-zinc-600">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-serif text-3xl font-bold leading-[1.05] tracking-[-0.04em] text-zinc-900 sm:text-4xl">
                        {client.name}
                      </h1>

                      {client.status && (
                        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                          {client.status}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-zinc-500">
                      {client.company || "Independent client"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12px] text-zinc-500">
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-zinc-800"
                    >
                      <Mail size={14} className="text-zinc-400" />
                      {client.email}
                    </a>
                  )}

                  {client.phone && (
                    <span className="inline-flex items-center gap-2">
                      <UserRound size={14} className="text-zinc-400" />
                      {client.phone}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} className="text-zinc-400" />
                    Client since {formatShortDate(client.createdAt)}
                  </span>
                </div>
              </div>

              <div className="grid gap-px bg-zinc-100 sm:grid-cols-4">
                <div className="bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Total paid
                  </p>

                  <p className="mt-2 text-xl font-bold text-emerald-700">
                    {formatCurrency(totals.totalPaid)}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Outstanding
                  </p>

                  <p className="mt-2 text-xl font-bold text-zinc-900">
                    {formatCurrency(totals.totalOutstanding)}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Invoiced
                  </p>

                  <p className="mt-2 text-xl font-bold text-zinc-900">
                    {formatCurrency(totals.totalInvoiced)}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Collection rate
                  </p>

                  <p className="mt-2 text-xl font-bold text-zinc-900">
                    {collectionRate}%
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Payments over time
                  </h2>

                  <p className="mt-1 text-[12px] text-zinc-500">
                    Payments recorded for this client, grouped by month.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 size={12} />
                  {totals.paidInvoiceCount} paid invoice
                  {totals.paidInvoiceCount === 1 ? "" : "s"}
                </div>
              </div>

              {data.paymentsByMonth.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-400">
                    <CreditCard size={17} />
                  </div>

                  <p className="text-sm font-medium text-zinc-600">
                    No payments recorded yet
                  </p>

                  <p className="mt-1 text-[12px] text-zinc-400">
                    Once this client pays an invoice, their payment history
                    will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-7">
                  <div className="flex h-44 items-end gap-2 sm:gap-3">
                    {data.paymentsByMonth.map((month) => {
                      const amount = Number(month.amount) || 0;

                      const height = Math.max(
                        8,
                        Math.round((amount / maxMonthlyPayment) * 100)
                      );

                      return (
                        <div
                          key={month.month}
                          className="group flex min-w-0 flex-1 flex-col items-center gap-2"
                        >
                          <div className="flex w-full flex-1 items-end">
                            <div
                              className="w-full rounded-t-lg bg-zinc-900 transition-all group-hover:bg-zinc-700"
                              style={{ height: `${height}%` }}
                              title={`${formatChartMonth(
                                month.month
                              )}: ${formatCurrency(amount)}`}
                            />
                          </div>

                          <span className="truncate text-[10px] font-medium text-zinc-400">
                            {formatChartMonth(month.month)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-[11px] text-zinc-500">
                    <span>
                      {data.paymentsByMonth.length} month
                      {data.paymentsByMonth.length === 1 ? "" : "s"} with
                      payments
                    </span>

                    <span className="font-semibold text-zinc-700">
                      {formatCurrency(totals.totalPaid)} collected
                    </span>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Recent invoices
                  </h2>

                  <p className="mt-1 text-[12px] text-zinc-500">
                    {totals.invoiceCount} invoice
                    {totals.invoiceCount === 1 ? "" : "s"} ·{" "}
                    {totals.paidInvoiceCount} paid ·{" "}
                    {totals.overdueInvoiceCount} overdue
                  </p>
                </div>

                <Link
                  to="/invoices"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  View all
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              {data.invoices.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-400">
                    <FileText size={17} />
                  </div>

                  <p className="text-sm font-medium text-zinc-600">
                    No invoices yet
                  </p>

                  <p className="mt-1 text-[12px] text-zinc-400">
                    Create an invoice to start tracking billing for this
                    client.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  {data.invoices.slice(0, 6).map((invoice) => {
                    const status =
                      invoiceStatusConfig[invoice.status] ||
                      invoiceStatusConfig.DRAFT;

                    const amount = Number(invoice.amount) || 0;
                    const amountPaid = Number(invoice.amountPaid) || 0;
                    const remaining = Math.max(amount - amountPaid, 0);

                    return (
                      <Link
                        key={invoice.id}
                        to={`/invoices/${invoice.id}`}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-zinc-900">
                              {invoice.invoiceNumber || "Invoice"}
                            </p>

                            <span
                              className={cn(
                                "hidden rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-flex",
                                status.className
                              )}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[11px] text-zinc-500">
                            {invoice.title || "No title"} · Due{" "}
                            {formatShortDate(invoice.dueDate)}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-zinc-900">
                            {formatCurrency(amount, invoice.currency)}
                          </p>

                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {amountPaid > 0 ? (
                              <>
                                <span className="font-semibold text-emerald-700">
                                  {formatCurrency(
                                    amountPaid,
                                    invoice.currency
                                  )}
                                </span>{" "}
                                paid
                              </>
                            ) : (
                              "No payment yet"
                            )}
                          </p>

                          {remaining > 0 && amountPaid > 0 && (
                            <p className="text-[10px] text-zinc-400">
                              {formatCurrency(
                                remaining,
                                invoice.currency
                              )}{" "}
                              remaining
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {data.projects.length > 0 && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Projects
                  </h2>

                  <span className="text-[11px] font-medium text-zinc-400">
                    {data.projects.length} linked
                  </span>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {data.projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-3.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {project.name}
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        {project.status || "Active project"}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {client.notes && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-zinc-900">
                  Internal notes
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-zinc-600">
                  {client.notes}
                </p>
              </section>
            )}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-20">
            <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-100 bg-gradient-to-br from-indigo-50 via-white to-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600">
                    <Bot size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Client viability AI
                    </p>

                    <p className="text-[11px] text-zinc-500">
                      Assess payment behavior, value, and risk
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <textarea
                  value={aiQuestion}
                  onChange={(event) => setAiQuestion(event.target.value)}
                  rows={4}
                  placeholder="Is this client viable? Should we prioritize them, and what are the risks?"
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-[13px] leading-6 text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-900/5"
                />

                <button
                  type="button"
                  onClick={handleAskAi}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 text-[13px] font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Sparkles size={15} />
                  )}

                  {aiLoading ? "Analyzing…" : "Analyze client"}
                </button>

                {aiError && (
                  <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12px] leading-5 text-rose-700">
                    {aiError}
                  </div>
                )}

                {aiAnswer ? (
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-indigo-600" />

                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        AI insight
                      </p>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-zinc-700">
                      {aiAnswer}
                    </p>

                    <div className="mt-4 border-t border-zinc-200 pt-3">
                      <p className="text-[10px] leading-4 text-zinc-400">
                        AI output is informational. Review it before making
                        pricing, credit, or client-relationship decisions.
                      </p>
                    </div>
                  </div>
                ) : (
                  !aiLoading &&
                  !aiError && (
                    <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-[12px] font-medium text-zinc-600">
                        Suggested questions
                      </p>

                      <div className="mt-3 space-y-2">
                        {[
                          "Should I continue working with this client?",
                          "What payment risks should I watch for?",
                          "Is this client worth prioritizing?",
                        ].map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => setAiQuestion(question)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-[12px] text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Billing health
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">Invoices</span>

                  <span className="font-semibold text-zinc-800">
                    {totals.invoiceCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">Paid invoices</span>

                  <span className="font-semibold text-emerald-700">
                    {totals.paidInvoiceCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">Overdue invoices</span>

                  <span
                    className={cn(
                      "font-semibold",
                      totals.overdueInvoiceCount > 0
                        ? "text-rose-600"
                        : "text-zinc-800"
                    )}
                  >
                    {totals.overdueInvoiceCount}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-500">Outstanding</span>

                  <span className="font-semibold text-zinc-800">
                    {formatCurrency(totals.totalOutstanding)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Quick actions
              </p>

              <div className="mt-4 space-y-2">
                <Link
                  to="/invoices/new"
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  <FileText size={15} />
                  Create invoice
                </Link>

                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <Mail size={15} />
                    Email client
                  </a>
                )}
              </div>
            </section>
          </aside>
        </div>
      </motion.main>
    </div>
  );
}