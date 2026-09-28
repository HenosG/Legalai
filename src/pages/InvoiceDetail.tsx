import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText } from "lucide-react";

export default function InvoiceDetail() {
  const { invoiceId } = useParams();

  return (
    <div className="min-h-full bg-[#fafafa] px-6 pb-24 pt-20 sm:px-12">
      <Link
        to="/invoices"
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition-colors hover:text-[#063ee2]"
      >
        <ArrowLeft size={16} />
        Back to invoices
      </Link>

      <div className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#063ee2]">
          <ReceiptText size={24} />
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Invoice detail
        </p>

        <h1 className="mt-3 font-serif text-3xl font-bold text-zinc-900">
          Invoice workspace
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
          Invoice ID:{" "}
          <span className="font-mono text-xs font-semibold text-zinc-700">
            {invoiceId}
          </span>
        </p>

        <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
          The detail view will show invoice line items, payment status,
          Stripe-hosted invoice links, activity, and client context.
        </p>
      </div>
    </div>
  );
}