import type { SettingsPayload } from "@/types/settings";

const EVENTS: { key: string; label: string; defaultInApp: boolean; defaultEmail: boolean }[] = [
  { key: "ai_intake_received", label: "New AI intake received", defaultInApp: true, defaultEmail: false },
  { key: "proposal_viewed", label: "Proposal viewed", defaultInApp: true, defaultEmail: false },
  { key: "proposal_signed", label: "Proposal signed", defaultInApp: true, defaultEmail: false },
  { key: "invoice_paid", label: "Invoice paid", defaultInApp: true, defaultEmail: false },
  { key: "invoice_overdue", label: "Invoice overdue", defaultInApp: true, defaultEmail: false },
  { key: "project_at_risk", label: "Project at risk", defaultInApp: true, defaultEmail: false },
  { key: "task_assigned", label: "Task assigned to you", defaultInApp: true, defaultEmail: false },
  { key: "task_due_soon", label: "Task due soon", defaultInApp: true, defaultEmail: false },
  { key: "client_message_received", label: "New client message", defaultInApp: true, defaultEmail: false },
  { key: "weekly_summary", label: "Weekly summary", defaultInApp: true, defaultEmail: true },
];

// PATCH /api/settings/notifications doesn't exist in the backend yet, so
// this renders the real designed layout, using saved preferences where
// present and sensible defaults otherwise, but disabled — an honest state,
// not a fake save.
export default function NotificationsSettings({ settings }: { settings: SettingsPayload }) {
  const prefFor = (eventKey: string, channel: "IN_APP" | "EMAIL") =>
    settings.notifications.find((n) => n.eventKey === eventKey && n.channel === channel);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Notifications</h2>
        <p className="text-sm text-zinc-500 mt-1">Choose what RelunoOS should notify you about and where.</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-400">Event</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-400 w-24">In-app</th>
              <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-400 w-24">Email</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((event) => {
              const inApp = prefFor(event.key, "IN_APP")?.enabled ?? event.defaultInApp;
              const email = prefFor(event.key, "EMAIL")?.enabled ?? event.defaultEmail;
              return (
                <tr key={event.key} className="border-b border-zinc-50 last:border-0">
                  <td className="px-5 py-3 text-[13px] text-zinc-700">{event.label}</td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-block w-9 h-5 rounded-full relative opacity-50 cursor-not-allowed ${inApp ? "bg-zinc-900" : "bg-zinc-200"}`}
                      aria-label={`${event.label} in-app notification, syncing not yet available`}
                    >
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white" style={{ left: inApp ? "18px" : "2px" }} />
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-block w-9 h-5 rounded-full relative opacity-50 cursor-not-allowed ${email ? "bg-zinc-900" : "bg-zinc-200"}`}
                      aria-label={`${event.label} email notification, syncing not yet available`}
                    >
                      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white" style={{ left: email ? "18px" : "2px" }} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[12px] text-zinc-400">
        Notification preference syncing is being connected — this shows how it will work once live. Email notifications are sent to your Clerk primary email.
      </p>
    </div>
  );
}