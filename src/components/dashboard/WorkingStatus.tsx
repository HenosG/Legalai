import type { CaseItem } from "@/hooks/useDashboardData";

const WorkingStatus = ({ cases }: { cases: CaseItem[] }) => {
  const total = cases.length;
  const resolved = cases.filter((c) => c.status === "resolved" || c.status === "closed").length;
  const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div
      className="rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h3 className="font-semibold text-gray-900 mb-4">Working Status</h3>
      <div className="flex items-center justify-center py-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none" stroke="#0066FF" strokeWidth="8"
              strokeDasharray={`${pct * 2.51} 251`} strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-xl font-bold text-gray-900">{pct}%</div>
              <div className="text-[10px] text-gray-500">Overall</div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500">Overall Case Status</p>
    </div>
  );
};

export default WorkingStatus;
