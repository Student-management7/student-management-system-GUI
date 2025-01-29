import React from 'react';
import styles from './ReusableTable.module.scss';

interface Column {
  field: string;
  headerName: string;
  renderCell?: (row: any) => React.ReactNode;
  cellRenderer?: (row: any) => React.ReactNode; // make cellRenderer optional
}


interface ReusableTableProps {
  columns: Column[];
  rows: Record<string, any>[];
  rowsPerPageOptions?: number[];
}

// Helper function to access nested fields
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

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

  // Filter rows based on search query
  const filteredRows = React.useMemo(() => {
    if (!searchQuery) return rows;
    return rows.filter((row) =>
      columns.some((column) =>
        String(getNestedValue(row, column.field)).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [rows, columns, searchQuery]);

  // Sort rows based on sort configuration
  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.field);
      const bValue = getNestedValue(b, sortConfig.field);
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortConfig]);

  // Calculate empty rows for pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedRows.length) : 0;

  // Handle page change
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  // Handle row selection
  const handleSelectRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.has(index) ? new Set([...prev].filter((i) => i !== index)) : new Set(prev.add(index))
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      columns.map((column) => column.headerName).join(','),
      ...rows.map((row) => columns.map((column) => getNestedValue(row, column.field)).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'table_data.csv';
    link.click();
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search table"
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const allSelected = e.target.checked;
                    setSelectedRows(allSelected ? new Set(rows.map((_, index) => index)) : new Set());
                  }}
                  aria-label="Select all rows"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className={styles.sortableHeader}
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
              <tr key={rowIndex} className={selectedRows.has(rowIndex) ? styles.selectedRow : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => handleSelectRow(rowIndex)}
                    aria-label={`Select row ${rowIndex + 1}`}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.field}>
                    {column.cellRenderer
                      ? column.cellRenderer({ data: row })
                      : getNestedValue(row, column.field)}
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
                <div className={styles.footer}>
                  <div className={styles.footerLeft}>
                    <button
                      onClick={exportToCSV}
                      className={styles.exportButton}
                    >
                      Export to CSV
                    </button>
                    <span>Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      className={styles.rowsPerPageSelect}
                    >
                      {rowsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.footerRight}>
                    <span className={styles.paginationInfo}>
                      {page * rowsPerPage + 1}-
                      {Math.min((page + 1) * rowsPerPage, sortedRows.length)} of{' '}
                      {sortedRows.length}
                    </span>
                    <div className={styles.paginationButtons}>
                      <button
                        onClick={() => handleChangePage(0)}
                        disabled={page === 0}
                        className={styles.paginationButton}
                      >
                        {'<<'}
                      </button>
                      <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        className={styles.paginationButton}
                      >
                        {'<'}
                      </button>
                      <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
                        className={styles.paginationButton}
                      >
                        {'>'}
                      </button>
                      <button
                        onClick={() =>
                          handleChangePage(Math.ceil(sortedRows.length / rowsPerPage) - 1)
                        }
                        disabled={page >= Math.ceil(sortedRows.length / rowsPerPage) - 1}
                        className={styles.paginationButton}
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