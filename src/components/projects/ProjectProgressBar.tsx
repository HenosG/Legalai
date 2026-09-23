export default function ProjectProgressBar({ progress }: { progress: number }) {
    const color = progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-blue-500" : "bg-zinc-400";
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Progress</span>
          <span className="text-[11px] font-semibold text-zinc-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }