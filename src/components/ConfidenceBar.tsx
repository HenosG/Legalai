export default function ConfidenceBar({ label, value }: { label: string; value: number }) {
    const pct = Math.round(value * 100);
    const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400";
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] text-zinc-500">{label}</span>
          <span className="text-[11px] font-semibold text-zinc-600">{pct}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }