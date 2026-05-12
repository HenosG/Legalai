// src/pages/CalendarSync.tsx
// High-fidelity Motion-inspired weekly/monthly calendar
// Color-coded legal deadline chips with hover states

import React, { useState } from "react";


import { useSubscription } from "@/contexts/SubscriptionContext";
import { FeatureGuard } from "@/components/FeatureGuard";
import {
  ChevronLeft, ChevronRight, Plus, Calendar, Clock,
  AlertTriangle, CheckCircle2, Circle, Filter, Grid3x3,
  List, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Event types & colors ─────────────────────────────────────────────────────
type EventType = "deadline" | "hearing" | "filing" | "meeting" | "reminder";

interface CalEvent {
  id: string;
  title: string;
  date: string;      // YYYY-MM-DD
  time?: string;
  type: EventType;
  caseRef?: string;
  priority: "high" | "medium" | "low";
  done?: boolean;
}

const EVENT_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string; dot: string }> = {
  deadline: { label: "Deadline",  color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-500"     },
  hearing:  { label: "Hearing",   color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200",  dot: "bg-violet-500"  },
  filing:   { label: "Filing",    color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  dot: "bg-orange-500"  },
  meeting:  { label: "Meeting",   color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500"    },
  reminder: { label: "Reminder",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
};

const PRIORITY_COLOR: Record<string, string> = {
  high:   "ring-1 ring-red-300",
  medium: "ring-1 ring-amber-200",
  low:    "",
};

// ─── Sample events ────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const SAMPLE_EVENTS: CalEvent[] = [
  { id: "1", title: "Motion to Dismiss — Due",         date: fmt(today),         time: "09:00", type: "deadline", caseRef: "#2847", priority: "high"   },
  { id: "2", title: "Discovery Deadline",              date: fmt(addDays(today,1)), time: "17:00", type: "deadline", caseRef: "#2801", priority: "high"   },
  { id: "3", title: "Settlement Conference Hearing",   date: fmt(addDays(today,2)), time: "10:30", type: "hearing",  caseRef: "#2750", priority: "medium" },
  { id: "4", title: "Client Call — Henderson",         date: fmt(addDays(today,2)), time: "14:00", type: "meeting",  caseRef: "#2847", priority: "low"    },
  { id: "5", title: "Answer to Complaint — File",     date: fmt(addDays(today,3)), time: "12:00", type: "filing",   caseRef: "#2900", priority: "high"   },
  { id: "6", title: "Deposition — Dr. Marcus Webb",   date: fmt(addDays(today,4)), time: "09:00", type: "meeting",  caseRef: "#2801", priority: "medium" },
  { id: "7", title: "Statute of Limitations Check",   date: fmt(addDays(today,5)), time: undefined, type: "reminder", caseRef: "#2720", priority: "high" },
  { id: "8", title: "Pre-Trial Conference",           date: fmt(addDays(today,6)), time: "11:00", type: "hearing",  caseRef: "#2750", priority: "high"   },
  { id: "9", title: "Summary Judgment Filing",        date: fmt(addDays(today,7)), time: "17:00", type: "filing",   caseRef: "#2847", priority: "high"   },
  { id: "10", title: "Expert Witness Disclosure",     date: fmt(addDays(today,-1)), time: "17:00", type: "deadline", caseRef: "#2801", priority: "high",  done: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getWeekDays(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - d.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(d, i));
}

function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// ─── Event Chip ───────────────────────────────────────────────────────────────
const EventChip: React.FC<{ event: CalEvent; compact?: boolean }> = ({ event, compact }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = EVENT_CONFIG[event.type];

  return (
    <div
      className={cn(
        "relative group cursor-pointer rounded-lg border px-2 py-1 transition-all duration-200",
        cfg.bg, cfg.border, cfg.color,
        PRIORITY_COLOR[event.priority],
        event.done && "opacity-50",
        hovered && "shadow-md z-10"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
        <span className={cn("font-bold truncate", compact ? "text-[9px]" : "text-[10px]")}>
          {event.title}
        </span>
        {event.time && !compact && (
          <span className="text-[9px] opacity-60 flex-shrink-0 ml-auto">{event.time}</span>
        )}
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute left-0 top-full mt-1.5 z-50 bg-white border border-zinc-200 rounded-xl shadow-xl p-3 min-w-[200px] pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", cfg.color)}>{cfg.label}</span>
            {event.priority === "high" && (
              <span className="ml-auto text-[8px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded">URGENT</span>
            )}
          </div>
          <p className="text-xs font-bold text-zinc-800 mb-1">{event.title}</p>
          {event.caseRef && <p className="text-[10px] text-zinc-400">Case {event.caseRef}</p>}
          {event.time && (
            <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1">
              <Clock className="w-2.5 h-2.5" /> {event.time}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Weekly view ──────────────────────────────────────────────────────────────
const WeekView: React.FC<{ weekDays: Date[]; events: CalEvent[] }> = ({ weekDays, events }) => {
  const todayStr = fmt(today);

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
        {weekDays.map((day) => {
          const str = fmt(day);
          const isToday = str === todayStr;
          return (
            <div key={str} className="px-3 py-3 text-center border-r border-zinc-200 last:border-r-0">
              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{DAYS[day.getDay()]}</div>
              <div className={cn(
                "mt-1 text-lg font-black tracking-tighter mx-auto w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                isToday ? "bg-blue-600 text-white" : "text-zinc-700"
              )}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 min-h-[480px]">
        {weekDays.map((day) => {
          const str = fmt(day);
          const dayEvents = events.filter((e) => e.date === str);
          const isToday = str === todayStr;

          return (
            <div
              key={str}
              className={cn(
                "border-r border-zinc-100 last:border-r-0 p-2 space-y-1 min-h-[200px]",
                isToday && "bg-blue-50/30"
              )}
            >
              {dayEvents.map((e) => (
                <EventChip key={e.id} event={e} compact />
              ))}
              {dayEvents.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-zinc-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Month view ───────────────────────────────────────────────────────────────
const MonthView: React.FC<{ year: number; month: number; events: CalEvent[] }> = ({ year, month, events }) => {
  const weeks = getMonthGrid(year, month);
  const todayStr = fmt(today);

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
        {DAYS.map((d) => (
          <div key={d} className="px-3 py-2.5 text-center text-[9px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-200 last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-zinc-100 last:border-b-0">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="border-r border-zinc-100 last:border-r-0 bg-zinc-50/50 min-h-[110px]" />;
            const str = fmt(day);
            const isToday = str === todayStr;
            const dayEvents = events.filter((e) => e.date === str);

            return (
              <div
                key={str}
                className={cn(
                  "border-r border-zinc-100 last:border-r-0 p-2 min-h-[110px]",
                  isToday && "bg-blue-50/40"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mb-1.5 mx-auto",
                  isToday ? "bg-blue-600 text-white" : "text-zinc-500"
                )}>
                  {day.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => <EventChip key={e.id} event={e} compact />)}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] font-black text-zinc-400 pl-1">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── Upcoming sidebar ─────────────────────────────────────────────────────────
const UpcomingPanel: React.FC<{ events: CalEvent[] }> = ({ events }) => {
  const upcoming = events
    .filter((e) => !e.done && e.date >= fmt(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  return (
    <div className="w-72 flex-shrink-0 border-l border-zinc-200 bg-zinc-50/60 flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-200">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Upcoming Deadlines</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ scrollbarWidth: "none" }}>
        {upcoming.map((e) => {
          const cfg = EVENT_CONFIG[e.type];
          return (
            <div key={e.id} className="bg-white border border-zinc-200 rounded-xl p-3 hover:border-cyan-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
                <span className={cn("text-[9px] font-black uppercase tracking-widest", cfg.color)}>{cfg.label}</span>
                {e.priority === "high" && (
                  <AlertTriangle className="w-2.5 h-2.5 text-red-400 ml-auto" />
                )}
              </div>
              <p className="text-[11px] font-bold text-zinc-800 leading-snug mb-1">{e.title}</p>
              <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-medium">
                <span>{e.date}</span>
                {e.time && <><span>·</span><span>{e.time}</span></>}
                {e.caseRef && <><span>·</span><span>{e.caseRef}</span></>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Calendar Page ───────────────────────────────────────────────────────
const CalendarContent: React.FC = () => {
  const [view, setView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState<EventType | "all">("all");

  const weekDays = getWeekDays(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const filteredEvents = filter === "all"
    ? SAMPLE_EVENTS
    : SAMPLE_EVENTS.filter((e) => e.type === filter);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const headerLabel = view === "week"
    ? `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`
    : `${MONTHS[month]} ${year}`;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 bg-white flex-shrink-0 flex-wrap gap-y-3">
        {/* Nav */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg border border-zinc-200 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:bg-zinc-50 transition-colors">
            Today
          </button>
          <button onClick={() => navigate(1)} className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
          <span className="text-sm font-black text-zinc-900 tracking-tight ml-2">{headerLabel}</span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {(["all", "deadline", "hearing", "filing", "meeting", "reminder"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                filter === f
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {f === "all" ? "All" : EVENT_CONFIG[f].label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
          <button
            onClick={() => setView("week")}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", view === "week" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
          >
            <List className="w-3 h-3" /> Week
          </button>
          <button
            onClick={() => setView("month")}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all", view === "month" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
          >
            <Grid3x3 className="w-3 h-3" /> Month
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-sm">
        <Plus className="w-3.5 h-3.5" /> New Case
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {view === "week"
          ? <WeekView weekDays={weekDays} events={filteredEvents} />
          : <MonthView year={year} month={month} events={filteredEvents} />
        }
        <UpcomingPanel events={SAMPLE_EVENTS} />
      </div>
    </div>
  );
};

export default function CalendarSync() {
  const { subscription } = useSubscription();
  return (
    
      <div className="flex min-h-screen w-full bg-[#F9FAFB] text-zinc-900">
        
        
          <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 bg-white sticky top-0 z-40 flex-shrink-0">
            <div className="flex items-center gap-3">
              
              <div className="h-4 w-px bg-zinc-200" />
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Calendar Sync</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-200 text-zinc-400">
              {subscription?.plan ?? "free"} plan
            </span>
          </header>
          <div className="flex-1 flex flex-col overflow-hidden">
            <FeatureGuard featureName="Calendar Sync" requiredPlan="starter">
              <CalendarContent />
            </FeatureGuard>
          </div>
        
      </div>
    
  );
}