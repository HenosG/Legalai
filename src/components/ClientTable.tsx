import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "../lib/api";
import { cn } from "../lib/utils";
import {
  Building2, Mail, Phone, MoreHorizontal,
  Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";

// ─── Status Badge ────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  lead: {
    label: "Lead",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    className: "bg-zinc-100 text-zinc-500 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.inactive;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
        config.className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

// ─── Tag Pill ────────────────────────────────────────────────────────────────

const TAG_COLORS = [
  "bg-blue-50 text-blue-600 border-blue-100",
  "bg-purple-50 text-purple-600 border-purple-100",
  "bg-emerald-50 text-emerald-600 border-emerald-100",
  "bg-rose-50 text-rose-600 border-rose-100",
  "bg-cyan-50 text-cyan-600 border-cyan-100",
  "bg-amber-50 text-amber-600 border-amber-100",
];

const TagPill = ({ tag, index }: { tag: string; index: number }) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold",
      TAG_COLORS[index % TAG_COLORS.length]
    )}
  >
    {tag}
  </span>
);

// ─── Avatar ──────────────────────────────────────────────────────────────────

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hues = [210, 260, 160, 20, 320, 190];
  const hue = hues[name.length % hues.length];

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
      style={{ backgroundColor: `hsl(${hue}, 60%, 55%)` }}
    >
      {initials}
    </div>
  );
};

// ─── Delete Confirmation ─────────────────────────────────────────────────────

const DeleteConfirm = ({
  clientName,
  onConfirm,
  onCancel,
}: {
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.15 }}
    className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 p-4"
  >
    <p className="text-[13px] font-semibold text-zinc-800 mb-1">Delete client?</p>
    <p className="text-[12px] text-zinc-500 mb-4 leading-relaxed">
      <span className="font-medium">{clientName}</span> will be permanently removed.
    </p>
    <div className="flex gap-2">
      <button
        onClick={onCancel}
        className="flex-1 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 py-1.5 rounded-lg bg-red-600 text-[12px] font-semibold text-white hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  </motion.div>
);

// ─── Row Actions ─────────────────────────────────────────────────────────────

const RowActions = ({
  client,
  onEdit,
  onDelete,
}: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
      >
        <MoreHorizontal size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setConfirming(false); }} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 py-1"
            >
              <button
                onClick={() => { onEdit(client); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <Pencil size={13} className="text-zinc-400" />
                Edit client
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} className="text-red-400" />
                Delete client
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirming && (
          <DeleteConfirm
            clientName={client.name}
            onConfirm={() => { onDelete(client.id); setOpen(false); setConfirming(false); }}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Skeleton Row ────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <tr className="border-b border-zinc-50">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 rounded bg-zinc-100 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

// ─── Main Table ──────────────────────────────────────────────────────────────

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

type SortField = "name" | "company" | "status";
type SortDir = "asc" | "desc";

export default function ClientTable({ clients, loading, onEdit, onDelete }: ClientTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedClients = [...clients].sort((a, b) => {
    const aVal = (a[sortField] || "").toString().toLowerCase();
    const bVal = (b[sortField] || "").toString().toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-zinc-300" />;
    return sortDir === "asc"
      ? <ArrowUp size={12} className="text-zinc-500" />
      : <ArrowDown size={12} className="text-zinc-500" />;
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="px-5 py-3.5">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Name <SortIcon field="name" />
                </button>
              </th>
              <th className="px-5 py-3.5">
                <button
                  onClick={() => handleSort("company")}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Company <SortIcon field="company" />
                </button>
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                Contact
              </th>
              <th className="px-5 py-3.5">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                Tags
              </th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : sortedClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-20 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mx-auto mb-3">
                    <Building2 size={20} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-500">No clients found</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Try adjusting your search or filters.
                  </p>
                </td>
              </tr>
            ) : (
              sortedClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors group"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-zinc-900 truncate">
                          {client.name}
                        </p>
                        {client.title && (
                          <p className="text-[11px] text-zinc-400 truncate">{client.title}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-5 py-4">
                    <p className="text-[13px] text-zinc-600 truncate">
                      {client.company || "—"}
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                          <Mail size={11} className="text-zinc-300 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                          <Phone size={11} className="text-zinc-300 shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {!client.email && !client.phone && (
                        <span className="text-[12px] text-zinc-300">—</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={client.status} />
                  </td>

                  {/* Tags */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.tags?.slice(0, 3).map((tag, i) => (
                        <TagPill key={tag} tag={tag} index={i} />
                      ))}
                      {client.tags && client.tags.length > 3 && (
                        <span className="text-[10px] text-zinc-400 font-medium">
                          +{client.tags.length - 3}
                        </span>
                      )}
                      {(!client.tags || client.tags.length === 0) && (
                        <span className="text-[12px] text-zinc-300">—</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <RowActions client={client} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}