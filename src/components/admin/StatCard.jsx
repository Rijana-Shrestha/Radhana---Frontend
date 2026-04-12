function StatCard({
  icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  label,
  value,
  sub,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
         {icon}
        </div>
        <span
          className={`font-poppins text-xs font-medium px-2 py-1 rounded-full ${
            badgeColor
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="font-poppins text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-playfair text-2xl font-bold text-gray-900 mb-0">
        {typeof value === "string" ? (
          <span dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          value
        )}
      </p>
      <p className="font-poppins text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export default StatCard;
