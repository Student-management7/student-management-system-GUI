import React, { useState, useMemo } from 'react';
import { Download,  } from 'lucide-react';
import './Table.css'


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
  tableHeight = "5/00px",
  tableWidth = "100%",
  
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({
    field: '',
    direction: null
  });

  // Get nested value
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  // Filter and sort rows
  const filteredAndSortedRows = useMemo(() => {
    let result = rows.filter((row) =>
      Object.entries(row).some(([key, value]) => {
        if (columns.find(col => col.field === key)) {
          const searchValue = value?.toString().toLowerCase() || '';
          return searchValue.includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );

    if (sortConfig.field && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortConfig.field];
        let bVal = b[sortConfig.field];

        // Handle nested fields
        const column = columns.find(col => col.field === sortConfig.field);
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="w-full">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-2.5 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Fixed Size Table Container */}
      <div className="table-container border border-gray-200 rounded-lg overflow-x-auto">
        <div
          className="max-w-full overflow-x-auto"
          style={{ width: tableWidth, height: tableHeight, maxHeight: tableHeight }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  S.No
                </th>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    style={{ width: column.width }}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    {startIndex + rowIndex + 1}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.field}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.cellRenderer ? (
                        column.cellRenderer({
                          data: row,
                          value: column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field],
                          setValue: (value) => onCellValueChange?.(rowIndex, column.field, value)
                        })
                      ) : (
                        <div className="text-sm text-gray-900 overflow-hidden overflow-ellipsis">
                          {column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field]}
                        </div>
                      )}
                    </td>
                  ))}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {/* Export CSV logic */ }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download size={16} />
            Export CSV
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md ${currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;