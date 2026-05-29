import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Settings2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SelectOption<T = string | number | boolean> {
  label: string;
  value: T;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "email" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[]; // for select
  pattern?: string; // validation pattern
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; // e.g., numeric
  visible?: boolean; // explicit visibility control
  hidden?: boolean; // hidden by default
}

interface DynamicMasterFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  triggerText?: string;
  initialData?: Record<string, any>;
  onFieldVisibilityChange?: (fieldId: string, visible: boolean) => void;
}

export const DynamicMasterForm = ({
  title,
  fields,
  onSubmit,
  triggerText = "Add",
  initialData,
  onFieldVisibilityChange,
}: DynamicMasterFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldSettingsOpen, setFieldSettingsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {})
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsOpen(true);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    for (const field of fields) {
      if (!field.required) continue;
      const value = formData[field.id];
      if (value === undefined || value === null || String(value).trim() === "") {
        errors.push(`${field.label} is required`);
      }
    }

    for (const field of fields) {
      if (!field.pattern) continue;
      const value = String(formData[field.id] ?? "").trim();
      if (!value) continue;
      if (!new RegExp(field.pattern).test(value)) {
        errors.push(`${field.label} has an invalid format`);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Please fix the form",
        description: errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    setFormData(
      fields.reduce((acc, field) => ({ ...acc, [field.id]: "" }), {})
    );
    setIsOpen(false);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const visibleFields = fields.filter((field) => {
    if (field.required) return true;
    if (field.visible !== undefined) return field.visible;
    return true;
  });

  const handleFieldVisibilityToggle = (fieldId: string, visible: boolean) => {
    if (onFieldVisibilityChange) {
      onFieldVisibilityChange(fieldId, visible);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Dialog
              open={fieldSettingsOpen}
              onOpenChange={setFieldSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Field Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Field Visibility</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={
                          field.visible !== undefined
                            ? field.visible
                            : !field.hidden
                        }
                        onCheckedChange={(checked) =>
                          handleFieldVisibilityToggle(
                            field.id,
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor={`field-${field.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DialogHeader>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {visibleFields.map((field) => (
            <div key={field.id} className="flex flex-col space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              {field.type === "select" ? (
                <select
                  id={field.id}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={String(formData[field.id] ?? "")}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={false}>
                  <option value="" disabled>
                    {field.placeholder || `Select ${field.label}`}
                  </option>
                  {(field.options || []).map((opt) => (
                    <option
                      key={`${field.id}-${String(opt.value)}`}
                      value={String(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id] ?? ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={false}
                  placeholder={field.placeholder}
                  pattern={undefined}
                  inputMode={field.inputMode}
                />
              )}
            </div>
          ))}

          <div className="col-span-full flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update" : triggerText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
