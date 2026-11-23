
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#15151f] border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {title}
        </p>

        <span className="text-xl">
          {icon}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white mt-4">
        {value}
      </h2>
    </div>
  );
}

export default StatCard;
