import type { SettingsPayload } from "@/types/settings";

export default function ProfileSettings({ settings }: { settings: SettingsPayload }) {
  const { clerk, organization, billing } = settings;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Profile</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage your personal identity and account details.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-zinc-100 bg-white p-6">
        <div className="flex items-center gap-4 mb-4">
          {clerk.imageUrl ? (
            <img src={clerk.imageUrl} alt="" className="w-14 h-14 rounded-2xl object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 text-lg font-bold">
              {clerk.firstName?.[0] || clerk.primaryEmail?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="text-[15px] font-semibold text-zinc-800">{clerk.fullName || "Unnamed"}</p>
            <p className="text-[13px] text-zinc-500">{clerk.primaryEmail || "No email on file"}</p>
          </div>
        </div>
        <p className="text-[12px] text-zinc-400 mb-4">Managed securely by Clerk.</p>
        <a
          href="https://accounts.clerk.dev/user"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
        >
          Manage profile
        </a>
      </div>

      {/* Account summary */}
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Account Summary</p>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-400">Workspace</span>
          <span className="font-semibold text-zinc-700">{organization?.name || "—"}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-zinc-400">Current Plan</span>
          <span className="font-semibold text-zinc-700 capitalize">{billing.plan}</span>
        </div>
      </div>
    </div>
  );
}