import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInButton,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import {
  ArrowRight,
  Check,
  FolderKanban,
  Globe2,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Interactive Home Button ─────────────────────────────────────────────────

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
        "group relative w-36 cursor-pointer overflow-hidden rounded-xl border border-blue-200 bg-white p-2.5 text-center font-semibold text-[#063ee2] shadow-sm transition-all hover:border-blue-400",
        className
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 text-xs transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      <div className="absolute top-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight size={14} className="rotate-180" />
      </div>

      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-[#063ee2] transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-[#063ee2]" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

// ─── Globe Visual ────────────────────────────────────────────────────────────

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
      <div className="relative h-[400px] w-[400px] max-w-full sm:h-[460px] sm:w-[460px]">
        <div className="absolute inset-0 rounded-full bg-blue-300/20 blur-[90px]" />

        <div className="absolute inset-[8%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(147,197,253,0.45),rgba(37,99,235,0.15)_35%,rgba(6,62,226,0.08)_62%,rgba(0,0,0,0)_74%)] shadow-[inset_-24px_-32px_70px_rgba(0,0,0,0.24),inset_18px_20px_50px_rgba(255,255,255,0.12),0_0_80px_rgba(96,165,250,0.24)]" />

        <div className="absolute inset-[8%] rounded-full opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.85)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_72%)]" />

        <div className="absolute left-[15%] top-[46%] h-px w-[67%] rotate-[18deg] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.8)]" />

        <div className="absolute left-[22%] top-[33%] h-px w-[60%] -rotate-[32deg] bg-gradient-to-r from-transparent via-blue-100/70 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.65)]" />

        <div className="absolute left-[19%] top-[62%] h-px w-[62%] -rotate-[14deg] bg-gradient-to-r from-transparent via-blue-100/70 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.65)]" />

        <div className="absolute left-[41%] top-[19%] h-px w-[2px] rotate-[35deg] bg-blue-100/70 shadow-[0_0_15px_rgba(255,255,255,0.75)]" />

        <div className="absolute inset-[13%] rounded-full border border-white/10" />
        <div className="absolute inset-[22%] rounded-full border border-white/10" />
        <div className="absolute inset-[31%] rounded-full border border-white/10" />

        {locations.map((location) => (
          <div
            key={location.name}
            className={`absolute ${location.position} group flex items-center gap-2`}
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
      </div>
    </div>
  );
}

// ─── Sign Up Page ────────────────────────────────────────────────────────────

export default function Signup() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#063ee2]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center overflow-hidden bg-white text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .auth-grid {
          background-color: #063ee2;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .auth-stripes {
          background-image:
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.035) 0,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px,
              transparent 15px
            );
        }

        .clerk-auth-card .cl-card {
          width: 100%;
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .clerk-auth-card .cl-cardBox,
        .clerk-auth-card .cl-rootBox {
          width: 100%;
          box-shadow: none !important;
        }

        .clerk-auth-card .cl-headerTitle {
          color: #18181b;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.035em;
        }

        .clerk-auth-card .cl-headerSubtitle {
          color: #71717a;
          font-size: 0.76rem;
        }

        .clerk-auth-card .cl-formButtonPrimary {
          border-radius: 0.65rem;
          background: #063ee2;
          font-weight: 700;
          box-shadow: 0 8px 16px rgba(6, 62, 226, 0.18);
        }

        .clerk-auth-card .cl-formButtonPrimary:hover {
          background: #1d4ed8;
        }

        .clerk-auth-card .cl-formFieldInput {
          border-color: #e4e4e7;
          border-radius: 0.65rem;
          box-shadow: none;
        }

        .clerk-auth-card .cl-formFieldInput:focus {
          border-color: #063ee2;
          box-shadow: 0 0 0 3px rgba(219, 234, 254, 0.9);
        }

        .clerk-auth-card .cl-socialButtonsBlockButton {
          border-color: #e4e4e7;
          border-radius: 0.65rem;
        }

        .clerk-auth-card .cl-footerAction {
          display: none !important;
        }

        .clerk-auth-card .cl-dividerLine {
          background: #e4e4e7;
        }
      `}</style>

      <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_1fr]">
        {/* Left column: Product visual */}
        <section className="auth-grid relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10 xl:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />

          <div className="auth-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative flex items-center justify-between">
            <Link to="/">
              <InteractiveHoverButton
                text="Home"
                className="w-24 py-1.5"
              />
            </Link>

            <div className="inline-flex items-center gap-2 rounded-lg border border-blue-300/30 bg-blue-600/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-md">
              <Sparkles size={12} />
              RelunoOS platform
            </div>
          </div>

          <div className="relative my-auto py-4">
            <NetworkGlobeVisual />
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
              <Sparkles size={16} className="text-blue-100" />
              <p className="mt-2 text-xs font-bold text-white">AI Intake</p>
              <p className="mt-0.5 text-[10px] leading-tight text-blue-100/75">
                Organize incoming inquiries automatically.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
              <FolderKanban size={16} className="text-blue-100" />
              <p className="mt-2 text-xs font-bold text-white">Projects</p>
              <p className="mt-0.5 text-[10px] leading-tight text-blue-100/75">
                Milestones and delivery in one view.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
              <Users size={16} className="text-blue-100" />
              <p className="mt-2 text-xs font-bold text-white">Clients</p>
              <p className="mt-0.5 text-[10px] leading-tight text-blue-100/75">
                Branded portal for seamless collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Right column: Sign-up form */}
        <section className="relative flex flex-col justify-between bg-white px-6 py-6 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xl font-bold tracking-[-0.045em] text-zinc-900"
            >
              <img
                src="/1.svg"
                alt="RelunoOS Logo"
                className="h-6 w-6 object-contain transition-all"
              />

              <span>
                RELUNOOS<span className="text-[#063ee2]">.</span>
              </span>
            </Link>

            <Link
              to="/pricing"
              className="text-xs font-semibold text-zinc-500 transition-colors hover:text-[#063ee2]"
            >
              View pricing →
            </Link>
          </div>

          <div className="my-auto w-full max-w-md py-4">
            <div className="mb-3">
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#063ee2]">
                Start free workspace
              </span>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Build a calmer client workflow.
              </h1>
            </div>

            {/* Embedded Clerk Sign Up */}
            <div className="clerk-auth-card w-full rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              <SignUp
                routing="hash"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full bg-transparent",
                    card: "w-full border-0 bg-transparent p-0 shadow-none",
                    cardBox:
                      "w-full border-0 bg-transparent p-0 shadow-none",
                    footerAction: "hidden",
                  },
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-blue-100/60 bg-blue-50/60 p-3">
              {[
                "AI Intake & CRM",
                "Proposals & Projects",
                "Client Portal",
                "No credit card required",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-700"
                >
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#063ee2] text-white">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            {/* Opens Clerk's Sign In modal popup */}
            <p className="mt-4 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard"
              >
                <button
                  type="button"
                  className="font-bold text-[#063ee2] hover:underline"
                >
                  Sign in
                </button>
              </SignInButton>
            </p>
          </div>

          <div className="text-[11px] text-zinc-400">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-zinc-600 underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-zinc-600 underline">
              Privacy Policy
            </Link>
            .
          </div>
        </section>
      </div>
    </div>
  );
}