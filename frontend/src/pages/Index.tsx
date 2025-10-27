import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { RecentBills } from "@/components/dashboard/RecentBills";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Notifications and Bills */}
      <div className="grid gap-4 md:grid-cols-2">
        <NotificationsPanel />
        <RecentBills />
      </div>
    </div>
  );
};

export default Index;
