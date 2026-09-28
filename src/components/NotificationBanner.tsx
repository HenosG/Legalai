import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NotificationBanner() {
  return (
    <div className="relative isolate flex items-center justify-between gap-x-6 overflow-hidden bg-[#063ee2] px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-blue-400 to-indigo-500 opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 41.1% 43.5%, 19.1% 72.4%, 0% 45.1%, 12.7% 17.2%, 32.6% 27.2%, 50.3% 10.5%, 82.4% 25.4%, 74.8% 41.9%)",
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs font-medium text-white">
        <span className="flex items-center gap-1.5 rounded-full bg-blue-700/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-100 border border-blue-400/30">
          <Sparkles size={12} />
          New v2.0
        </span>
        <p>
          RelunoOS is live! Build a calmer operation for your client work.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-1 font-bold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:text-blue-100 hover:decoration-white"
        >
          Get started free <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-1 justify-end" />
    </div>
  );
}