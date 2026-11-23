
import { useSelector } from "react-redux";

function AdminHeader() {
  const admin = useSelector((state) => state.adminAuth.admin);

  return (
    <header className="h-16 bg-[#15151f] border-b border-white/10 flex items-center justify-between px-8">
      <h2 className="text-white font-semibold">
        Admin Panel
      </h2>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-white">
            {admin?.name}
          </p>
          <p className="text-xs text-gray-400">
            Administrator
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
          {admin?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
