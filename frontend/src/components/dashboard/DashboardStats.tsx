import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Package, ShoppingCart } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change} from last month
      </div>
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: "Active Customers",
      value: "2,350",
      change: "+15.2%",
      isPositive: true,
      icon: Users,
    },
    {
      title: "Total Orders",
      value: "1,429",
      change: "+8.7%",
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: "Inventory Items",
      value: "892",
      change: "-3.2%",
      isPositive: false,
      icon: Package,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};