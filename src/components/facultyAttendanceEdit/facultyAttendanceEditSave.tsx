import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAttendanceEdit } from '../../services/Faculty/facultyAttendanceEdit/Api/api';
import { formatToDDMMYYYY } from '../Utils/dateUtils';
import { Faculty } from '../../services/Faculty/facultyAttendanceEdit/Type/type';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import BackButton from '../Navigation/backButton';
import { toast, ToastContainer } from 'react-toastify';

interface AttendanceRow {
  name: string;
  factId: string;
  attendance: string;
}

const EditAttendance: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use state to store the location data
  const [attendanceData, setAttendanceData] = useState({
    id: '',
    date: '',
    factList: [] as Faculty[]
  });
  
  // Initialize state from location on component mount
  useEffect(() => {
    const { id, date, factList } = location.state || {};
    if (id && date && factList) {
      setAttendanceData({ id, date, factList });
      setEditedFactList(factList);
    }
  }, [location.state]);

  const [editedFactList, setEditedFactList] = useState<Faculty[]>([]);

  // Early return with better error handling
  if (!attendanceData.id || !attendanceData.date || !attendanceData.factList.length) {
    return (
      <div className="p-4 bg-red-100 text-red-600 rounded">
        Error: Missing or invalid attendance data. Please go back and try again.
      </div>
    );
  }

  const handleSaveAttendance = async () => {
    try {
      const payload = {
        id: attendanceData.id,
        date: formatToDDMMYYYY(attendanceData.date),
        factList: editedFactList,
      };
      await saveAttendanceEdit(payload);
      toast.success('Attendance updated successfully!');
      navigate('/facultyAttendanceShow');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Faculty Name', 
      width: '30%'
    },
    { 
      field: 'factId', 
      headerName: 'Faculty ID', 
      width: '30%'
    },
    {
      field: 'attendance',
      headerName: 'Attendance',
      width: '40%',
      renderCell: (row: AttendanceRow) => (
        <select
          value={row.attendance}
          onChange={(e) => handleAttendanceChange(row.factId, e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      ),
    },
  ];

  const rowData = editedFactList.map((faculty) => ({
    name: faculty.name,
    factId: faculty.factId,
    attendance: faculty.attendance,
}));

// ...

const handleAttendanceChange = (factId: string, newValue: string) => {
    setEditedFactList(
      ( prevList: any) =>
      
      prevList.map((faculty: any) =>
            faculty.factId === factId
                ? { ...faculty, attendance: newValue }
                : faculty
        )
    );
};

 
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    
    <div className="box">
    <div className="flex items-center space-x-4 mb-4">
      <span>
        <BackButton />
      </span>
      <h1 className="text-xl items-center font-bold text-[#27727A]">
        Faculty Attendance Update
      </h1>
    </div>
    <div className="mb-6">
      <h2 className="text-gray-600 text-lg">
        Date: {formatToDDMMYYYY(attendanceData.date)}
      </h2>
    </div>

    <div className="box">
      <ReusableTable
        rows={rowData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>

    <div className="flex justify-end mt-4">
      <button
        onClick={handleSaveAttendance}
        className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 
                   transition duration-200 ease-in-out focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        disabled={!editedFactList.length}
      >
        Save Changes
      </button>
    </div>
  </div>
  </>
  );
};

export default EditAttendance;