// src/components/layout/AppLayout.tsx
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Optional Navbar / Sidebar shell can go here */}
      <main className="flex-1">{children}</main>
    </div>
  );
}