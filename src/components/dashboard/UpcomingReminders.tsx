import type { ReminderItem } from "@/hooks/useDashboardData";
import { Calendar } from "lucide-react";

const UpcomingReminders = ({ reminders }: { reminders: ReminderItem[] }) => {
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
      <h3 className="font-semibold text-gray-900 mb-4">Upcoming</h3>
      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((r) => {
            const date = new Date(r.due_date);
            return (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#0066FF]/10">
                  <Calendar className="w-4 h-4 text-[#0066FF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-[11px] text-gray-500">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No upcoming reminders</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingReminders;
