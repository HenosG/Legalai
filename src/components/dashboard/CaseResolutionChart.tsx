import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  resolved: number;
  inProgress: number;
  pending: number;
}

const CaseResolutionChart = ({ resolved, inProgress, pending }: Props) => {
  const total = resolved + inProgress + pending;
  const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const data = [
    { name: "Resolved", value: resolved || 0, color: "#8B00FF" },
    { name: "In Progress", value: inProgress || 0, color: "#0066FF" },
    { name: "Pending", value: pending || 0, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

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
      <h3 className="font-semibold text-gray-900 mb-4">Case Resolution Progress</h3>
      <div className="h-48 relative">
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: "#111827",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-[10px] text-gray-500">Resolved</div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">No cases yet</div>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-3">
        {[
          { label: "Resolved", color: "#8B00FF" },
          { label: "In Progress", color: "#0066FF" },
          { label: "Pending", color: "#F59E0B" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[11px] text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseResolutionChart;
