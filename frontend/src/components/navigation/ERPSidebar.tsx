import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  Settings,
  BarChart3,
  Truck,
  UserCheck,
  Building,
  Calendar,
  MessageSquare,
  Archive,
  CreditCard,
  PieChart,
  TrendingUp,
  Warehouse,
  ClipboardList,
  Factory,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Masters",
    url: "/masters",
    icon: Users,
    children: [
      { title: "Group", url: "/masters/group", icon: Users },
      { title: "Customer Master", url: "/masters/customer", icon: UserCheck },
      { title: "Supplier Master", url: "/masters/supplier", icon: Building },
      { title: "Employee Master", url: "/masters/employee", icon: Users },
      { title: "Ledger Master", url: "/masters/ledger", icon: FileText },
      { title: "Sales Promotor", url: "/masters/sales-promotor", icon: TrendingUp },
      { title: "Party Master", url: "/masters/party", icon: Users },
      { title: "Vehicle Master", url: "/masters/vehicle", icon: Truck },
      { title: "Place Master", url: "/masters/place", icon: LayoutDashboard },
      { title: "Rate (Sales/Purchase)", url: "/masters/rate-sales-purchase", icon: DollarSign },
      { title: "Proposed Rate", url: "/masters/proposed-rate", icon: DollarSign },
      { title: "Rate (Emp Salary)", url: "/masters/rate-emp-salary", icon: DollarSign },
      { title: "Rate (Fuel)", url: "/masters/rate-fuel", icon: DollarSign },
      { title: "Category Master", url: "/masters/category", icon: Archive },
      { title: "Vehicle With Driver", url: "/masters/vehicle-with-driver", icon: Truck },
    ],
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: FileText,
    children: [
      { title: "Sales Transaction", url: "/transactions/sales", icon: ShoppingCart },
      { title: "Purchase Transaction", url: "/transactions/purchase", icon: Package },
      { title: "Payment Transaction", url: "/transactions/payment", icon: CreditCard },
    ],
  },
  {
    title: "Transport Reports",
    url: "/transport-reports",
    icon: Truck,
    children: [
      { title: "Vehicle Reports", url: "/transport-reports/vehicle", icon: Truck },
      { title: "Driver Reports", url: "/transport-reports/driver", icon: Users },
      { title: "Route Reports", url: "/transport-reports/route", icon: LayoutDashboard },
    ],
  },
  {
    title: "Financial Reports",
    url: "/financial-reports",
    icon: DollarSign,
    children: [
      { title: "Income Statement", url: "/financial-reports/income", icon: TrendingUp },
      { title: "Balance Sheet", url: "/financial-reports/balance", icon: BarChart3 },
      { title: "Cash Flow", url: "/financial-reports/cashflow", icon: DollarSign },
    ],
  },
  {
    title: "Vehicle Reports",
    url: "/vehicle-reports",
    icon: Truck,
    children: [
      { title: "Vehicle Performance", url: "/vehicle-reports/performance", icon: BarChart3 },
      { title: "Maintenance Reports", url: "/vehicle-reports/maintenance", icon: Settings },
      { title: "Fuel Reports", url: "/vehicle-reports/fuel", icon: DollarSign },
    ],
  },
  {
    title: "Master Lists",
    url: "/master-lists",
    icon: ClipboardList,
    children: [
      { title: "All Masters", url: "/master-lists/all", icon: ClipboardList },
      { title: "Export Lists", url: "/master-lists/export", icon: FileText },
    ],
  },
  {
    title: "Payroll",
    url: "/payroll",
    icon: DollarSign,
    children: [
      { title: "Employee Payroll", url: "/payroll/employee", icon: Users },
      { title: "Salary Reports", url: "/payroll/salary", icon: BarChart3 },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    children: [
      { title: "General Settings", url: "/settings/general", icon: Settings },
      { title: "User Management", url: "/settings/users", icon: Users },
      { title: "System Config", url: "/settings/system", icon: Settings },
    ],
  },
];

const MenuItem = ({ item, collapsed }: { item: MenuItem; collapsed: boolean }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => location.pathname.startsWith(child.url)) || false
  );

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (isActive: boolean) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-muted text-sidebar-foreground";

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to={item.url} className={getNavClasses(isActive(item.url))}>
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className={getNavClasses(isActive(item.url))}>
            <item.icon className="h-4 w-4" />
            {!collapsed && (
              <>
                <span>{item.title}</span>
                {isOpen ? (
                  <ChevronDown className="ml-auto h-3 w-3" />
                ) : (
                  <ChevronRight className="ml-auto h-3 w-3" />
                )}
              </>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {!collapsed && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton asChild>
                    <NavLink
                      to={child.url}
                      className={getNavClasses(isActive(child.url))}
                    >
                      <child.icon className="h-3 w-3" />
                      <span>{child.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export function ERPSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            ERP Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}