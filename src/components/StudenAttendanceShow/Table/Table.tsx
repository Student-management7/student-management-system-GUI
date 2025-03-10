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

  // Existing helper functions (getNestedValue, filteredAndSortedRows calculation)
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const filteredAndSortedRows = useMemo(() => {
    let result = rows.filter((row: any) =>
      Object.entries(row).some(([key, value]) => {
        if (columns.find((col: any) => col.field === key)) {
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

  const totalPages = Math.ceil(filteredAndSortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + rowsPerPage);

  console.log('rows--->', rows);
  console.log('columns--->', columns);

  const actionbuttons = (id: any) => {
    console.log(id);
    return (
      <div>
        <button onClick={() => onEdit}>Edit</button>
        <button>Delete</button>
      </div>
    )

  }
  return (

    <>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full  max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  ID
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
              {paginatedRows.map((row: any, rowIndex: any) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  <td className="text-ellipsis">
                    <p className='pull-left'>{startIndex + rowIndex + 1}</p>
                    <div className='ml-4 mobileView'>
                      {columns.map((column: any) => (

                        <p className='m-0'
                          key={`${rowIndex}-${column.field}`}
                        >
                          {column.headerName}:
                          {column.cellRenderer ? (
                            column.cellRenderer({
                              data: row,
                              value: column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field],
                              setValue: (value: number) => onCellValueChange?.(rowIndex, column.field, value)
                            })
                          ) : (
                            <span className="text-sm text-gray-900 overflow-hidden overflow-ellipsis">
                              {column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field]}
                            </span>
                          )}
                        </p>
                      ))}
                    </div>

                  </td>
                  {columns.map((column: any) => (
                    <td className='webView'
                      key={`${rowIndex}-${column.field}`}
                    >
                      {column.cellRenderer ? (
                        column.cellRenderer({
                          data: row,
                          value: column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field],
                          setValue: (value: number) => onCellValueChange?.(rowIndex, column.field, value)
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

              {/* {rows.map((item: any, index: number) =>{

                return(
                  <tr>
                  {
                    <>
                      <td>{index}</td>
                      <td>{item.name}</td>
                      <td>{item.city}</td>
                      <td>{item.cls}</td>
                      <td>{item.gender}</td>
                      <td>{item.gender}</td>
                      <td>{item.gender}</td>
                      <td>{actionbuttons(item.id)}</td>
                      <td>{item.gender}</td>
                    </>

                  }
                </tr>
                );
              })} */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex mt-3 sm:flex-row justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const csvData = filteredAndSortedRows.map((row: any) => {
                return columns.map((column: any) => column.nestedField ? getNestedValue(row, column.nestedField) : row[column.field]);
              });

              const csvContent = csvData.map((row: any) => row.join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', 'data.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

            }}
            className="flex webView items-center gap-2 px-4  head1 btn button text-white"
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
            className="px-3 webView py-1  border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border  rounded-md transition-colors ${currentPage === page
                  ? 'bg-[#3a8686] text-white'
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
            className="px-3 webView py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>

  );
};

export default ReusableTable;