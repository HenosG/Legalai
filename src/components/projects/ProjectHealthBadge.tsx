import { Circle } from "lucide-react";

const STYLES: Record<string, { dot: string; text: string }> = {
  ON_TRACK: { dot: "text-emerald-500", text: "text-emerald-700" },
  AT_RISK: { dot: "text-amber-500", text: "text-amber-700" },
  OFF_TRACK: { dot: "text-red-500", text: "text-red-700" },
  UNKNOWN: { dot: "text-zinc-300", text: "text-zinc-500" },
};

const LABELS: Record<string, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  OFF_TRACK: "Off Track",
  UNKNOWN: "Unknown",
};

export default function ProjectHealthBadge({ health }: { health: string }) {
  const style = STYLES[health] || STYLES.UNKNOWN;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${style.text}`}>
      <Circle size={7} className={style.dot} fill="currentColor" />
      {LABELS[health] || health}
    </span>
  );
}