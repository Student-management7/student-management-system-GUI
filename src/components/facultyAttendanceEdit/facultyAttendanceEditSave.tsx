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
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
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
    const hasUnmarkedAttendance = facultyList.some(faculty => !faculty.attendance);
    if (hasUnmarkedAttendance) {
      toast.warning('Please mark attendance for all faculty members.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

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
    { headerName: "Faculty Name", field: "name" },
    {
      headerName: "Attendance",
      field: "attendance",
      editable: true,
      cellRenderer: (params: any) => {
        const [selectedValue, setSelectedValue] = React.useState(params.value);

        React.useEffect(() => {
          setSelectedValue(params.value);
        }, [params.value]);

        return (
          <div className="flex gap-2">
            {["Present", "Absent", "Half Day", "Late"].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`attendance-${params.data.factId}`}
                  value={option}
                  checked={selectedValue === option}
                  onChange={() => {
                    setSelectedValue(option);
                    handleCellValueChange(params.data.factId, "attendance", option);
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
  ];

  const rowData = editedFactList.map((faculty) => ({
    name: faculty.name,
    factId: faculty.factId,
    attendance: faculty.attendance,
  }));

  const handleCellValueChange = (factId: string, field: string, value: any) => {
    setEditedFactList((prevList) =>
      prevList.map((faculty) =>
        faculty.factId === factId ? { ...faculty, [field]: value } : faculty
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
        <div className="mb-4">
          <h2 className="text-gray-800 text-xl font-semibold ">
            Date: {formatToDDMMYYYY(attendanceData.date)}
          </h2>
        </div>
        <div className="">
          <ReusableTable
            rows={rowData}
            columns={columns}
            rowsPerPageOptions={[5, 10, 25]}
            onCellValueChange={handleCellValueChange}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSaveAttendance}
            className="button btn head1 text-white"
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
