import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertCircle,
  BellRing,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  FolderKanban,
  Globe2,
  KeyRound,
  PlugZap,
  RefreshCw,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  UserCircle,
  Users2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { settingsApi } from "@/lib/settings-api";
import type { SettingsPayload } from "@/types/settings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import WorkspaceSettingsPanel from "@/components/settings/WorkspaceSettings";
import ClientPortalSettings from "@/components/settings/ClientPortalSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

// ─── Navigation ──────────────────────────────────────────────────────────────

const SETTINGS_NAV = [
  {
    group: "Personal",
    items: [
      {
        id: "settings-profile",
        label: "Profile",
        description: "Your name and personal account details",
        icon: UserCircle,
      },
      {
        id: "settings-notifications",
        label: "Notifications",
        description: "Control when RelunoOS gets your attention",
        icon: BellRing,
      },
      {
        id: "settings-security",
        label: "Security",
        description: "Account protection and access controls",
        icon: ShieldCheck,
      },
    ],
  },
  {
    group: "Workspace",
    items: [
      {
        id: "settings-workspace",
        label: "Workspace",
        description: "Your company and workspace identity",
        icon: Building2,
      },
      {
        id: "settings-client-portal",
        label: "Client Portal",
        description: "What clients see when they sign in",
        icon: Globe2,
      },
      {
        id: "settings-proposal-defaults",
        label: "Proposal defaults",
        description: "Default terms and proposal content",
        icon: FileText,
      },
      {
        id: "settings-project-defaults",
        label: "Project defaults",
        description: "Default delivery and project settings",
        icon: FolderKanban,
      },
      {
        id: "settings-team-access",
        label: "Team & access",
        description: "Workspace members and permissions",
        icon: Users2,
      },
      {
        id: "settings-integrations",
        label: "Integrations",
        description: "Connected services and workflow tools",
        icon: PlugZap,
      },
      {
        id: "settings-billing",
        label: "Billing",
        description: "Plan, payment processing, and billing",
        icon: CreditCard,
      },
    ],
  },
  {
    group: "Advanced",
    items: [
      {
        id: "settings-danger-zone",
        label: "Danger zone",
        description: "Irreversible workspace actions",
        icon: TriangleAlert,
      },
    ],
  },
] as const;

const ALL_ITEMS = SETTINGS_NAV.flatMap((group) => group.items);

type SettingsSectionId = (typeof ALL_ITEMS)[number]["id"];

// ─── Motion ──────────────────────────────────────────────────────────────────

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 28,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scrollToSection(id: string) {
  const element = document.getElementById(id);

  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function getWorkspaceName(settings: SettingsPayload | null) {
  if (!settings) return "Your workspace";

  const record = settings as SettingsPayload & {
    workspace?: {
      name?: string | null;
      companyName?: string | null;
    };
    profile?: {
      company?: string | null;
    };
  };

  return (
    record.workspace?.name ||
    record.workspace?.companyName ||
    record.profile?.company ||
    "Your workspace"
  );
}

function getBillingConnected(settings: SettingsPayload | null) {
  if (!settings) return false;

  const record = settings as SettingsPayload & {
    billing?: {
      stripeConnected?: boolean;
    };
  };

  return Boolean(record.billing?.stripeConnected);
}

// ─── Shared Components ───────────────────────────────────────────────────────

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-100" />
            <div className="mt-2 h-3 w-64 animate-pulse rounded bg-zinc-100" />
          </div>

          <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-100" />
        </div>

        <div className="mt-6 space-y-4">
          <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="h-4 w-36 animate-pulse rounded bg-zinc-100" />
        <div className="mt-2 h-3 w-72 animate-pulse rounded bg-zinc-100" />

        <div className="mt-6 space-y-3">
          <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

function PendingSection({
  id,
  title,
  description,
  note,
  icon: Icon,
  actionLabel,
  onAction,
}: {
  id: string;
  title: string;
  description: string;
  note: string;
  icon: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
            <Icon size={16} strokeWidth={1.8} />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-800">
              This setting is not available yet
            </p>

            <p className="mt-1 max-w-xl text-[11px] leading-5 text-zinc-500">
              {note}
            </p>
          </div>

          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
            >
              <Settings2 size={14} />
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function SettingsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-600">
            <AlertCircle size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-800">
              Could not load settings
            </p>

            <p className="mt-1 max-w-xl text-xs leading-5 text-red-700">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    </div>
  );
}

function SettingsSectionPlaceholder({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center">
        <p className="text-xs text-zinc-500">
          Connect settings data to continue.
        </p>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Account() {
  const { getToken } = useAuth();

  const [settings, setSettings] = useState<SettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeId, setActiveId] = useState<SettingsSectionId>(
    ALL_ITEMS[0].id
  );

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const token = await getToken();
        const data = await settingsApi.getAll(token);

        if (mountedRef.current) {
          setSettings(data);
        }
      } catch (requestError) {
        if (mountedRef.current) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load settings."
          );
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [getToken]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id as SettingsSectionId);
        }
      },
      {
        rootMargin: "-18% 0px -70% 0px",
      }
    );

    ALL_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [error, loading, settings]);

  const workspaceName = getWorkspaceName(settings);
  const stripeConnected = getBillingConnected(settings);

  const handleNavClick = (id: SettingsSectionId) => {
    setActiveId(id);
    scrollToSection(id);
  };

  const handleRefresh = async () => {
    await load(true);
    toast.success("Settings refreshed.");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

        .font-serif {
          font-family: "DM Serif Display", serif;
        }

        * {
          font-family: "DM Sans", sans-serif;
        }

        .hide-scrollbar {
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full px-5 pb-24 pt-10 sm:px-8 lg:px-12 lg:pt-12"
      >
        {/* Header */}
        <motion.section
          variants={itemVariants}
          className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-zinc-400">
              Account and workspace controls
            </p>

            <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.045em] text-zinc-900 sm:text-5xl">
              Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Manage your personal account, workspace preferences, client
              experience, access controls, integrations, and billing from one
              place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleNavClick("settings-security")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <ShieldCheck size={14} className="text-zinc-500" />
              Security
            </button>

            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : undefined}
              />
              Refresh
            </button>
          </div>
        </motion.section>

        {/* Workspace Summary */}
        <motion.section
          variants={itemVariants}
          className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <button
            type="button"
            onClick={() => handleNavClick("settings-workspace")}
            className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500">
                Workspace
              </span>

              <Building2
                size={15}
                className="text-zinc-400 transition-colors group-hover:text-zinc-700"
              />
            </div>

            <p className="mt-4 truncate font-serif text-2xl font-bold leading-none tracking-tight text-zinc-900">
              {loading ? "…" : workspaceName}
            </p>

            <p className="mt-2 text-[11px] text-zinc-400">
              Company identity and workspace details
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("settings-client-portal")}
            className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500">
                Client Portal
              </span>

              <Globe2
                size={15}
                className="text-zinc-400 transition-colors group-hover:text-zinc-700"
              />
            </div>

            <p className="mt-4 font-serif text-2xl font-bold leading-none tracking-tight text-zinc-900">
              Configure
            </p>

            <p className="mt-2 text-[11px] text-zinc-400">
              Client-facing project and invoice access
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("settings-security")}
            className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500">
                Account security
              </span>

              <ShieldCheck
                size={15}
                className="text-zinc-400 transition-colors group-hover:text-zinc-700"
              />
            </div>

            <p className="mt-4 font-serif text-2xl font-bold leading-none tracking-tight text-zinc-900">
              Review
            </p>

            <p className="mt-2 text-[11px] text-zinc-400">
              Authentication and account protection
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick("settings-billing")}
            className="group rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500">
                Billing
              </span>

              <CreditCard
                size={15}
                className="text-zinc-400 transition-colors group-hover:text-zinc-700"
              />
            </div>

            <p className="mt-4 font-serif text-2xl font-bold leading-none tracking-tight text-zinc-900">
              {loading ? "…" : stripeConnected ? "Connected" : "Set up"}
            </p>

            <p className="mt-2 text-[11px] text-zinc-400">
              Stripe payments and workspace billing
            </p>
          </button>
        </motion.section>

        {/* Mobile Navigation */}
        <motion.section variants={itemVariants} className="mb-6 lg:hidden">
          <label
            htmlFor="settings-section-nav"
            className="mb-2 block text-[11px] font-semibold text-zinc-500"
          >
            Jump to a settings section
          </label>

          <div className="relative">
            <select
              id="settings-section-nav"
              value={activeId}
              onChange={(event) => {
                handleNavClick(event.target.value as SettingsSectionId);
              }}
              className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-10 text-sm text-zinc-800 outline-none transition-colors focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5"
            >
              {SETTINGS_NAV.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] xl:gap-12">
          {/* Desktop Navigation */}
          <aside className="hidden lg:block">
            <nav className="sticky top-8">
              {SETTINGS_NAV.map((group, groupIndex) => (
                <div
                  key={group.group}
                  className={cn(groupIndex > 0 && "mt-6")}
                >
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {group.group}
                  </p>

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                            active
                              ? "bg-zinc-900 text-white"
                              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                          )}
                        >
                          <Icon
                            size={15}
                            strokeWidth={1.8}
                            className={cn(
                              "shrink-0",
                              active
                                ? "text-white"
                                : "text-zinc-400 group-hover:text-zinc-700"
                            )}
                          />

                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Settings Content */}
          <div className="min-w-0 max-w-[900px]">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <SettingsErrorState
                    message={error}
                    onRetry={() => void load()}
                  />

                  <div className="mt-8 space-y-10">
                    {ALL_ITEMS.map((item) => (
                      <SettingsSectionPlaceholder
                        key={item.id}
                        id={item.id}
                        title={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : loading && !settings ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <SettingsLoadingSkeleton />
                </motion.div>
              ) : settings ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-12"
                >
                  {/* Personal */}
                  <section id="settings-profile" className="scroll-mt-28">
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <UserCircle size={16} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                            Profile
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Update the personal details used throughout your
                            workspace.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ProfileSettings settings={settings} />
                  </section>

                  <section
                    id="settings-notifications"
                    className="scroll-mt-28"
                  >
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <BellRing size={16} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                            Notifications
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Choose the client and workspace events worth
                            receiving.
                          </p>
                        </div>
                      </div>
                    </div>

                    <NotificationsSettings settings={settings} />
                  </section>

                  <section id="settings-security" className="scroll-mt-28">
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <KeyRound size={16} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                            Security
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Review authentication and security preferences for
                            your account.
                          </p>
                        </div>
                      </div>
                    </div>

                    <SecuritySettings settings={settings} />
                  </section>

                  {/* Workspace */}
                  <section id="settings-workspace" className="scroll-mt-28">
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <Building2 size={16} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                            Workspace
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Set the company details and preferences that define
                            this workspace.
                          </p>
                        </div>
                      </div>
                    </div>

                    <WorkspaceSettingsPanel
                      settings={settings}
                      onSaved={() => void load(true)}
                    />
                  </section>

                  <section
                    id="settings-client-portal"
                    className="scroll-mt-28"
                  >
                    <div className="mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                          <Globe2 size={16} strokeWidth={1.8} />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold tracking-[-0.02em] text-zinc-900">
                            Client Portal
                          </h2>

                          <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Configure how clients experience shared projects,
                            updates, and invoices.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ClientPortalSettings
                      settings={settings}
                      onSaved={() => void load(true)}
                    />
                  </section>

                  <PendingSection
                    id="settings-proposal-defaults"
                    title="Proposal defaults"
                    description="Set the baseline language and terms used when creating new proposals."
                    note="Proposal defaults are not connected yet. This section will control reusable proposal terms, scope templates, and default payment language."
                    icon={FileText}
                  />

                  <PendingSection
                    id="settings-project-defaults"
                    title="Project defaults"
                    description="Configure how new projects and task structures begin in your workspace."
                    note="Project defaults are not connected yet. This section will support task templates, delivery phases, project health rules, and default due-date behavior."
                    icon={FolderKanban}
                  />

                  <PendingSection
                    id="settings-team-access"
                    title="Team & access"
                    description="Manage workspace members, roles, and collaboration permissions."
                    note="Team workspaces are not enabled yet. This section becomes available when Clerk Organizations and workspace membership are configured."
                    icon={Users2}
                  />

                  <PendingSection
                    id="settings-integrations"
                    title="Integrations"
                    description="Connect the services that support your client operations."
                    note="The dedicated integration controls for Clerk, Stripe, Gemini, and Resend are not connected yet."
                    icon={PlugZap}
                  />

                  <PendingSection
                    id="settings-billing"
                    title="Billing"
                    description="Manage your RelunoOS plan and payment collection settings."
                    note={
                      stripeConnected
                        ? "Stripe is connected. Detailed billing controls, payment settings, and invoice collection preferences are being connected."
                        : "Stripe is not connected yet. Connect a payment provider before enabling client payment collection."
                    }
                    icon={CreditCard}
                  />

                  <PendingSection
                    id="settings-danger-zone"
                    title="Danger zone"
                    description="Irreversible actions for this workspace and its operational data."
                    note="Workspace export and deletion controls are intentionally unavailable in the app right now. Contact support for sensitive workspace deletion or export requests."
                    icon={TriangleAlert}
                  />

                  {/* AI workflow note */}
                  <section className="scroll-mt-28">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5">
                      <div className="flex items-start gap-3">
                        <Bot
                          size={16}
                          className="mt-0.5 shrink-0 text-zinc-400"
                        />

                        <div>
                          <p className="text-xs font-semibold text-zinc-800">
                            AI workflow preferences are coming next.
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                            AI Intake, proposal drafting, workspace summaries,
                            and automation controls will live here once the AI
                            service is connected. Important client-facing
                            actions should always remain reviewable before they
                            are sent.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-10"
                >
                  {ALL_ITEMS.map((item) => (
                    <SettingsSectionPlaceholder
                      key={item.id}
                      id={item.id}
                      title={item.label}
                      description={item.description}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>
    </div>
  );
}