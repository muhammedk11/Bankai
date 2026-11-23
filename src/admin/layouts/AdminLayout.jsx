import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#09090f]">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <AdminHeader />

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

