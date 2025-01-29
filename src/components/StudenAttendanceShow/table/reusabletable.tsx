import type React from "react";
import { useState, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components-UI/Ui/table";
import { Input } from "../../../components-UI/Ui/input";
import { Button } from "../../../components-UI/Ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components-UI/Ui/select";
import { Checkbox } from "../../../components-UI/Ui/checkbox";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from "lucide-react";
import styles from "./ReusableTable.module.scss";

interface Column<T> {
  field: keyof T;
  headerName: string;
  renderCell?: (row: T) => React.ReactNode;
  editable?: boolean;
  width?: string;
  type?: 'text' | 'select'; // Add type for different input types
  options?: { value: string; label: string }[]; // Add options for select type
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowsPerPageOptions?: number[];
  onCellEdit?: (row: T, field: keyof T, value: any) => void; // Add this callback

}

function ReusableTable<T extends Record<string, any>>({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 25],
  onCellEdit, // Add this prop
}: ReusableTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: keyof T; direction: "asc" | "desc" } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: keyof T } | null>(null); // Track editing cell

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      columns.some((column) => String(row[column.field]).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [rows, columns, searchQuery]);

  const sortedRows = useMemo(() => {
    if (sortConfig) {
      return [...filteredRows].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filteredRows;
  }, [filteredRows, sortConfig]);

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((value: string) => {
    setRowsPerPage(Number.parseInt(value, 10));
    setPage(0);
  }, []);

  const handleSort = useCallback((field: keyof T) => {
    setSortConfig((prevConfig) => ({
      field,
      direction: prevConfig?.field === field && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSelectRow = useCallback((index: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const handleSelectAllRows = useCallback(
    (checked: boolean) => {
      setSelectedRows(checked ? new Set(sortedRows.map((_, index) => index)) : new Set());
    },
    [sortedRows]
  );

  const handleCellEdit = useCallback(
    (row: T, field: keyof T, value: any) => {
      if (onCellEdit) {
        onCellEdit(row, field, value);
      }
      setEditingCell(null); // Exit edit mode after saving
    },
    [onCellEdit]
  );

  const exportToCSV = useCallback(() => {
    const csvContent = [
      columns.map((column) => column.headerName).join(","),
      ...sortedRows.map((row) => columns.map((column) => row[column.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "table_data.csv";
    link.click();
  }, [columns, sortedRows]);

  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  return (
    

    <div className={styles.tableWrapper}>
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectedRows.size === paginatedRows.length} onCheckedChange={handleSelectAllRows} />
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={String(column.field)}
                  className="cursor-pointer min-w-[150px]"
                  onClick={() => handleSort(column.field)}
                >
                  <div className="flex items-center">
                    {column.headerName}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={selectedRows.has(rowIndex) ? "bg-muted/50" : undefined}>
                <TableCell>
                  <Checkbox checked={selectedRows.has(rowIndex)} onCheckedChange={() => handleSelectRow(rowIndex)} />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={String(column.field)} style={{ width: column.width }}>
                    {column.renderCell ? (
                      // If custom render function is provided, use it
                      column.renderCell(row)
                    ) : column.editable ? (
                      // If editable but no custom render
                      column.type === 'select' ? (
                        <Select
                          value={String(row[column.field])}
                          onValueChange={(value) => handleCellEdit(row, column.field, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={String(row[column.field])} />
                          </SelectTrigger>
                          <SelectContent>
                            {column.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        // For regular editable fields
                        <div onClick={() => setEditingCell({ rowIndex, field: column.field })}>
                          {editingCell?.rowIndex === rowIndex && editingCell.field === column.field ? (
                            <Input
                              type="text"
                              value={String(row[column.field])}
                              onChange={(e) => handleCellEdit(row, column.field, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              autoFocus
                              className="min-w-[100px]"
                            />
                          ) : (
                            row[column.field]
                          )}
                        </div>
                      )
                    ) : (
                      // If not editable, just display the value
                      row[column.field]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select value={String(rowsPerPage)} onValueChange={handleChangeRowsPerPage}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {rowsPerPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            Page {page + 1} of {Math.max(1, Math.ceil(sortedRows.length / rowsPerPage))}
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleChangePage(0)} disabled={page === 0}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleChangePage(page - 1)} disabled={page === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleChangePage(Math.ceil(sortedRows.length / rowsPerPage) - 1)}
              disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default ReusableTable;