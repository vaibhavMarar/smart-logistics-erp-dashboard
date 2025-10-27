import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { DynamicMasterForm } from "@/components/forms/DynamicMasterForm";
import { SearchableTable } from "@/components/tables/SearchableTable";

interface Group {
  id: number;
  groupName: string;
  description: string;
}

const GroupPage = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, groupName: "Admin", description: "Administrators group" },
    { id: 2, groupName: "Sales", description: "Sales team group" },
  ]);

  const formFields = [
    {
      id: "groupName",
      label: "Group Name",
      type: "text" as const,
      required: true,
    },
    {
      id: "description",
      label: "Description",
      type: "text" as const,
      required: false,
    },
  ];

  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "groupName", label: "Group Name" },
    { key: "description", label: "Description" },
  ];

  const handleAddGroup = (formData: Record<string, string>) => {
    const newGroup: Group = {
      id: groups.length + 1,
      groupName: formData.groupName,
      description: formData.description,
    };
    setGroups([...groups, newGroup]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Group Master</h2>
          <p className="text-muted-foreground">
            Manage your groups and their descriptions.
          </p>
        </div>
        <DynamicMasterForm
          title="Add New Group"
          fields={formFields}
          onSubmit={handleAddGroup}
          triggerText="Add Group"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SearchableTable data={groups} columns={tableColumns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupPage;
