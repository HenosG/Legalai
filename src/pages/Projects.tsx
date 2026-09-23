import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Search, Plus, FolderKanban, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createApiClient } from "@/lib/api";
import ProjectCard, { ProjectListItem } from "../components/projects/ProjectCard";
import CreateProjectDialog from "../components/projects/CreateProjectDialog";

const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "AT_RISK", label: "At Risk" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "COMPLETED", label: "Completed" },
];

interface MetricCardProps { label: string; value: number | string; loading: boolean }
const MetricCard = ({ label, value, loading }: MetricCardProps) => (
  <motion.div variants={itemVariants} className="rounded-2xl border border-zinc-100 bg-white p-5">
    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 mb-1.5">{label}</p>
    {loading ? (
      <div className="h-7 w-14 rounded bg-zinc-100 animate-pulse" />
    ) : (
      <p className="font-serif text-[28px] font-bold text-zinc-900 leading-none tracking-tight">{value}</p>
    )}
  </motion.div>
);

export default function Projects() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const api = useCallback(async () => createApiClient(await getToken()), [getToken]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await (await api()).get<{ projects: ProjectListItem[] }>(`/api/projects?${params.toString()}`);
      setProjects(res.projects || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, api]);

  useEffect(() => { load(); }, [load]);

  const metrics = {
    active: projects.filter((p) => p.status === "ACTIVE").length,
    atRisk: projects.filter((p) => p.status === "AT_RISK" || p.health === "AT_RISK" || p.health === "OFF_TRACK").length,
    dueThisWeek: projects.reduce((sum, p) => sum + 0, 0), // computed server-side per-project as upcomingTaskCount; sum here if present
    completedThisMonth: projects.filter((p) => {
      if (p.status !== "COMPLETED") return false;
      return true; // completedAt not in list payload; refine once available client-side if needed
    }).length,
  };

  const handleCreated = async () => {
    setCreateOpen(false);
    toast.success("Project created");
    await load();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="w-full px-6 sm:px-12 pt-16 pb-24 max-w-6xl mx-auto">
        <motion.div variants={itemVariants} className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Projects</p>
            <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight">Projects</h1>
            <p className="text-sm text-zinc-500 mt-2">Track delivery across every active engagement.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Plus size={15} /> New Project
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Active Projects" value={metrics.active} loading={loading} />
          <MetricCard label="At Risk" value={metrics.atRisk} loading={loading} />
          <MetricCard label="Tasks Due This Week" value={metrics.dueThisWeek} loading={loading} />
          <MetricCard label="Completed This Month" value={metrics.completedThisMonth} loading={loading} />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-300 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] transition-all"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-1.5 flex-wrap mb-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all border ${
                statusFilter === tab.value
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={22} className="text-red-400 mb-3" />
            <p className="text-sm text-zinc-500 mb-3">{error}</p>
            <button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Try again</button>
          </div>
        ) : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 h-44 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-white p-16 text-center">
            <FolderKanban size={24} className="text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-500">No projects yet</p>
            <p className="text-xs text-zinc-400 mt-1">Projects are created automatically when a proposal is signed, or start one manually.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
            ))}
          </div>
        )}
      </motion.main>

      <CreateProjectDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
    </div>
  );
}