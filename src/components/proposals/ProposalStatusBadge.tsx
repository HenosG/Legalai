const STYLES: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-purple-100 text-purple-800",
    signed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-yellow-100 text-yellow-800",
  };
  
  export default function ProposalStatusBadge({ status }: { status: string }) {
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${STYLES[status] || STYLES.draft}`}>
        {status}
      </span>
    );
  }