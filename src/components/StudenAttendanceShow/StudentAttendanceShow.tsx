import React, { useState, useEffect, useCallback } from "react";
import { fetchAttendanceData, fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils";
import type { ClassData } from "../../services/SaveSubjects/Type";
import type { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import { Switch } from '@headlessui/react';
import Loader from "../loader/loader";
import { toast, ToastContainer } from "react-toastify";
import { Pencil } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import GridView from "./GridView";
import axiosInstance from "../../services/Utils/apiUtils";

interface Student {
  id: string;
  creationDateTime: string;
  name: string;
}

const StudentAttendanceShow: React.FC = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse[]>([]);
  const [AttendanceMode, setAttendanceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudents, setCurrentStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadClassData = async () => {
      try {
        setLoading(true);
        const data = await fetchClassData();
        if (data?.length > 0) {
          const sortedData = sortArrayByKey(data, "className");
          setClassData(sortedData);
          setClassSelected("");
          setSubjectSelected("");
          setAttendanceMode(true); // Explicitly set to true on component mount
        } else {
          toast.warning("No class data found.");
        }
      } catch (err) {
        toast.warning("Failed to load class data.");
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, []);

  useEffect(() => {
    const fetchCurrentStudents = async () => {
      try {
        const response = await axiosInstance.get("/student/findAllStudent");
        setCurrentStudents(response.data);
      } catch (err) {
        toast.error("Failed to fetch current students.");
      }
    };

    fetchCurrentStudents();
  }, []);

  // In your handleFetchAttendance function
const handleFetchAttendance = useCallback(async () => {
  const attendanceModeLabel = AttendanceMode ? "Master Attendance" : "Subject-wise Attendance";

  // Validation remains the same...
  
  setLoading(true);
  try {
    const data = await fetchAttendanceData(fromDate, toDate, classSelected, subjectSelected, AttendanceMode);

    if (!data || data.length === 0) {
      toast.warning("No attendance records found for the selected criteria.");
      setAttendanceData([]);
      return;
    }

    // Create a Set of current student IDs for faster lookups
    const currentStudentIds = new Set(currentStudents.map(student => student.id));
    
    // Filter attendance data to include only current students
    const filteredData = data.map(entry => ({
      ...entry,
      students: entry.students.filter(student => 
        currentStudentIds.has(String(student.stdId))
      )
    }));

    // Filter out any dates that now have no students
    const nonEmptyDates = filteredData.filter(entry => entry.students.length > 0);

    if (nonEmptyDates.length === 0) {
      toast.warning("No attendance records found for current students.");
      setAttendanceData([]);
      return;
    }

    setAttendanceData(nonEmptyDates);
    toast.success("Attendance data fetched successfully.");
  } catch (err) {
    toast.error(`No data found on this range of time`);
  } finally {
    setLoading(false);
  }
}, [fromDate, toDate, classSelected, subjectSelected, AttendanceMode, currentStudents]);


  const handleEditButtonClick = () => {
    navigate("/studentAttendanceEdit");
  };

  // Transform attendance data for GridView
  const transformAttendanceData = () => {
    const dateRange = getDateRange(fromDate, toDate);
    const rows: any[] = [];

    // Create a map of students with their attendance for each date
    const studentMap = new Map<string, any>();
    attendanceData.forEach(entry => {
      const date = entry.date.split("T")[0];
      entry.students.forEach(student => {
        if (!studentMap.has(student.stdId)) {
          studentMap.set(student.stdId, {
            stdId: student.stdId,
            name: student.name,
            ...dateRange.reduce((acc, d) => ({ ...acc, [d]: "-" }), {}), // Initialize all dates with "-"
          });
        }
        studentMap.get(student.stdId)[date] = student.attendance;
      });
    });

    // Convert the map to an array of rows
    studentMap.forEach(value => {
      rows.push(value);
    });

    return rows;
  };

  return (
    <>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (
        <>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="box">
            <h1 className="head1 m-4">Student Attendance View</h1>
            <div className="box">
              <div className="flex items-center space-x-7 mb-10">
                <span className="text-gray-900 font-semibold">
                  {AttendanceMode ? "Master Attendance" : "Subject-wise Attendance"}
                </span>
                <Switch
                  checked={AttendanceMode}
                  onChange={setAttendanceMode}
                  disabled={loading}
                  className={`
                    float-left 
                    ${AttendanceMode ? 'bg-[#3a8686]' : 'bg-gray-200'}  // Active/Inactive track colors
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-[#126666]-500 focus:ring-offset-2 mt-1
                  `}
                >
                  <span className="sr-only">Toggle attendance mode</span>
                  <span
                    className={`${AttendanceMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>

                <span className="">
                  <button onClick={handleEditButtonClick} className="button btn">
                    <Pencil size={20} color='White' />
                  </button>
                </span>
              </div>

              <div className="row form-group">
                <div className="col-md-6">
                  <label htmlFor="classSelect" className="form-label">
                    Class:
                  </label>
                  <select
                    id="classSelect"
                    className="form-control"
                    value={classSelected}
                    onChange={(e) => setClassSelected(e.target.value)}
                    disabled={loading}
                  >
                    <option value="" disabled>
                      Select a class
                    </option>
                    {classData.map(({ className }) => (
                      <option key={className} value={className}>
                        Class {className}
                      </option>
                    ))}
                  </select>
                </div>

                {!AttendanceMode && (
                  <div className="col-md-6">
                    <label htmlFor="subjectSelect" className="form-label">
                      Subject:
                    </label>
                    <select
                      id="subjectSelect"
                      className="form-control"
                      value={subjectSelected}
                      onChange={(e) => setSubjectSelected(e.target.value)}
                      disabled={loading}
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {classData
                        .find(({ className }) => className === classSelected)
                        ?.subject.map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="row form-group">
                <div className="col-md-6">
                  <label htmlFor="fromDate" className="form-label">
                    From Date:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="toDate" className="form-label">
                    To Date:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  className="button btn"
                  onClick={handleFetchAttendance}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Fetch Attendance"}
                </button>
              </div>

              {attendanceData.length > 0 && (
                <div className="overflow-x-auto">
                  <GridView
                    columnDefs={[
                      { field: 'stdId', headerName: 'Student ID' },
                      { field: 'name', headerName: 'Student Name' },
                      ...getDateRange(fromDate, toDate).map((date) => ({
                        field: date,
                        headerName: date,
                        renderCell: (row: any) => (
                          <span>{row[date] || '-'}</span>
                        ),
                      })),
                    ]}
                    rowData={transformAttendanceData()}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentAttendanceShow;