import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/Utils/apiUtils';
import { fetchFacultyData, submitAttendance } from '../../services/Faculty/FacultyAttendanceSave/Api';
import { Faculty } from '../../services/Faculty/FacultyAttendanceSave/Type';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import BackButton from '../Navigation/backButton';
import Loader from '../loader/loader';

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
      setLoading(true);
      try {
        const response = await axiosInstance.get('/faculty/findAllFaculty');
        if (response.data) {
          const initializedFacultyList = response.data.map((faculty: Faculty) => ({
            ...faculty,
            attendance: faculty.attendance || ''
          }));
          setFacultyList(initializedFacultyList);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to fetch faculty data. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAttendanceChange = (rowIndex: number, field: string, value: string) => {
    setFacultyList((prevList) =>
      prevList.map((faculty, index) =>
        index === rowIndex
          ? { ...faculty, attendance: value }
          : faculty
      )
    );
  };

  const handleSaveAttendance = async () => {
    const hasUnmarkedAttendance = facultyList.some(faculty => !faculty.attendance);
    if (hasUnmarkedAttendance) {
      toast.warning('Please mark attendance for all faculty members.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await submitAttendance(facultyList);
      if (response.status === 200) {
        toast.success('Attendance submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        const updatedData = await fetchFacultyData();
        setFacultyList(updatedData);
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Error submitting attendance. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Faculty Name',
      editable: false,
    },
    {
      field: 'factId',
      headerName: 'Faculty ID',
      editable: false,
    },
    {
      field: 'attendance',
      headerName: 'Attendance',
      editable: true,
      cellRenderer: (row: any, onValueChange: (value: string) => void) => (
        <select
          value={row.attendance || ''}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      )
    },
  ];

  const transformFacultyData = (faculty: Faculty) => ({
    name: faculty.fact_Name,
    factId: faculty.fact_id,
    attendance: faculty.attendance || '',
  });

  const rowData = facultyList.map(transformFacultyData);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="box p-4">
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]">
              Faculty Attendance Update
            </h1>
          </div>

          <div className="mb-6">
            <ReusableTable
              rows={rowData}
              columns={columns}
              rowsPerPageOptions={[5, 10, 25]}
              onCellValueChange={handleAttendanceChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAttendance}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 
                       transition duration-200 ease-in-out focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
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