import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useSubscription } from "@/hooks/useSubscription";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  Receipt,
  Settings,
  CreditCard,
  LogOut,
  HelpCircle,
  PanelLeft,
  ChevronsUpDown,
  Search,
  ArrowUpRight,
  CornerDownLeft,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface CommandItem extends NavItem {
  category: string;
}

// ─── Navigation — RelunoOS Core Modules ──────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "CRM", icon: Users, path: "/crm" },
  { label: "AI Intake", icon: Sparkles, path: "/intake" },
  { label: "Proposals", icon: FileText, path: "/proposals" },
  { label: "Projects", icon: FolderKanban, path: "/projects" },
  { label: "Invoices", icon: Receipt, path: "/invoices" },
];

const SETTINGS_ITEM: NavItem = {
  label: "Settings",
  icon: Settings,
  path: "/account",
};

const COMMAND_ITEMS: CommandItem[] = [
  ...NAV_ITEMS.map((item) => ({ ...item, category: "Modules" })),
  { ...SETTINGS_ITEM, category: "Workspace" },
];

// ─── Command Palette ─────────────────────────────────────────────────────────

function CommandPalette({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    setSearch("");
    setActiveIndex(0);

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const filtered = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  const handleKeyNav = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && filtered[activeIndex]) {
      onSelect(filtered[activeIndex].path);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onMouseDown={onClose}
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex h-[420px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2.5 border-b border-zinc-100 px-3.5 py-3 dark:border-white/[0.06]">
              <Search
                className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                strokeWidth={2}
              />

              <input
                ref={inputRef}
                type="text"
                placeholder="Search modules and settings..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyNav}
                className="flex-1 bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />

              <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-500">
                ESC
              </kbd>
            </div>

            <div className="flex-1 overflow-y-auto py-1.5">
              {Object.keys(grouped).length === 0 ? (
                <div className="px-4 py-8 text-center text-[13px] text-zinc-400 dark:text-zinc-500">
                  No matches for “{search}”
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="px-1.5">
                    <div className="px-2.5 pb-1 pt-2.5 text-[10.5px] font-semibold tracking-wide text-zinc-400 dark:text-zinc-500">
                      {category}
                    </div>

                    {items.map((item) => {
                      const itemIndex = filtered.indexOf(item);
                      const isActive = itemIndex === activeIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.path}
                          type="button"
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                          onClick={() => {
                            onSelect(item.path);
                            onClose();
                          }}
                          className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                            isActive
                              ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
                              : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/[0.05]"
                          )}
                        >
                          <Icon
                            className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500"
                            strokeWidth={2}
                          />
                          <span className="flex-1 truncate">{item.label}</span>

                          {isActive && (
                            <CornerDownLeft className="h-3 w-3 shrink-0 text-zinc-300 dark:text-zinc-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[10.5px] text-zinc-400 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 text-[9px] font-bold dark:border-white/10 dark:bg-white/5">
                  ↑↓
                </kbd>
                navigate
              </span>

              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 text-[9px] font-bold dark:border-white/10 dark:bg-white/5">
                  ↵
                </kbd>
                select
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Nav Row ─────────────────────────────────────────────────────────────────

function NavRow({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const isAiIntake = item.path === "/intake";

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-[7px] text-[13px] font-medium transition-colors duration-100",
        collapsed && "justify-center px-0 py-2.5",
        isActive
          ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-xl bg-zinc-100 dark:bg-white/10"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      <Icon
        className={cn(
          "relative h-[17px] w-[17px] shrink-0",
          isAiIntake
            ? "text-blue-600 dark:text-blue-400"
            : isActive
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
        )}
        strokeWidth={2}
      />

      {!collapsed && (
        <span className="relative flex-1 truncate text-left">{item.label}</span>
      )}

      {!collapsed && isAiIntake && (
        <span className="relative rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          AI
        </span>
      )}
    </button>
  );
}

// ─── Settings Row (Direct Navigation Only) ───────────────────────────────────

function SettingsRow({
  collapsed,
  isActive,
  onClick,
}: {
  collapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? "Settings" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-[7px] text-[13px] font-medium transition-colors",
        collapsed && "justify-center px-0 py-2.5",
        isActive
          ? "bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="settings-active-pill"
          className="absolute inset-0 rounded-xl bg-zinc-100 dark:bg-white/10"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      <Settings
        className={cn(
          "relative h-[17px] w-[17px] shrink-0",
          isActive
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-200"
        )}
        strokeWidth={2}
      />

      {!collapsed && (
        <span className="relative flex-1 truncate text-left">Settings</span>
      )}
    </button>
  );
}

// ─── Account Menu ────────────────────────────────────────────────────────────

function AccountMenu({
  collapsed,
  userName,
  userInitials,
  planLabel,
  onLogout,
  onUpgrade,
  onExpandIfNeeded,
}: {
  collapsed: boolean;
  userName: string;
  userInitials: string;
  planLabel: string;
  onLogout: () => void;
  onUpgrade: () => void;
  onExpandIfNeeded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <AnimatePresence>
        {open && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-50 w-full rounded-xl border border-zinc-200 bg-white py-1.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)] dark:backdrop-blur-xl"
          >
            <div className="border-b border-zinc-100 px-3 pb-2 pt-1 dark:border-white/[0.06]">
              <p className="truncate text-[13px] font-semibold text-zinc-900 dark:text-white">
                {userName}
              </p>
              <p className="text-[11.5px] font-medium text-zinc-400 dark:text-zinc-500">
                {planLabel} plan
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/support");
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <HelpCircle
                className="h-[15px] w-[15px] text-zinc-400 dark:text-zinc-500"
                strokeWidth={2}
              />
              Help & Support
            </button>

            <div className="my-1 border-t border-zinc-100 dark:border-white/[0.06]" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onUpgrade();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <ArrowUpRight className="h-[15px] w-[15px]" strokeWidth={2} />
              Upgrade Plan
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-[15px] w-[15px]" strokeWidth={2} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (collapsed) {
            onExpandIfNeeded();
            setOpen(false);
            return;
          }

          setOpen((current) => !current);
        }}
        title={userName}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-150",
          "hover:bg-zinc-100 dark:hover:bg-white/[0.06]",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10.5px] font-semibold text-white ring-1 ring-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 dark:ring-white/10">
            {userInitials}
          </div>
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[12.5px] font-semibold text-zinc-900 dark:text-zinc-100">
                {userName}
              </p>
              <p className="truncate text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {planLabel} plan
              </p>
            </div>

            <ChevronsUpDown
              className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-300"
              strokeWidth={2}
            />
          </>
        )}
      </button>
    </div>
  );
}

// ─── Sidebar Main ────────────────────────────────────────────────────────────

function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { plan } = useSubscription();

  const userName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "User";

  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const planValue = plan || "free";
  const planLabel = planValue.charAt(0).toUpperCase() + planValue.slice(1);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // 🛑 FIX: Redirect to /pricing instead of /billing
  const handleUpgrade = () => navigate("/pricing");

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const isSettingsActive =
    location.pathname === "/account" ||
    location.pathname === "/billing" ||
    location.pathname === "/pricing" ||
    location.pathname === "/team" ||
    location.pathname === "/settings";

  return (
    <aside
      className={cn(
        "sticky top-4 flex h-[calc(100vh-2rem)] shrink-0 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_20px_60px_-16px_rgba(0,0,0,0.5)]",
        collapsed ? "w-[72px]" : "w-[252px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "relative flex h-14 shrink-0 items-center px-3.5",
          collapsed ? "justify-center px-0" : "justify-between"
        )}
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden rounded-md transition-opacity hover:opacity-90"
          aria-label="Go to dashboard"
        >
          <img
            src="/brand-icon.png"
            alt="RelunoOS"
            className="h-6 w-6 shrink-0 object-contain"
          />
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
              title="Search (Ctrl/⌘ K)"
              aria-label="Search navigation"
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeft className="h-[16px] w-[16px]" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>

      {/* Expand button while sidebar is collapsed */}
      {collapsed && (
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-[16px] w-[16px] rotate-180" strokeWidth={2} />
          </button>
        </div>
      )}

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelect={(path) => navigate(path)}
      />

      {/* Module navigation */}
      <nav
        className="relative flex-1 space-y-0.5 overflow-y-auto px-3 pb-2 pt-1"
        aria-label="Main navigation"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

        {NAV_ITEMS.map((item) => (
          <NavRow
            key={item.path}
            item={item}
            isActive={
              location.pathname === item.path ||
              (item.path === "/projects" &&
                location.pathname.startsWith("/projects/")) ||
              (item.path === "/proposals" &&
                location.pathname.startsWith("/proposals/"))
            }
            collapsed={collapsed}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="relative shrink-0 space-y-0.5 border-t border-zinc-100 p-3 dark:border-white/[0.06]">
        <SettingsRow
          collapsed={collapsed}
          isActive={isSettingsActive}
          onClick={() => navigate("/account")}
        />

        <AccountMenu
          collapsed={collapsed}
          userName={userName}
          userInitials={userInitials}
          planLabel={planLabel}
          onLogout={handleLogout}
          onUpgrade={handleUpgrade}
          onExpandIfNeeded={() => setCollapsed(false)}
        />
      </div>
    </aside>
  );
}

// ─── Optional App Shell ──────────────────────────────────────────────────────

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-zinc-100 p-4 dark:bg-black">
      <div className="flex w-full gap-4">
        <DashboardSidebar />

        <div className="min-w-0 flex-1">
          <main className="min-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export { DashboardSidebar, DashboardShell };
export default DashboardShell;