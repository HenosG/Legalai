import { Link } from "react-router-dom";
import { ArrowLeft, FilePlus2 } from "lucide-react";

export default function InvoiceNew() {
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
          <FilePlus2 size={24} />
        </div>

        <h1 className="mt-5 font-serif text-3xl font-bold text-zinc-900">
          Create invoice
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
          The RelunoOS invoice builder will be added here next. This route is
          now connected and protected inside the authenticated app.
        </p>
      </div>
    </div>
  );
}