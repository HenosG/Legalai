import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function BillingSettings() {
  return (
    <div className="min-h-full bg-[#fafafa] px-6 pb-24 pt-20 sm:px-12">
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition-colors hover:text-[#063ee2]"
      >
        <ArrowLeft size={16} />
        Back to account
      </Link>

      <div className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#063ee2]">
          <CreditCard size={24} />
        </div>

        <h1 className="mt-5 font-serif text-3xl font-bold text-zinc-900">
          Billing settings
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
          Your RelunoOS subscription plan, payment method, billing history,
          plan changes, and Stripe customer portal controls will live here.
        </p>
      </div>
    </div>
  );
}