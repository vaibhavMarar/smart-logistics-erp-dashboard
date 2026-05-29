import { useState, useEffect, useMemo } from "react";
import { customerService } from "@/services/customerService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";

interface Customer {
  led_cd: number; // ✅ DB primary key
  [key: string]: any;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [fieldVisibility, setFieldVisibility] = useState<
    Record<string, boolean>
  >({});

  const groupOptions = useMemo(
    () => [
      { label: "-- Select Group --", value: "" },
      { label: "Retail", value: 1 },
      { label: "Wholesale", value: 2 },
      { label: "Distributor", value: 3 },
    ],
    []
  );

  const stateOptions = useMemo(
    () => [
      { label: "-- Select State --", value: "" },
      { label: "Maharashtra", value: "MH" },
      { label: "Gujarat", value: "GJ" },
      { label: "Delhi", value: "DL" },
      { label: "Karnataka", value: "KA" },
      { label: "Tamil Nadu", value: "TN" },
    ],
    []
  );

  const activeOptions = useMemo(
    () => [
      { label: "Active", value: 1 },
      { label: "Non-Active", value: 0 },
    ],
    []
  );

  const gstTypeOptions = useMemo(
    () => [
      { label: "-- GST Type --", value: "" },
      { label: "Regular", value: "Regular" },
      { label: "Composition", value: "Composition" },
      { label: "Unregistered", value: "Unregistered" },
      { label: "Consumer", value: "Consumer" },
      { label: "Overseas", value: "Overseas" },
    ],
    []
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formFields = [
    {
      id: "led_shortname",
      label: "Short Name",
      type: "text" as const,
      visible: fieldVisibility["led_shortname"],
    },
    {
      id: "led_name",
      label: "Name",
      type: "text" as const,
      required: true,
      visible: fieldVisibility["led_name"],
    },
    {
      id: "led_cat",
      label: "Group",
      type: "select" as const,
      options: groupOptions,
      visible: fieldVisibility["led_cat"],
    },
    {
      id: "led_adr1",
      label: "Address 1",
      type: "text" as const,
      visible: fieldVisibility["led_adr1"],
    },
    {
      id: "led_adr2",
      label: "Address 2",
      type: "text" as const,
      visible: fieldVisibility["led_adr2"],
    },
    {
      id: "led_adr3",
      label: "Address 3",
      type: "text" as const,
      visible: fieldVisibility["led_adr3"],
    },
    {
      id: "led_pin",
      label: "Pin Code",
      type: "text" as const,
      pattern: "^\\d{6}$",
      inputMode: "numeric" as const,
      visible: fieldVisibility["led_pin"],
    },
    {
      id: "led_stcd",
      label: "State",
      type: "select" as const,
      options: stateOptions,
      visible: fieldVisibility["led_stcd"],
    },
    {
      id: "led_mob",
      label: "Tel/Mob No.",
      type: "text" as const,
      required: true,
      pattern: "^\\d{10}$",
      inputMode: "tel" as const,
      visible: fieldVisibility["led_mob"],
    },
    {
      id: "led_email",
      label: "Email",
      type: "email" as const,
      visible: fieldVisibility["led_email"],
    },
    {
      id: "led_panno",
      label: "PAN No.",
      type: "text" as const,
      pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
      visible: fieldVisibility["led_panno"],
    },
    {
      id: "led_gstno",
      label: "GSTIN",
      type: "text" as const,
      pattern: "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$",
      visible: fieldVisibility["led_gstno"],
    },
    {
      id: "led_gsttype",
      label: "GST Type",
      type: "select" as const,
      options: gstTypeOptions,
      visible: fieldVisibility["led_gsttype"],
    },
    {
      id: "led_tds",
      label: "TDS (%)",
      type: "number" as const,
      visible: fieldVisibility["led_tds"],
    },
    {
      id: "led_bankname",
      label: "Bank Name",
      type: "text" as const,
      visible: fieldVisibility["led_bankname"],
    },
    {
      id: "led_branchname",
      label: "Branch Name",
      type: "text" as const,
      visible: fieldVisibility["led_branchname"],
    },
    {
      id: "led_acno",
      label: "Account No.",
      type: "text" as const,
      pattern: "^\\d+$",
      inputMode: "numeric" as const,
      visible: fieldVisibility["led_acno"],
    },
    {
      id: "led_ifsc",
      label: "IFSC",
      type: "text" as const,
      pattern: "^[A-Z]{4}0[0-9A-Z]{6}$",
      visible: fieldVisibility["led_ifsc"],
    },
    {
      id: "led_uid",
      label: "Vendor Code",
      type: "text" as const,
      visible: fieldVisibility["led_uid"],
    },
    {
      id: "led_active",
      label: "Active",
      type: "select" as const,
      options: activeOptions,
      visible: fieldVisibility["led_active"],
    },
    {
      id: "led_udt",
      label: "Date",
      type: "date" as const,
      visible: fieldVisibility["led_udt"],
    },
    {
      id: "led_udt2",
      label: "Date 2",
      type: "date" as const,
      visible: fieldVisibility["led_udt2"],
    },
    {
      id: "led_udt1",
      label: "UDF 1",
      type: "text" as const,
      visible: fieldVisibility["led_udt1"],
    },
  ];

  const tableColumns = [
    {
      key: "edit",
      label: "Edit",
      render: (_: any, row: Customer) => (
        <span
          className="text-green-600 cursor-pointer"
          onClick={() => setEditCustomer(row)}>
          Edit
        </span>
      ),
      visible: columnVisibility["edit"] ?? true,
    },
    {
      key: "delete",
      label: "Delete",
      render: (_: any, row: Customer) => (
        <span
          className="text-red-600 cursor-pointer"
          onClick={() => handleDeleteCustomer(row.led_cd)}>
          Delete
        </span>
      ),
      visible: columnVisibility["delete"] ?? true,
    },
    {
      key: "led_shortname",
      label: "Short Name",
      visible: columnVisibility["led_shortname"] ?? true,
    },
    {
      key: "led_name",
      label: "Name",
      searchable: true,
      visible: columnVisibility["led_name"] ?? true,
    },
    {
      key: "led_cat",
      label: "Group",
      visible: columnVisibility["led_cat"] ?? true,
    },
    {
      key: "led_adr1",
      label: "Address 1",
      visible: columnVisibility["led_adr1"] ?? false,
    },
    {
      key: "led_adr2",
      label: "Address 2",
      visible: columnVisibility["led_adr2"] ?? false,
    },
    {
      key: "led_adr3",
      label: "Address 3",
      visible: columnVisibility["led_adr3"] ?? false,
    },
    {
      key: "led_pin",
      label: "PIN",
      visible: columnVisibility["led_pin"] ?? true,
    },
    {
      key: "led_stcd",
      label: "State",
      visible: columnVisibility["led_stcd"] ?? true,
    },
    {
      key: "led_mob",
      label: "Mobile",
      searchable: true,
      visible: columnVisibility["led_mob"] ?? true,
    },
    {
      key: "led_email",
      label: "Email",
      searchable: true,
      visible: columnVisibility["led_email"] ?? true,
    },
    {
      key: "led_panno",
      label: "PAN",
      visible: columnVisibility["led_panno"] ?? false,
    },
    {
      key: "led_gstno",
      label: "GSTIN",
      visible: columnVisibility["led_gstno"] ?? true,
    },
    {
      key: "led_gsttype",
      label: "GST Type",
      visible: columnVisibility["led_gsttype"] ?? true,
    },
    {
      key: "led_tds",
      label: "TDS (%)",
      visible: columnVisibility["led_tds"] ?? false,
    },
    {
      key: "led_bankname",
      label: "Bank",
      visible: columnVisibility["led_bankname"] ?? false,
    },
    {
      key: "led_branchname",
      label: "Branch",
      visible: columnVisibility["led_branchname"] ?? false,
    },
    {
      key: "led_acno",
      label: "A/C No",
      visible: columnVisibility["led_acno"] ?? false,
    },
    {
      key: "led_ifsc",
      label: "IFSC",
      visible: columnVisibility["led_ifsc"] ?? false,
    },
    {
      key: "led_uid",
      label: "Vendor Code",
      visible: columnVisibility["led_uid"] ?? false,
    },
    {
      key: "led_active",
      label: "Active",
      render: (val: any) => (val ? "Active" : "Non-Active"),
      visible: columnVisibility["led_active"] ?? true,
    },
    {
      key: "led_udt",
      label: "Date",
      render: (_: any, row: Customer) => formatDate(row.led_udt),
      visible: columnVisibility["led_udt"] ?? false,
    },
    {
      key: "led_udt2",
      label: "Date 2",
      render: (_: any, row: Customer) => formatDate(row.led_udt2),
      visible: columnVisibility["led_udt2"] ?? false,
    },
    {
      key: "led_udt1",
      label: "UDF 1",
      visible: columnVisibility["led_udt1"] ?? false,
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setCustomers(customerService.getAll());
  };

  const coercePayload = (raw: Record<string, any>) => {
    return {
      ...raw,
      led_cat: raw.led_cat ? Number(raw.led_cat) : null,
      led_tds:
        raw.led_tds !== undefined && raw.led_tds !== ""
          ? Number(raw.led_tds)
          : null,
      led_active:
        raw.led_active !== undefined && raw.led_active !== ""
          ? Number(raw.led_active)
          : 0,
    };
  };

  const handleAddCustomer = (formData: Record<string, any>) => {
    const payload = coercePayload(formData);
    customerService.create(payload);
    fetchCustomers();
  };

  const handleUpdateCustomer = (formData: Record<string, any>) => {
    if (!editCustomer) return;

    const payload = coercePayload(formData);
    customerService.update(editCustomer.led_cd, payload);
    fetchCustomers();
    setEditCustomer(null);
  };

  const handleDeleteCustomer = (led_cd: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmed) return;

    customerService.delete(led_cd);
    setCustomers((prev) => prev.filter((c) => c.led_cd !== led_cd));
  };

  const handleColumnVisibilityChange = (
    columnKey: string,
    visible: boolean
  ) => {
    setColumnVisibility((prev) => ({ ...prev, [columnKey]: visible }));
  };

  const handleFieldVisibilityChange = (fieldId: string, visible: boolean) => {
    setFieldVisibility((prev) => ({ ...prev, [fieldId]: visible }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Master</h2>
          <p className="text-muted-foreground">
            Manage your customers and track their information.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Customer"
          fields={formFields}
          onSubmit={handleAddCustomer}
          triggerText="Add Customer"
          onFieldVisibilityChange={handleFieldVisibilityChange}
        />
      </div>

      {editCustomer && (
        <DynamicMasterForm
          title={`Edit Customer: ${editCustomer.led_name}`}
          fields={formFields}
          onSubmit={handleUpdateCustomer}
          initialData={editCustomer}
          triggerText="Update Customer"
          onFieldVisibilityChange={handleFieldVisibilityChange}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable
            data={customers}
            columns={tableColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
