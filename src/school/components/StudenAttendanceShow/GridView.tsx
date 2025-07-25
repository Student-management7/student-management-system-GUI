import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CellValueChangedEvent } from 'ag-grid-community';

interface GridViewProps {
    rowData: any[];
    columnDefs: any[];
    showAddButton?: boolean; // Optional prop to control the visibility of the button
    onCellValueChanged ?: (params: any) => void; // Optional prop to handle cell value changed event
    onAddRow?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const GridView: React.FC<GridViewProps> = ({ rowData, columnDefs, showAddButton, onAddRow }) => {
    function onCellValueChanged(event: CellValueChangedEvent<any, any>): void {
        throw new Error('Function not implemented.');
    }

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
                onCellValueChanged={onCellValueChanged}
            />
        </div>
            </div>
       </>
    );
};

export default GridView;
