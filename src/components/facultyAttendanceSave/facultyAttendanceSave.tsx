import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
  const [bulkAttendance, setBulkAttendance] = useState<string>('');


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


  const handleCellValueChange = (factId: string, field: string, value: any) => {
    setFacultyList((prevList) =>
      prevList.map((faculty) =>
        faculty.fact_id === factId ? { ...faculty, [field]: value } : faculty
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
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          {["Present", "Absent", "Leave"].map((option) => (
            <label key={option} className="flex items-center gap-1">
              <input
                type="radio"
                name={`attendance-${params.data.factId}`}
                value={option}
                checked={params.data.attendance === option}
                onChange={() => handleCellValueChange(params.data.factId, "attendance", option)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const transformFacultyData = (faculty: Faculty) => ({
    name: faculty.fact_Name,
    factId: faculty.fact_id,
    attendance: faculty.attendance || '',
  });

  const rowData = facultyList.map(transformFacultyData);


  // bulk attendance 

  const handleBulkAttendanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBulkAttendance(event.target.value);
  };

  const applyBulkAttendance = () => {
    if (!bulkAttendance) {
      toast.warning("Please select an attendance status before applying.");
      return;
    }


    setFacultyList((prevList:any) =>
      prevList.map((faculty:any) => ({ ...faculty, attendance: bulkAttendance }))
    );
  };

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


          <span className=" float-right mb-4 flex items-center space-x-4 mb-4">
            <select
              value={bulkAttendance}
              onChange={handleBulkAttendanceChange}
              className="border rounded p-2 mr-2 mb-2" 
            >
              <option value="">Select Attendance</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>

            <button
              onClick={applyBulkAttendance}
              className="head1 btn button text-white pt-2 pb-2 pl-4 pr-4  "
            >
              Apply to All
            </button>
          </span>

          <span className="mb-6">
            
            <ToastContainer />
            <ReusableTable
              rows={rowData}
              columns={columns}
              rowsPerPageOptions={[5, 10, 25]}
              onCellValueChange={handleCellValueChange}
            />
          </span>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleSaveAttendance}
              className="head1 btn button text-white pt-2 pb-2 pl-4 pr-4 "
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
