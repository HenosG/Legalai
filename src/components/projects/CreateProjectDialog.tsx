import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createApiClient } from "@/lib/api";

interface Client { id: string; name: string; company?: string | null }

export default function CreateProjectDialog({
  open, onClose, onCreated,
}: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { getToken } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingClients(true);
      try {
        const api = createApiClient(await getToken());
        const res = await api.get<{ clients: Client[] }>("/api/clients");
        setClients(res.clients || []);
        if (res.clients?.length) setClientId(res.clients[0].id);
      } catch (e) {
        toast.error("Couldn't load clients");
      } finally {
        setLoadingClients(false);
      }
    })();
  }, [open, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim()) {
      toast.error("Client and project name are required");
      return;
    }
    setSubmitting(true);
    try {
      const api = createApiClient(await getToken());
      await api.post("/api/projects", {
        clientId,
        name: name.trim(),
        budget: budget ? parseFloat(budget) : undefined,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      });
      setName(""); setBudget(""); setTargetDate("");
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-bold text-zinc-900">New Project</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 transition-all" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Client</label>
                  {loadingClients ? (
                    <div className="h-10 bg-zinc-100 rounded-xl animate-pulse" />
                  ) : clients.length === 0 ? (
                    <p className="text-sm text-zinc-500">No clients found — add one in CRM first.</p>
                  ) : (
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Project Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Website Redesign"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Budget (CAD)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="10000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Target Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-all disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}