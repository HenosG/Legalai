import type { CaseItem } from "@/hooks/useDashboardData";
import { useNavigate } from "react-router-dom";

const WorkProgress = ({ cases }: { cases: CaseItem[] }) => {
  const navigate = useNavigate();
  const recentCases = cases.slice(0, 2);

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
      <h3 className="font-semibold text-gray-900 mb-4">Work Progress</h3>
      {recentCases.length > 0 ? (
        <div className="space-y-4">
          {recentCases.map((c) => (
            <div key={c.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#8B00FF] font-medium">Case #{c.id.slice(0, 6)}</span>
                <span className="text-xs text-gray-500">{c.progress}% Complete</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">{c.title}</p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.progress}%`, background: "linear-gradient(90deg, #8B00FF, #0066FF)" }}
                />
              </div>
              {c.start_date && (
                <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
                  <span>Start: {new Date(c.start_date).toLocaleDateString()}</span>
                  {c.estimated_end_date && <span>Est. End: {new Date(c.estimated_end_date).toLocaleDateString()}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm mb-3">No cases yet</p>
          <button
            onClick={() => navigate("/my-cases")}
            className="text-xs px-4 py-2 rounded-lg text-white hover:scale-[1.02] transition-all"
            style={{ background: "#0066FF" }}
          >
            Start Your First Case
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkProgress;
