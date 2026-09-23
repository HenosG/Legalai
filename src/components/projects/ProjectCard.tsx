import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Milestone as MilestoneIcon } from "lucide-react";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProjectHealthBadge from "./ProjectHealthBadge";
import ProjectProgressBar from "./ProjectProgressBar";

export interface ProjectListItem {
  id: string;
  name: string;
  status: string;
  health: string;
  progress: number;
  budget: number | null;
  currency: string;
  targetDate: string | null;
  taskCount: number;
  milestoneCount: number;
  completedTaskCount: number;
  client?: { id: string; name: string; company: string | null };
}

export default function ProjectCard({ project, onClick }: { project: ProjectListItem; onClick: () => void }) {
  const formattedBudget = project.budget != null
    ? new Intl.NumberFormat("en-CA", { style: "currency", currency: project.currency || "CAD", maximumFractionDigits: 0 }).format(project.budget)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] text-zinc-400">
            {project.client?.name}{project.client?.company ? ` · ${project.client.company}` : ""}
          </p>
          <h3 className="text-[15px] font-semibold text-zinc-800 mt-0.5">{project.name}</h3>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <ProjectProgressBar progress={project.progress} />

      <div className="flex items-center justify-between text-[12px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} /> {project.completedTaskCount}/{project.taskCount}
          </span>
          <span className="flex items-center gap-1">
            <MilestoneIcon size={13} /> {project.milestoneCount}
          </span>
        </div>
        <ProjectHealthBadge health={project.health} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-50 text-[12px]">
        {project.targetDate ? (
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Calendar size={13} />
            {new Date(project.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        ) : <span />}
        {formattedBudget && <span className="font-semibold text-zinc-700">{formattedBudget}</span>}
      </div>
    </motion.div>
  );
}