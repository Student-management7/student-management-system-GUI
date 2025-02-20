import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GridView from './GridView';
import { formatToDDMMYYYY } from '../Utils/dateUtils';
import axiosInstance from '../../services/Utils/apiUtils';
import { toast, ToastContainer } from 'react-toastify';

const StudentAttendanceEditSave: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { studentData, date, className, subject, AttendanceMode } = location.state || {};

  if (!studentData || !date || !className || !subject) {
    return <div>Error: Missing attendance data</div>;
  }

  const [editedStudentList, setEditedStudentList] = useState(studentData);

  const saveEditedAttendance = async () => {
    try {
      const payload = {
        date: formatToDDMMYYYY(date),
        className,
        subject,
        studentList: editedStudentList,
      };

      await axiosInstance.post(
        'https://s-m-s-keyw.onrender.com/attendance/update',
        payload
      );
      toast.success('Attendance updated successfully!');
      navigate('/studentAttendance');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const columnDefs = [
    { headerName: 'Student Name', field: 'name', editable: false },
    { headerName: 'Student ID', field: 'stdId', editable: false },
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

  const rowData = editedStudentList.map((student: any) => ({
    stdId: student.stdId,
    name: student.name,
    attendance: student.attendance,
  }));

  const onCellValueChanged = (event: any) => {
    const updatedRow = event.data;
    const updatedStudentList = editedStudentList.map((student: any) =>
      student.stdId === updatedRow.stdId
        ? { ...student, attendance: updatedRow.attendance }
        : student
    );
    setEditedStudentList(updatedStudentList);
  };

  return (
    <>
      <ToastContainer />
      <div className="box">
        <h2 className="text-lg font-bold mb-4">Date: {date}</h2>
        <h3>Class: {className}</h3>
        <h3>Subject: {subject}</h3>
        <h3>Attendance Mode: {AttendanceMode ? 'Enabled' : 'Disabled'}</h3>

        <GridView
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
        />

        <button
          onClick={saveEditedAttendance}
          className="bg-blue-500 text-white rounded px-3 py-1 mt-4"
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default StudentAttendanceEditSave;
