import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Users, UserPlus, CheckCircle2, UserX, RefreshCw, 
  MoreVertical, Edit3, Trash2, Mail, Phone
} from "lucide-react";
import { clientsApi, Client } from "../lib/api";
import ClientDrawer from "../components/ClientDrawer";

const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

interface ClientStats {
  total: number;
  leads: number;
  active: number;
  inactive: number;
}

const STATUS_PILLS = [
  { value: "all", label: "All Clients" },
  { value: "lead", label: "Leads" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const KPI = ({
  label, value, icon: Icon, iconColor, iconBg, loading,
}: {
  label: string; value: number; icon: React.ElementType; iconColor: string; iconBg: string; loading: boolean;
}) => (
  <motion.div
    variants={itemVariants}
    className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 hover:border-zinc-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} transition-transform group-hover:scale-105 duration-300`}>
        <Icon size={16} className={iconColor} />
      </div>
    </div>
    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-1">{label}</p>
    {loading ? (
      <div className="h-7 w-16 rounded-md bg-zinc-100 animate-pulse mt-1" />
    ) : (
      <p className="font-serif text-[28px] font-bold text-zinc-900 leading-none tracking-tight">{value}</p>
    )}
  </motion.div>
);

// Portal-based hover action menu that never gets clipped by any container boundaries
const ClientActionMenu = ({
  client,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(true);
  };

  return (
    <div 
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        aria-label="Client actions"
      >
        <MoreVertical size={16} />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              style={{ top: coords.top, right: coords.right }}
              className="fixed w-48 rounded-xl bg-white border border-zinc-200 shadow-2xl py-1.5 z-[9999] focus:outline-none"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-zinc-100">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Quick Actions</p>
              </div>
              <button
                onClick={() => { setIsOpen(false); onEdit(client); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50 transition-colors font-medium text-left"
              >
                <Edit3 size={14} className="text-zinc-400" />
                Edit Profile
              </button>
              <button
                onClick={() => { setIsOpen(false); onStatusChange(client.id, client.status === "active" ? "inactive" : "active"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-zinc-700 hover:bg-zinc-50 transition-colors font-medium text-left"
              >
                <CheckCircle2 size={14} className="text-zinc-400" />
                {client.status === "active" ? "Make Inactive" : "Make Active"}
              </button>
              <div className="h-px bg-zinc-100 my-1" />
              <button
                onClick={() => { setIsOpen(false); onDelete(client.id); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
              >
                <Trash2 size={14} className="text-rose-500" />
                Delete Client
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default function CRM() {
  const { isLoaded } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [stats, setStats] = useState<ClientStats>({ total: 0, leads: 0, active: 0, inactive: 0 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadClients = useCallback(async (showRefresh = false) => {
    showRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [response, allResponse] = await Promise.all([
        clientsApi.getAll(debouncedSearch, statusFilter, page, 20),
        clientsApi.getAll("", "all", 1, 1000),
      ]);
      setClients(response.clients);
      setTotalPages(response.pagination.totalPages);
      setTotalClients(response.pagination.total);
      setStats({
        total: allResponse.pagination.total,
        leads: allResponse.clients.filter((c) => c.status === "lead").length,
        active: allResponse.clients.filter((c) => c.status === "active").length,
        inactive: allResponse.clients.filter((c) => c.status === "inactive").length,
      });
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    if (!isLoaded) return;
    loadClients();
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
    await clientsApi.delete(id);
    await loadClients(true);
  };

  const handleQuickStatusChange = async (id: string, status: string) => {
    await clientsApi.update(id, { status });
    await loadClients(true);
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-24"
      >
        {/* ── Header Section ── */}
        <motion.div variants={itemVariants} className="flex items-end justify-between mb-8 flex-wrap gap-4 border-b border-zinc-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                Customer Relationship Management
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              Directory & Pipeline
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadClients(true)}
              disabled={refreshing}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white flex items-center gap-2 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm disabled:opacity-50 text-[13px] font-medium"
              aria-label="Refresh"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreateDrawer}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-800 transition-all shadow-sm shadow-zinc-900/10"
            >
              <Plus size={15} />
              Add Client
            </motion.button>
          </div>
        </motion.div>

        {/* ── KPI Grid ── */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPI label="Total Clients" value={stats.total} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50/80" loading={loading} />
          <KPI label="Leads" value={stats.leads} icon={UserPlus} iconColor="text-amber-600" iconBg="bg-amber-50/80" loading={loading} />
          <KPI label="Active Clients" value={stats.active} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50/80" loading={loading} />
          <KPI label="Inactive" value={stats.inactive} icon={UserX} iconColor="text-zinc-500" iconBg="bg-zinc-100/80" loading={loading} />
        </motion.section>

        {/* ── Main Content Card (Search, Filters & Table) ── */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          {/* Controls Bar */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-zinc-50/50 rounded-t-2xl">
            <div className="flex-1 relative max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 h-10 rounded-xl border border-zinc-200 bg-white text-[13px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 transition-all shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <div className="flex items-center gap-1 bg-zinc-200/60 p-1 rounded-xl">
                {STATUS_PILLS.map((pill) => (
                  <button
                    key={pill.value}
                    onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                    className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                      statusFilter === pill.value
                        ? "bg-white text-zinc-900 shadow-sm font-semibold"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 bg-zinc-50/30">
                  <th className="py-3.5 px-6">Client / Company</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tags</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[13px]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6"><div className="h-4 w-32 bg-zinc-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-4 w-40 bg-zinc-100 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-5 w-16 bg-zinc-100 rounded-full" /></td>
                      <td className="py-4 px-4"><div className="h-4 w-20 bg-zinc-100 rounded" /></td>
                      <td className="py-4 px-6 text-right"><div className="h-8 w-8 bg-zinc-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-400 font-medium">
                      No clients found matching your search.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-zinc-900">{client.name}</div>
                        <div className="text-[12px] text-zinc-400">{client.company || client.title || "Independent"}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-zinc-700 flex items-center gap-1.5">
                          <Mail size={12} className="text-zinc-400" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="text-[12px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} className="text-zinc-400" />
                            {client.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                          client.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" :
                          client.status === "lead" ? "bg-amber-50 text-amber-700 border border-amber-200/50" :
                          "bg-zinc-100 text-zinc-600 border border-zinc-200/50"
                        }`}>
                          {client.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {client.tags?.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[11px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right relative">
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

          {/* Pagination Footer */}
          {!loading && clients.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/30 rounded-b-2xl">
              <p className="text-[12px] text-zinc-500">
                Showing <span className="font-medium text-zinc-800">{clients.length}</span> of{" "}
                <span className="font-medium text-zinc-800">{totalClients}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3.5 h-8 rounded-lg border border-zinc-200 bg-white text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-[12px] font-medium text-zinc-600 px-1 tabular-nums">
                  {page} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-3.5 h-8 rounded-lg border border-zinc-200 bg-white text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.main>

      <ClientDrawer
        open={drawerOpen}
        mode={drawerMode}
        client={editingClient}
        onClose={() => { setDrawerOpen(false); setEditingClient(null); }}
        onSave={handleSaveClient}
      />
    </div>
  );
}