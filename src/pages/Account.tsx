import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
  UserCircle, Building2, Globe2, BellRing, FileText, FolderKanban,
  Users2, PlugZap, CreditCard, ShieldCheck, TriangleAlert, AlertCircle,
} from "lucide-react";
import { settingsApi } from "@/lib/settings-api";
import type { SettingsPayload } from "@/types/settings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import WorkspaceSettingsPanel from "@/components/settings/WorkspaceSettings";
import ClientPortalSettings from "@/components/settings/ClientPortalSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const SETTINGS_NAV = [
  {
    group: "Personal",
    items: [
      { id: "settings-profile", label: "Profile", icon: UserCircle },
      { id: "settings-notifications", label: "Notifications", icon: BellRing },
      { id: "settings-security", label: "Security", icon: ShieldCheck },
    ],
  },
  {
    group: "Workspace",
    items: [
      { id: "settings-workspace", label: "Workspace", icon: Building2 },
      { id: "settings-client-portal", label: "Client Portal", icon: Globe2 },
      { id: "settings-proposal-defaults", label: "Proposal Defaults", icon: FileText },
      { id: "settings-project-defaults", label: "Project Defaults", icon: FolderKanban },
      { id: "settings-team-access", label: "Team & Access", icon: Users2 },
      { id: "settings-integrations", label: "Integrations", icon: PlugZap },
      { id: "settings-billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    group: "Advanced",
    items: [{ id: "settings-danger-zone", label: "Danger Zone", icon: TriangleAlert }],
  },
] as const;

const ALL_ITEMS = SETTINGS_NAV.flatMap((g) => g.items);

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// Honest "not built yet" section — still gets a real heading + real id so
// it participates in scroll nav, per the requirement that every listed
// item corresponds to a real rendered section.
const PendingSection = ({ id, title, description, note }: { id: string; title: string; description: string; note: string }) => (
  <section id={id} className="scroll-mt-28">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      <p className="text-sm text-zinc-500 mt-1">{description}</p>
    </div>
    <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center">
      <p className="text-[13px] text-zinc-500">{note}</p>
    </div>
  </section>
);

export default function Account() {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>(ALL_ITEMS[0].id);
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const data = await settingsApi.getAll(token);
      if (mountedRef.current) setSettings(data);
    } catch (e) {
      if (mountedRef.current) setError(e instanceof Error ? e.message : "Unable to load settings");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  // Scrollspy — active section tracks scroll position independent of data
  // load state, so nav still works even if settings failed to fetch.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    ALL_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading, error]); // re-observe once sections actually exist in the DOM

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
        .font-serif { font-family: 'DM Serif Display', serif; }
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-24">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Settings</p>
          <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-2">Manage your personal account, workspace preferences, client experience, and billing.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-red-700">Unable to load settings</p>
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            </div>
            <button type="button" onClick={load} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[12px] font-semibold hover:bg-red-700 transition-all shrink-0">
              Try Again
            </button>
          </div>
        )}

        {/* Mobile section nav */}
        <div className="lg:hidden mb-6">
          <select
            value={activeId}
            onChange={(e) => scrollTo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm outline-none"
            aria-label="Jump to settings section"
          >
            {SETTINGS_NAV.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-[230px_1fr] gap-10">
          {/* Desktop scroll nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-10 space-y-6">
              {SETTINGS_NAV.map((group) => (
                <div key={group.group}>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1.5">{group.group}</p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => scrollTo(item.id)}
                          aria-current={active ? "true" : undefined}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left ${
                            active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
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

          {/* Continuous content */}
          <div className="min-w-0 max-w-[860px] space-y-14">
            {loading && !settings ? (
              <>
                <div className="h-32 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                <div className="h-48 rounded-2xl bg-white border border-zinc-100 animate-pulse" />
              </>
            ) : settings ? (
              <>
                <section id="settings-profile" className="scroll-mt-28">
                  <ProfileSettings settings={settings} />
                </section>
                <section id="settings-notifications" className="scroll-mt-28">
                  <NotificationsSettings settings={settings} />
                </section>
                <section id="settings-security" className="scroll-mt-28">
                  <SecuritySettings settings={settings} />
                </section>
                <section id="settings-workspace" className="scroll-mt-28">
                  <WorkspaceSettingsPanel settings={settings} onSaved={load} />
                </section>
                <section id="settings-client-portal" className="scroll-mt-28">
                  <ClientPortalSettings settings={settings} onSaved={load} />
                </section>
                <PendingSection
                  id="settings-proposal-defaults"
                  title="Proposal defaults"
                  description="Set the baseline terms and content used when you create new proposals."
                  note="Proposal default settings are being connected — check back shortly."
                />
                <PendingSection
                  id="settings-project-defaults"
                  title="Project defaults"
                  description="Configure how new projects and tasks are created in your workspace."
                  note="Project default settings are being connected — check back shortly."
                />
                <PendingSection
                  id="settings-team-access"
                  title="Team & access"
                  description="Manage how your team collaborates in this workspace."
                  note="Team workspaces are coming soon — available when Clerk Organizations is enabled for this app."
                />
                <PendingSection
                  id="settings-integrations"
                  title="Integrations"
                  description="Connect the services that power your agency workflows."
                  note="A detailed integrations view (Clerk, Stripe, Gemini, Resend) is being connected — check back shortly."
                />
                <PendingSection
                  id="settings-billing"
                  title="Billing"
                  description="Manage your RelunoOS plan, payment method, and billing history."
                  note={settings.billing.stripeConnected ? "Billing controls are being connected — check back shortly." : "Stripe billing is not connected yet. Billing controls will become available once your Stripe connection is complete."}
                />
                <PendingSection
                  id="settings-danger-zone"
                  title="Danger zone"
                  description="Irreversible actions for your workspace."
                  note="Workspace export and deletion are currently handled by support. Contact support to request these actions."
                />
              </>
            ) : (
              // Sections still render with real ids/headings so nav works,
              // even with zero data — per the requirement that nav must
              // function even when settings fail to load.
              ALL_ITEMS.map((item) => (
                <section key={item.id} id={item.id} className="scroll-mt-28">
                  <h2 className="text-lg font-bold text-zinc-900">{item.label}</h2>
                  <div className="mt-4 rounded-2xl border border-zinc-100 bg-white p-8 text-center">
                    <p className="text-[13px] text-zinc-400">Connect settings data to continue.</p>
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}