import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";

function AdminRoutes() {
  return (
    <Routes>
      {/* Admin login */}
      <Route path="login" element={<AdminLogin />} />

      {/* Protected admin pages */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* Unknown admin routes */}
      <Route path="*" element={<Navigate to="/admin/login" replace />}/>
    </Routes>
  );
}

export default AdminRoutes;
