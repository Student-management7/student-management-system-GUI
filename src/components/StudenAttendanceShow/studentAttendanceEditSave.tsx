import React, { useState } from 'react';
import { useLocation,  } from 'react-router-dom';
import { formatToDDMMYYYY } from '../Utils/dateUtils';
import axiosInstance from '../../services/Utils/apiUtils';
import { toast, ToastContainer } from 'react-toastify';
import ReusableTable from './Table/Table';
import BackButton from '../Navigation/backButton';

const StudentAttendanceEditSave: React.FC = () => {
  const location = useLocation();

  const { studentData, date, className, subject, AttendanceMode } = location.state || {};

  if (!studentData || !date || !className || AttendanceMode === undefined) {
    return (
      <div>
        <p>Error: Missing or invalid attendance data. Please go back and try again.</p>
      </div>
    );
  }
  
  console.log("studentData:", studentData);
  const studenttsList = studentData?.[0]?.students || [];

  console.log("studenttsList:", studenttsList);


  const [editedStudentList, setEditedStudentList] = useState(
    studentData?.[0]?.students || []
  );

  console.log("Extracted students list:", studenttsList);

  
  const saveEditedAttendance = async () => {
    try {
      const payload = {
        date: formatToDDMMYYYY(date),
        className,
        subject: AttendanceMode ? '' : subject,
        studentList: editedStudentList.map((student: { stdId: any; name: any; attendance: any; remark: any; }) => ({
          stdId: student.stdId,
          name: student.name,
          attendance: student.attendance,
          remark: student.remark || '',
        })),
      };

      console.log("Payload to be sent:", payload);

      await axiosInstance.post(
        `/attendance/update?masterAttendance=${AttendanceMode}`,
        payload
      );
      toast.success('Attendance updated successfully!');
      // navigate('/studentAttendanceEdit');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const columnDefs = [
    { headerName: 'Student Name', field: 'name', editable: false },
    {
      headerName: 'Attendance',
      field: 'attendance',
      editable: true,
      cellRenderer: (params: any) => {
        const [selectedValue, setSelectedValue] = React.useState(params.value);

        React.useEffect(() => {
          setSelectedValue(params.value);
        }, [params.value]);

        return (
          <div className="flex gap-2">
            {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`attendance-${params.data.stdId}`}
                  value={option}
                  checked={selectedValue === option}
                  onChange={() => {
                    setSelectedValue(option);
                    params.setValue(option);
                    handleCellValueChange(params.rowIndex, 'attendance', option);
                  }}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      },
    },
    {
      headerName: 'Remarks',
      field: 'remark',
      editable: true,
      cellRenderer: (params: any) => (
        <input
          type="text"
          value={params.value || ''}
          onChange={(e) => params.setValue(e.target.value)}
          placeholder="Enter remarks"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ),
    },
  ];

  const rowData = editedStudentList.map((student: any, index: any) => ({
    ...student,
    rowIndex: index,
  }));

  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    setEditedStudentList((prevStudents: string | any[]) => {
      if (rowIndex >= 0 && rowIndex < prevStudents.length) {
        const newStudents = [...prevStudents];
        newStudents[rowIndex] = {
          ...newStudents[rowIndex],
          [field]: value,
        };
        console.log('Updated students:', newStudents);
        return newStudents;
      } else {
        console.error('Invalid rowIndex:', rowIndex);
        return prevStudents;
      }
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="box">
        <div className="flex items-center space-x-4 mb-4">
          <span>
            <BackButton />
          </span>
          <h1 className="head1" >Student Attendance Update</h1>
        </div>
        <div className="row mb-4 p-3 border rounded-lg bg-light shadow-sm d-flex flex-wrap align-items-center gap-3 ml-1 mr-1">

          <h2 className="text-lg font-bold col-md-auto d-flex align-items-center gap-2">
            📅 <span>Date:</span> {date}
          </h2>

          <h3 className="col-md-auto d-flex align-items-center gap-2">
            🏫 <span>Class:</span> {className}
          </h3>

          <h3 className="col-md-auto d-flex align-items-center gap-2">
            📖 <span>Subject:</span> {subject || 'N/A'}
          </h3>

          <h3 className="col-md-auto d-flex align-items-center gap-2">
            🎯 <span>Attendance Mode:</span> {AttendanceMode ? 'Class wise' : 'Subject Wise'}
          </h3>

        </div>



        <ReusableTable
          rows={rowData}
          columns={columnDefs}
          onCellValueChange={handleCellValueChange}
        />

        <div className='flex justify-center mt-4 mb-4'>

          <button
            onClick={saveEditedAttendance}
            className="button btn   "
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentAttendanceEditSave;
