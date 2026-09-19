import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Phone, Building2, Tag, Plus,
  FolderKanban, Receipt, Clock, Loader2, UserCircle2, ChevronDown,
} from "lucide-react";
import { clientsApi, ClientDetail as ClientDetailType, AssignableUser } from "../lib/api";

const INVOICE_STATUS_STYLES: Record<string, string> = {
  PAID: "text-emerald-700 bg-emerald-50 border-emerald-100",
  UNPAID: "text-amber-700 bg-amber-50 border-amber-100",
  OVERDUE: "text-red-700 bg-red-50 border-red-100",
};

const Card = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-zinc-100 bg-white p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">{title}</p>
      {action}
    </div>
    {children}
  </div>
);

const userLabel = (u: { firstName?: string | null; lastName?: string | null; email: string } | null | undefined) => {
  if (!u) return null;
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return name || u.email;
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteBody, setNoteBody] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await clientsApi.getById(id);
      setClient(data);
    } catch (error) {
      console.error("Error loading client:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (!id) return;
    clientsApi.getAssignableUsers(id).then((res) => setAssignableUsers(res.users)).catch((err) => {
      console.error("Error loading assignable users:", err);
    });
  }, [id]);

  const handleAddNote = async () => {
    if (!id || !noteBody.trim()) return;
    setAddingNote(true);
    try {
      await clientsApi.addNote(id, noteBody.trim());
      setNoteBody("");
      await load();
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleAssign = async (userId: string | null) => {
    if (!id) return;
    setAssigning(true);
    setAssignMenuOpen(false);
    try {
      await clientsApi.update(id, { assignedUserId: userId });
      await load();
    } catch (error) {
      console.error("Error assigning client:", error);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-sm text-zinc-500">
        Client not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-5xl mx-auto"
      >
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 text-[13px] font-semibold text-zinc-400 hover:text-zinc-700 transition-colors mb-6"
        >
          <ArrowLeft size={15} /> Back to Clients
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight">{client.name}</h1>
            {client.company && <p className="text-sm text-zinc-500 mt-1">{client.company}</p>}
          </div>

          {/* Team Assignment */}
          <div className="relative">
            <button
              onClick={() => setAssignMenuOpen((o) => !o)}
              disabled={assigning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-[13px] font-semibold text-zinc-700 hover:border-zinc-300 transition-all disabled:opacity-60"
            >
              <UserCircle2 size={15} className="text-zinc-400" />
              {userLabel(client.assignedUser) || "Unassigned"}
              <ChevronDown size={13} className="text-zinc-400" />
            </button>
            {assignMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAssignMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 rounded-xl border border-zinc-100 bg-white shadow-lg py-1 min-w-[180px]">
                  <button
                    onClick={() => handleAssign(null)}
                    className="w-full text-left px-3 py-2 text-[13px] text-zinc-500 hover:bg-zinc-50 transition-colors"
                  >
                    Unassigned
                  </button>
                  {assignableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleAssign(u.id)}
                      className="w-full text-left px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {userLabel(u)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact & Profile */}
          <Card title="Contact & Profile">
            <div className="space-y-3 text-[13px] text-zinc-700">
              {client.email && <div className="flex items-center gap-2"><Mail size={14} className="text-zinc-400" /> {client.email}</div>}
              {client.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-zinc-400" /> {client.phone}</div>}
              {client.company && <div className="flex items-center gap-2"><Building2 size={14} className="text-zinc-400" /> {client.company}</div>}
              {client.tags && client.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag size={14} className="text-zinc-400 mt-0.5" />
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-zinc-100 text-[11px] text-zinc-600">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Notes</p>
              <div className="flex gap-2 mb-3">
                <input
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  placeholder="Add a note…"
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-[13px] outline-none focus:border-zinc-400"
                />
                <button
                  onClick={handleAddNote}
                  disabled={addingNote || !noteBody.trim()}
                  className="px-3 py-2 rounded-lg bg-zinc-900 text-white disabled:opacity-50"
                  aria-label="Add note"
                >
                  {addingNote ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(client.clientNotes ?? []).map((n) => (
                  <div key={n.id} className="text-[12px] text-zinc-600 bg-zinc-50 rounded-lg px-3 py-2">
                    <p>{n.body}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
                {(!client.clientNotes || client.clientNotes.length === 0) && (
                  <p className="text-[12px] text-zinc-400">No notes yet.</p>
                )}
              </div>
            </div>
          </Card>

          {/* Projects */}
          <Card title="Projects" action={<FolderKanban size={14} className="text-zinc-400" />}>
            {client.projects && client.projects.length > 0 ? (
              <div className="space-y-4">
                {client.projects.map((p) => (
                  <div key={p.id} className="text-[13px]">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-zinc-800">{p.name}</p>
                      <span className="text-[11px] text-zinc-400">{p.progress ?? 0}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${p.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-zinc-400">No projects yet.</p>
            )}
          </Card>

          {/* Invoices — Invoice model has no `number` field, so we show a
              short id reference instead of inventing one. Add a `number`
              field to schema.prisma if you want real sequential numbering. */}
          <Card title="Invoices" action={<Receipt size={14} className="text-zinc-400" />}>
            {client.invoices && client.invoices.length > 0 ? (
              <div className="space-y-3">
                {client.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-zinc-500 font-mono text-[11px]">#{inv.id.slice(0, 8)}</span>
                    <span className="font-semibold text-zinc-800">
                      ${inv.amount.toLocaleString()}
                      {inv.amountPaid > 0 && inv.amountPaid < inv.amount && (
                        <span className="text-zinc-400 font-normal"> (${inv.amountPaid.toLocaleString()} paid)</span>
                      )}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${INVOICE_STATUS_STYLES[inv.status] || INVOICE_STATUS_STYLES.UNPAID}`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-zinc-400">No invoices yet.</p>
            )}
          </Card>
        </div>

        {/* Activity Timeline — pulled from ActivityLog where targetId = client.id.
            Will stay empty until other parts of the app actually write
            ActivityLog rows with targetId set to this client's id. */}
        <div className="mt-6">
          <Card title="Activity Timeline" action={<Clock size={14} className="text-zinc-400" />}>
            {client.activity && client.activity.length > 0 ? (
              <div className="space-y-4">
                {client.activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-[13px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-2 shrink-0" />
                    <div>
                      <p className="text-zinc-700">{item.description}</p>
                      <p className="text-[11px] text-zinc-400">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-zinc-400">No activity yet.</p>
            )}
          </Card>
        </div>
      </motion.main>
    </div>
  );
}