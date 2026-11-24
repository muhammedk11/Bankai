
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../store/slices/adminAuthSlice";

function AdminHeader() {
  const admin = useSelector((state) => state.adminAuth.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="h-16 bg-[#15151f] border-b border-white/10 flex items-center justify-between px-8">
      <h2 className="text-white font-semibold">
        Admin Panel
      </h2>

      <div className="relative flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-white">
            {admin?.name}
          </p>
          <p className="text-xs text-gray-400">
            Administrator
          </p>
        </div>

        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer"
        >
          {admin?.name?.charAt(0).toUpperCase()}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-12 z-50 w-40 rounded-lg border border-white/10 bg-[#20202c] p-2 shadow-xl">
            <button
              onClick={handleLogout}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
