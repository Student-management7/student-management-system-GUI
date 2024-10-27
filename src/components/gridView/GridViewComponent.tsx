import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


interface GridViewProps {
  rowData?: any[];
  columnDefs?: any[];
  
}

const GridViewComponent: React.FC<GridViewProps> = (props:GridViewProps) => {
  
  const {
    columnDefs,
    rowData 
  } = props

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
      />
    </div>
  );
};

export default GridViewComponent;
