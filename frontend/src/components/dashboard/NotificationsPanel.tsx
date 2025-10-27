import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "urgent";
  title: string;
  message: string;
  time: string;
  icon: React.ComponentType<any>;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    title: "Low Stock Alert",
    message: "Product XYZ-123 is running low (5 units remaining)",
    time: "2 min ago",
    icon: AlertTriangle,
  },
  {
    id: "2",
    type: "success",
    title: "Order Completed",
    message: "Order #ORD-1234 has been successfully delivered",
    time: "15 min ago",
    icon: CheckCircle,
  },
  {
    id: "3",
    type: "info",
    title: "New Customer",
    message: "John Doe has registered as a new customer",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: "4",
    type: "warning",
    title: "Payment Due",
    message: "Invoice #INV-5678 payment is due in 2 days",
    time: "2 hours ago",
    icon: Clock,
  },
];

const getBadgeVariant = (type: string) => {
  switch (type) {
    case "urgent":
      return "destructive";
    case "warning":
      return "secondary";
    case "success":
      return "default";
    default:
      return "outline";
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case "urgent":
      return "text-destructive";
    case "warning":
      return "text-warning";
    case "success":
      return "text-success";
    default:
      return "text-primary";
  }
};

export const NotificationsPanel = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notifications
        </CardTitle>
        <Badge variant="secondary">{notifications.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className={`mt-0.5 ${getIconColor(notification.type)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                  <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};