// src/App.tsx
// RelunoOS Core Application Router
// - PublicLayout: Wrapper for public landing/auth pages
// - AppLayout: DashboardSidebar wrapper for authenticated workspace views + Onboarding Modal check
// - Clean routes with zero unnecessary legacy imports

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
import Index      from "./pages/Index";
import Login      from "./pages/Login";
import Signup     from "./pages/Signup";
import Pricing    from "./pages/Pricing";
import Contact    from "./pages/Contact";
import Support    from "./pages/company/Support";

// ─── RelunoOS Core App Pages ──────────────────────────────────────────────────
import Dashboard      from "./pages/Dashboard";
import CRM            from "./pages/CRM";
import ClientDetail   from "./pages/ClientDetail"; // <-- Added ClientDetail import
import AIIntake       from "./pages/AIIntake";
import Proposals      from "./pages/Proposals";
import Projects       from "./pages/Projects";
import Invoices       from "./pages/Invoices";
import Account        from "./pages/Account";

// ─── Temporary Placeholder for remaining stubs ────────────────────────────────
import TempPlaceholder from "./pages/TempPlaceholder";

// ─── Utility ──────────────────────────────────────────────────────────
import NotFound       from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Public Layout ─────────────────────────────────────────────────────────────
const PublicLayout = () => <Outlet />;

// ─── App Layout (Handles Onboarding Check & Modal Popup with Clerk Token) ───
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
            Authorization: `Bearer ${token}`,
          },
        });
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

    checkOnboardingStatus();
  }, [getToken]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden relative">
        {/* SIDEBAR CONTAINER */}
        <div className="flex-shrink-0 flex-grow-0 h-full border-r border-zinc-200/60 bg-[#FAFAFA]">
          <DashboardSidebar /> 
        </div>
        
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto relative bg-[#FAFAFA]">
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

// ══════════════════════════════════════════════════════════════════════════════
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter> 
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              
              {/* ── PUBLIC ROUTES (No Sidebar) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/"        element={<Index />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/signup"   element={<Signup />} />
                <Route path="/pricing"  element={<Pricing />} />
                <Route path="/contact"  element={<Contact />} />
                <Route path="/support"  element={<Support />} />
              </Route>

              {/* ── AUTHENTICATED APP ROUTES (With Persistent Sidebar & Onboarding) ── */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard"        element={<Dashboard />} />
                <Route path="/crm"              element={<CRM />} />
                <Route path="/clients/:id"      element={<ClientDetail />} /> {/* <-- Added dynamic Client Detail route */}
                <Route path="/ai"               element={<AIIntake />} /> 
                <Route path="/intake"           element={<AIIntake />} />
                <Route path="/proposals"        element={<Proposals />} />
                <Route path="/projects"         element={<Projects />} />
                <Route path="/invoices"         element={<Invoices />} />
                <Route path="/account"          element={<Account />} />

                {/* Secondary stubs falling back gracefully */}
                <Route path="/tasks"            element={<TempPlaceholder />} />
                <Route path="/calendar"         element={<TempPlaceholder />} />
                <Route path="/analytics"        element={<TempPlaceholder />} />
                <Route path="/settings"         element={<TempPlaceholder />} />
              </Route>

              {/* ── REDIRECTS ── */}
              <Route path="/home"                element={<Navigate to="/dashboard" replace />} />
              <Route path="/billing"             element={<Navigate to="/account"  replace />} />
              <Route path="/settings-and-billing"  element={<Navigate to="/account"  replace />} />

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