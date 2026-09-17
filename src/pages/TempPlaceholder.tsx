import { useLocation, Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TempPlaceholder() {
  const location = useLocation();
  // Turn "/legalquestionai" into "Legal Question AI" for a nice title
  const pageName = location.pathname
    .replace("/", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
        <Construction size={32} />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          {pageName || "Coming Soon"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          This page is currently under construction. We're actively building out its core features and backend integrations.
        </p>
      </div>
      <Button asChild variant="outline" className="rounded-xl font-bold">
        <Link to="/dashboard">
          <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
        </Link>
      </Button>
    </div>
  );
}