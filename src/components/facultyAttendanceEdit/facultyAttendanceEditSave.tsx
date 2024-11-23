import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GridView from './gridView';
import { saveAttendanceEdit } from '../../services/facultyAttendanceEdit/Api/api';
import { formatToDDMMYYYY } from '../Utils/dateUtils';
import { Faculty } from '../../services/facultyAttendanceEdit/Type/type';

const EditAttendance: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, date, factList } = location.state || {};

  if (!id || !date || !factList) {
    return <div>Error: Missing attendance data</div>;
  }

  const [editedFactList, setEditedFactList] = useState<Faculty[]>(factList);

  const handleSaveAttendance = async () => {
    try {
      const payload = {
        id,
        date: formatToDDMMYYYY(date),
        factList: editedFactList,
      };
      await saveAttendanceEdit(payload);
      alert('Attendance updated successfully!');
      navigate('/facultyAttendance');
    } catch (error) {
      alert('Failed to save changes. Please try again.');
    }
  };

  const columnDefs = [
    { headerName: 'Faculty Name', field: 'name', editable: false },
    { headerName: 'Faculty ID', field: 'factId', editable: false },
    { 
      headerName: 'Attendance', 
      field: 'attendance', 
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Present', 'Absent'],
      },
    },
  ];

  const rowData = editedFactList.map((faculty) => ({
    factId: faculty.factId,
    name: faculty.name,
    attendance: faculty.attendance,
  }));

  const onCellValueChanged = (event: any) => {
    const updatedRow = event.data;
    setEditedFactList((prevList) =>
      prevList.map((faculty) =>
        faculty.factId === updatedRow.factId
          ? { ...faculty, attendance: updatedRow.attendance }
          : faculty
      )
    );
  };

  return (
    <div className="box">
      <h2 className="text-lg font-bold mb-4">Date: {date}</h2>
      <GridView
        rowData={rowData}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
      />
      <button
        onClick={handleSaveAttendance}
        className="w-1/8 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex justify-center"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditAttendance;
