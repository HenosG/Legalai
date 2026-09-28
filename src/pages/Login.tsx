import { useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  Globe2,
  LockKeyhole,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-36 cursor-pointer overflow-hidden rounded-full border border-blue-600 bg-white p-2.5 text-center font-semibold text-blue-600 shadow-sm transition-all hover:border-blue-700",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-xs">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 text-xs font-bold">
        <span>{text}</span>
        <ArrowRight size={14} />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-[#063ee2] transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-[#063ee2]"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

function NetworkGlobeVisual() {
  const locations = [
    { name: "Vancouver", position: "left-[22%] top-[28%]" },
    { name: "Toronto", position: "left-[58%] top-[25%]" },
    { name: "New York", position: "left-[72%] top-[43%]" },
    { name: "London", position: "left-[78%] top-[20%]" },
    { name: "Sydney", position: "left-[82%] top-[68%]" },
  ];

  return (
    <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center">
      <div className="relative h-[430px] w-[430px] max-w-full sm:h-[510px] sm:w-[510px]">
        <div className="absolute inset-0 rounded-full bg-blue-300/20 blur-[90px]" />

        <div className="absolute inset-[8%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(147,197,253,0.45),rgba(37,99,235,0.15)_35%,rgba(6,62,226,0.08)_62%,rgba(0,0,0,0)_74%)] shadow-[inset_-24px_-32px_70px_rgba(0,0,0,0.24),inset_18px_20px_50px_rgba(255,255,255,0.12),0_0_80px_rgba(96,165,250,0.24)]" />

        <div className="absolute inset-[8%] rounded-full opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_72%)]" />

        <div className="absolute left-[15%] top-[46%] h-px w-[67%] rotate-[18deg] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

        <div className="absolute left-[22%] top-[33%] h-px w-[60%] -rotate-[32deg] bg-gradient-to-r from-transparent via-blue-100/70 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.65)]" />

        <div className="absolute left-[19%] top-[62%] h-px w-[62%] -rotate-[14deg] bg-gradient-to-r from-transparent via-blue-100/70 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.65)]" />

        <div className="absolute inset-[13%] rounded-full border border-white/10" />
        <div className="absolute inset-[22%] rounded-full border border-white/10" />
        <div className="absolute inset-[31%] rounded-full border border-white/10" />

        {locations.map((location) => (
          <div
            key={location.name}
            className={`absolute ${location.position} flex items-center gap-2`}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-200 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-cyan-300 shadow-[0_0_16px_rgba(165,243,252,1)]" />
            </span>

            <span className="hidden rounded-full border border-white/15 bg-slate-950/30 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-100 backdrop-blur-md xl:inline-block">
              {location.name}
            </span>
          </div>
        ))}

        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(191,219,254,0.4)] backdrop-blur-md">
          <Globe2 size={34} className="text-white" />
        </div>

        <div className="absolute -left-4 top-[16%] hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
          <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
            Workspace state
          </p>

          <p className="mt-1 text-xs font-bold text-white">
            Ready when you are
          </p>
        </div>

        <div className="absolute -right-2 bottom-[17%] hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
          <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
            One workflow
          </p>

          <p className="mt-1 text-xs font-semibold text-white">
            Inquiry → payment
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    } else {
      // Automatically redirect to signup and let users sign in from there
      navigate("/signup", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-[#063ee2]" />
        <p className="mt-4 text-sm font-medium text-zinc-600">
          Redirecting to sign up (you can sign in there)...
        </p>
      </div>
    </div>
  );
}