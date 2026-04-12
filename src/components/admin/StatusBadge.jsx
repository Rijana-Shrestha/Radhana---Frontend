function StatusBadge({ status }) {
  const statusMap = {
    pending: { style: "bg-yellow-100 text-yellow-900", label: "Pending" },
    confirmed: { style: "bg-blue-100 text-blue-900", label: "Processing" },
    delivered: { style: "bg-green-100 text-green-900", label: "Completed" },
    cancelled: { style: "bg-red-100 text-red-600", label: "Cancelled" },
    unpaid: { style: "bg-yellow-100 text-yellow-900", label: "Unpaid" },
  };

  const statusLower = status?.toLowerCase() || "pending";
  const statusInfo = statusMap[statusLower] || { style: "bg-gray-100 text-gray-900", label: status };

  return (
    <span className={`${statusInfo.style} rounded-full px-2.5 py-0.5 text-xs font-bold`}>
      {statusInfo.label}
    </span>
  );
}

export default StatusBadge;
