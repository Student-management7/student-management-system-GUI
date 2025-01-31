
import React from 'react';
import GridView from './gridView';
import { Faculty , FacultyTableProps } from '../../services/Faculty/FacultyAttendanceSave/Type';
import ReusableTable from '../StudenAttendanceShow/table/reusabletable';



// Faculty Table management

const FacultyTable: React.FC<FacultyTableProps> = ({ facultyList, onAttendanceSelect }) => {
    const AttendanceSelector = (props: any) => {
        const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            event.stopPropagation();
            const value = event.target.value;
            props.onValueChange(value, props.node);
        };

        return (
            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center' }}>
                <select
                    
                    value={props.data.attendance || ''}
                    onChange={handleChange}
                    style={{ width: '100%', height: '30px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                    <option  value="">Select</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            </div>
        );
    };

    const columnDefs = [
        // { field: 'fact_id', headerName: 'ID' },
        { field: 'fact_Name', headerName: 'Name' },
        { field: 'fact_email', headerName: 'Email' },
        { field: 'fact_contact', headerName: 'Contact' },

       
        {
            field: 'attendance',
            headerName: 'Attendance',
            cellRenderer: AttendanceSelector,
            cellRendererParams: {
                onValueChange: (value: string, node: any) => {
                    onAttendanceSelect(value, node.data.fact_id); // Pass `fact_id` here
                },
            },
            
            width: 120,
            suppressMovable: true,
            pinned: 'middle',
        },
    ];

    return (
        <div className='box' >
            <ReusableTable rows={facultyList} columns={columnDefs} />
        </div>
    );
};

export default FacultyTable;