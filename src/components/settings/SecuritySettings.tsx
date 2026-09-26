import type { SettingsPayload } from "@/types/settings";

export default function SecuritySettings({ settings }: { settings: SettingsPayload }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Security</h2>
        <p className="text-sm text-zinc-500 mt-1">Keep your account and workspace secure.</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Clerk Authentication</p>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-400">Primary Email</span>
          <span className="font-semibold text-zinc-700">{settings.clerk.primaryEmail || "—"}</span>
        </div>
        <p className="text-[12px] text-zinc-500">
          Password, multi-factor authentication, email verification, and active sessions are managed securely by Clerk.
        </p>
        <a
          href="https://accounts.clerk.dev/user"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
        >
          Manage sign-in &amp; security
        </a>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Workspace Access</p>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-400">Workspace</span>
          <span className="font-semibold text-zinc-700">{settings.organization?.name || "—"}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-400">Plan</span>
          <span className="font-semibold text-zinc-700 capitalize">{settings.billing.plan}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Recent Security Activity</p>
        <p className="text-[13px] text-zinc-400">No recent workspace security events to show.</p>
      </div>
    </div>
  );
}