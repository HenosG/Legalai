// ─── App Layout ────────────────────────────────________________________________
const AppLayout = () => (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-white overflow-hidden">
        {/* SIDEBAR STAYS RIGIDLY FIXED */}
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