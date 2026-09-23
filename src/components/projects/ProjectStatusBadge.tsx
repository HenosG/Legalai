const STYLES: Record<string, string> = {
    PLANNING: "bg-zinc-100 text-zinc-600",
    ACTIVE: "bg-blue-50 text-blue-700",
    ON_HOLD: "bg-amber-50 text-amber-700",
    AT_RISK: "bg-orange-50 text-orange-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-700",
  };
  
  const LABELS: Record<string, string> = {
    PLANNING: "Planning",
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    AT_RISK: "At Risk",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  
  export default function ProjectStatusBadge({ status }: { status: string }) {
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STYLES[status] || STYLES.PLANNING}`}>
        {LABELS[status] || status}
      </span>
    );
  }