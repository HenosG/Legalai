import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export default function LeadScoreBadge({ score }: { score: number | null }) {
  if (score == null) {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-400">
        Unscored
      </span>
    );
  }
  const tier = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
        tier === "high" && "bg-emerald-50 text-emerald-700",
        tier === "mid" && "bg-amber-50 text-amber-700",
        tier === "low" && "bg-red-50 text-red-600"
      )}
    >
      {tier === "high" && <Zap size={11} />}
      {score}/100
    </div>
  );
}