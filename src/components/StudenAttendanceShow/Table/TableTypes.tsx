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
  }