import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientOption {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
}

interface ProjectOption {
  id: string;
  name: string;
  clientId: string;
}

interface MilestoneOption {
  id: string;
  title: string;
  projectId: string;
}

interface LineItem {
  id: string; // local key only (uuid-ish), not necessarily a DB id
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceItemResponse {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceResponse {
  id: string;
  clientId: string;
  invoiceNumber: string | null;
  title: string | null;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  amount: number;
  amountPaid: number;
  status: string;
  issueDate: string;
  dueDate: string | null;
  notes: string | null;
  terms: string | null;
  items: InvoiceItemResponse[];
}

const transition = { type: "spring", stiffness: 300, damping: 28 } as const;

function makeLocalId() {
  return `li_${Math.random().toString(36).slice(2, 10)}`;
}

function emptyLineItem(): LineItem {
  return { id: makeLocalId(), description: "", quantity: 1, unitPrice: 0 };
}

function formatCurrency(amount: number, currency = "CAD") {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "CAD";
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: safeCurrency,
    }).format(amount || 0);
  } catch {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
      amount || 0
    );
  }
}

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400";

const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400";

export default function InvoiceBuilder() {
  const navigate = useNavigate();
  // Matches your route param name from App.tsx: /invoices/:invoiceId/edit
  const { invoiceId: id } = useParams<{ invoiceId: string }>();
  const { getToken } = useAuth();
  const isNew = !id || id === "new";

  const api = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  // ── Reference data ──
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [milestones, setMilestones] = useState<MilestoneOption[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  // ── Invoice state ──
  const [invoiceId, setInvoiceId] = useState<string | null>(isNew ? null : id!);
  const [invoiceStatus, setInvoiceStatus] = useState<string>("DRAFT");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("CAD");
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [items, setItems] = useState<LineItem[]>([emptyLineItem()]);
  const [amountPaid, setAmountPaid] = useState(0);

  const [loading, setLoading] = useState(!isNew);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"save" | "issue" | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // ── Load reference data ──
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingRefs(true);
      try {
        const client = await api();
        const [clientsRes, projectsRes] = await Promise.all([
          client.get<{ clients: ClientOption[] }>("/api/clients"),
          client.get<{ projects: ProjectOption[] }>("/api/projects"),
        ]);
        if (cancelled) return;
        setClients(clientsRes.clients || []);
        setProjects(projectsRes.projects || []);
      } catch (err) {
        console.error("Failed to load clients/projects:", err);
      } finally {
        if (!cancelled) setLoadingRefs(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api]);

  // Load milestones for the selected project (ProjectDetail already proves
  // GET /api/projects/:id returns `milestones` inline).
  useEffect(() => {
    if (!projectId) {
      setMilestones([]);
      setMilestoneId("");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const client = await api();
        const project = await client.get<{ milestones?: { id: string; title: string }[] }>(
          `/api/projects/${projectId}`
        );
        if (cancelled) return;
        setMilestones(
          (project.milestones || []).map((m) => ({ id: m.id, title: m.title, projectId }))
        );
      } catch (err) {
        console.error("Failed to load milestones:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api, projectId]);

  // ── Load existing invoice ──
  useEffect(() => {
    if (isNew) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setPageError(null);
      try {
        const client = await api();
        const invoice = await client.get<InvoiceResponse>(`/api/invoices/${id}`);
        if (cancelled) return;

        setInvoiceId(invoice.id);
        setInvoiceStatus(invoice.status);
        setClientId(invoice.clientId);
        setInvoiceNumber(invoice.invoiceNumber || "");
        setTitle(invoice.title || "");
        setCurrency(invoice.currency || "CAD");
        setIssueDate(invoice.issueDate.slice(0, 10));
        setDueDate(invoice.dueDate ? invoice.dueDate.slice(0, 10) : "");
        setTaxAmount(String(invoice.taxAmount ?? 0));
        setDiscountAmount(String(invoice.discountAmount ?? 0));
        setNotes(invoice.notes || "");
        setTerms(invoice.terms || "");
        setAmountPaid(invoice.amountPaid || 0);
        setItems(
          invoice.items.length > 0
            ? invoice.items.map((i) => ({
                id: i.id,
                description: i.description,
                quantity: Number(i.quantity),
                unitPrice: Number(i.unitPrice),
              }))
            : [emptyLineItem()]
        );
      } catch (err) {
        console.error("Failed to load invoice:", err);
        setPageError(err instanceof Error ? err.message : "Failed to load invoice.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [api, id, isNew]);

  const isDraft = isNew || invoiceStatus === "DRAFT";
  const projectsForClient = useMemo(
    () => projects.filter((p) => !clientId || p.clientId === clientId),
    [projects, clientId]
  );

  // ── Line item handlers ──
  const updateItem = (itemId: string, patch: Partial<LineItem>) => {
    setItems((current) => current.map((it) => (it.id === itemId ? { ...it, ...patch } : it)));
  };

  const addItem = () => setItems((current) => [...current, emptyLineItem()]);

  const removeItem = (itemId: string) => {
    setItems((current) => (current.length > 1 ? current.filter((it) => it.id !== itemId) : current));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // ── Totals (client-side preview only — server recomputes authoritatively) ──
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0),
    [items]
  );
  const parsedTax = Number(taxAmount) || 0;
  const parsedDiscount = Number(discountAmount) || 0;
  const total = Math.max(subtotal + parsedTax - parsedDiscount, 0);
  const amountDue = Math.max(total - amountPaid, 0);

  const validate = (): string | null => {
    if (!clientId) return "Select a client before saving.";
    const validItems = items.filter((it) => it.description.trim() && it.quantity > 0);
    if (validItems.length === 0) return "Add at least one line item with a description and quantity.";
    if (items.some((it) => it.unitPrice < 0)) return "Unit prices cannot be negative.";
    return null;
  };

  const buildPayload = () => ({
    clientId,
    projectId: projectId || null,
    milestoneId: milestoneId || null,
    invoiceNumber: invoiceNumber.trim() || undefined,
    title: title.trim() || undefined,
    currency,
    issueDate,
    dueDate: dueDate || null,
    taxAmount: parsedTax,
    discountAmount: parsedDiscount,
    notes: notes.trim() || null,
    terms: terms.trim() || null,
    items: items
      .filter((it) => it.description.trim())
      .map((it, index) => ({
        description: it.description.trim(),
        quantity: Number(it.quantity) || 0,
        unitPrice: Number(it.unitPrice) || 0,
        position: index,
      })),
  });

  const handleSaveDraft = async (event?: FormEvent) => {
    event?.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setBusy("save");

    try {
      const client = await api();
      const payload = buildPayload();

      if (invoiceId) {
        const updated = await client.patch<InvoiceResponse>(`/api/invoices/${invoiceId}`, payload);
        setInvoiceStatus(updated.status);
        toast.success("Draft saved");
      } else {
        const created = await client.post<InvoiceResponse>("/api/invoices", payload);
        setInvoiceId(created.id);
        setInvoiceStatus(created.status);
        toast.success("Draft created");
        navigate(`/invoices/${created.id}/edit`, { replace: true });
      }
    } catch (err) {
      console.error("Failed to save invoice:", err);
      const message = err instanceof Error ? err.message : "Failed to save invoice.";
      setFormError(message);
      toast.error("Unable to save invoice", { description: message });
    } finally {
      setBusy(null);
    }
  };

  const handleIssue = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    setBusy("issue");

    try {
      const client = await api();
      let currentId = invoiceId;

      // Save first so the server has the latest line items, then issue.
      const payload = buildPayload();
      if (currentId) {
        await client.patch<InvoiceResponse>(`/api/invoices/${currentId}`, payload);
      } else {
        const created = await client.post<InvoiceResponse>("/api/invoices", payload);
        currentId = created.id;
        setInvoiceId(created.id);
      }

      const issued = await client.post<InvoiceResponse>(`/api/invoices/${currentId}/issue`, {});
      setInvoiceStatus(issued.status);
      toast.success("Invoice issued", { description: "The invoice is now open and ready to be paid." });
      navigate(`/invoices/${currentId}`, { replace: true });
    } catch (err) {
      console.error("Failed to issue invoice:", err);
      const message = err instanceof Error ? err.message : "Failed to issue invoice.";
      setFormError(message);
      toast.error("Unable to issue invoice", { description: message });
    } finally {
      setBusy(null);
    }
  };

  const selectedClient = clients.find((c) => c.id === clientId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-12">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-zinc-200" />
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <div className="mb-4 h-4 w-24 rounded bg-zinc-100" />
            <div className="mb-3 h-10 max-w-xl rounded bg-zinc-100" />
            <div className="h-5 w-64 rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={22} />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">Unable to load invoice</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{pageError}</p>
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="mt-6 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Back to invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: "DM Serif Display", serif; }
        * { font-family: "DM Sans", sans-serif; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-50">
              <ArrowLeft size={15} />
            </span>
            <span className="hidden sm:inline">All invoices</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="hidden rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:inline-flex"
            >
              {showPreview ? "Edit" : "Preview"}
            </button>

            {isDraft && (
              <button
                type="button"
                onClick={() => void handleSaveDraft()}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                {busy === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save draft
              </button>
            )}

            {isDraft ? (
              <button
                type="button"
                onClick={() => void handleIssue()}
                disabled={busy !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
              >
                {busy === "issue" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                {busy === "issue" ? "Issuing..." : "Issue & send"}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                <Check size={12} /> {invoiceStatus}
              </span>
            )}
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="mx-auto max-w-5xl px-5 py-8 sm:px-6"
      >
        {!isDraft && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              This invoice has been issued and can no longer be edited here. View it from the invoices
              list to track payment status.
            </span>
          </div>
        )}

        {formError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {showPreview ? (
          <InvoicePreview
            invoiceNumber={invoiceNumber}
            title={title}
            client={selectedClient}
            issueDate={issueDate}
            dueDate={dueDate}
            items={items}
            currency={currency}
            subtotal={subtotal}
            taxAmount={parsedTax}
            discountAmount={parsedDiscount}
            total={total}
            amountPaid={amountPaid}
            amountDue={amountDue}
            notes={notes}
            terms={terms}
          />
        ) : (
          <div className="space-y-6">
            {/* Client / project / milestone */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-zinc-900">Bill to</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="client">Client</label>
                  {loadingRefs ? (
                    <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
                  ) : clients.length === 0 ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                      No clients yet. Create one in CRM first.
                    </p>
                  ) : (
                    <select
                      id="client"
                      value={clientId}
                      disabled={!isDraft}
                      onChange={(e) => {
                        setClientId(e.target.value);
                        setProjectId("");
                      }}
                      className={cn(inputClass, "cursor-pointer")}
                    >
                      <option value="">Select a client…</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                          {c.company ? ` · ${c.company}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="project">Project (optional)</label>
                  <select
                    id="project"
                    value={projectId}
                    disabled={!isDraft || !clientId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="">No project</option>
                    {projectsForClient.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="milestone">Milestone (optional)</label>
                  <select
                    id="milestone"
                    value={milestoneId}
                    disabled={!isDraft || !projectId}
                    onChange={(e) => setMilestoneId(e.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="">No milestone</option>
                    {milestones.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Invoice meta */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-zinc-900">Invoice details</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelClass} htmlFor="invoiceNumber">Invoice number</label>
                  <input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    disabled={!isDraft}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Auto-generated if left blank"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    disabled={!isDraft}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {["CAD", "USD", "EUR", "GBP"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="issueDate">Issue date</label>
                  <input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    disabled={!isDraft}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="dueDate">Due date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    disabled={!isDraft}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass} htmlFor="title">Title (optional)</label>
                <input
                  id="title"
                  value={title}
                  disabled={!isDraft}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Website redesign — Phase 1"
                  className={inputClass}
                />
              </div>
            </section>

            {/* Line items */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Line items</h2>
                {isDraft && (
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <Plus size={13} /> Add item
                  </button>
                )}
              </div>

              <div className="hidden grid-cols-[20px_1fr_90px_120px_120px_36px] gap-3 px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400 sm:grid">
                <span />
                <span>Description</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Unit price</span>
                <span className="text-right">Amount</span>
                <span />
              </div>

              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 items-center gap-2 rounded-xl border border-zinc-100 p-2.5 sm:grid-cols-[20px_1fr_90px_120px_120px_36px] sm:border-0 sm:p-0"
                  >
                    {isDraft ? (
                      <div className="hidden flex-col gap-1 sm:flex">
                        <button
                          type="button"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="text-zinc-300 hover:text-zinc-600 disabled:opacity-30"
                          aria-label="Move item up"
                        >
                          <GripVertical size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="hidden sm:block" />
                    )}

                    <input
                      value={item.description}
                      disabled={!isDraft}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Describe the work or deliverable"
                      className={inputClass}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      disabled={!isDraft}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                      className={cn(inputClass, "text-right")}
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      disabled={!isDraft}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                      className={cn(inputClass, "text-right")}
                    />

                    <p className="px-1 text-right text-sm font-semibold text-zinc-800">
                      {formatCurrency((item.quantity || 0) * (item.unitPrice || 0), currency)}
                    </p>

                    {isDraft && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        aria-label="Remove line item"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-zinc-800">{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-zinc-500">
                    <span>Tax</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxAmount}
                      disabled={!isDraft}
                      onChange={(e) => setTaxAmount(e.target.value)}
                      className="h-8 w-28 rounded-md border border-zinc-200 bg-white px-2 text-right text-sm outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-zinc-500">
                    <span>Discount</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discountAmount}
                      disabled={!isDraft}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="h-8 w-28 rounded-md border border-zinc-200 bg-white px-2 text-right text-sm outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-base font-bold text-zinc-900">
                    <span>Total</span>
                    <span>{formatCurrency(total, currency)}</span>
                  </div>
                  {amountPaid > 0 && (
                    <>
                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Paid</span>
                        <span>{formatCurrency(amountPaid, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold text-zinc-800">
                        <span>Due</span>
                        <span>{formatCurrency(amountDue, currency)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Notes & terms */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="notes">Client-visible notes</label>
                  <textarea
                    id="notes"
                    rows={4}
                    value={notes}
                    disabled={!isDraft}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Shown to the client on the invoice"
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 disabled:bg-zinc-50 disabled:text-zinc-400"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="terms">Payment terms</label>
                  <textarea
                    id="terms"
                    rows={4}
                    value={terms}
                    disabled={!isDraft}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="e.g. Due within 14 days of issue"
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 disabled:bg-zinc-50 disabled:text-zinc-400"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </motion.main>
    </div>
  );
}

function InvoicePreview({
  invoiceNumber,
  title,
  client,
  issueDate,
  dueDate,
  items,
  currency,
  subtotal,
  taxAmount,
  discountAmount,
  total,
  amountPaid,
  amountDue,
  notes,
  terms,
}: {
  invoiceNumber: string;
  title: string;
  client: ClientOption | undefined;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes: string;
  terms: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-12">
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-zinc-100 pb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Invoice</p>
          <h1 className="font-serif mt-2 text-3xl font-bold text-zinc-900">
            {invoiceNumber || "Draft"}
          </h1>
          {title && <p className="mt-1 text-sm text-zinc-500">{title}</p>}
        </div>
        <div className="text-right text-sm text-zinc-500">
          <div className="flex items-center justify-end gap-2">
            <CalendarDays size={14} className="text-zinc-400" />
            Issued {issueDate || "—"}
          </div>
          {dueDate && <p className="mt-1">Due {dueDate}</p>}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Billed to</p>
        <p className="mt-1 text-sm font-semibold text-zinc-900">{client?.name || "No client selected"}</p>
        {client?.company && <p className="text-sm text-zinc-500">{client.company}</p>}
        {client?.email && <p className="text-sm text-zinc-500">{client.email}</p>}
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-[0.1em] text-zinc-400">
            <th className="pb-2 font-semibold">Description</th>
            <th className="pb-2 text-right font-semibold">Qty</th>
            <th className="pb-2 text-right font-semibold">Unit price</th>
            <th className="pb-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items
            .filter((it) => it.description.trim())
            .map((it) => (
              <tr key={it.id} className="border-b border-zinc-100">
                <td className="py-3 text-zinc-800">{it.description}</td>
                <td className="py-3 text-right text-zinc-500">{it.quantity}</td>
                <td className="py-3 text-right text-zinc-500">{formatCurrency(it.unitPrice, currency)}</td>
                <td className="py-3 text-right font-medium text-zinc-900">
                  {formatCurrency(it.quantity * it.unitPrice, currency)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Tax</span>
            <span>{formatCurrency(taxAmount, currency)}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Discount</span>
            <span>-{formatCurrency(discountAmount, currency)}</span>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatCurrency(total, currency)}</span>
          </div>
          {amountPaid > 0 && (
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Amount due</span>
              <span>{formatCurrency(amountDue, currency)}</span>
            </div>
          )}
        </div>
      </div>

      {(notes || terms) && (
        <div className="mt-10 grid gap-6 border-t border-zinc-100 pt-6 sm:grid-cols-2">
          {notes && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Notes</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">{notes}</p>
            </div>
          )}
          {terms && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Payment terms</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">{terms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}