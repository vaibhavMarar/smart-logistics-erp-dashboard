import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Customers from "./pages/Masters/Customers";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import GroupPage from "./pages/Masters/Group";
import SupplierPage from "./pages/Supplier";
import EmployeePage from "./pages/Masters/Employee";
import LedgerPage from "./pages/Masters/Ledger";
import SalesPromotorPage from "./pages/Masters/SalesPromotor";

const queryClient = new QueryClient();

// Generic page component for routes that don't have specific pages yet
const GenericPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-muted-foreground">This page is under development.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customers/*" element={<Customers />} />
            <Route path="/inventory/*" element={<Inventory />} />

            {/* Masters Routes */}
            <Route path="/masters/group" element={<GroupPage />} />
            <Route path="/masters/customer" element={<Customers />} />
            <Route path="/masters/supplier" element={<SupplierPage />} />
            <Route path="/masters/employee" element={<EmployeePage />} />
            <Route path="/masters/ledger" element={<LedgerPage />} />
            <Route
              path="/masters/sales-promotor"
              element={<SalesPromotorPage />}
            />
            <Route
              path="/masters/party"
              element={<GenericPage title="Party Master" />}
            />
            <Route
              path="/masters/vehicle"
              element={<GenericPage title="Vehicle Master" />}
            />
            <Route
              path="/masters/place"
              element={<GenericPage title="Place Master" />}
            />
            <Route
              path="/masters/rate-sales-purchase"
              element={<GenericPage title="Rate (Sales/Purchase)" />}
            />
            <Route
              path="/masters/proposed-rate"
              element={<GenericPage title="Proposed Rate" />}
            />
            <Route
              path="/masters/rate-emp-salary"
              element={<GenericPage title="Rate (Emp Salary)" />}
            />
            <Route
              path="/masters/rate-fuel"
              element={<GenericPage title="Rate (Fuel)" />}
            />
            <Route
              path="/masters/category"
              element={<GenericPage title="Category Master" />}
            />
            <Route
              path="/masters/vehicle-with-driver"
              element={<GenericPage title="Vehicle With Driver" />}
            />

            {/* Other Routes */}
            <Route
              path="/transactions/*"
              element={<GenericPage title="Transactions" />}
            />
            <Route
              path="/transport-reports/*"
              element={<GenericPage title="Transport Reports" />}
            />
            <Route
              path="/financial-reports/*"
              element={<GenericPage title="Financial Reports" />}
            />
            <Route
              path="/vehicle-reports/*"
              element={<GenericPage title="Vehicle Reports" />}
            />
            <Route
              path="/master-lists/*"
              element={<GenericPage title="Master Lists" />}
            />
            <Route
              path="/payroll/*"
              element={<GenericPage title="Payroll" />}
            />
            <Route
              path="/settings/*"
              element={<GenericPage title="Settings" />}
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
