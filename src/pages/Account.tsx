import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  UserCircle, Building2, Globe2, BellRing, FileText, FolderKanban,
  Users2, PlugZap, CreditCard, ShieldCheck, TriangleAlert, Loader2, AlertCircle,
} from "lucide-react";
import { settingsApi } from "@/lib/settings-api";
import type { SettingsPayload } from "@/types/settings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import WorkspaceSettingsPanel from "@/components/settings/WorkspaceSettings";

type TabKey =
  | "profile" | "workspace" | "client-portal" | "notifications" | "proposals"
  | "projects" | "team" | "integrations" | "billing" | "security" | "danger";

const NAV_GROUPS: { label: string; items: { key: TabKey; label: string; icon: any }[] }[] = [
  {
    label: "Personal",
    items: [
      { key: "profile", label: "Profile", icon: UserCircle },
      { key: "notifications", label: "Notifications", icon: BellRing },
      { key: "security", label: "Security", icon: ShieldCheck },
    ],
  },
  {
    label: "Workspace",
    items: [
      { key: "workspace", label: "Workspace", icon: Building2 },
      { key: "client-portal", label: "Client Portal", icon: Globe2 },
      { key: "proposals", label: "Proposal Defaults", icon: FileText },
      { key: "projects", label: "Project Defaults", icon: FolderKanban },
      { key: "team", label: "Team & Access", icon: Users2 },
      { key: "integrations", label: "Integrations", icon: PlugZap },
      { key: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    label: "Advanced",
    items: [{ key: "danger", label: "Danger Zone", icon: TriangleAlert }],
  },
];

const ALL_TABS = NAV_GROUPS.flatMap((g) => g.items);

// Placeholder panel for tabs not yet built in this pass — honest "coming
// soon" state rather than a broken/empty screen.
const ComingSoonPanel = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-zinc-100 bg-white p-10 text-center">
    <p className="text-sm font-semibold text-zinc-600">{label} settings</p>
    <p className="text-xs text-zinc-400 mt-1">This section is being built next — check back shortly.</p>
  </div>
);

export default function Account() {
  const { getToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) || "profile";

  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await settingsApi.getAll(token);
      setSettings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const setTab = (key: TabKey) => setSearchParams({ tab: key });

  const activeLabel = ALL_TABS.find((t) => t.key === activeTab)?.label || "Profile";

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-24">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Settings</p>
          <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-2">Manage your personal account, workspace preferences, client experience, and billing.</p>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setTab(e.target.value as TabKey)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm outline-none"
            aria-label="Settings section"
          >
            {NAV_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.items.map((item) => (
                  <option key={item.key} value={item.key}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden sm:block w-[230px] shrink-0">
            <nav className="sticky top-16 space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1.5">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setTab(item.key)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left ${
                            active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
                          }`}
                        >
                          <Icon size={15} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Active panel */}
          <div className="flex-1 min-w-0 max-w-[820px]">
            {loading ? (
              <div className="space-y-4">
                <div className="h-32 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                <div className="h-48 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
              </div>
            ) : error || !settings ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle size={22} className="text-red-400 mb-3" />
                <p className="text-sm text-zinc-500 mb-3">{error || "Couldn't load settings."}</p>
                <button onClick={load} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Try again</button>
              </div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                {activeTab === "profile" && <ProfileSettings settings={settings} />}
                {activeTab === "workspace" && <WorkspaceSettingsPanel settings={settings} onSaved={load} />}
                {activeTab === "client-portal" && <ComingSoonPanel label="Client Portal" />}
                {activeTab === "notifications" && <ComingSoonPanel label="Notifications" />}
                {activeTab === "proposals" && <ComingSoonPanel label="Proposal Defaults" />}
                {activeTab === "projects" && <ComingSoonPanel label="Project Defaults" />}
                {activeTab === "team" && <ComingSoonPanel label="Team & Access" />}
                {activeTab === "integrations" && <ComingSoonPanel label="Integrations" />}
                {activeTab === "billing" && <ComingSoonPanel label="Billing" />}
                {activeTab === "security" && <ComingSoonPanel label="Security" />}
                {activeTab === "danger" && <ComingSoonPanel label="Danger Zone" />}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}