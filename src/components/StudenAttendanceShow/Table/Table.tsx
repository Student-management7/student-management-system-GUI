import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import './Table.css';

interface Column {
  field: string;
  headerName: string;
  width?: string;
  editable?: boolean;
  sortable?: boolean;
  nestedField?: string;
  cellRenderer?: (params: CellRendererParams) => React.ReactNode;
}

interface CellRendererParams {
  data: any;
  value: any;
  setValue: (value: any) => void;
  rowIndex?: number;
}

interface TableProps {
  columns: Column[];
  rows: any[];
  rowsPerPageOptions?: number[];
  onCellValueChange?: (rowIndex: number, field: string, value: any) => void;
  tableHeight?: string;
  tableWidth?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onViewReport?: (row: any) => void;
}

const ReusableTable: React.FC<TableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 25],
  onCellValueChange,
  tableHeight = "70vh",
  tableWidth = "90vw",
  onEdit,
  onDelete,
  onViewReport
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({
    field: '',
    direction: null
  });

  // Enhanced nested value getter to handle deep objects with better error handling
  const getNestedValue = (obj: any, path: string) => {
    if (!path) return obj;

    // Handle null or undefined
    if (obj === null || obj === undefined) return '';

    try {
      return path.split('.').reduce((acc, part) => {
        return acc !== null && acc !== undefined ? acc[part] : '';
      }, obj);
    } catch (error) {
      console.error('Error getting nested value:', error);
      return '';
    }
  };

  // Enhanced search functionality to handle objects and arrays
  const filteredAndSortedRows = useMemo(() => {
    // Filter rows based on search term
    let result = rows.filter((row: any) => {
      if (!searchTerm.trim()) return true;

      return columns.some(column => {
        let value;

        if (column.nestedField) {
          value = getNestedValue(row, column.nestedField);
        } else {
          value = row[column.field];
        }

        // Skip undefined or null values
        if (value === null || value === undefined) return false;

        // Handle objects by converting to string
        if (typeof value === 'object') {
          try {
            return JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase());
          } catch {
            return false;
          }
        }

        // Handle primitive values
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    // Sort filtered rows
    if (sortConfig.field && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortConfig.field];
        let bVal = b[sortConfig.field];

        const column = columns.find((col: any) => col.field === sortConfig.field);
        if (column?.nestedField) {
          aVal = getNestedValue(a, column.nestedField);
          bVal = getNestedValue(b, column.nestedField);
        }

        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });
    }

    return result;
  }, [rows, searchTerm, sortConfig, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedRows.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Ensure currentPage is valid when data changes
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredAndSortedRows.length, rowsPerPage, currentPage, totalPages]);

  // Get paginated rows with safety check
  const paginatedRows = useMemo(() => {
    const end = startIndex + rowsPerPage;
    return filteredAndSortedRows.slice(startIndex, end);
  }, [filteredAndSortedRows, startIndex, rowsPerPage]);

  // Modified handleCellValueChange to convert pagination rowIndex to global index
  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    // Convert pagination-based rowIndex to global index
    const globalRowIndex = startIndex + rowIndex;
    onCellValueChange?.(globalRowIndex, field, value);
  };

  // Enhanced CSV export with headers
  const exportCsv = () => {
    // Create header row from column names
    const headerRow = columns.map(column => column.headerName);

    // Create data rows
    const dataRows = filteredAndSortedRows.map((row: any) => {
      return columns.map((column: any) => {
        let value;
        if (column.nestedField) {
          value = getNestedValue(row, column.nestedField);
        } else {
          value = row[column.field];
        }

        // Format value for CSV
        if (value === null || value === undefined) {
          return '';
        } else if (Array.isArray(value)) {
          // Handle arrays by joining elements with a separator
          return value.map((item: any) => {
            if (typeof item === 'object') {
              return `${item.name}: ${item.amount}`; // Format as "name: amount"
            } else {
              return String(item);
            }
          }).join('; ');
        } else if (typeof value === 'object') {
          // Handle objects like otherAmount
          if (value.name && value.amount !== undefined) {
            return `${value.name}: ${value.amount}`; // Format as "name: amount"
          }
          return JSON.stringify(value);
        } else {
          return String(value);
        }
      });
    });

    // Combine headers and data rows
    const csvData = [headerRow, ...dataRows];
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const actionbuttons = (row: any) => {
    return (
      <div>
        {onEdit && <button onClick={() => onEdit(row)}>Edit</button>}
        {onDelete && <button onClick={() => onDelete(row)}>Delete</button>}
        {onViewReport && <button onClick={() => onViewReport(row)}>View</button>}
      </div>
    );
  };

  // Function to create cell renderer wrapper that handles proper value setting
  // Function to create cell renderer wrapper that handles proper value setting
  const createCellRendererWrapper = (column: Column, rowIndex: number, row: any) => {
    const originalValue = column.nestedField
      ? getNestedValue(row, column.nestedField)
      : row[column.field];

    const handleSetValue = (value: any) => {
      if (column.field === 'attendance' && row.factId) {
        // For attendance field with factId, use the factId-based approach
        onCellValueChange?.(row.factId, column.field, value);
      } else {
        // For other fields, use the row index approach
        handleCellValueChange(rowIndex, column.field, value);
      }
    };

    if (column.cellRenderer) {
      return column.cellRenderer({
        data: row,
        value: originalValue,
        setValue: handleSetValue
      });
    }

    return (
      <div className="text-gray-900 overflow-hidden text-ellipsis">
        {formatDisplayValue(originalValue)}
      </div>
    );
  };
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full  max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full px-8 py-2 borderr border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <span className="absolute left-2.5 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Fixed Size Table Container */}
      <div className="border borderr">
        <div>
          <table className="divide-y w-100">
            <thead className="webView">
              <tr>
                <th>
                  S.No.
                </th>
                {columns.map((column: any) => (
                  <th
                    key={column.field}
                    onClick={() => column.sortable !== false && setSortConfig({
                      field: column.field,
                      direction: sortConfig.field === column.field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                    })}
                  >
                    <div className="flex items-center gap-2">
                      {column.headerName}
                      {sortConfig.field === column.field && (
                        <span className="text-gray-400">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    <td className="text-ellipsis">
                      <p className='pull-left'>{startIndex + rowIndex + 1}</p>
                      <div className='ml-4 mobileView'>
                        {columns.map((column: any) => (
                          <p className='m-0'
                            key={`${rowIndex}-${column.field}`}
                          >
                            {column.headerName}:
                            {createCellRendererWrapper(column, rowIndex, row)}
                          </p>
                        ))}
                      </div>
                    </td>
                    {columns.map((column: any) => (
                      <td className='webView'
                        key={`${rowIndex}-${column.field}`}
                      >
                        {createCellRendererWrapper(column, rowIndex, row)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex mt-3 sm:flex-row justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={exportCsv}
            className="flex webView items-center gap-2 px-4 head1 btn button text-white"
            disabled={paginatedRows.length === 0}
          >
            <Download size={16} />
            Export CSV
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 webView">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border borderr rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {rowsPerPageOptions.map((option: any) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 webView py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show pages around current page
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageToShow}
                  onClick={() => setCurrentPage(pageToShow)}
                  className={`px-3 py-1 border rounded-md transition-colors ${currentPage === pageToShow
                    ? 'bg-[#3a8686] text-white'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  {pageToShow}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 webView py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

// Helper function to format display values
function formatDisplayValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  } else if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  } else {
    return String(value);
  }
}

export default ReusableTable;