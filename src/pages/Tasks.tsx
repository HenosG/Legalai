// src/pages/Tasks.tsx
// Full Task Management UI — Add / Edit / Delete / Toggle
// Gated behind "starter" plan via FeatureGuard

import React, { useState, useEffect, useRef } from "react";


import { FeatureGuard } from "@/components/FeatureGuard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { tasksApi, type Task } from "@/lib/api";
import {
  Plus, CheckCircle2, Circle, Trash2, Pencil, Clock,
  CheckCheck, Cpu, Flag, X, Save, Filter, SortAsc,
  Calendar, Tag, AlertTriangle, Zap, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  high:   { label: "High",   color: "text-red-500",    bg: "bg-red-50 border-red-100",    dot: "bg-red-500"    },
  medium: { label: "Medium", color: "text-amber-500",  bg: "bg-amber-50 border-amber-100", dot: "bg-amber-500"  },
  low:    { label: "Low",    color: "text-slate-400",   bg: "bg-slate-50 border-slate-100", dot: "bg-slate-300"  },
} as const;

// ─── Stats bar ────────────────────────────────────────────────────────────────
const StatsBar = ({ tasks }: { tasks: Task[] }) => {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const high = tasks.filter(t => t.priority === "high" && !t.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { label: "Total Tasks", val: total, icon: BarChart3, color: "text-slate-600", bg: "bg-slate-50" },
        { label: "Completed",   val: done,  icon: CheckCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Urgent",      val: high,  icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
        { label: "Progress",    val: `${pct}%`, icon: Zap, color: "text-blue-700", bg: "bg-blue-50" },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 tracking-tight">{s.val}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Task Form (Add / Edit) ───────────────────────────────────────────────────
interface TaskFormProps {
  initial?: Partial<Task>;
  onSave: (data: { title: string; priority: string; dueDate?: string }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initial, onSave, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<string>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ? initial.dueDate.slice(0, 10) : "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), priority, dueDate: dueDate || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-cyan-100 shadow-lg shadow-blue-50 p-5 space-y-4">
      <input
        ref={inputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task description..."
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-slate-50 font-medium"
      />
      <div className="flex gap-3 flex-wrap">
        {/* Priority */}
        <div className="flex gap-2 flex-wrap">
          {(["high", "medium", "low"] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all",
                priority === p
                  ? `${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].color} border-current`
                  : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
              )}
            >
              <Flag className="w-3 h-3" />
              {PRIORITY_CONFIG[p].label}
            </button>
          ))}
        </div>

        {/* Due date */}
        <div className="flex items-center gap-2 flex-1 min-w-[160px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:border-cyan-400 bg-slate-50 font-medium"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-700 transition-colors shadow-md"
        >
          <Save className="w-3.5 h-3.5" /> Save
        </button>
      </div>
    </form>
  );
};

// ─── Task Row ─────────────────────────────────────────────────────────────────
interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const p = PRIORITY_CONFIG[task.priority ?? "medium"];

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
      task.completed
        ? "bg-slate-50/60 border-slate-100 opacity-60"
        : "bg-white border-slate-100 hover:border-cyan-100 hover:shadow-sm"
    )}>
      {/* Toggle */}
      <button onClick={() => onToggle(task.id)} className="shrink-0">
        {task.completed
          ? <CheckCircle2 className="w-5 h-5 text-blue-600" />
          : <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
        }
      </button>

      {/* Priority dot */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />

      {/* Title */}
      <span className={cn(
        "flex-1 text-sm font-semibold",
        task.completed ? "line-through text-slate-400" : "text-slate-800"
      )}>
        {task.title}
      </span>

      {/* Priority badge */}
      <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border hidden sm:block", p.bg, p.color)}>
        {p.label}
      </span>

      {/* Due date */}
      {task.dueDate && (
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      )}

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Tasks Content (inner, shown after feature guard passes) ──────────────────
const TasksContent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "due">("created");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tasksApi.getAll()
      .then(data => { if (Array.isArray(data)) setTasks(data); })
      .catch(() => setError("Could not load tasks. Check backend connection."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data: { title: string; priority: string; dueDate?: string }) => {
    try {
      const task = await tasksApi.create(data);
      setTasks(prev => [task, ...prev]);
      setShowForm(false);
    } catch { setError("Failed to create task."); }
  };

  const handleEdit = async (data: { title: string; priority: string; dueDate?: string }) => {
    if (!editingTask) return;
    try {
      const updated = await tasksApi.update(editingTask.id, data);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
    } catch { setError("Failed to update task."); }
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await tasksApi.toggle(id, !task.completed);
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed } : t));
    }
  };

  const handleDelete = async (id: string) => {
    const prev = tasks;
    setTasks(p => p.filter(t => t.id !== id));
    try {
      await tasksApi.delete(id);
    } catch {
      setTasks(prev);
      setError("Failed to delete task.");
    }
  };

  // Filter + sort
  const filtered = tasks
    .filter(t => {
      if (filter === "active") return !t.completed;
      if (filter === "done")   return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const rank = { high: 0, medium: 1, low: 2 };
        return (rank[a.priority ?? "low"] ?? 2) - (rank[b.priority ?? "low"] ?? 2);
      }
      if (sortBy === "due") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Cpu className="w-7 h-7 text-blue-600 animate-pulse" />
    </div>
  );

  return (
    <div className="space-y-6">
      <StatsBar tasks={tasks} />

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(["all", "active", "done"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all",
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <SortAsc className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-[11px] font-bold text-slate-600 bg-slate-100 border-none rounded-xl px-3 py-2 focus:outline-none uppercase tracking-wider cursor-pointer"
          >
            <option value="created">Newest First</option>
            <option value="priority">By Priority</option>
            <option value="due">By Due Date</option>
          </select>
        </div>

        {/* Add button */}
        <button
          onClick={() => { setShowForm(true); setEditingTask(null); }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-3.5 h-3.5" /> New Case
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Add form */}
      {showForm && !editingTask && (
        <TaskForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <CheckCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">
              {filter === "done" ? "No completed tasks yet" : "No tasks — add your first one above"}
            </p>
          </div>
        ) : (
          filtered.map(task => (
            editingTask?.id === task.id ? (
              <TaskForm
                key={task.id}
                initial={task}
                onSave={handleEdit}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={setEditingTask}
                onDelete={handleDelete}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
export default function Tasks() {
  const { subscription } = useSubscription();

  return (
    
      <div className="flex min-h-screen w-full bg-white text-slate-900">
        
        

          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4">
              
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Smart Reminders & Tasks
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 text-slate-500">
              {subscription?.plan ?? "free"} plan
            </span>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
            {/* Page title */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Task Command Center</h1>
              <p className="text-sm text-slate-500">Manage deadlines, reminders, and case actions in one place.</p>
            </div>

            <FeatureGuard
              featureName="Smart Reminders & Tasks"
              requiredPlan="starter"
              description="Manage tasks, set deadlines, and stay on top of every case action."
            >
              <TasksContent />
            </FeatureGuard>
          </main>
        
      </div>
    
  );
}