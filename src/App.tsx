// RelunoOS Core Application Router

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import OnboardingModal from "@/components/OnboardingModal";
import { useAuth } from "@clerk/clerk-react";

// ─── Public Pages ─────────────────────────────────────────────────────────────
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Support from "./pages/company/Support";

// ─── RelunoOS Core App Pages ──────────────────────────────────────────────────
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import ClientDetail from "./pages/ClientDetail";
import AIIntake from "./pages/AIIntake";
import AIIntakeDetail from "./pages/AIIntakeDetail";
import Proposals from "./pages/Proposals";
import ProposalDetail from "./pages/ProposalDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail"; // 🛑 Added Project Detail page import
import Invoices from "./pages/Invoices";
import Account from "./pages/Account";

// ─── Temporary Placeholder for remaining stubs ────────────────────────────────
import TempPlaceholder from "./pages/TempPlaceholder";

// ─── Utility ──────────────────────────────────────────────────────────────────
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Public Layout ────────────────────────────────────────────────────────────
const PublicLayout = () => <Outlet />;

// ─── App Layout (Handles Onboarding Check & Modal Popup with Clerk Token) ────
const AppLayout = () => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
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

        if (!data.isOnboarded) {
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.error("Failed to check onboarding status:", err);
      } finally {
        setIsChecking(false);
      }
    }

    void checkOnboardingStatus();
  }, [getToken]);

  return (
    <ProtectedRoute>
      <div className="relative flex h-screen w-full overflow-hidden bg-[#FAFAFA]">
        {/* SIDEBAR CONTAINER */}
        <div className="h-full flex-shrink-0 flex-grow-0 border-r border-zinc-200/60 bg-[#FAFAFA]">
          <DashboardSidebar />
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="relative h-full min-w-0 flex-1 overflow-y-auto bg-[#FAFAFA]">
          <Outlet />
        </main>

        {/* ONBOARDING POPUP MODAL */}
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

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            {/* Keep this for any pages already using the shadcn useToast hook. */}
            <Toaster />

            {/* Premium RelunoOS in-app Sonner notification design */}
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
              {/* ── PUBLIC ROUTES (No Sidebar) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
              </Route>

              {/* ── AUTHENTICATED APP ROUTES ── */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/clients/:id" element={<ClientDetail />} />

                {/* AI Intake Routes */}
                <Route path="/ai" element={<AIIntake />} />
                <Route path="/intake" element={<AIIntake />} />
                <Route path="/ai-intake" element={<AIIntake />} />
                <Route path="/ai-intake/:id" element={<AIIntakeDetail />} />

                {/* Proposal Routes */}
                <Route path="/proposals" element={<Proposals />} />
                <Route path="/proposals/new" element={<ProposalDetail />} />
                <Route path="/proposals/:id" element={<ProposalDetail />} />
                <Route
                  path="/proposals/:id/edit"
                  element={<Navigate to=".." replace />}
                />

                {/* Project Routes */}
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} /> {/* 🛑 Added dynamic route for individual projects */}

                <Route path="/invoices" element={<Invoices />} />
                <Route path="/account" element={<Account />} />

                {/* Secondary stubs */}
                <Route path="/tasks" element={<TempPlaceholder />} />
                <Route path="/calendar" element={<TempPlaceholder />} />
                <Route path="/analytics" element={<TempPlaceholder />} />
                <Route path="/settings" element={<TempPlaceholder />} />
              </Route>

              {/* ── REDIRECTS ── */}
              <Route path="/home" element={<Navigate to="/dashboard" replace />} />
              <Route path="/billing" element={<Navigate to="/account" replace />} />
              <Route
                path="/settings-and-billing"
                element={<Navigate to="/account" replace />}
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