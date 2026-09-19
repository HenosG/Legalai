import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface StatCounterProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  loading?: boolean;
}

export default function StatCounter({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  loading = false,
}: StatCounterProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 animate-pulse" />
        </div>
        <div className="h-3 w-20 rounded bg-zinc-100 animate-pulse mb-3" />
        <div className="h-7 w-12 rounded bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="group rounded-2xl border border-zinc-100 bg-white p-5 hover:border-zinc-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400 mb-1.5">
        {title}
      </p>
      <p className="font-serif text-[28px] font-bold text-zinc-900 leading-none tracking-tight tabular-nums">
        {value.toLocaleString()}
      </p>
    </motion.div>
  );
}