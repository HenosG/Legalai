// src/App.tsx
// Full architectural rewrite:
// - PublicLayout: Navbar + Footer wrapper for marketing pages
// - AppLayout: DashboardSidebar wrapper for authenticated app pages
// - All routes wired, zero 404s

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";


// ─── Public pages ─────────────────────────────────────────────────────────────
import Index    from "./pages/Index";
import Login    from "./pages/Login";
import Signup   from "./pages/Signup";
import Pricing  from "./pages/Pricing";
import About    from "./pages/company/AboutUs"; 
import Contact from "./pages/Contact"; // Remove the /company/ part
import Careers from "./pages/company/Careers";    // Added
import Support from "./pages/company/Support";    // Added
import Affiliates from "./pages/company/Affiliates"; // Added
import Blog from "./pages/resources/Blog";


// ─── Practice area marketing pages ──────────────────────────────────────────
import PersonalInjury from "./pages/practice-types/PersonalInjury";
import FamilyLaw      from "./pages/practice-types/FamilyLaw";
import ContractLaw    from "./pages/practice-types/ContractLaw";
import LandlordTenant from "./pages/practice-types/LandlordTenant";
import SmallClaims    from "./pages/practice-types/SmallClaims";

// ─── App pages ────────────────────────────────────────────────────────────────
import Dashboard          from "./pages/Dashboard";
import MyCases            from "./pages/MyCases";
import Account            from "./pages/Account";
import DashboardAnalytics  from "./pages/DashboardAnalytics";
import LegalQuestionAI    from "./pages/products/LegalQuestionAI";
import DocumentGenerator  from "./pages/products/DocumentGenerator";

// ─── New feature pages ────────────────────────────────────────────────────────
import Tasks         from "./pages/Tasks";
import PDFAnalysis   from "./pages/PDFAnalysis";
import Integrations from "./pages/Integrations";
import Analytics     from "./pages/Analytics";
import Export        from "./pages/Export";
import CalendarSync from "./pages/resources/CalendarSync";
import Templates     from "./pages/Templates";
import CaseTracking from "./pages/CaseTracking";

// ─── Utility ──────────────────────────────────────────────────────────────────
import NotFound       from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Public Layout ─────────────────────────────────────────────────────────────
const PublicLayout = () => <Outlet />;

// ─── App Layout ────────────────────────────────────────────────────────────────
const AppLayout = () => (
  <ProtectedRoute>
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* SIDEBAR STAYS HERE */}
      <DashboardSidebar /> 
      
      {/* MAIN CONTENT AREA - flex-1 allows it to take all remaining space */}
      <main className="flex-1 overflow-y-auto relative bg-[#F9FAFB] w-full">
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);

// ══════════════════════════════════════════════════════════════════════════════
const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* MOVED: BrowserRouter must wrap everything for useNavigate to work */}
    <BrowserRouter> 
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* ── PUBLIC ROUTES ── */}
              <Route element={<PublicLayout />}>
                <Route path="/"               element={<Index />}   />
                <Route path="/login"          element={<Login />}   />
                <Route path="/signup"         element={<Signup />}  />
                <Route path="/pricing"        element={<Pricing />} />
                <Route path="/aboutus"          element={<About />}   />
                <Route path="/contact"        element={<Contact />} />
                <Route path="/careers"        element={<Careers />} />
                <Route path="/support"        element={<Support />} />
                <Route path="/affiliates"     element={<Affiliates />} />

                {/* ── PRACTICE AREA ROUTES ── */}
<Route element={<PublicLayout />}>
  <Route path="/personalinjury" element={<PersonalInjury />} />
  <Route path="/familylaw"      element={<FamilyLaw />}      />
  <Route path="/contracts"      element={<ContractLaw />}    />
  <Route path="/landlordtenant" element={<LandlordTenant />} />
  <Route path="/smallclaims"    element={<SmallClaims />}    />
</Route>

                {/* Resources — public */}
                <Route path="/blog"      element={<Dashboard title="Legal Blog" />}    />
                <Route path="/guides"    element={<Dashboard title="Expert Guides" />} />
                <Route path="/webinars"  element={<Dashboard title="Webinars" />}      />
                <Route path="/community" element={<Dashboard title="Community" />}     />
              </Route>

              {/* ── PUBLIC ROUTES (No Sidebar) ── */}
<Route path="/" element={<Index />} />
<Route path="/blog" element={<Blog />} /> 

{/* ── AUTHENTICATED APP ROUTES ── */}
<Route element={<AppLayout />}>

  {/* Core platform */}
  <Route path="/dashboard"           element={<Dashboard />} />
  <Route path="/my-cases"            element={<MyCases />} />
  <Route path="/dashboard-analytics" element={<DashboardAnalytics />} />
  <Route path="/account"             element={<Account />} />
  <Route path="/legalquestionai"     element={<LegalQuestionAI />} />
  <Route path="/documentgenerator"   element={<DocumentGenerator />} />
  <Route path="/case-tracking"       element={<CaseTracking />} />

  {/* Productivity */}
  <Route path="/tasks"               element={<Tasks />} />
  <Route path="/integrations"        element={<Integrations />} />
  <Route path="/calendar"            element={<CalendarSync />} />

  {/* Intelligence */}
  <Route path="/pdf-analysis"        element={<PDFAnalysis />} />
  <Route path="/analytics"           element={<Analytics />} />

  {/* Output */}
  <Route path="/export"              element={<Export />} />

  {/* Templates library */}
  <Route path="/templates"           element={<Templates />} />

  {/* Legacy stubs — Redirected to real components to kill placeholders */}
  <Route path="/claimtracker"        element={<CaseTracking />} />
  <Route path="/workflowautomation"  element={<Tasks />} />
</Route>

              {/* ── REDIRECTS ── */}
              <Route path="/home"                 element={<Navigate to="/dashboard" replace />} />
              <Route path="/settings"             element={<Navigate to="/account"   replace />} />
              <Route path="/billing"              element={<Navigate to="/account"   replace />} />
              <Route path="/settings-and-billing" element={<Navigate to="/account"   replace />} />
              <Route path="/support"              element={<Navigate to="/contact"   replace />} />

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