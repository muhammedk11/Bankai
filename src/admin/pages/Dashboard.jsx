
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your BANKAI store"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Products"
          value="—"
          icon="📦"
        />

        <StatCard
          title="Total Users"
          value="—"
          icon="👥"
        />

        <StatCard
          title="Total Orders"
          value="—"
          icon="🛒"
        />

        <StatCard
          title="Total Revenue"
          value="—"
          icon="💰"
        />
      </div>
    </div>
  );
}

export default Dashboard;
