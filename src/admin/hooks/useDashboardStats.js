
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const fetchDashboardStats = async () => {
  const [products, users, orders] = await Promise.all([
    api.get("/products"),
    api.get("/users"),
    api.get("/orders"),
  ]);

  return {
    totalProducts: products.data.length,
    totalUsers: users.data.length,
    totalOrders: orders.data.length,
    totalRevenue: orders.data.reduce(
      (total, order) => total + Number(order.total || 0),
      0
    ),
  };
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
};
