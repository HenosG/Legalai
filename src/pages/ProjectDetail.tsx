import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleDot,
  Clock,
  Edit3,
  Loader2,
  Milestone as MilestoneIcon,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  ListTodo,
  Wand2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
}

interface ProjectTask {
  id: string;
  title: string;
  description?: string | null;
  completed?: boolean;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  milestoneId?: string | null;
  estimatedHours?: number | null;
  actualHours?: number | null;
}

interface Milestone {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  dueDate?: string | null;
  amount?: number | null;
  tasks?: ProjectTask[];
}

interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description?: string | null;
  status: string;
  health?: string | null;
  budget: number;
  currency?: string | null;
  startDate?: string | null;
  targetDate?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  progress?: number | null;
  client?: Client;
  milestones?: Milestone[];
  tasks?: ProjectTask[];
}

interface AiInsight {
  id?: string;
  summary: string;
  risks: string[];
  nextSteps: string[];
  healthScore: number | null;
  recommendedTasks: string[];
  createdAt?: string;
}

type ProjectStatus =
  | "ACTIVE"
  | "AT_RISK"
  | "ON_HOLD"
  | "COMPLETED";

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    className: string;
    dotClass: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dotClass: "bg-blue-500",
  },
  AT_RISK: {
    label: "At risk",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    dotClass: "bg-rose-500",
  },
  ON_HOLD: {
    label: "On hold",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
};

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
};

function formatCurrency(
  amount: number | null | undefined,
  currency = "CAD"
) {
  const safeCurrency = /^[A-Z]{3}$/.test(currency)
    ? currency
    : "CAD";

  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  } catch {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function normalizeStatus(status?: string | null) {
  return String(status || "ACTIVE").trim().toUpperCase();
}

function isTaskDone(task: ProjectTask) {
  return task.completed === true || normalizeStatus(task.status) === "DONE";
}

function isTaskCancelled(task: ProjectTask) {
  return normalizeStatus(task.status) === "CANCELLED";
}

function isTaskInProgress(task: ProjectTask) {
  const status = normalizeStatus(task.status);
  return status === "IN_PROGRESS" || status === "IN_REVIEW";
}

function getTaskStatusLabel(task: ProjectTask) {
  if (isTaskCancelled(task)) return "Cancelled";
  if (isTaskDone(task)) return "Done";

  const status = normalizeStatus(task.status);

  if (status === "IN_PROGRESS") return "In progress";
  if (status === "IN_REVIEW") return "In review";
  if (status === "BACKLOG") return "Backlog";

  return "To do";
}

function getTaskStatusClass(task: ProjectTask) {
  if (isTaskCancelled(task)) {
    return "border-zinc-200 bg-zinc-100 text-zinc-500";
  }

  if (isTaskDone(task)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (isTaskInProgress(task)) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-zinc-200 bg-white text-zinc-500";
}

function normalizeTaskTitle(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getHealthScoreClass(score: number | null) {
  if (score == null) return "text-zinc-500";
  if (score >= 75) return "text-emerald-700";
  if (score >= 50) return "text-amber-700";
  return "text-rose-700";
}

function ProgressRing({
  progress,
  size = 124,
}: {
  progress: number;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#18181b"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900">
          {clamped}%
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Complete
        </span>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  busy,
  onToggle,
  onDelete,
}: {
  task: ProjectTask;
  busy: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const done = isTaskDone(task);
  const cancelled = isTaskCancelled(task);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border p-3 transition-all",
        done
          ? "border-emerald-100 bg-emerald-50/40"
          : cancelled
            ? "border-zinc-200 bg-zinc-50"
            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={busy || cancelled}
        aria-label={
          done ? `Mark ${task.title} incomplete` : `Complete ${task.title}`
        }
        className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-not-allowed"
      >
        {done ? (
          <CheckCircle2
            size={18}
            className="shrink-0 text-emerald-600"
          />
        ) : isTaskInProgress(task) ? (
          <CircleDot
            size={18}
            className="shrink-0 text-blue-600"
          />
        ) : cancelled ? (
          <Circle
            size={18}
            className="shrink-0 text-zinc-300"
          />
        ) : (
          <Circle
            size={18}
            className="shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-700"
          />
        )}

        <span
          className={cn(
            "min-w-0 flex-1 truncate text-[13px] font-medium",
            done
              ? "text-zinc-400 line-through"
              : cancelled
                ? "text-zinc-400"
                : "text-zinc-800"
          )}
        >
          {task.title}
        </span>

        <span
          className={cn(
            "hidden shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:inline-flex",
            getTaskStatusClass(task)
          )}
        >
          {getTaskStatusLabel(task)}
        </span>
      </button>

      {task.dueDate && (
        <span className="hidden shrink-0 items-center gap-1 text-[10px] text-zinc-400 md:inline-flex">
          <Clock size={11} />
          {formatDate(task.dueDate)}
        </span>
      )}

      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        title="Delete task"
        aria-label={`Delete task: ${task.title}`}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(true);
  const [selectedAiTasks, setSelectedAiTasks] = useState<string[]>([]);
  const [addedAiTasks, setAddedAiTasks] = useState<string[]>([]);

  const api = useCallback(async () => {
    const token = await getToken();
    return createApiClient(token);
  }, [getToken]);

  const populateForm = useCallback((data: Project) => {
    setClientId(data.clientId || "");
    setName(data.name || "");
    setDescription(data.description || "");
    setBudget(String(data.budget ?? ""));
    setStatus((data.status as ProjectStatus) || "ACTIVE");
    setFormError(null);
  }, []);

  const loadProject = useCallback(async () => {
    if (!id || id === "new") {
      const blankProject: Project = {
        id: "new",
        userId: "",
        clientId: "",
        name: "Untitled project",
        status: "ACTIVE",
        budget: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [],
        milestones: [],
      };

      setProject(blankProject);
      populateForm(blankProject);
      setIsEditing(true);
      setLoading(false);
      setPageError(null);
      return;
    }

    setLoading(true);
    setPageError(null);

    try {
      const client = await api();
      const response = await client.get<Project>(`/api/projects/${id}`);

      setProject(response);
      populateForm(response);
    } catch (err) {
      console.error("Failed to load project:", err);
      setPageError(
        err instanceof Error ? err.message : "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  }, [api, id, populateForm]);

  const loadClients = useCallback(async () => {
    setLoadingClients(true);

    try {
      const client = await api();
      const response = await client.get<{ clients: Client[] }>("/api/clients");
      setClients(response.clients || []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoadingClients(false);
    }
  }, [api]);

  useEffect(() => {
    void loadProject();
    void loadClients();
  }, [loadClients, loadProject]);

  const handleStartEditing = () => {
    if (!project) return;
    populateForm(project);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (project?.id === "new") {
      navigate("/projects");
      return;
    }

    if (project) populateForm(project);
    setFormError(null);
    setIsEditing(false);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!project) return;

    if (!clientId || !name.trim() || !budget) {
      setFormError(
        "Please complete the client, project name, and budget before saving."
      );
      return;
    }

    const parsedBudget = Number(budget);

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      setFormError("Enter a valid project budget amount.");
      return;
    }

    setBusyAction("save");
    setFormError(null);

    try {
      const client = await api();
      const payload = {
        clientId,
        name: name.trim(),
        description: description.trim(),
        budget: parsedBudget,
        status,
      };

      let nextProject: Project;

      if (project.id === "new") {
        const responseData = await client.post<Project>(
          "/api/projects",
          payload
        );

        nextProject = responseData;
        navigate(`/projects/${nextProject.id}`, { replace: true });
      } else {
        const updated = await client.patch<Project>(
          `/api/projects/${id}`,
          payload
        );

        nextProject = {
          ...project,
          ...updated,
          client:
            clients.find((item) => item.id === clientId) ||
            updated.client ||
            project.client,
        };
      }

      setProject(nextProject);
      populateForm(nextProject);
      setIsEditing(false);

      toast.success("Project saved successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (err) {
      console.error("Failed to save project:", err);

      const message =
        err instanceof Error ? err.message : "Failed to save project.";

      setFormError(message);
      toast.error("Unable to save project", {
        description: message,
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleTask = async (
    taskId: string,
    currentCompleted: boolean
  ) => {
    if (!project || project.id === "new") return;

    setBusyAction(`toggle-task-${taskId}`);

    try {
      const client = await api();

      await client.patch(`/api/tasks/${taskId}`, {
        completed: !currentCompleted,
      });

      await loadProject();
      toast.success(currentCompleted ? "Task reopened" : "Task completed");
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task status");
    } finally {
      setBusyAction(null);
    }
  };

  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault();

    if (!newTaskTitle.trim() || !project || project.id === "new") {
      return;
    }

    setBusyAction("add-task");

    try {
      const client = await api();

      await client.post(`/api/projects/${project.id}/tasks`, {
        title: newTaskTitle.trim(),
      });

      setNewTaskTitle("");
      await loadProject();
      toast.success("Task added");
    } catch (err) {
      console.error("Failed to add task:", err);

      toast.error("Failed to add task", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project || project.id === "new") return;

    setBusyAction(`delete-task-${taskId}`);

    try {
      const client = await api();
      await client.delete(`/api/tasks/${taskId}`);

      await loadProject();
      toast.success("Task deleted");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    if (!project || !id || id === "new") return;

    setBusyAction("delete");

    try {
      const client = await api();
      await client.delete(`/api/projects/${id}`);

      toast.success("Project deleted successfully!");
      navigate("/projects");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Unable to delete project", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const generateAiInsights = async () => {
    if (!project || project.id === "new") return;

    setAiLoading(true);
    setAiError(null);
    setSelectedAiTasks([]);

    try {
      const client = await api();

      const response = await client.post<AiInsight>(
        `/api/projects/${project.id}/ai-insights`,
        {}
      );

      const normalizedResponse: AiInsight = {
        ...response,
        risks: Array.isArray(response.risks) ? response.risks : [],
        nextSteps: Array.isArray(response.nextSteps)
          ? response.nextSteps
          : [],
        recommendedTasks: Array.isArray(response.recommendedTasks)
          ? response.recommendedTasks
          : [],
      };

      setAiInsight(normalizedResponse);

      const existingTitles = new Set(
        getAllTasks(project)
          .map((task) => normalizeTaskTitle(task.title))
          .filter(Boolean)
      );

      const alreadyAdded = normalizedResponse.recommendedTasks.filter(
        (task) => existingTitles.has(normalizeTaskTitle(task))
      );

      setAddedAiTasks(alreadyAdded);
    } catch (err) {
      console.error("Failed to generate AI insights:", err);

      setAiError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI insights."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const toggleAiTaskSelection = (taskTitle: string) => {
    const normalizedTitle = normalizeTaskTitle(taskTitle);

    if (!normalizedTitle) return;

    if (addedAiTasks.some((title) => normalizeTaskTitle(title) === normalizedTitle)) {
      return;
    }

    setSelectedAiTasks((current) =>
      current.some((title) => normalizeTaskTitle(title) === normalizedTitle)
        ? current.filter(
            (title) => normalizeTaskTitle(title) !== normalizedTitle
          )
        : [...current, taskTitle]
    );
  };

  const addSelectedAiTasks = async () => {
    if (!project || project.id === "new" || selectedAiTasks.length === 0) {
      return;
    }

    const existingTitles = new Set(
      getAllTasks(project)
        .map((task) => normalizeTaskTitle(task.title))
        .filter(Boolean)
    );

    const uniqueSelected = selectedAiTasks.filter((title) => {
      const normalized = normalizeTaskTitle(title);

      return (
        normalized &&
        !existingTitles.has(normalized) &&
        !addedAiTasks.some(
          (addedTitle) => normalizeTaskTitle(addedTitle) === normalized
        )
      );
    });

    if (uniqueSelected.length === 0) {
      setSelectedAiTasks([]);
      toast.info("Those suggested tasks are already on this project.");
      return;
    }

    setBusyAction("add-ai-tasks");

    const addedSuccessfully: string[] = [];

    try {
      const client = await api();

      for (const title of uniqueSelected) {
        try {
          await client.post(`/api/projects/${project.id}/tasks`, {
            title: title.trim(),
          });

          addedSuccessfully.push(title);
        } catch (error) {
          console.error(`Failed to add suggested task "${title}":`, error);
        }
      }

      if (addedSuccessfully.length > 0) {
        setAddedAiTasks((current) => [
          ...current,
          ...addedSuccessfully,
        ]);

        setSelectedAiTasks((current) =>
          current.filter(
            (title) =>
              !addedSuccessfully.some(
                (addedTitle) =>
                  normalizeTaskTitle(addedTitle) ===
                  normalizeTaskTitle(title)
              )
          )
        );

        await loadProject();

        toast.success(
          addedSuccessfully.length === 1
            ? "Suggested task added"
            : `${addedSuccessfully.length} suggested tasks added`
        );
      }

      const failedCount = uniqueSelected.length - addedSuccessfully.length;

      if (failedCount > 0) {
        toast.error(
          failedCount === 1
            ? "One suggested task could not be added"
            : `${failedCount} suggested tasks could not be added`
        );
      }
    } finally {
      setBusyAction(null);
    }
  };

  const tasks = useMemo(
    () => (project ? getAllTasks(project) : []),
    [project]
  );

  const activeTasks = useMemo(
    () => tasks.filter((task) => !isTaskCancelled(task)),
    [tasks]
  );

  const completedTasks = useMemo(
    () => activeTasks.filter(isTaskDone),
    [activeTasks]
  );

  const inProgressTasks = useMemo(
    () =>
      activeTasks.filter(
        (task) => !isTaskDone(task) && isTaskInProgress(task)
      ),
    [activeTasks]
  );

  const todoTasks = useMemo(
    () =>
      activeTasks.filter(
        (task) => !isTaskDone(task) && !isTaskInProgress(task)
      ),
    [activeTasks]
  );

  const progressPercentage = useMemo(() => {
    if (activeTasks.length === 0) return 0;

    return Math.round(
      (completedTasks.length / activeTasks.length) * 100
    );
  }, [activeTasks.length, completedTasks.length]);

  const completedShare = activeTasks.length
    ? (completedTasks.length / activeTasks.length) * 100
    : 0;

  const inProgressShare = activeTasks.length
    ? (inProgressTasks.length / activeTasks.length) * 100
    : 0;

  const normalizedStatus = normalizeStatus(project?.status) as ProjectStatus;
  const currentStatus =
    statusConfig[normalizedStatus] || statusConfig.ACTIVE;

  const selectedClient =
    clients.find(
      (item) => item.id === (isEditing ? clientId : project?.clientId)
    ) || project?.client;

  const clientName = selectedClient?.name || "Client";
  const clientCompany = selectedClient?.company;
  const clientInitial =
    clientName.trim().charAt(0).toUpperCase() || "C";

  const displayedName = isEditing
    ? name || "Untitled project"
    : project?.name || "Project";

  const standaloneTasks = tasks.filter((task) => !task.milestoneId);

  const milestoneGroups = (project?.milestones || []).map((milestone) => ({
    milestone,
    tasks: tasks.filter((task) => task.milestoneId === milestone.id),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-zinc-200" />
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
            <div className="mb-5 h-4 w-24 rounded bg-zinc-100" />
            <div className="mb-3 h-12 max-w-xl rounded bg-zinc-100" />
            <div className="h-5 w-64 rounded bg-zinc-100" />
          </div>
        </div>
      </div>
    );
  }

  if (pageError || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={22} />
          </div>

          <h1 className="text-lg font-semibold text-zinc-900">
            Unable to load project
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            {pageError || "The project could not be found."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => void loadProject()}
              className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              Try again
            </button>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: "DM Serif Display", serif; }
        * { font-family: "DM Sans", sans-serif; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-50">
              <ArrowLeft size={15} />
            </span>
            <span className="hidden sm:inline">All projects</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-xl border border-zinc-200 bg-white p-1 sm:flex">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) handleCancelEditing();
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  !isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                Overview
              </button>

              <button
                type="button"
                onClick={handleStartEditing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  isEditing
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Edit3 size={14} />
                Edit
              </button>
            </div>

            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEditing}
                  disabled={busyAction !== null}
                  className="hidden rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 sm:inline-flex"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const form = document.getElementById(
                      "project-editor-form"
                    ) as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
                >
                  {busyAction === "save" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {busyAction === "save" ? "Saving..." : "Save changes"}
                </button>
              </>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={busyAction !== null}
                    aria-label="Delete project"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete{" "}
                      <span className="font-semibold text-zinc-900">
                        {project.name}
                      </span>{" "}
                      and all associated tasks and milestones. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(event) => {
                        event.preventDefault();
                        if (busyAction) return;
                        void handleDelete();
                      }}
                      className="bg-rose-600 text-white hover:bg-rose-700"
                    >
                      {busyAction === "delete" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-5 py-7 sm:px-6 sm:py-10"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-medium text-zinc-400"
        >
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="transition-colors hover:text-zinc-700"
          >
            Projects
          </button>
          <ChevronRight size={13} />
          <span className="max-w-[250px] truncate text-zinc-600">
            {displayedName}
          </span>
          {isEditing && (
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
              Editing
            </span>
          )}
        </motion.div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <motion.article
            variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="border-b border-zinc-100 bg-gradient-to-br from-indigo-50/70 via-white to-white px-6 py-7 sm:px-10 sm:py-9">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]",
                    currentStatus.className
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      currentStatus.dotClass
                    )}
                  />
                  {currentStatus.label}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-600">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {progressPercentage}% · {completedTasks.length}/
                  {activeTasks.length} tasks
                </span>
              </div>

              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                {isEditing ? "Editing project" : "Client project"}
              </p>

              {isEditing ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Project name"
                  className="font-serif w-full max-w-3xl border-0 bg-transparent p-0 text-3xl font-bold leading-tight tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-4xl"
                />
              ) : (
                <h1 className="font-serif max-w-3xl text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                  {project.name}
                </h1>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-zinc-400" />
                  Created {formatDate(project.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound size={14} className="text-zinc-400" />
                  {clientName}
                  {clientCompany ? ` · ${clientCompany}` : ""}
                </span>
                {project.targetDate && (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-zinc-400" />
                    Due {formatDate(project.targetDate)}
                  </span>
                )}
              </div>
            </div>

            <form id="project-editor-form" onSubmit={handleSave}>
              <div className="space-y-8 px-6 py-7 sm:px-10">
                {formError && isEditing && (
                  <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <section className="grid gap-6 border-b border-zinc-100 pb-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Client
                    </p>

                    {isEditing ? (
                      <div className="max-w-md">
                        {loadingClients ? (
                          <div className="h-10 animate-pulse rounded-lg bg-zinc-100" />
                        ) : clients.length === 0 ? (
                          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
                            No clients are available. Create a client in CRM
                            first.
                          </p>
                        ) : (
                          <select
                            value={clientId}
                            onChange={(event) =>
                              setClientId(event.target.value)
                            }
                            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                          >
                            <option value="">Select a client...</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.name}
                                {client.company
                                  ? ` · ${client.company}`
                                  : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                          {clientInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {clientName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-zinc-500">
                            {clientCompany || "Client account"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:text-right">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Project budget
                    </p>

                    {isEditing ? (
                      <div className="relative ml-auto max-w-[220px]">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-semibold text-zinc-400">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={budget}
                          onChange={(event) =>
                            setBudget(event.target.value)
                          }
                          placeholder="0"
                          className="w-full border-0 border-b border-zinc-200 bg-transparent py-1 pl-6 text-right text-3xl font-bold tracking-tight text-zinc-900 outline-none focus:border-zinc-900"
                        />
                      </div>
                    ) : (
                      <p className="font-serif text-3xl font-bold tracking-tight text-zinc-900">
                        {formatCurrency(
                          project.budget,
                          project.currency || "CAD"
                        )}
                      </p>
                    )}

                    <p className="mt-1 text-[11px] text-zinc-400">
                      {project.currency || "CAD"}
                    </p>
                  </div>
                </section>

                <section>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Description & scope
                  </p>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Outline project deliverables and requirements..."
                      className="w-full resize-y rounded-lg border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600">
                      {project.description ||
                        "No project description provided."}
                    </p>
                  )}
                </section>
              </div>
            </form>

            {!isEditing && project.id !== "new" && (
              <section className="border-t border-zinc-100 bg-zinc-50/70 px-6 py-7 sm:px-10">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                        <ListTodo size={16} />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-zinc-900">
                          Delivery work
                        </h2>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          Tasks grouped by milestone and project phase.
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-600">
                    {completedTasks.length} of {activeTasks.length} complete
                  </span>
                </div>

                <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Overall progress
                    </span>
                    <span className="text-xs font-bold tabular-nums text-zinc-800">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div
                    className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100"
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Project task completion"
                  >
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${completedShare}%` }}
                    />
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${inProgressShare}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {completedTasks.length} completed
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      {inProgressTasks.length} in progress
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-zinc-300" />
                      {todoTasks.length} to do
                    </span>
                    <span className="ml-auto text-zinc-400">
                      Cancelled tasks excluded
                    </span>
                  </div>
                </div>

                {milestoneGroups.map(({ milestone, tasks: milestoneTasks }) => {
                  const milestoneActiveTasks = milestoneTasks.filter(
                    (task) => !isTaskCancelled(task)
                  );
                  const milestoneCompletedCount =
                    milestoneActiveTasks.filter(isTaskDone).length;
                  const milestoneProgress =
                    milestoneActiveTasks.length === 0
                      ? 0
                      : Math.round(
                          (milestoneCompletedCount /
                            milestoneActiveTasks.length) *
                            100
                        );

                  return (
                    <div
                      key={milestone.id}
                      className="mb-4 overflow-hidden rounded-xl border border-zinc-200 bg-white"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-white px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                            <MilestoneIcon size={15} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-zinc-900">
                              {milestone.title}
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              {milestoneCompletedCount}/
                              {milestoneActiveTasks.length} tasks complete
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {milestone.dueDate && (
                            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500">
                              <Clock size={11} className="text-zinc-400" />
                              {formatDate(milestone.dueDate)}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold tabular-nums text-zinc-600">
                            {milestoneProgress}%
                          </span>
                        </div>
                      </div>

                      <div className="px-3 py-3">
                        <div className="mb-3 h-1 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-violet-500 transition-all duration-500"
                            style={{ width: `${milestoneProgress}%` }}
                          />
                        </div>

                        {milestoneTasks.length > 0 ? (
                          <div className="space-y-2">
                            {milestoneTasks.map((task) => (
                              <TaskRow
                                key={task.id}
                                task={task}
                                busy={
                                  busyAction === `delete-task-${task.id}` ||
                                  busyAction === `toggle-task-${task.id}`
                                }
                                onToggle={() =>
                                  void handleToggleTask(
                                    task.id,
                                    isTaskDone(task)
                                  )
                                }
                                onDelete={() =>
                                  void handleDeleteTask(task.id)
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-400">
                            No tasks in this milestone yet.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {standaloneTasks.length > 0 && (
                  <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                        <ListTodo size={14} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-zinc-900">
                          General tasks
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          Not assigned to a milestone
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {standaloneTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          busy={
                            busyAction === `delete-task-${task.id}` ||
                            busyAction === `toggle-task-${task.id}`
                          }
                          onToggle={() =>
                            void handleToggleTask(
                              task.id,
                              isTaskDone(task)
                            )
                          }
                          onDelete={() =>
                            void handleDeleteTask(task.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTasks.length === 0 && (
                  <div className="mb-4 rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <ListTodo size={18} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-zinc-800">
                      No active tasks yet
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Add a task below to start tracking delivery progress.
                    </p>
                  </div>
                )}

                <form
                  onSubmit={handleAddTask}
                  className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 sm:flex-row"
                >
                  <input
                    value={newTaskTitle}
                    onChange={(event) =>
                      setNewTaskTitle(event.target.value)
                    }
                    placeholder="What needs to get done?"
                    aria-label="New task title"
                    className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
                  />
                  <button
                    type="submit"
                    disabled={
                      busyAction === "add-task" ||
                      !newTaskTitle.trim()
                    }
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyAction === "add-task" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Add task
                  </button>
                </form>
              </section>
            )}
          </motion.article>

          <aside className="space-y-4 xl:sticky xl:top-[76px]">
            <motion.section
              variants={itemVariants}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Delivery progress
                  </h2>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Based on active project tasks
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <TargetIcon />
                </div>
              </div>

              <div className="flex justify-center py-1">
                <ProgressRing progress={progressPercentage} />
              </div>

              <div className="mt-4 space-y-2.5 border-t border-zinc-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {completedTasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    In progress / review
                  </span>
                  <span className="text-xs font-semibold text-blue-700">
                    {inProgressTasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-zinc-300" />
                    To do
                  </span>
                  <span className="text-xs font-semibold text-zinc-700">
                    {todoTasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5">
                  <span className="text-[11px] text-zinc-500">
                    Milestones
                  </span>
                  <span className="text-xs font-semibold text-zinc-800">
                    {project.milestones?.length || 0}
                  </span>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="overflow-hidden rounded-2xl border border-indigo-200/80 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setAiOpen((open) => !open)}
                aria-expanded={aiOpen}
                className="flex w-full items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-5 py-4 text-left transition-colors hover:from-indigo-100/70 hover:to-violet-100/70"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                    <Sparkles size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-zinc-900">
                      Project AI Copilot
                    </span>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      Risks, recommendations & task ideas
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform",
                    aiOpen && "rotate-180"
                  )}
                />
              </button>

              {aiOpen && (
                <div className="border-t border-indigo-100">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p className="text-[10px] leading-4 text-zinc-500">
                      Analyze the project’s actual tasks, milestones and dates.
                    </p>
                    <button
                      type="button"
                      onClick={() => void generateAiInsights()}
                      disabled={aiLoading || project.id === "new"}
                      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Wand2 size={12} />
                      )}
                      {aiLoading ? "Analyzing" : "Analyze"}
                    </button>
                  </div>

                  <div className="max-h-[min(66vh,620px)] space-y-3 overflow-y-auto overscroll-contain border-t border-zinc-100 bg-zinc-50/50 p-4">
                    {aiError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                        <p className="text-[11px] leading-5 text-rose-700">
                          {aiError}
                        </p>
                      </div>
                    )}

                    {!aiInsight && !aiLoading && !aiError && (
                      <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-4 text-center">
                        <Sparkles
                          size={18}
                          className="mx-auto text-indigo-400"
                        />
                        <p className="mt-2 text-xs font-semibold text-zinc-800">
                          Get a delivery review
                        </p>
                        <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                          AI can summarize the project, flag risks, suggest next
                          steps and recommend tasks.
                        </p>
                      </div>
                    )}

                    {aiLoading && (
                      <div className="rounded-xl border border-indigo-100 bg-white p-4">
                        <div className="flex items-center gap-2">
                          <Loader2
                            size={14}
                            className="animate-spin text-indigo-600"
                          />
                          <p className="text-[11px] font-medium text-zinc-600">
                            Reviewing project delivery…
                          </p>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="h-2 animate-pulse rounded bg-zinc-100" />
                          <div className="h-2 w-4/5 animate-pulse rounded bg-zinc-100" />
                        </div>
                      </div>
                    )}

                    {aiInsight && !aiLoading && (
                      <>
                        <div className="rounded-xl border border-indigo-100 bg-white p-3.5">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Sparkles
                              size={12}
                              className="text-indigo-600"
                            />
                            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-indigo-700">
                              Assessment
                            </p>
                            {aiInsight.healthScore != null && (
                              <span
                                className={cn(
                                  "ml-auto rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] font-bold",
                                  getHealthScoreClass(aiInsight.healthScore)
                                )}
                              >
                                {aiInsight.healthScore}/100
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] leading-5 text-zinc-600">
                            {aiInsight.summary}
                          </p>
                        </div>

                        {aiInsight.risks.length > 0 && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.13em] text-amber-800">
                              Watch-outs
                            </p>
                            <ul className="space-y-1.5">
                              {aiInsight.risks.map((risk, index) => (
                                <li
                                  key={`${risk}-${index}`}
                                  className="flex items-start gap-2 text-[10px] leading-4 text-amber-900"
                                >
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiInsight.nextSteps.length > 0 && (
                          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3.5">
                            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.13em] text-sky-800">
                              Recommended next steps
                            </p>
                            <ul className="space-y-1.5">
                              {aiInsight.nextSteps.map((step, index) => (
                                <li
                                  key={`${step}-${index}`}
                                  className="flex items-start gap-2 text-[10px] leading-4 text-sky-900"
                                >
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-sky-500" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiInsight.recommendedTasks.length > 0 && (
                          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3.5 py-3">
                              <div>
                                <p className="text-[10px] font-semibold text-zinc-900">
                                  Suggested tasks
                                </p>
                                <p className="mt-0.5 text-[9px] text-zinc-400">
                                  Select tasks to add
                                </p>
                              </div>
                              <span className="rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-semibold text-indigo-700">
                                {
                                  aiInsight.recommendedTasks.filter(
                                    (task) =>
                                      !isAiTaskAdded(task, addedAiTasks, tasks)
                                  ).length
                                }{" "}
                                available
                              </span>
                            </div>

                            <div className="max-h-48 space-y-1 overflow-y-auto p-2">
                              {aiInsight.recommendedTasks.map((task, index) => {
                                const alreadyAdded = isAiTaskAdded(
                                  task,
                                  addedAiTasks,
                                  tasks
                                );
                                const selected = selectedAiTasks.some(
                                  (title) =>
                                    normalizeTaskTitle(title) ===
                                    normalizeTaskTitle(task)
                                );

                                return (
                                  <button
                                    key={`${normalizeTaskTitle(task)}-${index}`}
                                    type="button"
                                    disabled={alreadyAdded || busyAction === "add-ai-tasks"}
                                    onClick={() => toggleAiTaskSelection(task)}
                                    className={cn(
                                      "flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors",
                                      alreadyAdded
                                        ? "cursor-default border-emerald-100 bg-emerald-50/70"
                                        : selected
                                          ? "border-indigo-300 bg-indigo-50"
                                          : "border-transparent bg-white hover:border-zinc-200 hover:bg-zinc-50"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                        alreadyAdded
                                          ? "border-emerald-600 bg-emerald-600 text-white"
                                          : selected
                                            ? "border-indigo-600 bg-indigo-600 text-white"
                                            : "border-zinc-300 bg-white"
                                      )}
                                    >
                                      {(alreadyAdded || selected) && (
                                        <Check size={11} />
                                      )}
                                    </span>
                                    <span
                                      className={cn(
                                        "min-w-0 flex-1 text-[10px] leading-4",
                                        alreadyAdded
                                          ? "text-emerald-800"
                                          : "text-zinc-700"
                                      )}
                                    >
                                      {task}
                                    </span>
                                    {alreadyAdded && (
                                      <span className="shrink-0 text-[9px] font-semibold text-emerald-700">
                                        Added
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="border-t border-zinc-100 p-2.5">
                              <button
                                type="button"
                                onClick={() => void addSelectedAiTasks()}
                                disabled={
                                  selectedAiTasks.length === 0 ||
                                  busyAction === "add-ai-tasks"
                                }
                                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[10px] font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                              >
                                {busyAction === "add-ai-tasks" ? (
                                  <Loader2
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Plus size={13} />
                                )}
                                {busyAction === "add-ai-tasks"
                                  ? "Adding selected tasks..."
                                  : `Add selected tasks${
                                      selectedAiTasks.length > 0
                                        ? ` (${selectedAiTasks.length})`
                                        : ""
                                    }`}
                              </button>
                            </div>
                          </div>
                        )}

                        {aiInsight.createdAt && (
                          <p className="text-right text-[9px] text-zinc-400">
                            Reviewed {formatDate(aiInsight.createdAt)}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Project information
                </h2>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                  <ArrowUpRight size={15} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">
                    Status
                  </p>
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                      currentStatus.className
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        currentStatus.dotClass
                      )}
                    />
                    {currentStatus.label}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-zinc-400">
                    Total budget
                  </p>
                  <p className="mt-0.5 font-serif text-xl font-bold text-zinc-900">
                    {formatCurrency(
                      project.budget,
                      project.currency || "CAD"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-zinc-400">
                    Client
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-zinc-800">
                    {clientName}
                  </p>
                  {clientCompany && (
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {clientCompany}
                    </p>
                  )}
                </div>

                {project.startDate && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400">
                      Start date
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold text-zinc-800">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                )}

                {project.targetDate && (
                  <div>
                    <p className="text-[10px] font-medium text-zinc-400">
                      Target date
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold text-zinc-800">
                      {formatDate(project.targetDate)}
                    </p>
                  </div>
                )}

                <div className="border-t border-zinc-100 pt-3">
                  <p className="text-[10px] font-medium text-zinc-400">
                    Last updated
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-600">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Quick actions
              </h2>
              <button
                type="button"
                onClick={handleStartEditing}
                className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <Edit3 size={14} className="text-zinc-400" />
                Edit project details
              </button>
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="mt-2 flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-left text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <ArrowLeft size={14} className="text-zinc-400" />
                Back to all projects
              </button>
            </motion.section>
          </aside>
        </div>
      </motion.main>
    </div>
  );
}

function getAllTasks(project: Project): ProjectTask[] {
  const byId = new Map<string, ProjectTask>();

  for (const task of project.tasks || []) {
    byId.set(task.id, task);
  }

  for (const milestone of project.milestones || []) {
    for (const task of milestone.tasks || []) {
      byId.set(task.id, {
        ...task,
        milestoneId: task.milestoneId || milestone.id,
      });
    }
  }

  return Array.from(byId.values());
}

function isAiTaskAdded(
  title: string,
  addedTitles: string[],
  currentTasks: ProjectTask[]
) {
  const normalized = normalizeTaskTitle(title);

  return (
    addedTitles.some(
      (added) => normalizeTaskTitle(added) === normalized
    ) ||
    currentTasks.some(
      (task) => normalizeTaskTitle(task.title) === normalized
    )
  );
}

function TargetIcon() {
  return <CircleDot size={15} />;
}
``