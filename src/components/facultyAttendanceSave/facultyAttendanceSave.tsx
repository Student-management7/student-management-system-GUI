import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/Utils/apiUtils';
import { fetchFacultyData, submitAttendance } from '../../services/Faculty/FacultyAttendanceSave/Api';
import { Faculty } from '../../services/Faculty/FacultyAttendanceSave/Type';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import BackButton from '../Navigation/backButton';
import Loader from '../loader/loader';
import { ToastContainer } from "react-toastify";

interface AttendanceRow {
  name: string;
  factId: string;
  attendance: string;
}

const AttendanceSave: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFacultyData();
        setFacultyList(response);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to fetch faculty data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleSaveAttendance = async () => {
    // ✅ 1️⃣ Check if all faculty have marked attendance
    const isAllMarked = facultyList.every(faculty => faculty.attendance && faculty.attendance !== 'Select');

    if (!isAllMarked) {
      toast.warn('Please mark attendance for all faculty before saving.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await submitAttendance(facultyList);
      if (response.status === 200) {
        toast.success('Attendance submitted successfully!');
        const updatedData = await fetchFacultyData();
        setFacultyList(updatedData);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400 && error.response.data.detail === 'Attendance already present') {
        toast.info('Attendance already present', { position: 'top-right', autoClose: 3000 });
      } else {
        toast.error('Error submitting attendance. Please try again.');
      }
    }
  };

  const handleAttendanceChange = (factId: string, newValue: string) => {
    setFacultyList(prevList =>
      prevList.map(faculty =>
        faculty.fact_id === factId ? { ...faculty, attendance: newValue } : faculty
      )
    );
  };

  const columns = [
    { field: 'name', headerName: 'Faculty Name', editable: false, width: '30%' },
    { field: 'factId', headerName: 'Faculty ID', editable: false, width: '30%' },
    {
      field: 'attendance',
      headerName: 'Attendance',
      editable: true,
      width: '40%',
      cellRenderer: (row: AttendanceRow) => (
        <div className="w-full">
          <select
            value={row.attendance}
            onChange={e => handleAttendanceChange(row.factId, e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Select">Select</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      ),
    },
  ];

  const rowData = facultyList.map(faculty => ({
    name: faculty.fact_Name,
    factId: faculty.fact_id,
    attendance: faculty.attendance || 'Select',
  }));

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="box p-4">
          <div className="flex items-center space-x-4 mb-4">
            <span><BackButton /></span>
            <h1 className="text-xl font-bold text-[#27727A]">Student Attendance Update</h1>
          </div>

          <div className="mb-6">
            <ToastContainer/>
            <ReusableTable
              rows={rowData}
              columns={columns}
              onRowUpdate={(row, index) => handleAttendanceChange(row.factId, row.attendance)}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:opacity-50"
              disabled={!facultyList.length}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceSave;
