// src/pages/Integrations.tsx
// Calendar (Google/Outlook) and Email sync settings dashboard
// Calendar + Email gates: "starter" plan

import React, { useState, useEffect } from "react";


import { FeatureGuard } from "@/components/FeatureGuard";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { integrationsApi, type CalendarConnection, type EmailConnection } from "@/lib/api";
import {
  Calendar, Mail, Plug, Plug2, RefreshCw, Trash2,
  CheckCircle2, Clock, Cpu, AlertTriangle, X,
  Chrome, Globe, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Connection Card ──────────────────────────────────────────────────────────
interface ConnectionCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  email?: string;
  lastSync?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
  accent: string;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  name, icon, description, connected, email, lastSync,
  onConnect, onDisconnect, loading, accent,
}) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl border p-6 transition-all",
      connected ? "border-emerald-100 shadow-sm shadow-emerald-50" : "border-slate-100 hover:border-slate-200"
    )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", accent)}>
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{name}</h3>
            {connected && (
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                <CheckCircle2 className="w-2.5 h-2.5" /> Live
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>

          {connected && email && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="font-medium truncate">{email}</span>
              </div>
              {lastSync && (
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  Last synced: {new Date(lastSync).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-slate-400 animate-pulse" />
            </div>
          ) : connected ? (
            <button
              onClick={onDisconnect}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Disconnect
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plug className="w-3 h-3" /> Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Integrations Content ─────────────────────────────────────────────────────
const IntegrationsContent: React.FC = () => {
  const [calendars, setCalendars] = useState<CalendarConnection[]>([]);
  const [emails, setEmails] = useState<EmailConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [cal, em] = await Promise.all([
        integrationsApi.getCalendars().catch(() => [] as CalendarConnection[]),
        integrationsApi.getEmails().catch(() => [] as EmailConnection[]),
      ]);
      setCalendars(Array.isArray(cal) ? cal : []);
      setEmails(Array.isArray(em) ? em : []);
    } catch {
      setError("Could not load integrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const connectCalendar = async (provider: string) => {
    setActionLoading(`cal-${provider}`);
    try {
      const { authUrl } = await integrationsApi.connectCalendar(provider);
      window.open(authUrl, "_blank");
      setTimeout(load, 3000);
    } catch { setError("Could not initiate OAuth. Check backend."); }
    finally { setActionLoading(null); }
  };

  const disconnectCalendar = async (id: string) => {
    setActionLoading(`cal-${id}`);
    try {
      await integrationsApi.disconnectCalendar(id);
      setCalendars(prev => prev.filter(c => c.id !== id));
    } catch { setError("Could not disconnect calendar."); }
    finally { setActionLoading(null); }
  };

  const connectEmail = async (provider: string) => {
    setActionLoading(`em-${provider}`);
    try {
      const { authUrl } = await integrationsApi.connectEmail(provider);
      window.open(authUrl, "_blank");
      setTimeout(load, 3000);
    } catch { setError("Could not initiate OAuth. Check backend."); }
    finally { setActionLoading(null); }
  };

  const disconnectEmail = async (id: string) => {
    setActionLoading(`em-${id}`);
    try {
      await integrationsApi.disconnectEmail(id);
      setEmails(prev => prev.filter(e => e.id !== id));
    } catch { setError("Could not disconnect email."); }
    finally { setActionLoading(null); }
  };

  // Build display connections from backend data + static options
  const calendarOptions = [
    {
      provider: "google", name: "Google Calendar",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      description: "Sync court dates, deadlines, and reminders directly with Google Calendar.",
      accent: "bg-blue-50 border border-blue-100",
    },
    {
      provider: "outlook", name: "Outlook Calendar",
      icon: <Calendar className="w-5 h-5 text-blue-700" />,
      description: "Connect your Microsoft Outlook calendar for two-way event sync.",
      accent: "bg-blue-50 border border-cyan-100",
    },
  ];

  const emailOptions = [
    {
      provider: "gmail", name: "Gmail",
      icon: <Mail className="w-5 h-5 text-red-500" />,
      description: "Monitor client emails, auto-tag case threads, and trigger task creation.",
      accent: "bg-red-50 border border-red-100",
    },
    {
      provider: "outlook", name: "Outlook Mail",
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      description: "Sync your Microsoft Outlook inbox with case management workflows.",
      accent: "bg-blue-50 border border-blue-100",
    },
    {
      provider: "yahoo", name: "Yahoo Mail",
      icon: <Globe className="w-5 h-5 text-purple-500" />,
      description: "Connect your Yahoo Mail account for unified inbox management.",
      accent: "bg-purple-50 border border-purple-100",
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Cpu className="w-7 h-7 text-blue-600 animate-pulse" />
    </div>
  );

  const connectedCount = calendars.filter(c => c.connected).length + emails.filter(e => e.connected).length;

  return (
    <div className="space-y-10">
      {/* Status bar */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", connectedCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
            {connectedCount} Active Connection{connectedCount !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={load}
          className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5 text-amber-400" /></button>
        </div>
      )}

      {/* Calendar section */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-cyan-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Calendar Sync</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Automatic two-way event synchronization</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {calendarOptions.map(opt => {
            const conn = calendars.find(c => c.provider === opt.provider);
            return (
              <ConnectionCard
                key={opt.provider}
                name={opt.name}
                icon={opt.icon}
                description={opt.description}
                accent={opt.accent}
                connected={conn?.connected ?? false}
                email={conn?.email}
                lastSync={conn?.lastSync}
                loading={actionLoading === `cal-${opt.provider}` || actionLoading === `cal-${conn?.id}`}
                onConnect={() => connectCalendar(opt.provider)}
                onDisconnect={() => conn && disconnectCalendar(conn.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Email section */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Email Integrations</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Auto-tag client emails and create tasks from inbox</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailOptions.map(opt => {
            const conn = emails.find(e => e.provider === opt.provider);
            return (
              <ConnectionCard
                key={opt.provider}
                name={opt.name}
                icon={opt.icon}
                description={opt.description}
                accent={opt.accent}
                connected={conn?.connected ?? false}
                email={conn?.email}
                lastSync={conn?.lastSync}
                loading={actionLoading === `em-${opt.provider}` || actionLoading === `em-${conn?.id}`}
                onConnect={() => connectEmail(opt.provider)}
                onDisconnect={() => conn && disconnectEmail(conn.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Info notice */}
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
        <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Connecting a calendar or email will open a secure OAuth window.
          RelunoLegal never stores your credentials — we use read-only access tokens
          revocable at any time from your Google/Microsoft account settings.
        </p>
      </div>
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
export default function Integrations() {
  const { subscription } = useSubscription();

  return (
    
      <div className="flex min-h-screen w-full bg-white text-slate-900">
        
        

          <header className="flex h-16 items-center justify-between border-b border-slate-100 px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4">
              
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Calendar & Email Integrations</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-200 text-slate-500">
              {subscription?.plan ?? "free"} plan
            </span>
          </header>

          <main className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Integrations Hub</h1>
              <p className="text-sm text-slate-500">Connect your calendars and email accounts for automated workflow sync.</p>
            </div>

            <FeatureGuard
              featureName="Calendar & Email Integrations"
              requiredPlan="starter"
              description="Sync Google Calendar, Outlook, Gmail and more with your legal workflow."
            >
              <IntegrationsContent />
            </FeatureGuard>
          </main>
        
      </div>
    
  );
}