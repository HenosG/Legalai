import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  FolderKanban,
  Loader2,
  MoreHorizontal,
  Plus,
  Save,
  Trash2,
  UserRound,
  CheckSquare,
  ListTodo,
} from "lucide-react";
import { createApiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
}

interface Milestone {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
}

interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
  milestoneId?: string;
}

interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description?: string;
  status: string;
  budget: number;
  startDate?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  milestones?: Milestone[];
  tasks?: ProjectTask[];
}

type ProjectStatus = "ACTIVE" | "AT_RISK" | "ON_HOLD" | "COMPLETED";

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  AT_RISK: {
    label: "At Risk",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  ON_HOLD: {
    label: "On Hold",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

const springTransition = { type: "spring", stiffness: 300, damping: 28 } as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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

  // Form states
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("ACTIVE");
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
      setPageError(err instanceof Error ? err.message : "Failed to load project.");
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

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!project) return;

    if (!clientId || !name.trim() || !budget) {
      setFormError("Please complete the client, project name, and budget before saving.");
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
        const responseData = await client.post<{ project: Project }>("/api/projects", payload);
        nextProject = responseData.project;
        navigate(`/projects/${nextProject.id}`, { replace: true });
      } else {
        const updated = await client.patch<Project>(`/api/projects/${id}`, payload);
        nextProject = {
          ...project,
          ...updated,
          client: clients.find((c) => c.id === clientId) || updated.client || project.client,
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
      const message = err instanceof Error ? err.message : "Failed to save project.";
      setFormError(message);
      toast.error("Unable to save project", { description: message });
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    if (!project || project.id === "new") return;
    try {
      const client = await api();
      await client.patch(`/api/tasks/${taskId}`, { completed: !currentCompleted });
      await loadProject();
      toast.success("Task updated");
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task status");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project || project.id === "new") return;

    try {
      const client = await api();
      await client.post("/api/tasks", {
        projectId: project.id,
        title: newTaskTitle.trim(),
      });
      setNewTaskTitle("");
      await loadProject();
      toast.success("Task added");
    } catch (err) {
      console.error("Failed to add task:", err);
      toast.error("Failed to add task");
    }
  };

  const handleDelete = async () => {
    if (!project || !id || id === "new") return;
    const confirmed = window.confirm(`Delete “${project.name}”? This action cannot be undone.`);
    if (!confirmed) return;

    setBusyAction("delete");
    try {
      const client = await api();
      await client.delete(`/api/projects/${id}`);
      toast.success("Project deleted successfully!");
      navigate("/projects");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Unable to delete project", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyAction(null);
    }
  };

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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={22} />
          </div>
          <h1 className="text-lg font-semibold text-zinc-900">Unable to load project</h1>
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

  const normalizedStatus = (project.status?.toUpperCase() || "ACTIVE") as ProjectStatus;
  const currentStatus = statusConfig[normalizedStatus] || statusConfig.ACTIVE;

  const selectedClient =
    clients.find((c) => c.id === (isEditing ? clientId : project.clientId)) || project.client;
  const clientName = selectedClient?.name || project.client?.name || "Client";
  const clientCompany = selectedClient?.company || project.client?.company;
  const clientInitial = clientName.trim().charAt(0).toUpperCase() || "C";

  const displayedName = isEditing ? name || "Untitled project" : project.name;
  const completedTasksCount = project.tasks?.filter((t) => t.completed).length || 0;
  const totalTasksCount = project.tasks?.length || 0;
  const progressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-16 text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
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
                onClick={handleCancelEditing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  !isEditing ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={handleStartEditing}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors",
                  isEditing ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                )}
              >
                <Edit3 size={14} /> Edit
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
                    const form = document.getElementById("project-editor-form") as HTMLFormElement | null;
                    form?.requestSubmit();
                  }}
                  disabled={busyAction !== null}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50"
                >
                  {busyAction === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  <span>{busyAction === "save" ? "Saving..." : "Save changes"}</span>
                </button>
              </>
            ) : (
              <details className="relative">
                <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50">
                  <MoreHorizontal size={18} />
                </summary>
                <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={busyAction !== null}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    {busyAction === "delete" ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    Delete project
                  </button>
                </div>
              </details>
            )}
          </div>
        </div>
      </header>

      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <div className="mb-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-medium text-zinc-400">
          <button type="button" onClick={() => navigate("/projects")} className="transition-colors hover:text-zinc-700">
            Projects
          </button>
          <ChevronRight size={13} />
          <span className="max-w-[250px] truncate text-zinc-600">{displayedName}</span>
          {isEditing && (
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
              Editing
            </span>
          )}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main Content Area */}
          <article className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
            <div className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 via-white to-white px-7 py-8 sm:px-12 sm:py-11">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]", currentStatus.className)}>
                  {currentStatus.label}
                </div>
                <span className="text-[12px] font-medium text-zinc-400">
                  {progressPercentage}% Completed ({completedTasksCount}/{totalTasksCount} tasks)
                </span>
              </div>

              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-400">
                {isEditing ? "Editing project" : "Client project"}
              </p>

              {isEditing ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Project name"
                  className="font-serif w-full max-w-3xl border-0 bg-transparent p-0 text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 outline-none placeholder:text-zinc-300 focus:ring-0 sm:text-5xl"
                />
              ) : (
                <h1 className="font-serif max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl">
                  {project.name}
                </h1>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-zinc-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={15} className="text-zinc-400" />
                  Created {formatDate(project.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound size={15} className="text-zinc-400" />
                  For {clientName} {clientCompany ? ` · ${clientCompany}` : ""}
                </span>
              </div>
            </div>

            <form id="project-editor-form" onSubmit={handleSave}>
              <div className="px-7 py-9 sm:px-12 sm:py-12 space-y-10">
                {formError && isEditing && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <section className="grid gap-8 border-b border-zinc-100 pb-10 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Client</p>
                    {isEditing ? (
                      <div className="max-w-md">
                        {loadingClients ? (
                          <div className="h-11 animate-pulse rounded-xl bg-zinc-100" />
                        ) : clients.length === 0 ? (
                          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-700">
                            No clients are available. Create a client in CRM first.
                          </p>
                        ) : (
                          <select
                            value={clientId}
                            onChange={(event) => setClientId(event.target.value)}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-800 outline-none transition-all focus:border-zinc-400"
                          >
                            <option value="">Select a client...</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} {c.company ? ` · ${c.company}` : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-bold text-white">
                          {clientInitial}
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-zinc-900">{clientName}</p>
                          <p className="mt-0.5 text-[13px] text-zinc-500">{clientCompany || "Client account"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:text-right">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Budget</p>
                    {isEditing ? (
                      <div className="relative ml-auto max-w-[230px]">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 font-serif text-3xl font-bold text-zinc-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="0"
                          className="font-serif w-full border-0 border-b border-zinc-200 bg-transparent py-1 pl-7 text-right text-4xl font-bold tracking-tight text-zinc-900 outline-none focus:border-zinc-900"
                        />
                      </div>
                    ) : (
                      <p className="font-serif text-4xl font-bold tracking-tight text-zinc-900">
                        {formatCurrency(project.budget)}
                      </p>
                    )}
                    <p className="mt-1 text-[12px] text-zinc-400">CAD</p>
                  </div>
                </section>

                {/* Description / Scope */}
                <section>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Description & Scope</p>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Outline project deliverables and requirements..."
                      className="w-full rounded-xl border border-zinc-200 bg-white p-3.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">
                      {project.description || "No project description provided."}
                    </p>
                  )}
                </section>
              </div>
            </form>

            {/* Tasks & Milestones Section */}
            {!isEditing && project.id !== "new" && (
              <div className="border-t border-zinc-100 px-7 py-9 sm:px-12 sm:py-12 bg-zinc-50/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ListTodo size={18} className="text-zinc-500" />
                    <h3 className="text-base font-semibold text-zinc-900">Project Tasks</h3>
                  </div>
                  <span className="text-xs font-medium text-zinc-500">
                    {completedTasksCount} of {totalTasksCount} completed
                  </span>
                </div>

                {/* Task Checklist */}
                <div className="space-y-2 mb-6">
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id, task.completed)}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-zinc-200/80 cursor-pointer hover:border-zinc-300 transition-colors"
                      >
                        <div className={cn("w-5 h-5 rounded-lg flex items-center justify-center border transition-colors", task.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-zinc-300 bg-white")}>
                          {task.completed && <CheckCircle2 size={14} />}
                        </div>
                        <span className={cn("text-sm font-medium", task.completed ? "line-through text-zinc-400" : "text-zinc-800")}>
                          {task.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400 italic">No tasks added to this project yet.</p>
                  )}
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 outline-none focus:border-zinc-400"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Plus size={16} /> Add Task
                  </button>
                </form>
              </div>
            )}
          </article>

          {/* Sidebar Metadata */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">Project Info</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-zinc-400">Status</p>
                  <p className="font-semibold text-zinc-800 mt-0.5">{currentStatus.label}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total Budget</p>
                  <p className="font-serif text-xl font-bold text-zinc-900 mt-0.5">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Client</p>
                  <p className="font-semibold text-zinc-800 mt-0.5">{clientName}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.main>
    </div>
  );
}