import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface GridViewProps {
    rowData: any[];
    columnDefs: any[];
    showAddButton?: boolean; // Optional prop to control the visibility of the button
    onAddRow?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onCellValueChanged?: (event: any) => void; // Add onCellValueChanged prop
}

const GridView: React.FC<GridViewProps> = ({ rowData, columnDefs, showAddButton, onAddRow, onCellValueChanged }) => {
    return (
        <>
            <div>
                {showAddButton && (
                    <button
                        onClick={onAddRow} // Call the function passed from the parent
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            padding: '8px 12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Add
                    </button>
                )}
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        onCellValueChanged={onCellValueChanged} // Bind the event handler here
                    />
                </div>
            </div>
        </>
    );
};

export default GridView;
