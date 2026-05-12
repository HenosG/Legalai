import { MessageSquare, Briefcase, Clock, DollarSign } from "lucide-react";
import type { DashboardStats } from "@/hooks/useDashboardData";

const StatsCards = ({ stats }: { stats: DashboardStats }) => {
  const cards = [
    { label: "Queries Answered", value: stats.totalQueries, icon: MessageSquare, color: "#8B00FF", bg: "#8B00FF" },
    { label: "Active Cases", value: stats.activeCases, icon: Briefcase, color: "#0066FF", bg: "#0066FF" },
    { label: "Pending Claims", value: stats.pendingCases, icon: Clock, color: "#F59E0B", bg: "#F59E0B" },
    { label: "Estimated Saved", value: `$${stats.estimatedSavings.toLocaleString()}`, icon: DollarSign, color: "#10B981", bg: "#10B981" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative rounded-xl p-5 overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl" style={{ background: card.bg }} />
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.bg}15` }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
          </div>
          <div className="font-display text-2xl font-bold text-gray-900">{card.value}</div>
          <p className="text-xs text-gray-500 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
