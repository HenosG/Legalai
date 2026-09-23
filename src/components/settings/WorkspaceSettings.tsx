import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { settingsApi } from "@/lib/settings-api";
import type { SettingsPayload } from "@/types/settings";

interface FormState {
  businessName: string;
  businessSlug: string;
  industry: string;
  businessType: string;
  agentName: string;
  defaultCurrency: string;
  timezone: string;
  locale: string;
  dateFormat: string;
  weekStartsOn: number;
}

const toForm = (settings: SettingsPayload): FormState => ({
  businessName: settings.workspace?.businessName || "",
  businessSlug: settings.workspace?.businessSlug || "",
  industry: settings.workspace?.industry || "",
  businessType: settings.workspace?.businessType || "",
  agentName: settings.workspace?.agentName || "Rulo",
  defaultCurrency: settings.workspaceSettings.defaultCurrency,
  timezone: settings.workspaceSettings.timezone,
  locale: settings.workspaceSettings.locale,
  dateFormat: settings.workspaceSettings.dateFormat,
  weekStartsOn: settings.workspaceSettings.weekStartsOn,
});

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-[14px] outline-none focus:border-zinc-400 transition-all";
const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WorkspaceSettingsPanel({ settings, onSaved }: { settings: SettingsPayload; onSaved: () => void }) {
  const { getToken } = useAuth();
  const [form, setForm] = useState<FormState>(() => toForm(settings));
  const [initial, setInitial] = useState<FormState>(() => toForm(settings));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const f = toForm(settings);
    setForm(f);
    setInitial(f);
  }, [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      await settingsApi.updateWorkspace(form, token);
      toast.success("Workspace settings saved");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save workspace settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-900">Workspace</h2>
        <p className="text-sm text-zinc-500 mt-1">Set the defaults that keep your agency operating consistently.</p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Business Identity</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Business Name</label>
            <input className={inputClass} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Business Slug</label>
            <input className={inputClass} value={form.businessSlug} onChange={(e) => update("businessSlug", e.target.value.toLowerCase())} />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <input className={inputClass} value={form.industry} onChange={(e) => update("industry", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Business Type</label>
            <input className={inputClass} value={form.businessType} onChange={(e) => update("businessType", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>AI Assistant Name</label>
            <input className={inputClass} value={form.agentName} onChange={(e) => update("agentName", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-6 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Regional Defaults</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Default Currency</label>
            <input className={inputClass} value={form.defaultCurrency} onChange={(e) => update("defaultCurrency", e.target.value.toUpperCase())} maxLength={3} />
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <input className={inputClass} value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Locale</label>
            <input className={inputClass} value={form.locale} onChange={(e) => update("locale", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Date Format</label>
            <input className={inputClass} value={form.dateFormat} onChange={(e) => update("dateFormat", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Week Starts On</label>
          <div className="flex gap-1.5 flex-wrap">
            {WEEKDAYS.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => update("weekStartsOn", i)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                  form.weekStartsOn === i ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={!dirty}
          onClick={() => setForm(initial)}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 text-[13px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-semibold hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}