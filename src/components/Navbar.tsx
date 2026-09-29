import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Code2,
  FileText,
  FolderKanban,
  Globe2,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Menu,
  Palette,
  PlugZap,
  Receipt,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UsersRound,
  Workflow,
  X,
} from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MegaMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

const platformItems: MegaMenuItem[] = [
  {
    name: "AI Intake",
    href: "/platform/ai-intake",
    icon: Sparkles,
    description: "Turn raw inquiries into structured opportunities.",
    badge: "AI-powered",
  },
  {
    name: "CRM & Contacts",
    href: "/platform/crm",
    icon: Users,
    description: "Keep clients, notes, opportunities, and history connected.",
  },
  {
    name: "Proposals",
    href: "/platform/proposals",
    icon: FileText,
    description: "Create polished scopes, pricing, and approval workflows.",
  },
  {
    name: "Projects & Delivery",
    href: "/platform/projects",
    icon: FolderKanban,
    description: "Manage milestones, tasks, priorities, and deadlines.",
  },
  {
    name: "Invoices & Payments",
    href: "/platform/invoices",
    icon: Receipt,
    description: "Create invoices, track payment status, and collect online.",
  },
  {
    name: "Client Portal",
    href: "/platform/client-portal",
    icon: Globe2,
    description: "Give clients a clear view of approved work and progress.",
    badge: "Popular",
  },
];

const solutionItems: MegaMenuItem[] = [
  {
    name: "Agencies",
    href: "/solutions/agencies",
    icon: Building2,
    description: "Bring leads, delivery, billing, and client visibility together.",
  },
  {
    name: "Freelancers",
    href: "/solutions/freelancers",
    icon: BriefcaseBusiness,
    description: "Replace scattered admin tools with one focused workspace.",
  },
  {
    name: "Creative Teams",
    href: "/solutions/creative-agencies",
    icon: Palette,
    description: "Organize briefs, approvals, production, and delivery.",
  },
  {
    name: "Marketing Agencies",
    href: "/solutions/marketing-agencies",
    icon: Target,
    description: "Manage campaigns, retainers, timelines, and account context.",
  },
  {
    name: "Development Agencies",
    href: "/solutions/development-agencies",
    icon: Code2,
    description: "Move from discovery and scope to milestones and launch.",
  },
];

const resourceItems: MegaMenuItem[] = [
  {
    name: "Blog",
    href: "/blog",
    icon: BookOpen,
    description: "Workflow guides, comparisons, and agency operations insights.",
    badge: "New",
  },
  {
    name: "Guides",
    href: "/guides",
    icon: Lightbulb,
    description: "Practical playbooks for calmer client operations.",
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
    description: "Proposal, onboarding, scope, and delivery starting points.",
  },
  {
    name: "Changelog",
    href: "/changelog",
    icon: Bell,
    description: "Follow product updates and new RelunoOS capabilities.",
  },
  {
    name: "Help Center",
    href: "/support",
    icon: HelpCircle,
    description: "Find setup guidance and answers for your workspace.",
  },
];

const companyItems: MegaMenuItem[] = [
  {
    name: "About RelunoOS",
    href: "/about",
    icon: UsersRound,
    description: "Learn why we are building a calmer client operating system.",
  },
  {
    name: "Security & Privacy",
    href: "/security",
    icon: ShieldCheck,
    description: "Understand our approach to access, privacy, and trust.",
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: PlugZap,
    description: "Explore the systems that connect to RelunoOS.",
  },
  {
    name: "Contact",
    href: "/contact",
    icon: MessageSquare,
    description: "Ask a product, pricing, support, or security question.",
  },
];

function MenuItem({
  item,
  onClick,
}: {
  item: MegaMenuItem;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-zinc-200/80 hover:bg-zinc-50"
    >
      <div className="flex h-9 w-8 shrink-0 items-center justify-center text-zinc-900 transition-colors group-hover:text-[#063ee2]">
        <Icon size={18} strokeWidth={1.9} />
      </div>

      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-zinc-900 transition-colors group-hover:text-[#063ee2]">
            {item.name}
          </p>

          {item.badge && (
            <span className="rounded-full border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-blue-700">
              {item.badge}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-[11px] leading-4 text-zinc-500">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function MegaMenu({
  type,
  items,
  onClose,
}: {
  type: "platform" | "solutions" | "resources" | "company";
  items: MegaMenuItem[];
  onClose: () => void;
}) {
  const isPlatform = type === "platform";
  const isSolutions = type === "solutions";
  const isResources = type === "resources";

  const menuTitle = isPlatform
    ? "One connected workflow"
    : isSolutions
    ? "Built around your kind of work"
    : isResources
    ? "Learn and improve"
    : "Get to know RelunoOS";

  const menuDescription = isPlatform
    ? "Move from inquiry to client context, proposal, delivery, invoice, payment, and portal visibility."
    : isSolutions
    ? "Explore how RelunoOS fits agencies, freelancers, creative teams, marketing teams, and developers."
    : isResources
    ? "Practical resources for building calmer client operations."
    : "Learn about RelunoOS, security, integrations, and support.";

  const featuredHref = isPlatform
    ? "/platform"
    : isSolutions
    ? "/solutions/agencies"
    : isResources
    ? "/blog"
    : "/about";

  const featuredLabel = isPlatform
    ? "Explore the platform"
    : isSolutions
    ? "Explore solutions"
    : isResources
    ? "Read the latest resources"
    : "About RelunoOS";

  const FeaturedIcon = isPlatform
    ? Workflow
    : isSolutions
    ? BriefcaseBusiness
    : isResources
    ? BookOpen
    : Sparkles;

  const featuredTitle = isPlatform
    ? "Run the whole client workflow in one place."
    : isSolutions
    ? "Find the workflow that fits your business."
    : isResources
    ? "Learn how to make client work calmer."
    : "Build client operations with clarity.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={cn(
        "absolute top-full mt-2 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.14)] ring-1 ring-black/5",
        isPlatform ? "left-1/2 w-[720px] -translate-x-1/2" : "right-0 w-[680px]"
      )}
    >
      <div className="grid grid-cols-[1fr_210px] gap-4">
        <div>
          <div className="mb-3 border-b border-zinc-100 px-2 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              {menuTitle}
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              {menuDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {items.map((item) => (
              <MenuItem key={item.name} item={item} onClick={onClose} />
            ))}
          </div>

          <div className="mt-3 border-t border-zinc-100 px-2 pt-3">
            <Link
              to={featuredHref}
              onClick={onClose}
              className="group inline-flex items-center gap-2 text-[11px] font-bold text-[#063ee2] transition-colors hover:text-blue-800"
            >
              {featuredLabel}
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <Link
          to={featuredHref}
          onClick={onClose}
          className="group relative overflow-hidden rounded-xl bg-[#063ee2] p-5 text-white"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
              <FeaturedIcon size={18} />
            </div>

            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                RelunoOS
              </p>

              <p className="mt-2 text-lg font-bold leading-tight tracking-[-0.03em]">
                {featuredTitle}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white">
                Explore
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const isMenuOpen = (name: string) => activeDropdown === name;

  const navButtonClass = cn(
    "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
    scrolled
      ? "text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900"
      : "text-white hover:bg-white/15 hover:text-white"
  );

  const chevronClass = cn(
    "transition-transform duration-200",
    scrolled ? "text-zinc-400" : "text-white/70"
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      {/* Notification banner */}
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative isolate flex items-center justify-center gap-x-4 overflow-hidden bg-blue-600 px-4 py-2 pr-10 text-center text-xs font-medium text-white shadow-sm"
          >
            <span className="hidden items-center rounded-full border border-blue-400/30 bg-blue-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-100 sm:flex">
              v2.0 Live
            </span>

            <p className="truncate">
              RelunoOS is live. Build a calmer operation for your client work.
            </p>

            <Link
              to="/signup"
              className="inline-flex shrink-0 items-center gap-1 font-bold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:text-blue-100 hover:decoration-white"
            >
              Get started free
              <ArrowRight size={12} />
            </Link>

            <button
              type="button"
              onClick={() => setIsBannerVisible(false)}
              className="absolute right-2 top-1/2 rounded-md p-1 text-blue-200 transition-colors hover:bg-blue-700/50 hover:text-white"
              aria-label="Dismiss banner"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2">
          <img
            src={scrolled ? "/1.svg" : "/1-white.svg"}
            alt="RelunoOS logo"
            className="h-6 w-6 object-contain transition-all"
          />

          <span
            className={cn(
              "text-xl font-bold tracking-[-0.055em] transition-colors",
              scrolled ? "text-zinc-900" : "text-white"
            )}
          >
            RELUNOOS<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {/* Platform */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("platform")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link to="/platform" className={navButtonClass}>
              Platform
              <ChevronDown
                size={13}
                className={cn(
                  chevronClass,
                  isMenuOpen("platform") && "rotate-180"
                )}
              />
            </Link>

            <AnimatePresence>
              {isMenuOpen("platform") && (
                <MegaMenu
                  type="platform"
                  items={platformItems}
                  onClose={closeMenus}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Solutions */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("solutions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button type="button" className={navButtonClass}>
              Solutions
              <ChevronDown
                size={13}
                className={cn(
                  chevronClass,
                  isMenuOpen("solutions") && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isMenuOpen("solutions") && (
                <MegaMenu
                  type="solutions"
                  items={solutionItems}
                  onClose={closeMenus}
                />
              )}
            </AnimatePresence>
          </div>

          <Link to="/pricing" className={navButtonClass}>
            Pricing
          </Link>

          {/* Resources */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("resources")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button type="button" className={navButtonClass}>
              Resources
              <ChevronDown
                size={13}
                className={cn(
                  chevronClass,
                  isMenuOpen("resources") && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isMenuOpen("resources") && (
                <MegaMenu
                  type="resources"
                  items={resourceItems}
                  onClose={closeMenus}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Company */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("company")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button type="button" className={navButtonClass}>
              Company
              <ChevronDown
                size={13}
                className={cn(
                  chevronClass,
                  isMenuOpen("company") && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isMenuOpen("company") && (
                <MegaMenu
                  type="company"
                  items={companyItems}
                  onClose={closeMenus}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className={cn(
                  "hidden rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all sm:inline-flex",
                  scrolled
                    ? "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                    : "text-white hover:bg-white/15 hover:text-white"
                )}
              >
                Dashboard
              </Link>

              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                    scrolled
                      ? "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                      : "text-white hover:bg-white/15 hover:text-white"
                  )}
                >
                  Log in
                </button>
              </SignInButton>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all",
                    scrolled
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "bg-white text-zinc-950 shadow-md hover:bg-zinc-100"
                  )}
                >
                  Get started for free
                </motion.button>
              </Link>
            </>
          )}

          <button
            type="button"
            className={cn(
              "rounded-lg p-2 md:hidden",
              scrolled
                ? "text-zinc-800 hover:bg-zinc-100"
                : "text-white hover:bg-white/15"
            )}
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-200 bg-white px-6 py-6 shadow-2xl md:hidden"
          >
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Platform
                </p>

                <div className="grid gap-2">
                  <Link
                    to="/platform"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    <Workflow size={16} className="text-zinc-900" />
                    Platform overview
                  </Link>

                  {platformItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        <Icon size={16} className="text-zinc-900" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Solutions
                </p>

                <div className="grid gap-2">
                  {solutionItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        <Icon size={16} className="text-zinc-900" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Resources
                </p>

                <div className="grid gap-2">
                  {resourceItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        <Icon size={16} className="text-zinc-900" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-zinc-100 pt-5">
                <Link
                  to="/pricing"
                  onClick={closeMenus}
                  className="rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm font-bold text-zinc-700"
                >
                  Pricing
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMenus}
                  className="rounded-xl bg-[#063ee2] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;