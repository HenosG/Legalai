import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "../lib/api";
import { cn } from "../lib/utils";
import { X, Building2, Mail, Phone, Tag, User } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientModalProps {
  open: boolean;
  mode: "create" | "edit";
  client: Client | null;
  onClose: () => void;
  onSubmit: (data: Partial<Client>) => Promise<void>;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  tags: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const springTransition = { type: "spring", stiffness: 400, damping: 30 } as const;

// ─── Input Field ─────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ label, icon, error, children }: FieldProps) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
    {error && (
      <p className="mt-1.5 text-[11px] text-red-500 font-medium">{error}</p>
    )}
  </div>
);

const inputClass = (hasError: boolean) =>
  cn(
    "w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white text-[14px] text-zinc-800 placeholder-zinc-400 outline-none transition-all",
    hasError
      ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
      : "border-zinc-200 focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
  );

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function ClientModal({ open, mode, client, onClose, onSubmit }: ClientModalProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "lead",
    tags: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && client) {
        setForm({
          name: client.name || "",
          company: client.company || "",
          email: client.email || "",
          phone: client.phone || "",
          status: client.status || "lead",
          tags: client.tags?.join(", ") || "",
          notes: client.notes || "",
        });
      } else {
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          status: "lead",
          tags: "",
          notes: "",
        });
      }
      setErrors({});
    }
  }, [open, mode, client]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: Partial<Client> = {
        name: form.name.trim(),
        company: form.company.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: form.notes.trim() || undefined,
      };
      await onSubmit(payload);
    } catch {
      // Error surfaced by parent
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-zinc-900/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl shadow-zinc-900/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-1">
                  {mode === "create" ? "New Client" : "Edit Client"}
                </p>
                <h2 className="font-serif text-xl font-bold text-zinc-900 tracking-tight">
                  {mode === "create" ? "Add a client" : `Edit ${client?.name}`}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              <Field label="Full Name" icon={<User size={14} />} error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Smith"
                  className={inputClass(!!errors.name)}
                  autoFocus
                />
              </Field>

              <Field label="Company" icon={<Building2 size={14} />}>
                <input
                  type="text"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Acme Corp"
                  className={inputClass(false)}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" icon={<Mail size={14} />} error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="jane@acme.com"
                    className={inputClass(!!errors.email)}
                  />
                </Field>
                <Field label="Phone" icon={<Phone size={14} />}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass(false)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={set("status")}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] text-zinc-700 outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] appearance-none cursor-pointer transition-all"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Field label="Tags" icon={<Tag size={14} />}>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={set("tags")}
                    placeholder="enterprise, saas"
                    className={inputClass(false)}
                  />
                </Field>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-2">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Any additional context…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] resize-none transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                )}
                {mode === "create" ? "Add Client" : "Save Changes"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}