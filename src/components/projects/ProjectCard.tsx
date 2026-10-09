import {
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Loader2,
  Milestone as MilestoneIcon,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createApiClient } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";

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
  client?: {
    id: string;
    name: string;
    company: string | null;
  };
}

type ProgressStyle = "bar" | "ring";

interface ProjectQuestionResponse {
  message?: string;
  answer?: string;
}

function normalize(value?: string | null) {
  return String(value || "").trim().toUpperCase();
}

function formatWords(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatus(status?: string | null) {
  switch (normalize(status)) {
    case "ACTIVE":
      return {
        label: "Active",
        dot: "bg-blue-500",
        pill: "border-blue-200 bg-blue-50 text-blue-700",
      };
    case "AT_RISK":
      return {
        label: "At risk",
        dot: "bg-rose-500",
        pill: "border-rose-200 bg-rose-50 text-rose-700",
      };
    case "ON_HOLD":
      return {
        label: "On hold",
        dot: "bg-amber-500",
        pill: "border-amber-200 bg-amber-50 text-amber-800",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        dot: "bg-emerald-500",
        pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    default:
      return {
        label: normalize(status) ? formatWords(normalize(status)) : "Active",
        dot: "bg-zinc-400",
        pill: "border-zinc-200 bg-zinc-50 text-zinc-600",
      };
  }
}

function getHealth(health?: string | null, isFinished = false) {
  if (isFinished) {
    return {
      label: "Finished",
      className: "text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  switch (normalize(health)) {
    case "ON_TRACK":
      return {
        label: "On track",
        className: "text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "AT_RISK":
      return {
        label: "At risk",
        className: "text-amber-700",
        dot: "bg-amber-500",
      };
    case "OFF_TRACK":
    case "BLOCKED":
      return {
        label: normalize(health) === "BLOCKED" ? "Blocked" : "Off track",
        className: "text-rose-700",
        dot: "bg-rose-500",
      };
    default:
      return {
        label: "Health not set",
        className: "text-zinc-500",
        dot: "bg-zinc-300",
      };
  }
}

function getClientInitials(name?: string | null) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "—";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function formatMoney(amount: number | null, currency?: string) {
  if (amount == null) return "Budget not set";

  const code = /^[A-Z]{3}$/.test(currency || "") ? currency! : "CAD";

  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

function getProgressColor(isFinished: boolean, progress: number) {
  if (isFinished) return "bg-emerald-500";
  if (progress >= 75) return "bg-emerald-500";
  if (progress >= 35) return "bg-blue-500";
  return "bg-indigo-500";
}

function ProgressRing({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) {
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  const strokeColor =
    colorClass === "bg-emerald-500"
      ? "#10b981"
      : colorClass === "bg-blue-500"
        ? "#3b82f6"
        : colorClass === "bg-indigo-500"
          ? "#6366f1"
          : "#10b981";

  return (
    <div
      className="relative h-12 w-12 shrink-0"
      role="img"
      aria-label={`${value}% complete`}
    >
      <svg
        viewBox="0 0 40 40"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums text-zinc-800">
        {value}%
      </span>
    </div>
  );
}

function stopCardClick(event: MouseEvent) {
  event.stopPropagation();
}

export default function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectListItem;
  onClick: () => void;
}) {
  const { getToken } = useAuth();

  const [progressStyle, setProgressStyle] = useState<ProgressStyle>("bar");
  const [aiOpen, setAiOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const status = getStatus(project.status);

  const taskCount = Math.max(0, Number(project.taskCount) || 0);
  const completedTaskCount = Math.max(
    0,
    Number(project.completedTaskCount) || 0
  );

  // Prefer the current task counts when present. This handles a completed
  // 5/5 project even if the stored progress value has not refreshed yet.
  const progress = Math.max(
    0,
    Math.min(
      100,
      taskCount > 0
        ? Math.round((completedTaskCount / taskCount) * 100)
        : Number(project.progress) || 0
    )
  );

  const isFinished =
    normalize(project.status) === "COMPLETED" ||
    (taskCount > 0 && completedTaskCount >= taskCount);

  const health = getHealth(project.health, isFinished);
  const progressColor = getProgressColor(isFinished, progress);

  const targetDate = useMemo(
    () => formatDate(project.targetDate),
    [project.targetDate]
  );

  const clientName = project.client?.name || "No client";
  const clientInitials = getClientInitials(project.client?.name);
  const budgetText = formatMoney(project.budget, project.currency);

  const handleAskProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || aiLoading) return;

    setAiLoading(true);
    setAiError(null);
    setAiAnswer("");

    try {
      const token = await getToken();
      const api = createApiClient(token);

      /*
       * This uses the existing authenticated /api/ai-assistant route.
       * It includes the specific project ID/name in the prompt.
       */
      const response = await api.post<ProjectQuestionResponse>(
        "/api/ai-assistant",
        {
          query: `Answer this question using only this RelunoOS project, not other projects:
Project ID: ${project.id}
Project name: ${project.name}
Client: ${clientName}${project.client?.company ? ` (${project.client.company})` : ""}
Project status: ${project.status}
Project health: ${project.health || "not set"}
Progress: ${progress}%
Budget: ${budgetText}
Target date: ${project.targetDate || "not set"}
Tasks: ${completedTaskCount} completed of ${taskCount}
Milestones: ${project.milestoneCount}

Question: ${trimmedQuestion}

If the available project details do not contain the answer, say that you don't have enough project data to answer.`,
        }
      );

      const answer = response.message || response.answer;

      if (!answer) {
        throw new Error("The AI did not return an answer.");
      }

      setAiAnswer(answer);
    } catch (error) {
      console.error("Project card AI question failed:", error);
      setAiError(
        error instanceof Error
          ? error.message
          : "Could not get an answer for this project."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={onClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open project ${project.name}`}
      className={cn(
        "group relative flex min-h-[286px] flex-col overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all",
        isFinished
          ? "border-emerald-200/80 hover:border-emerald-300"
          : "border-zinc-200 hover:border-zinc-300",
        "hover:shadow-[0_12px_30px_rgba(24,24,27,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      )}
    >
      {isFinished && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-[11px] font-semibold tracking-wide text-white ring-2 ring-white shadow-sm">
            {clientInitials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-zinc-500">
              {clientName}
            </p>
            {project.client?.company && (
              <p className="truncate text-[10px] text-zinc-400">
                {project.client.company}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              stopCardClick(event);
              setAiOpen((open) => !open);
              setAiError(null);
            }}
            title="Ask AI about this project"
            aria-label={`Ask AI about ${project.name}`}
            aria-expanded={aiOpen}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
              aiOpen
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-zinc-200 bg-white text-zinc-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            )}
          >
            <Sparkles size={14} />
          </button>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em]",
              status.pill
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 min-h-[42px] text-[15px] font-semibold leading-5 tracking-[-0.02em] text-zinc-900">
          {project.name || "Untitled project"}
        </h3>

        {isFinished && (
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 size={13} />
            Done
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            Project budget
          </p>
          <p
            className={cn(
              "mt-1 truncate text-[25px] font-bold leading-none tracking-[-0.045em] tabular-nums",
              project.budget == null ? "text-zinc-400" : "text-zinc-950"
            )}
          >
            {budgetText}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">
            Health
          </p>
          <p
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold",
              health.className
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", health.dot)} />
            {health.label}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-zinc-500">
            {isFinished ? "Delivery complete" : "Delivery progress"}
          </span>
          <span className="text-[11px] font-bold tabular-nums text-zinc-800">
            {progress}%
          </span>
        </div>

        {progressStyle === "bar" ? (
          <button
            type="button"
            onClick={(event) => {
              stopCardClick(event);
              setProgressStyle("ring");
            }}
            title="Switch to circular progress"
            aria-label="Switch to circular progress"
            className="block w-full rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Project is ${progress}% complete`}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progressColor
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              stopCardClick(event);
              setProgressStyle("bar");
            }}
            title="Switch to progress bar"
            aria-label="Switch to progress bar"
            className="flex w-full items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="text-[10px] text-zinc-500">
              Click to show progress bar
            </span>
            <ProgressRing value={progress} colorClass={progressColor} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-600" />
          <span className="font-medium text-zinc-700">
            {completedTaskCount}
          </span>
          /{taskCount} tasks
        </span>

        <span className="inline-flex items-center gap-1.5">
          <MilestoneIcon size={12} className="text-violet-500" />
          <span className="font-medium text-zinc-700">
            {project.milestoneCount}
          </span>
          milestones
        </span>

        {targetDate && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} className="text-zinc-400" />
            Due {targetDate}
          </span>
        )}
      </div>

      {aiOpen && (
        <div
          onClick={stopCardClick}
          className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
              <Bot size={13} />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-zinc-900">
                Ask about this project
              </p>
              <p className="text-[9px] text-zinc-500">
                Answers use the project details shown here.
              </p>
            </div>
          </div>

          <form onSubmit={handleAskProject} className="flex gap-1.5">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onClick={stopCardClick}
              placeholder="Ask about progress, deadline, budget…"
              aria-label={`Ask AI about ${project.name}`}
              className="h-8 min-w-0 flex-1 rounded-lg border border-indigo-100 bg-white px-2.5 text-[10px] text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10"
            />
            <button
              type="submit"
              disabled={aiLoading || !question.trim()}
              aria-label="Send project question"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {aiLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <MessageCircle size={13} />
              )}
            </button>
          </form>

          {aiError && (
            <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[10px] leading-4 text-rose-700">
              {aiError}
            </p>
          )}

          {aiLoading && (
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-700">
              <Loader2 size={11} className="animate-spin" />
              Thinking about this project…
            </p>
          )}

          {aiAnswer && !aiLoading && (
            <div className="mt-2 max-h-28 overflow-y-auto rounded-lg border border-indigo-100 bg-white p-2.5">
              <p className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-700">
                {aiAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
          {isFinished ? (
            <>
              <CheckCircle2 size={12} className="text-emerald-500" />
              Project finished
            </>
          ) : targetDate ? (
            <>
              <Clock3 size={12} />
              Target {targetDate}
            </>
          ) : (
            <>
              <Clock3 size={12} />
              No target date
            </>
          )}
        </span>

        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 transition-all group-hover:bg-zinc-900 group-hover:text-white">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </motion.article>
  );
}