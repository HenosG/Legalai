// src/App.tsx
// RelunoOS Core Application Router
// - PublicLayout: Wrapper for public landing/auth pages
// - AppLayout: DashboardSidebar wrapper for authenticated workspace views
// - Clean routes with zero unnecessary legacy imports

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

// ─── Public Pages ─────────────────────────────────────────────────────────────
import Index      from "./pages/Index";
import Login      from "./pages/Login";
import Signup     from "./pages/Signup";
import Pricing    from "./pages/Pricing";
import Contact    from "./pages/Contact";
import Support    from "./pages/company/Support";

// ─── RelunoOS Core App Pages ────────────────────────────────________________──
import Dashboard      from "./pages/Dashboard";
import CRM            from "./pages/CRM";
import AIIntake       from "./pages/AIIntake";
import Proposals      from "./pages/Proposals";
import Projects       from "./pages/Projects";
import Invoices       from "./pages/Invoices";
import Account        from "./pages/Account";

// ─── Temporary Placeholder for remaining stubs ────────────────────────────────
import TempPlaceholder from "./pages/TempPlaceholder";

// ─── Utility ──────────────────────────────────────────────────────────────────
import NotFound       from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Public Layout ─────────────────────────────────────────────────────────────
const PublicLayout = () => <Outlet />;

// ─── App Layout ────────────────────────────────────────────────────────────────
const AppLayout = () => (
  <ProtectedRoute>
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* SIDEBAR STAYS RIGIDLY FIXED & PERSISTENT */}
      <div className="w-64 flex-shrink-0 flex-grow-0 h-full border-r border-zinc-100">
        <DashboardSidebar /> 
      </div>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto relative bg-[#F9FAFB]">
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);

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
                <Route path="/"          element={<Index />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/signup"    element={<Signup />} />
                <Route path="/pricing"   element={<Pricing />} />
                <Route path="/contact"   element={<Contact />} />
                <Route path="/support"   element={<Support />} />
              </Route>

              {/* ── AUTHENTICATED APP ROUTES (With Persistent Sidebar) ── */}
              <Route element={<AppLayout />}>
                {/* RelunoOS Primary Navigation */}
                <Route path="/dashboard"         element={<Dashboard />} />
                <Route path="/crm"               element={<CRM />} />
                <Route path="/intake"            element={<AIIntake />} />
                <Route path="/proposals"         element={<Proposals />} />
                <Route path="/projects"          element={<Projects />} />
                <Route path="/invoices"          element={<Invoices />} />
                <Route path="/account"           element={<Account />} />

                {/* Secondary stubs falling back gracefully */}
                <Route path="/tasks"             element={<TempPlaceholder />} />
                <Route path="/calendar"          element={<TempPlaceholder />} />
                <Route path="/analytics"         element={<TempPlaceholder />} />
                <Route path="/settings"          element={<TempPlaceholder />} />
              </Route>

              {/* ── REDIRECTS ── */}
              <Route path="/home"                  element={<Navigate to="/dashboard" replace />} />
              <Route path="/billing"               element={<Navigate to="/account"   replace />} />
              <Route path="/settings-and-billing"  element={<Navigate to="/account"   replace />} />

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