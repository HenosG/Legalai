export default function CRM() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header matching your Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">CRM & Leads</h1>
          <p className="text-sm text-zinc-500 font-medium mt-1">Manage client pipelines and intake tracking.</p>
        </div>
      </div>

      {/* Content Card container */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-xs min-h-[50vh]">
        <p className="text-sm text-zinc-600">CRM pipeline view coming soon...</p>
      </div>
    </div>
  );
}