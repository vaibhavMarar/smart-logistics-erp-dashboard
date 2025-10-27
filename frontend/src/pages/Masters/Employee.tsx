import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";

interface Employee {
  id: number;
  employeeName: string;
  designation: string;
  joiningDate: string;
}

const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      employeeName: "Alice Brown",
      designation: "Manager",
      joiningDate: "2023-12-01",
    },
    {
      id: 2,
      employeeName: "Bob White",
      designation: "Sales Executive",
      joiningDate: "2024-01-05",
    },
  ]);

  const formFields = [
    {
      id: "employeeName",
      label: "Employee Name",
      type: "text" as const,
      required: true,
    },
    {
      id: "designation",
      label: "Designation",
      type: "text" as const,
      required: true,
    },
    {
      id: "joiningDate",
      label: "Joining Date",
      type: "date" as const,
      required: true,
    },
  ];

  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "employeeName", label: "Employee Name" },
    { key: "designation", label: "Designation" },
    { key: "joiningDate", label: "Joining Date" },
  ];

  const handleAddEmployee = (formData: Record<string, string>) => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      employeeName: formData.employeeName,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
    };
    setEmployees([...employees, newEmployee]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employee Master</h2>
          <p className="text-muted-foreground">
            Manage your employees and their information.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Employee"
          fields={formFields}
          onSubmit={handleAddEmployee}
          triggerText="Add Employee"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Employee List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable data={employees} columns={tableColumns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeePage;
