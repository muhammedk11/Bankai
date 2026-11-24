
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Users from "../pages/Users";
import Orders from "../pages/Orders";
import Trash from "../pages/Trash";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";

function AdminRoutes() {
  return (
    <Routes>
      {/* Redirect old admin login URL */}
      <Route
        path="login"
        element={<Navigate to="/login" replace />}
      />

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<Orders />} />
        <Route path="trash" element={<Trash />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AdminRoutes;
