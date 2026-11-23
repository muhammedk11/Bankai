
function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-500/10 text-green-400",
    blocked: "bg-red-500/10 text-red-400",
    pending: "bg-yellow-500/10 text-yellow-400",
    delivered: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
    processing: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        colors[status?.toLowerCase()] || "bg-gray-500/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
