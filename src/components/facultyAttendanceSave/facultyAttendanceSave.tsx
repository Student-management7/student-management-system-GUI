import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../services/Utils/apiUtils';
import { fetchFacultyData, submitAttendance } from '../../services/Faculty/FacultyAttendanceSave/Api';
import { Faculty } from '../../services/Faculty/FacultyAttendanceSave/Type';
import ReusableTable from '../StudenAttendanceShow/Table/Table';
import Loader from '../loader/loader';

interface AttendanceRow {
  name: string;
  factId: string;
  attendance: string;
}

const AttendanceSave: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkAttendance, setBulkAttendance] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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

  // Add the missing handleCellValueChange function
  const handleCellValueChange = (factId: string, field: string, value: any) => {
    console.log(`Updating factId: ${factId}, field: ${field}, value: ${value}`);
    setFacultyList(prevList =>
      prevList.map(faculty =>
        faculty.fact_id === factId
          ? { ...faculty, [field]: value }
          : faculty
      )
    );
  };

  // Revised onCellValueChange function
  const onCellValueChange = (rowIndexOrId: number | string, field: string, value: any) => {
    // Check if rowIndexOrId is a string (factId) or number (rowIndex)
    if (typeof rowIndexOrId === 'string') {
      // Handle factId-based updates
      handleCellValueChange(rowIndexOrId, field, value);
    } else {
      // Handle index-based updates
      const faculty = facultyList[rowIndexOrId as number];
      if (faculty) {
        handleCellValueChange(faculty.fact_id, field, value);
      }
    }
  };

  const handleSaveAttendance = async () => {
    console.log('Faculty List before submission:', facultyList);
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
      const payload = {
        factList: facultyList.map(faculty => ({
          factId: faculty.fact_id,
          name: faculty.fact_Name,
          attendance: faculty.attendance,
        })),
      };

      const response = await submitAttendance(payload);
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
    { headerName: "Faculty Name", field: "name" },
    {
      headerName: "Attendance",
      field: "attendance",
      editable: true,
      cellRenderer: (params: any) => {
        const factId = params.data.factId;
        const faculty = facultyList.find(f => f.fact_id === factId);
        const currentValue = faculty ? faculty.attendance : '';


        return (
          <div className="flex gap-2" key={`${factId}-${refreshKey}`}>
            {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`attendance-${factId}`}
                  value={option}
                  checked={currentValue === option}
                  onChange={() => {
                    // Update the state directly
                    setFacultyList(prevList =>
                      prevList.map(faculty =>
                        faculty.fact_id === factId
                          ? { ...faculty, attendance: option }
                          : faculty
                      )
                    );

                    // Force refresh the component
                    setRefreshKey(prev => prev + 1);

                    // Attempt to update the table if possible
                    if (typeof params.setValue === 'function') {
                      params.setValue(option);
                    }
                  }}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      }
    },
  ];

  const transformFacultyData = (faculty: Faculty) => ({
    name: faculty.fact_Name,
    factId: faculty.fact_id,
    attendance: faculty.attendance || '',
  });

  const rowData = facultyList.map(transformFacultyData);

  const applyBulkAttendance = (value: string) => {
    if (!value) {
      return;
    }

    setFacultyList((prevList) =>
      prevList.map((faculty) => ({ ...faculty, attendance: value }))
    );
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <Loader />}
      {!loading && (
        <div className="box p-4">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="head1 items-center">
              Faculty Attendance 
            </h1>
          </div>

          <div className="">
            <span className="flex">
              <select
                value={bulkAttendance}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setBulkAttendance(selectedValue);
                  applyBulkAttendance(selectedValue);
                }}
                className="border rounded p-2 mr-2 mb-2"
              >
                <option value="">Bulk Attendance</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
                <option value="Late">Late</option>
                <option value="Leave">Leave</option>
              </select>
            </span>

            <span>
              <ReusableTable
                rows={rowData}
                columns={columns}
                rowsPerPageOptions={[5, 10, 20]}
                onCellValueChange={onCellValueChange}
                page={currentPage}
                onPageChange={(newPage: React.SetStateAction<number>) => setCurrentPage(newPage)}
              />
            </span>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveAttendance}
              className="head1 btn button text-white pt-2 pb-2 pl-4 pr-4"
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