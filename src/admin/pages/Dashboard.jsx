
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

import { useDashboardStats } from "../hooks/useDashboardStats";
import { useAdminOrders } from "../hooks/useAdminOrders";

function Dashboard() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboardStats();

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useAdminOrders();

  if (isLoading) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load dashboard data.</p>;
  }

  // Get the latest 5 orders
  const latestOrders = [...orders]
    .sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5);

  const getStatusStyle = (status) => {
    const styles = {
      Placed: "bg-purple-500/10 text-purple-400",
      Pending: "bg-yellow-500/10 text-yellow-400",
      Processing: "bg-blue-500/10 text-blue-400",
      Shipped: "bg-indigo-500/10 text-indigo-400",
      Delivered: "bg-green-500/10 text-green-400",
      Cancelled: "bg-red-500/10 text-red-400",
    };

    return styles[status] || "bg-gray-500/10 text-gray-400";
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your BANKAI store"
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value={data.totalProducts}
          icon="📦"
        />

        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon="👥"
        />

        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon="🛒"
        />

        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          icon="💰"
        />
      </div>

      {/* Latest Orders */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-5">
          Latest 5 Orders
        </h2>

        {ordersLoading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : ordersError ? (
          <p className="text-red-400">Failed to load orders.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#15151f] text-gray-400">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {latestOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  latestOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-white/10 text-white"
                    >
                      <td className="px-5 py-4">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4">
                        {order.shippingDetails?.fullName || "Unknown"}
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        ${Number(order.total || 0).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
