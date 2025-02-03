import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';

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

  // Existing helper functions (getNestedValue, filteredAndSortedRows calculation)
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

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

  const totalPages = Math.ceil(filteredAndSortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="flex flex-col w-full max-w-[95vw] mx-auto space-y-4">
      {/* Search and Controls Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full p-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-8 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <span className="absolute left-2.5 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative w-full overflow-hidden border rounded-lg shadow-sm">
        <div className="w-full overflow-auto" style={{ height: tableHeight, maxWidth: tableWidth }}>
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gray-50">
              <tr className="sticky top-0 z-10">
                <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    style={{ width: column.width }}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer bg-gray-50"
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
              {paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {startIndex + rowIndex + 1}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.field}`}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {column.cellRenderer ? (
                        column.cellRenderer({
                          data: row,
                          value: column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field],
                          setValue: (value) => onCellValueChange?.(rowIndex, column.field, value)
                        })
                      ) : (
                        <div className="text-gray-900 overflow-hidden text-ellipsis">
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

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => {/* Export CSV logic */}}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
              className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-md transition-colors ${
                  currentPage === page
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
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;