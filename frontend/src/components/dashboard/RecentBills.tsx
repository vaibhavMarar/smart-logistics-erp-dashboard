import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";

interface Bill {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  issueDate: string;
}

const bills: Bill[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customer: "Acme Corporation",
    amount: 2500.00,
    status: "paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customer: "Tech Solutions Ltd",
    amount: 1800.50,
    status: "pending",
    dueDate: "2024-01-20",
    issueDate: "2024-01-05",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customer: "Global Industries",
    amount: 3200.75,
    status: "overdue",
    dueDate: "2024-01-10",
    issueDate: "2023-12-28",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customer: "Smart Systems Inc",
    amount: 950.00,
    status: "pending",
    dueDate: "2024-01-25",
    issueDate: "2024-01-08",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "outline";
  }
};

export const RecentBills = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Bills & Invoices
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium">{bill.invoiceNumber}</h4>
                <Badge variant={getStatusVariant(bill.status)}>
                  {bill.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{bill.customer}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Issue: {bill.issueDate}</span>
                <span>Due: {bill.dueDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-lg">${bill.amount.toFixed(2)}</div>
              <div className="flex gap-1 mt-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};