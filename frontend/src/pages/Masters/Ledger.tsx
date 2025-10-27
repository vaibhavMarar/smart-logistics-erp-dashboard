import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";

interface Ledger {
  id: number;
  ledgerName: string;
  accountType: string;
  openingBalance: string;
}

const LedgerPage = () => {
  const [ledgers, setLedgers] = useState<Ledger[]>([
    {
      id: 1,
      ledgerName: "Cash",
      accountType: "Asset",
      openingBalance: "10000",
    },
    { id: 2, ledgerName: "Sales", accountType: "Income", openingBalance: "0" },
  ]);

  const formFields = [
    {
      id: "ledgerName",
      label: "Ledger Name",
      type: "text" as const,
      required: true,
    },
    {
      id: "accountType",
      label: "Account Type",
      type: "text" as const,
      required: true,
    },
    {
      id: "openingBalance",
      label: "Opening Balance",
      type: "number" as const,
      required: true,
    },
  ];

  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "ledgerName", label: "Ledger Name" },
    { key: "accountType", label: "Account Type" },
    { key: "openingBalance", label: "Opening Balance" },
  ];

  const handleAddLedger = (formData: Record<string, string>) => {
    const newLedger: Ledger = {
      id: ledgers.length + 1,
      ledgerName: formData.ledgerName,
      accountType: formData.accountType,
      openingBalance: formData.openingBalance,
    };
    setLedgers([...ledgers, newLedger]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ledger Master</h2>
          <p className="text-muted-foreground">
            Manage your ledgers and their details.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Ledger"
          fields={formFields}
          onSubmit={handleAddLedger}
          triggerText="Add Ledger"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ledger List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable data={ledgers} columns={tableColumns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LedgerPage;
