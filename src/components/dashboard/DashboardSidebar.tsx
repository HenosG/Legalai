// src/components/dashboard/DashboardSidebar.tsx

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MessageSquare, FileText, Briefcase,
  Bell, Calendar, Mail, ScanLine, Activity, FolderKanban,
  BarChart3, UserCircle, Settings, Download, BookOpen,
  Newspaper, BookMarked, FileStack, Video, Users, HelpCircle,
  LogOut, Crown, ChevronLeft, ChevronRight, ChevronDown,
  Lock, Cpu, Search,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  requiredPlan?: "starter" | "pro";
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

const learnItems = [
  { label: "Blog",      icon: Newspaper,  path: "/blog"      },
  { label: "Guides",    icon: BookMarked, path: "/guides"    },
  { label: "Templates", icon: FileStack,  path: "/templates" },
  { label: "Webinars",  icon: Video,      path: "/webinars"  },
  { label: "Community", icon: Users,      path: "/community" },
];

const PlanBadge = ({ plan }: { plan: "starter" | "pro" }) => (
  <span className={cn(
    "text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border flex-shrink-0",
    plan === "pro"
      ? "text-blue-600 bg-blue-50 border-cyan-200"
      : "text-emerald-500 bg-emerald-50 border-emerald-200"
  )}>
    {plan}
  </span>
);

const SectionHeader = ({ label, collapsed }: { label: string; collapsed: boolean }) => {
  if (collapsed) return <div className="h-px bg-slate-200 mx-2 my-3" />;
  return (
    <div className="px-3 pt-5 pb-1.5">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.35em]">{label}</p>
    </div>
  );
};

const NavButton = ({
  item, isActive, collapsed, canAccess, onClick,
}: {
  item: NavItem; isActive: boolean; collapsed: boolean;
  canAccess: boolean; onClick: () => void;
}) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group relative",
        isActive
          ? "bg-slate-900 text-white shadow-lg shadow-blue-500/20" 
          : canAccess
          ? "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          : "text-slate-300 cursor-not-allowed"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
      )}
      <Icon className={cn(
        "w-4 h-4 flex-shrink-0 transition-colors",
        isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-600"
      )} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left truncate">{item.label}</span>
          {item.requiredPlan && !canAccess && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <PlanBadge plan={item.requiredPlan} />
              <Lock className="w-2.5 h-2.5 text-slate-300" />
            </div>
          )}
        </>
      )}
    </button>
  );
};

function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { can, isPro, isStarter } = useSubscription();

  // --- CRASH PREVENTION LOGIC ---
  
  // 1. Safe Name Retrieval with fallback
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  // 2. Safe Initials Calculation (Bulletproof version of your code)
  const userInitials = (userName || "U")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 3. Plan Logic
  const planLabel = isPro ? "Pro" : isStarter ? "Starter" : "Free";
  const planColor = isPro ? "text-blue-600" : isStarter ? "text-blue-500" : "text-zinc-400";

  const accessMap: Record<string, boolean> = {
    "/tasks":         can("smartReminders"),
    "/integrations": can("calendarSync"),
    "/pdf-analysis": can("pdfAnalysis"),
    "/analytics":     Boolean(can("analyticsLevel")),
    "/export":        can("exportSuite"),
  };

  const canAccessPath = (path: string): boolean => accessMap[path] ?? true;

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const sections: NavSection[] = [
    {
      id: "platform",
      label: "Platform",
      items: [
        { label: "Dashboard",     icon: LayoutDashboard, path: "/dashboard"         },
        { label: "Legal AI",      icon: MessageSquare,   path: "/legalquestionai"   },
        { label: "Doc Generator", icon: FileText,        path: "/documentgenerator" },
        { label: "Case Vault",    icon: Briefcase,       path: "/my-cases"          },
      ],
    },
    {
      id: "productivity",
      label: "Productivity",
      items: [
        { label: "Smart Reminders",    icon: Bell,     path: "/tasks",        requiredPlan: "starter" as const },
        { label: "Calendar Sync",      icon: Calendar, path: "/calendar",     requiredPlan: "starter" as const },
        { label: "Email Integrations", icon: Mail,     path: "/integrations", requiredPlan: "starter" as const },
      ],
    },
    {
      id: "intelligence",
      label: "Intelligence",
      items: [
        { label: "PDF Analysis",          icon: ScanLine,     path: "/pdf-analysis", requiredPlan: "pro" as const },
        { label: "Workload Intelligence", icon: Activity,     path: "/analytics",    requiredPlan: "pro" as const },
        { label: "Case Tracking",         icon: FolderKanban, path: "/case-tracking"                                },
      ],
    },
    {
      id: "management",
      label: "Management",
      items: [
        { label: "Management", icon: BarChart3, path: "/dashboard-analytics" },
        { label: "Settings & Billing", icon: Settings, path: "/account" },
      ],
    },
    {
      id: "output",
      label: "Output",
      items: [
        { label: "Professional Export", icon: Download, path: "/export", requiredPlan: "pro" as const },
      ],
    },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col border-r border-slate-200 transition-all duration-300 z-30 bg-white shrink-0", // Added shrink-0
      collapsed ? "w-[70px]" : "w-[256px]"
    )}>

      {/* Brand Header — "Legal OS" Style */}
      <div className={cn(
        "flex items-center gap-3 border-b border-slate-100 flex-shrink-0",
        collapsed ? "p-4 justify-center" : "px-6 py-8"
      )}>
        {/* The Icon Box */}
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_8px_16px_rgba(37,99,235,0.2)] transform -rotate-3">
          <span className="text-white font-display font-bold text-xl">R</span>
        </div>

        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="font-display text-2xl font-bold leading-[1.02] tracking-tighter text-blue-600">
              Reluno<span className="text-zinc-900">.</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mt-0.5">
              Legal OS
            </p>
          </div>
        )}
      </div>

      {/* User Info — Minimalist & Clean */}
      <div className={cn(
        "flex items-center gap-3 border-b border-slate-100 flex-shrink-0",
        collapsed ? "p-3 justify-center" : "px-6 py-4"
      )}>
        <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-600 text-[10px] font-bold">{userInitials}</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-[13px] font-semibold text-zinc-900 truncate tracking-tight">
              {userName}
            </p>
            <p className="text-[10px] font-medium text-blue-600 uppercase tracking-widest">
              {planLabel}
            </p>
          </div>
        )}
      </div>

      {/* Navigation — Straight into the tools */}
      <nav
        className="flex-1 overflow-y-auto px-3 pb-4 pt-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <SectionHeader label={section.label} collapsed={collapsed} />
            <div className="space-y-1 mt-2">
              {section.items.map((item) => (
                <NavButton
                  key={`${section.id}-${item.label}`}
                  item={item}
                  isActive={location.pathname === item.path}
                  collapsed={collapsed}
                  canAccess={canAccessPath(item.path)}
                  onClick={() => handleNavClick(item)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Archives dropdown */}
        <div>
          <SectionHeader label="Archives" collapsed={collapsed} />
          <div className="space-y-0.5">
            <button
              onClick={() => collapsed ? navigate("/blog") : setLearnOpen((o) => !o)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all border border-transparent uppercase tracking-tight"
            >
              <BookOpen className="w-4 h-4 flex-shrink-0 text-slate-400" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">Resources</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", learnOpen && "rotate-180")} />
                </>
              )}
            </button>
            {learnOpen && !collapsed && (
              <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 mt-1">
                {learnItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                        location.pathname === item.path
                          ? "text-blue-600 bg-blue-50"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-100 p-3 space-y-1 bg-white">
        {/* Upgrade CTA */}
        {!isPro && !collapsed && (
          <button
            onClick={() => navigate("/pricing")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest bg-blue-600 hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] mb-2"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Pro
          </button>
        )}
        {!isPro && collapsed && (
          <button
            onClick={() => navigate("/pricing")}
            title="Upgrade to Pro"
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-blue-50 border border-cyan-200 hover:bg-cyan-100 transition-all mb-1"
          >
            <Crown className="w-4 h-4 text-blue-600" />
          </button>
        )}

        <button
          onClick={() => navigate("/support")}
          title={collapsed ? "Help & Support" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all uppercase tracking-tight border border-transparent"
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Help & Support</span>}
        </button>

        <button
          onClick={handleLogout}
          title={collapsed ? "Disconnect" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-tight border border-transparent"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Disconnect</span>}
        </button>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all uppercase tracking-tight border border-transparent"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
export { DashboardSidebar };