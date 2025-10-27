import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";
import axios from "axios";
import { apiUrl } from "@/lib/api";

interface Supplier {
  sup_cd: number;
  [key: string]: any;
}

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [fieldVisibility, setFieldVisibility] = useState<
    Record<string, boolean>
  >({});

  const groupOptions = useMemo(
    () => [
      { label: "-- Select Group --", value: "" },
      { label: "Raw Material", value: "Raw Material" },
      { label: "Transport", value: "Transport" },
      { label: "Services", value: "Services" },
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
      id: "sup_name",
      label: "Supplier Name",
      type: "text" as const,
      required: true,
      visible: fieldVisibility["sup_name"],
    },
    {
      id: "sup_group",
      label: "Group",
      type: "select" as const,
      options: groupOptions,
      visible: fieldVisibility["sup_group"],
    },
    {
      id: "sup_status",
      label: "Status",
      type: "text" as const,
      visible: fieldVisibility["sup_status"],
    },
    {
      id: "sup_active",
      label: "Active",
      type: "select" as const,
      options: activeOptions,
      visible: fieldVisibility["sup_active"],
    },
    {
      id: "sup_adr1",
      label: "Address 1",
      type: "text" as const,
      visible: fieldVisibility["sup_adr1"],
    },
    {
      id: "sup_adr2",
      label: "Address 2",
      type: "text" as const,
      visible: fieldVisibility["sup_adr2"],
    },
    {
      id: "sup_adr3",
      label: "Address 3",
      type: "text" as const,
      visible: fieldVisibility["sup_adr3"],
    },
    {
      id: "sup_state",
      label: "State",
      type: "select" as const,
      options: stateOptions,
      visible: fieldVisibility["sup_state"],
    },
    {
      id: "sup_mob",
      label: "Mobile",
      type: "text" as const,
      pattern: "^\\d{10}$",
      inputMode: "tel" as const,
      visible: fieldVisibility["sup_mob"],
    },
    {
      id: "sup_email",
      label: "Email",
      type: "email" as const,
      visible: fieldVisibility["sup_email"],
    },
    {
      id: "sup_panno",
      label: "PAN No.",
      type: "text" as const,
      pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
      visible: fieldVisibility["sup_panno"],
    },
    {
      id: "sup_gstno",
      label: "GSTIN",
      type: "text" as const,
      pattern: "^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$",
      visible: fieldVisibility["sup_gstno"],
    },
    {
      id: "sup_gsttype",
      label: "GST Type",
      type: "select" as const,
      options: gstTypeOptions,
      visible: fieldVisibility["sup_gsttype"],
    },
    {
      id: "sup_tds",
      label: "TDS (%)",
      type: "number" as const,
      visible: fieldVisibility["sup_tds"],
    },
    {
      id: "sup_ratecat",
      label: "Rate Category",
      type: "text" as const,
      visible: fieldVisibility["sup_ratecat"],
    },
    {
      id: "sup_bankname",
      label: "Bank Name",
      type: "text" as const,
      visible: fieldVisibility["sup_bankname"],
    },
    {
      id: "sup_branchname",
      label: "Branch Name",
      type: "text" as const,
      visible: fieldVisibility["sup_branchname"],
    },
    {
      id: "sup_acno",
      label: "Account No.",
      type: "text" as const,
      pattern: "^\\d+$",
      inputMode: "numeric" as const,
      visible: fieldVisibility["sup_acno"],
    },
    {
      id: "sup_ifsc",
      label: "IFSC",
      type: "text" as const,
      pattern: "^[A-Z]{4}0[0-9A-Z]{6}$",
      visible: fieldVisibility["sup_ifsc"],
    },
    {
      id: "sup_paymentduedays",
      label: "Payment Due Days",
      type: "number" as const,
      visible: fieldVisibility["sup_paymentduedays"],
    },
    {
      id: "created_at",
      label: "Created At",
      type: "date" as const,
      visible: fieldVisibility["created_at"],
    },
    {
      id: "updated_at",
      label: "Updated At",
      type: "date" as const,
      visible: fieldVisibility["updated_at"],
    },
  ];

  const tableColumns = [
    {
      key: "edit",
      label: "Edit",
      render: (_: any, row: Supplier) => (
        <span
          className="text-green-600 cursor-pointer"
          onClick={() => setEditSupplier(row)}>
          Edit
        </span>
      ),
      visible: columnVisibility["edit"] ?? true,
    },
    {
      key: "delete",
      label: "Delete",
      render: (_: any, row: Supplier) => (
        <span
          className="text-red-600 cursor-pointer"
          onClick={() => handleDelete(row.sup_cd)}>
          Delete
        </span>
      ),
      visible: columnVisibility["delete"] ?? true,
    },
    {
      key: "sup_name",
      label: "Supplier Name",
      searchable: true,
      visible: columnVisibility["sup_name"] ?? true,
    },
    {
      key: "sup_group",
      label: "Group",
      visible: columnVisibility["sup_group"] ?? true,
    },
    {
      key: "sup_status",
      label: "Status",
      visible: columnVisibility["sup_status"] ?? true,
    },
    {
      key: "sup_active",
      label: "Active",
      render: (v: any) => (v ? "Active" : "Non-Active"),
      visible: columnVisibility["sup_active"] ?? true,
    },
    {
      key: "sup_mob",
      label: "Mobile",
      searchable: true,
      visible: columnVisibility["sup_mob"] ?? true,
    },
    {
      key: "sup_email",
      label: "Email",
      searchable: true,
      visible: columnVisibility["sup_email"] ?? true,
    },
    {
      key: "sup_gstno",
      label: "GSTIN",
      visible: columnVisibility["sup_gstno"] ?? true,
    },
    {
      key: "sup_gsttype",
      label: "GST Type",
      visible: columnVisibility["sup_gsttype"] ?? true,
    },
    {
      key: "created_at",
      label: "Created",
      render: (_: any, r: Supplier) => formatDate(r.created_at),
      visible: columnVisibility["created_at"] ?? false,
    },
    {
      key: "updated_at",
      label: "Updated",
      render: (_: any, r: Supplier) => formatDate(r.updated_at),
      visible: columnVisibility["updated_at"] ?? false,
    },
  ];

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    axios
      .get(apiUrl("/api/suppliers"))
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("❌ Failed to fetch suppliers", err));
  };

  const coercePayload = (raw: Record<string, any>) => {
    const { sup_cd, ...rest } = raw; // Remove sup_cd from the payload
    const payload = {
      ...rest,
      sup_active:
        raw.sup_active !== undefined && raw.sup_active !== ""
          ? Number(raw.sup_active)
          : 0,
      sup_tds:
        raw.sup_tds !== undefined && raw.sup_tds !== ""
          ? Number(raw.sup_tds)
          : null,
      sup_paymentduedays:
        raw.sup_paymentduedays !== undefined && raw.sup_paymentduedays !== ""
          ? Number(raw.sup_paymentduedays)
          : null,
    };

    return payload;
  };

  const handleAdd = (formData: Record<string, any>) => {
    const payload = coercePayload(formData);
    axios
      .post(apiUrl("/api/suppliers"), payload)
      .then(() => fetchSuppliers())
      .catch((err) => console.error("❌ Failed to add supplier", err));
  };

  const handleUpdate = (formData: Record<string, any>) => {
    if (!editSupplier) return;
    // ✅ Don't include sup_cd in payload as it's in the URL
    const payload = coercePayload(formData);
    axios
      .put(apiUrl(`/api/suppliers/${editSupplier.sup_cd}`), payload)
      .then(() => {
        fetchSuppliers();
        setEditSupplier(null);
      })
      .catch((err) => console.error("❌ Failed to update supplier", err));
  };

  const handleDelete = (sup_cd: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmed) return;
    axios
      .delete(apiUrl(`/api/suppliers/${sup_cd}`))
      .then(() =>
        setSuppliers((prev) => prev.filter((s) => s.sup_cd !== sup_cd))
      )
      .catch((err) => console.error("❌ Failed to delete supplier", err));
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
          <h2 className="text-3xl font-bold tracking-tight">Supplier Master</h2>
          <p className="text-muted-foreground">
            Manage your suppliers and their information.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Supplier"
          fields={formFields}
          onSubmit={handleAdd}
          triggerText="Add Supplier"
          onFieldVisibilityChange={handleFieldVisibilityChange}
        />
      </div>

      {editSupplier && (
        <DynamicMasterForm
          title={`Edit Supplier: ${editSupplier.sup_name}`}
          fields={formFields}
          onSubmit={handleUpdate}
          initialData={editSupplier}
          triggerText="Update Supplier"
          onFieldVisibilityChange={handleFieldVisibilityChange}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Supplier List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable
            data={suppliers}
            columns={tableColumns}
            onColumnVisibilityChange={handleColumnVisibilityChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierPage;
