// RelunoOS Core Application Router

import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import OnboardingModal from "@/components/OnboardingModal";

// ─── Public Pages ─────────────────────────────────────────────────────────────
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Support from "./pages/company/Support";

import Platform from "./pages/public/Platform";
import AIIntakePlatform from "./pages/public/AIIntakePlatform";
import CRMPlatform from "./pages/public/CRMPlatform";
import ProposalsPlatform from "./pages/public/ProposalsPlatform";
import ProjectsPlatform from "./pages/public/ProjectsPlatform";
import ClientPortalPlatform from "./pages/public/ClientPortalPlatform";

import Agencies from "./pages/public/Agencies";
import Freelancers from "./pages/public/Freelancers";
import CreativeAgencies from "./pages/public/CreativeAgencies";
import MarketingAgencies from "./pages/public/MarketingAgencies";
import DevelopmentAgencies from "./pages/public/DevelopmentAgencies";

import About from "./pages/public/About";
import Security from "./pages/public/Security";
import Integrations from "./pages/public/Integrations";

import Blog from "./pages/public/Blog";
import Guides from "./pages/public/Guides";
import Templates from "./pages/public/Templates";
import Changelog from "./pages/public/Changelog";

import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import AcceptableUse from "./pages/public/AcceptableUse";
import Subprocessors from "./pages/public/Subprocessors";
import Status from "./pages/public/Status";

// ─── Authenticated RelunoOS Pages ────────────────────────────────────────────
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import ClientDetail from "./pages/ClientDetail";

import AIIntake from "./pages/AIIntake";
import AIIntakeDetail from "./pages/AIIntakeDetail";

import Proposals from "./pages/Proposals";
import ProposalDetail from "./pages/ProposalDetail";
import ProposalNew from "./pages/ProposalNew";

import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

import Invoices from "./pages/Invoices";
import Account from "./pages/Account";

// ─── Temporary Dashboard Stubs ───────────────────────────────────────────────
import TempPlaceholder from "./pages/TempPlaceholder";

// ─── Utility ─────────────────────────────────────────────────────────────────
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Public Layout ────────────────────────────────────────────────────────────
const PublicLayout = () => <Outlet />;

// ─── Authenticated App Layout ─────────────────────────────────────────────────
const AppLayout = () => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function checkOnboardingStatus() {
      try {
        const token = await getToken();

        const response = await fetch("/api/onboarding/status", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Unable to check onboarding status");
        }

        const data = await response.json();

        if (mounted && !data.isOnboarded) {
          setIsOnboardingOpen(true);
        }
      } catch (error) {
        // Do not block the protected dashboard if onboarding status is temporarily unavailable.
        console.error("Failed to check onboarding status:", error);
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    }

    void checkOnboardingStatus();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  return (
    <ProtectedRoute>
      <div className="relative flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
        <div className="h-full flex-shrink-0 flex-grow-0 border-r border-zinc-200/60 bg-[#FAFAFA]">
          <DashboardSidebar />
        </div>

        <main className="relative h-full min-w-0 flex-1 overflow-y-auto bg-[#FAFAFA]">
          <Outlet />
        </main>

        {!isChecking && (
          <OnboardingModal
            isOpen={isOnboardingOpen}
            onComplete={() => {
              setIsOnboardingOpen(false);
              window.location.reload();
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

// ─── Application ──────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            {/* Existing shadcn toast support */}
            <Toaster />

            {/* RelunoOS Sonner notification system */}
            <Sonner
              position="top-right"
              richColors
              closeButton
              expand={false}
              duration={4200}
              toastOptions={{
                classNames: {
                  toast:
                    "group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-zinc-900 shadow-[0_18px_50px_rgba(0,0,0,0.14)]",
                  title:
                    "pr-5 text-[13px] font-semibold tracking-[-0.01em] text-zinc-900",
                  description:
                    "mt-1 pr-5 text-[12px] leading-relaxed text-zinc-500",
                  closeButton:
                    "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-zinc-400 opacity-100 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200",
                  success:
                    "border-emerald-200/80 bg-white before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-emerald-500",
                  error:
                    "border-red-200/80 bg-white before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-red-500",
                  warning:
                    "border-amber-200/80 bg-white before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-amber-500",
                  info:
                    "border-blue-200/80 bg-white before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-blue-500",
                  actionButton:
                    "rounded-lg bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700",
                  cancelButton:
                    "rounded-lg bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-200",
                },
              }}
            />

            <Routes>
              {/* ── Public Marketing Routes ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Primary conversion pages */}
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />

                {/* Platform */}
                <Route path="/platform" element={<Platform />} />
                <Route path="/platform/ai-intake" element={<AIIntakePlatform />} />
                <Route path="/platform/crm" element={<CRMPlatform />} />
                <Route path="/platform/proposals" element={<ProposalsPlatform />} />
                <Route path="/platform/projects" element={<ProjectsPlatform />} />
                <Route
                  path="/platform/client-portal"
                  element={<ClientPortalPlatform />}
                />

                {/* Solutions */}
                <Route path="/solutions/agencies" element={<Agencies />} />
                <Route path="/solutions/freelancers" element={<Freelancers />} />
                <Route
                  path="/solutions/creative-agencies"
                  element={<CreativeAgencies />}
                />
                <Route
                  path="/solutions/marketing-agencies"
                  element={<MarketingAgencies />}
                />
                <Route
                  path="/solutions/development-agencies"
                  element={<DevelopmentAgencies />}
                />

                {/* Resources */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/changelog" element={<Changelog />} />

                {/* Company */}
                <Route path="/about" element={<About />} />
                <Route path="/security" element={<Security />} />
                <Route path="/integrations" element={<Integrations />} />

                {/* Legal and Trust */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/acceptable-use" element={<AcceptableUse />} />
                <Route path="/subprocessors" element={<Subprocessors />} />
                <Route path="/status" element={<Status />} />
              </Route>

              {/* ── Authenticated RelunoOS Product Routes ── */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* CRM */}
                <Route path="/crm" element={<CRM />} />
                <Route path="/clients/:id" element={<ClientDetail />} />

                {/* AI Intake */}
                <Route path="/ai" element={<AIIntake />} />
                <Route path="/intake" element={<AIIntake />} />
                <Route path="/ai-intake" element={<AIIntake />} />
                <Route path="/ai-intake/:id" element={<AIIntakeDetail />} />

                {/* Proposals */}
                <Route path="/proposals" element={<Proposals />} />
                <Route path="/proposals/new" element={<ProposalNew />} />
                <Route path="/proposals/:id" element={<ProposalDetail />} />

                {/* Preserve old edit links without maintaining a second editor page */}
                <Route
                  path="/proposals/:id/edit"
                  element={<Navigate to=".." replace />}
                />

                {/* Projects */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                {/* Finance and Account */}
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/account" element={<Account />} />

                {/* Future authenticated modules */}
                <Route path="/tasks" element={<TempPlaceholder />} />
                <Route path="/calendar" element={<TempPlaceholder />} />
                <Route path="/analytics" element={<TempPlaceholder />} />

                {/* Old internal settings location */}
                <Route
                  path="/settings"
                  element={<Navigate to="/account" replace />}
                />
              </Route>

              {/* ── App Redirects ── */}
              <Route
                path="/home"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/billing"
                element={<Navigate to="/account" replace />}
              />
              <Route
                path="/settings-and-billing"
                element={<Navigate to="/account" replace />}
              />

              {/* ── Old Legal Product Redirects ── */}
              <Route
                path="/legalquestionai"
                element={<Navigate to="/platform/ai-intake" replace />}
              />
              <Route
                path="/documentgenerator"
                element={<Navigate to="/platform/proposals" replace />}
              />
              <Route
                path="/claimtracker"
                element={<Navigate to="/platform/projects" replace />}
              />
              <Route
                path="/workflowautomation"
                element={<Navigate to="/platform" replace />}
              />
              <Route
                path="/matters"
                element={<Navigate to="/platform/projects" replace />}
              />
              <Route
                path="/export-archive"
                element={<Navigate to="/platform" replace />}
              />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;