import { Link, useParams } from "react-router-dom";
import { ArrowLeft, PencilLine } from "lucide-react";

export default function InvoiceEdit() {
  const { invoiceId } = useParams();

  return (
    <div className="min-h-full bg-[#fafafa] px-6 pb-24 pt-20 sm:px-12">
      <Link
        to={`/invoices/${invoiceId}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition-colors hover:text-[#063ee2]"
      >
        <ArrowLeft size={16} />
        Back to invoice
      </Link>

      <div className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#063ee2]">
          <PencilLine size={24} />
        </div>

        <h1 className="mt-5 font-serif text-3xl font-bold text-zinc-900">
          Edit invoice
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
          Draft invoice editing will be available here for invoice{" "}
          <span className="font-mono text-xs font-semibold text-zinc-700">
            {invoiceId}
          </span>
          .
        </p>
      </div>
    </div>
  );
}