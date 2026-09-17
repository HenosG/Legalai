import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function PageLayout({ title, subtitle, children, action }: PageLayoutProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Universal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">{title}</h1>
          {subtitle && <p className="text-sm text-zinc-500 font-medium mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Page Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}