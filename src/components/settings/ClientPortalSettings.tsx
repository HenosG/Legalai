import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2, Copy } from "lucide-react";
import { settingsApi } from "@/lib/settings-api";
import type { SettingsPayload, ClientPortalPatchInput } from "@/types/settings";

type FormState = ClientPortalPatchInput & { portalSlug: string; primaryColor: string; accessMode: "INVITE_ONLY" | "CLIENT_EMAIL" | "PUBLIC_LINK" };

const toForm = (settings: SettingsPayload): FormState => ({
  enabled: settings.clientPortal?.enabled ?? false,
  portalName: settings.clientPortal?.portalName ?? "",
  portalSlug: settings.clientPortal?.portalSlug ?? "",
  logoUrl: settings.clientPortal?.logoUrl ?? "",
  primaryColor: settings.clientPortal?.primaryColor ?? "#18181B",
  welcomeTitle: settings.clientPortal?.welcomeTitle ?? "",
  welcomeMessage: settings.clientPortal?.welcomeMessage ?? "",
  supportEmail: settings.clientPortal?.supportEmail ?? "",
  supportUrl: settings.clientPortal?.supportUrl ?? "",
  accessMode: settings.clientPortal?.accessMode ?? "INVITE_ONLY",
  allowClientMessages: settings.clientPortal?.allowClientMessages ?? true,
  showProjectProgress: settings.clientPortal?.showProjectProgress ?? true,
  showInvoices: settings.clientPortal?.showInvoices ?? true,
  showProposals: settings.clientPortal?.showProposals ?? true,
  showDocuments: settings.clientPortal?.showDocuments ?? true,
});

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] outline-none focus:border-zinc-400 transition-all";
const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2";

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between py-2"
    aria-pressed={checked}
  >
    <span className="text-[13px] text-zinc-700">{label}</span>
    <span className={`w-9 h-5 rounded-full transition-all relative ${checked ? "bg-zinc-900" : "bg-zinc-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-4.5" : "left-0.5"}`} style={{ left: checked ? "18px" : "2px" }} />
    </span>
  </button>
);

export default function ClientPortalSettings({ settings, onSaved }: { settings: SettingsPayload; onSaved: () => void }) {
  const { getToken } = useAuth();
  const [form, setForm] = useState<FormState>(() => toForm(settings));
  const [initial, setInitial] = useState<FormState>(() => toForm(settings));
  const [saving, setSaving] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);

  useEffect(() => {
    const f = toForm(settings);
    setForm(f); setInitial(f);
    if (settings.clientPortal) {
      const base = window.location.origin;
      setPortalUrl(`${base}/portal/${settings.clientPortal.portalSlug}`);
    }
  }, [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const slugValid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.portalSlug || "");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!slugValid) { toast.error("Portal slug must be lowercase letters, numbers, and hyphens only"); return; }
    setSaving(true);
    try {
      const token = await getToken();
      const res = await settingsApi.updateClientPortal(form, token);
      setPortalUrl(res.portalUrl);
      toast.success("Client portal settings saved");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save client portal settings");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl);
    toast.success("Portal link copied");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Client portal</h2>
        <p className="text-sm text-zinc-500 mt-1">Create a polished, branded space where clients can follow work and access key documents.</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-4">
        <Toggle checked={!!form.enabled} onChange={(v) => update("enabled", v)} label="Enable client portal" />

        {portalUrl && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-50 px-4 py-3">
            <span className="text-[13px] text-zinc-600 truncate">{portalUrl}</span>
            <button type="button" onClick={copyLink} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-white transition-all shrink-0">
              <Copy size={12} /> Copy link
            </button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Portal Name</label>
            <input className={inputClass} value={form.portalName || ""} onChange={(e) => update("portalName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Portal Slug</label>
            <input className={inputClass} value={form.portalSlug} onChange={(e) => update("portalSlug", e.target.value.toLowerCase())} />
            {!slugValid && form.portalSlug && <p className="text-[11px] text-red-500 mt-1">Lowercase letters, numbers, and hyphens only</p>}
          </div>
          <div>
            <label className={labelClass}>Logo URL</label>
            <input className={inputClass} value={form.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Primary Color</label>
            <div className="flex items-center gap-2">
              <input className={inputClass} value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} />
              <span className="w-9 h-9 rounded-lg border border-zinc-200 shrink-0" style={{ backgroundColor: form.primaryColor }} />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Welcome Title</label>
          <input className={inputClass} value={form.welcomeTitle || ""} onChange={(e) => update("welcomeTitle", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Welcome Message</label>
          <textarea className={inputClass} rows={3} value={form.welcomeMessage || ""} onChange={(e) => update("welcomeMessage", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Support Email</label>
            <input className={inputClass} value={form.supportEmail || ""} onChange={(e) => update("supportEmail", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Support URL</label>
            <input className={inputClass} value={form.supportUrl || ""} onChange={(e) => update("supportUrl", e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Access Mode</label>
          <div className="flex gap-1.5 flex-wrap">
            {(["INVITE_ONLY", "CLIENT_EMAIL", "PUBLIC_LINK"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update("accessMode", mode)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                  form.accessMode === mode ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200"
                }`}
              >
                {mode === "INVITE_ONLY" ? "Invite only" : mode === "CLIENT_EMAIL" ? "Client email" : "Public link"}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-50">
          <Toggle checked={!!form.allowClientMessages} onChange={(v) => update("allowClientMessages", v)} label="Allow client messages" />
          <Toggle checked={!!form.showProjectProgress} onChange={(v) => update("showProjectProgress", v)} label="Show project progress" />
          <Toggle checked={!!form.showInvoices} onChange={(v) => update("showInvoices", v)} label="Show invoices" />
          <Toggle checked={!!form.showProposals} onChange={(v) => update("showProposals", v)} label="Show proposals" />
          <Toggle checked={!!form.showDocuments} onChange={(v) => update("showDocuments", v)} label="Show documents" />
        </div>

        <p className="text-[11px] text-zinc-400 pt-2">The public portal page itself isn't built yet — this saves your configuration for when it launches.</p>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" disabled={!dirty} onClick={() => setForm(initial)} className="px-4 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={!dirty || saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}