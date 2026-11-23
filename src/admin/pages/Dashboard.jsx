
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

function Dashboard() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Failed to load dashboard data.</p>;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your BANKAI store"
      />

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
    </div>
  );
}

export default Dashboard;
