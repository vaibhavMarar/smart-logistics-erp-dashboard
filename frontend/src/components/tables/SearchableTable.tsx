import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Settings2 } from "lucide-react";

interface TableColumn {
  key: string;
  label: string;
  searchable?: boolean;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
  hidden?: boolean; // hidden by default
  visible?: boolean; // explicit visibility control
}

interface SearchableTableProps {
  data: Record<string, any>[];
  columns: TableColumn[];
  className?: string;
  pageSizeOptions?: number[]; // e.g., [15, 50, 100]
  onColumnVisibilityChange?: (columnKey: string, visible: boolean) => void;
}

export const SearchableTable = ({
  data,
  columns,
  className,
  pageSizeOptions = [15, 50, 100],
  onColumnVisibilityChange,
}: SearchableTableProps) => {
  const searchableColumns = useMemo(
    () => columns.filter((c) => c.searchable),
    [columns]
  );

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>(
    searchableColumns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {})
  );

  const filteredData = useMemo(() => {
    if (searchableColumns.length === 0) return data;
    return data.filter((item) => {
      return searchableColumns.every((column) => {
        const searchTerm = searchTerms[column.key]?.toLowerCase() || "";
        if (!searchTerm) return true;
        const raw = item[column.key];
        const cellValue =
          raw === undefined || raw === null ? "" : String(raw).toLowerCase();
        return cellValue.includes(searchTerm);
      });
    });
  }, [data, searchTerms, searchableColumns]);

  const handleSearchChange = (columnKey: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [columnKey]: value }));
  };

  const [showHidden, setShowHidden] = useState(false);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  const visibleColumns = useMemo(() => {
    return columns.filter((c) => {
      // If explicit visibility is set, use that
      if (c.visible !== undefined) {
        return c.visible;
      }
      // Otherwise, use the old hidden logic
      return showHidden || !c.hidden;
    });
  }, [columns, showHidden]);

  // Pagination
  const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0] || 15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [JSON.stringify(searchTerms), data, pageSize]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = (current: number, total: number) => {
    const delta = 2; // window size around current
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    while (end - start < 4 && start > 1) start--;
    while (end - start < 4 && end < total) end++;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handleColumnVisibilityToggle = (
    columnKey: string,
    visible: boolean
  ) => {
    if (onColumnVisibilityChange) {
      onColumnVisibilityChange(columnKey, visible);
    }
  };

  return (
    <div className={className}>
      {searchableColumns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          {searchableColumns.map((column) => (
            <div key={column.key} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${column.label}`}
                value={searchTerms[column.key]}
                onChange={(e) => handleSearchChange(column.key, e.target.value)}
                className="pl-9"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <select
            className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value, 10))}>
            {pageSizeOptions.map((opt) => (
              <option key={`ps-${opt}`} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {totalItems === 0 ? "0" : `${startIndex + 1}-${endIndex}`} of{" "}
            {totalItems}
          </span>
        </div>
        <div className="flex gap-2">
          {columns.some((c) => c.hidden) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHidden((s) => !s)}>
              {showHidden ? "Hide less important" : "Show all columns"}
            </Button>
          )}
          <Dialog
            open={columnSettingsOpen}
            onOpenChange={setColumnSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Column Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Column Visibility</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.key}`}
                      checked={
                        column.visible !== undefined
                          ? column.visible
                          : !column.hidden
                      }
                      onCheckedChange={(checked) =>
                        handleColumnVisibilityToggle(
                          column.key,
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={`column-${column.key}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="text-center text-muted-foreground">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item, index) => (
              <TableRow key={(item as any).led_cd ?? (item as any).id ?? index}>
                {visibleColumns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}>
          Prev
        </Button>
        {pageNumbers.map((num) => (
          <Button
            key={`pg-${num}`}
            variant={num === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(num)}>
            {num}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};
