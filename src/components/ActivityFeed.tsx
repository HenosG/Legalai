import { Clock } from "lucide-react";

export interface ActivityEntry {
  id: string;
  description: string;
  createdAt: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export default function ActivityFeed({ entries, loading }: { entries: ActivityEntry[]; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white divide-y divide-zinc-50 px-5">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="py-4">
            <div className="h-3.5 w-3/4 rounded bg-zinc-100 animate-pulse mb-2" />
            <div className="h-3 w-1/4 rounded bg-zinc-100 animate-pulse" />
          </div>
        ))
      ) : entries.length === 0 ? (
        <div className="py-12 text-center">
          <Clock size={20} className="text-zinc-300 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No activity yet</p>
        </div>
      ) : (
        entries.map((e) => (
          <div key={e.id} className="py-3 flex items-start gap-3">
            <span className="text-[11px] font-mono text-zinc-400 shrink-0 mt-0.5 w-16">{formatTime(e.createdAt)}</span>
            <span className="text-[13px] text-zinc-700">{e.description}</span>
          </div>
        ))
      )}
    </div>
  );
}