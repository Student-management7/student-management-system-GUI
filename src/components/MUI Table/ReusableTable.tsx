import React from 'react';
// import './ReusableTable.module.scss';
import styles from './ReusableTable.module.scss';


interface Column {
  renderCell: any;
  field: string;
  headerName: string;

}

interface ReusableTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  rowsPerPageOptions?: number[];


}

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 25],
  
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) =>
      columns.some((column) =>
        String(row[column.field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rows, columns, searchQuery]);

  const sortedRows = React.useMemo(() => {
    if (sortConfig) {
      return [...filteredRows].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filteredRows;
  }, [filteredRows, sortConfig]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedRows.length) : 0;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  const handleSelectRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.has(index) ? new Set([...prev].filter((i) => i !== index)) : new Set(prev.add(index))
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      columns.map((column) => column.headerName).join(','),
      ...rows.map((row) => columns.map((column) => row[column.field]).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table_data.csv';
    link.click();
  };

  return (
    <div className={styles['table-container']}>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const allSelected = e.target.checked;
                    setSelectedRows(allSelected ? new Set(rows.map((_, index) => index)) : new Set());
                  }}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                >
                  <div>
                    <span>{column.headerName}</span>
                    {sortConfig?.field === column.field && (
                      <span>{sortConfig.direction === 'asc' ? '🔼' : '🔽'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
  {(rowsPerPage > 0
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows
  ).map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.has(rowIndex)}
          onChange={() => handleSelectRow(rowIndex)}
        />
      </td>
      {columns.map((column) => (
        <td key={column.field}>
          {typeof column.renderCell === "function"
            ? column.renderCell(row)
            : row[column.field]}
        </td>
      ))}
    </tr>
  ))}
  {emptyRows > 0 && (
    <tr style={{ height: `${41 * emptyRows}px` }}>
      <td colSpan={columns.length + 1} />
    </tr>
  )}
</tbody>

          <tfoot>
            <tr>
              <td colSpan={columns.length + 1}>
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={exportToCSV}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                    >
                      Export to CSV
                    </button>
                    <span>Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      className="border border-gray-300 rounded p-1"
                    >
                      {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {page * rowsPerPage + 1}-
                      {Math.min((page + 1) * rowsPerPage, sortedRows.length)} of{' '}
                      {sortedRows.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleChangePage(0)}
                        disabled={page === 0}
                        className="py-1 px-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        {'<<'}
                      </button>
                      <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className="py-1 px-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        {'<'}
                      </button>
                      <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
                        className="py-1 px-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        {'>'}
                      </button>
                      <button
                        onClick={() =>
                          handleChangePage(
                            Math.ceil(sortedRows.length / rowsPerPage) - 1
                          )
                        }
                        disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
                        className="py-1 px-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
                      >
                        {'>>'}
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default ReusableTable;