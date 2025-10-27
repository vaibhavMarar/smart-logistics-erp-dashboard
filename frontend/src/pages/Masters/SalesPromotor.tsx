import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";

interface SalesPromotor {
  id: number;
  name: string;
  region: string;
  contact: string;
}

const SalesPromotorPage = () => {
  const [promotors, setPromotors] = useState<SalesPromotor[]>([
    { id: 1, name: "Ravi Kumar", region: "North", contact: "9876543210" },
    { id: 2, name: "Priya Singh", region: "South", contact: "9123456780" },
  ]);

  const formFields = [
    { id: "name", label: "Name", type: "text" as const, required: true },
    { id: "region", label: "Region", type: "text" as const, required: true },
    { id: "contact", label: "Contact", type: "text" as const, required: true },
  ];

  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "region", label: "Region" },
    { key: "contact", label: "Contact" },
  ];

  const handleAddPromotor = (formData: Record<string, string>) => {
    const newPromotor: SalesPromotor = {
      id: promotors.length + 1,
      name: formData.name,
      region: formData.region,
      contact: formData.contact,
    };
    setPromotors([...promotors, newPromotor]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Sales Promotor Master
          </h2>
          <p className="text-muted-foreground">
            Manage your sales promotors and their details.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Sales Promotor"
          fields={formFields}
          onSubmit={handleAddPromotor}
          triggerText="Add Sales Promotor"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Promotor List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable data={promotors} columns={tableColumns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPromotorPage;
