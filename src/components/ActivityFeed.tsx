import { useMemo } from "react";
import { Clock } from "lucide-react";

export interface ActivityEntry {
  id: string;
  description: string;
  createdAt: string;
}

interface ActivityGroup {
  label: string;
  entries: ActivityEntry[];
}

function formatTime(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDayLabel(iso: string) {
  const activityDate = new Date(iso);

  if (Number.isNaN(activityDate.getTime())) {
    return "Recent";
  }

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const startOfActivityDay = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth(),
    activityDate.getDate()
  );

  if (startOfActivityDay.getTime() === startOfToday.getTime()) {
    return "Today";
  }

  if (startOfActivityDay.getTime() === startOfYesterday.getTime()) {
    return "Yesterday";
  }

  const daysAgo = Math.floor(
    (startOfToday.getTime() - startOfActivityDay.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysAgo <= 7) {
    return "Earlier this week";
  }

  return activityDate.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
  });
}

function groupEntriesByDay(entries: ActivityEntry[]): ActivityGroup[] {
  const groups = new Map<string, ActivityEntry[]>();

  for (const entry of entries) {
    const label = getDayLabel(entry.createdAt);

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label)?.push(entry);
  }

  return Array.from(groups.entries()).map(([label, groupedEntries]) => ({
    label,
    entries: groupedEntries,
  }));
}

export default function ActivityFeed({
  entries,
  loading,
}: {
  entries: ActivityEntry[];
  loading: boolean;
}) {
  const groups = useMemo(() => groupEntriesByDay(entries), [entries]);

  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4">
        <div>
          <p className="text-xs font-semibold text-zinc-800">
            Latest workspace events
          </p>

          <p className="mt-1 text-[11px] text-zinc-400">
            Activity from the last 48 hours.
          </p>
        </div>

        {!loading && entries.length > 0 && (
          <span className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold tabular-nums text-zinc-500">
            {entries.length}
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {loading ? (
          <div className="divide-y divide-zinc-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="py-4">
                <div className="h-3.5 w-3/4 animate-pulse rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-5 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
              <Clock size={18} />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-600">
              No recent activity
            </p>

            <p className="mt-1 max-w-[220px] text-[11px] leading-5 text-zinc-400">
              New intake, client, proposal, and workflow events will appear
              here.
            </p>
          </div>
        ) : (
          <div className="py-2">
            {groups.map((group) => (
              <section key={group.label} className="py-3">
                <p className="sticky top-0 z-10 -mx-1 bg-white px-1 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {group.label}
                </p>

                <div className="space-y-1">
                  {group.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-zinc-50"
                    >
                      <span className="mt-0.5 w-14 shrink-0 font-mono text-[10px] text-zinc-400">
                        {formatTime(entry.createdAt)}
                      </span>

                      <span className="min-w-0 flex-1 text-[12px] leading-5 text-zinc-600">
                        {entry.description}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}