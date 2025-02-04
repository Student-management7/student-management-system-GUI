// TableTypes.ts
export interface Column {
    Rows: string;
    Columns: string;
    width?: number;
  }
  
  export interface Row {
    id: string;
    [key: string]: any;
  }
  
  export interface TableProps {
    columns: Column[];
    data: Row[];
    itemsPerPage?: number;
    onCellValueChange?: (rowIndex: number, field: string, value: any) => void;
    tableHeight?: string;
    tableWidth?: string;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onViewReport?: (row: any) => void; 
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;
    rows: any[]; 

  }