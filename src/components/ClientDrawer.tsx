import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Client } from "../lib/api";

interface ClientDrawerProps {
  open: boolean;
  mode: "create" | "edit";
  client: Client | null;
  onClose: () => void;
  onSave: (data: Partial<Client>) => Promise<void>;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: string;
  tags: string; // comma-separated in the UI, split on save
}

const EMPTY_FORM: FormState = {
  name: "", email: "", phone: "", company: "", title: "", status: "lead", tags: "",
};

const STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] transition-all";

const errorInputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-red-300 bg-red-50/30 text-[14px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)] transition-all";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">{title}</p>
    {children}
  </div>
);

const Field = ({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
  </div>
);

export default function ClientDrawer({ open, mode, client, onClose, onSave }: ClientDrawerProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        client
          ? {
              name: client.name ?? "",
              email: client.email ?? "",
              phone: client.phone ?? "",
              company: client.company ?? "",
              title: client.title ?? "",
              status: client.status ?? "lead",
              tags: (client.tags ?? []).join(", "),
            }
          : EMPTY_FORM
      );
      setErrors({});
      setSubmitError(null);
    }
  }, [open, client]);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        title: form.title.trim() || null,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (err) {
      // Surfaced to the user instead of only logged — this is the fix for
      // the old "fails silently" behavior.
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong saving this client. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <h2 className="font-serif text-xl font-bold text-zinc-900">
                {mode === "create" ? "Add Client" : "Edit Client"}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              <Section title="Basic Info">
                <Field label="Full name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Jane Doe"
                    className={errors.name ? errorInputClass : inputClass}
                  />
                </Field>
                <Field label="Title / Role">
                  <input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="Marketing Director"
                    className={inputClass}
                  />
                </Field>
              </Section>

              <Section title="Company Details">
                <Field label="Company">
                  <input
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Acme Inc."
                    className={inputClass}
                  />
                </Field>
              </Section>

              <Section title="Contact Info">
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="jane@acme.com"
                    className={errors.email ? errorInputClass : inputClass}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </Field>
              </Section>

              <Section title="Status & Tags">
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => update("status", e.target.value)}
                    className={inputClass + " cursor-pointer"}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Tags (comma-separated)">
                  <input
                    value={form.tags}
                    onChange={(e) => update("tags", e.target.value)}
                    placeholder="web-design, priority"
                    className={inputClass}
                  />
                </Field>
              </Section>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {submitError}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-zinc-100 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-all disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {mode === "create" ? "Add Client" : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}