import React from "react";
import { useState, useEffect, useCallback } from "react";
import { fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import type { ClassData } from "../../services/SaveSubjects/Type";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import { Switch } from '@headlessui/react';
import ReusableTable from "./Table/Table";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";
import { toast, ToastContainer } from "react-toastify";
import { formatToDDMMYYYY, formatDateToAPIFormat } from "../Utils/dateUtils";
import axiosInstance from "../../services/Utils/apiUtils";

// Define proper types based on the actual API response
interface Student {
  stdId: string;
  name: string;
  attendance: string;
  remark: string;
}

interface AttendanceRecord {
  date: string;
  students: Student[];
}

const StudentAttendanceEdit: React.FC = () => {
  // State variables
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [editedStudentList, setEditedStudentList] = useState<Student[]>([]);
  const [attendanceMode, setAttendanceMode] = useState(true); // Default to true (Master Attendance)
  const [loading, setLoading] = useState(false);

  // Load class data on component mount
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
        } else {
          toast.warning("No class data found.");
        }
      } catch (err) {
        toast.error("Failed to load class data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, []);

  // Update editedStudentList whenever attendance data changes
  useEffect(() => {
    if (attendanceData.length > 0 && attendanceData[0]?.students) {
      // Use the students array from the API response
      setEditedStudentList(attendanceData[0].students.map(student => ({
        ...student,
        attendance: student.attendance || "Present", // Default to Present if not set
        remark: student.remark || ""
      })));
    } else {
      setEditedStudentList([]);
    }
  }, [attendanceData]);

  // Custom function to fetch attendance data
  const fetchAttendanceData = async (fromDate: string, toDate: string, className: string, subject: string, isMasterAttendance: boolean) => {
    // Format dates from YYYY-MM-DD to DD/MM/YYYY for API
    const formattedFromDate = formatDateToAPIFormat(fromDate);
    const formattedToDate = formatDateToAPIFormat(toDate);
    
    const response = await axiosInstance.post(
      `/attendance/getAttendance?cls=${className}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&subject=${subject}&masterAttendance=${isMasterAttendance}`
    );
    
    return response.data;
  };

  // Fetch attendance data
  const handleFetchAttendance = useCallback(async () => {
    const attendanceModeLabel = attendanceMode ? "Master Attendance" : "Subject-wise Attendance";

    // Adjust validation based on attendance mode
    const isFormValid = attendanceMode
      ? validateAttendanceForm(fromDate, toDate, classSelected, "", attendanceModeLabel)
      : validateAttendanceForm(fromDate, toDate, classSelected, subjectSelected, attendanceModeLabel);

    if (!isFormValid) {
      toast.warning("Please fill in all required fields with valid values.");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Validate date range
    if (fromDateObj > toDateObj) {
      toast.warning("From date cannot be later than To date.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAttendanceData(
        fromDate, 
        toDate, 
        classSelected, 
        subjectSelected, 
        attendanceMode
      );

      if (!data || data.length === 0) {
        toast.warning("No attendance records found for the selected criteria.");
        setAttendanceData([]);
        setEditedStudentList([]);
        return;
      }

      console.log("Fetched attendance data:", data);
      setAttendanceData(data);
      toast.success("Attendance data fetched successfully.");
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      toast.error("No data found for this time range");
      setAttendanceData([]);
      setEditedStudentList([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, classSelected, subjectSelected, attendanceMode]);

  // Handle cell value changes
  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    setEditedStudentList(prevStudents => {
      if (rowIndex >= 0 && rowIndex < prevStudents.length) {
        const newStudents = [...prevStudents];
        newStudents[rowIndex] = {
          ...newStudents[rowIndex],
          [field]: value,
        };
        return newStudents;
      }
      return prevStudents;
    });
  };

  // Save edited attendance
  const saveEditedAttendance = async () => {
    if (editedStudentList.length === 0 || attendanceData.length === 0) {
      toast.warning("No attendance data to save.");
      return;
    }

    try {
      setLoading(true);
      
      // Extract date from the first attendance record
      const date = attendanceData[0]?.date || fromDate;
      
      const payload = {
        date: formatToDDMMYYYY(date),
        className: classSelected,
        subject: attendanceMode ? '' : subjectSelected,
        studentList: editedStudentList.map((student) => ({
          stdId: student.stdId,
          name: student.name,
          attendance: student.attendance,
          remark: student.remark || '',
        })),
      };

      console.log("Saving attendance with payload:", payload);

      await axiosInstance.post(
        `/attendance/update?masterAttendance=${attendanceMode}`,
        payload
      );
      
      toast.success('Attendance updated successfully!');
    } catch (err) {
      console.error("Error saving attendance:", err);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Column definitions for the table
  const columnDefs = [
    { headerName: 'Student Name', field: 'name', editable: false },
    {
      headerName: 'Attendance',
      field: 'attendance',
      editable: true,
      cellRenderer: (params: any) => {
        const [selectedValue, setSelectedValue] = React.useState(params.value || "Present");

        React.useEffect(() => {
          setSelectedValue(params.value || "Present");
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
          onChange={(e) => {
            params.setValue(e.target.value);
            handleCellValueChange(params.rowIndex, 'remark', e.target.value);
          }}
          placeholder="Enter remarks"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ),
    },
  ];

  // Prepare row data for the table
  const rowData = editedStudentList.map((student, index) => ({
    ...student,
    rowIndex: index,
  }));

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <ToastContainer position="top-right" autoClose={3000} />

          <div className="box">
            <div className="flex items-center space-x-4 mb-4">
              <span>
                <BackButton />
              </span>
              <h1 className="head1">Student Attendance Update</h1>
            </div>

            <div className="box">
              <div className="flex items-center space-x-7 mb-10">
                <span className="text-gray-900 font-semibold">
                  {attendanceMode ? "Master Attendance" : "Subject-wise Attendance"}
                </span>
                <Switch
                  checked={attendanceMode}
                  onChange={setAttendanceMode}
                  disabled={loading}
                  className={`
                    float-left 
                    ${attendanceMode ? 'bg-[#3a8686]' : 'bg-gray-200'}
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-[#126666]-500 focus:ring-offset-2 mt-1
                  `}
                >
                  <span className="sr-only">Toggle attendance mode</span>
                  <span
                    className={`${attendanceMode ? 'translate-x-6' : 'translate-x-1'} 
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
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
                    onChange={(e) => {
                      setClassSelected(e.target.value);
                      setSubjectSelected(""); // Reset subject when class changes
                      setAttendanceData([]); // Clear attendance data when class changes
                      setEditedStudentList([]); // Clear edited student list
                    }}
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

                {!attendanceMode && (
                  <div className="col-md-6">
                    <label htmlFor="subjectSelect" className="form-label">
                      Subject:
                    </label>
                    <select
                      id="subjectSelect"
                      className="form-control"
                      value={subjectSelected}
                      onChange={(e) => {
                        setSubjectSelected(e.target.value);
                        setAttendanceData([]); // Clear attendance data when subject changes
                        setEditedStudentList([]); // Clear edited student list
                      }}
                      disabled={loading || !classSelected}
                    >
                      <option value="" disabled>
                        Select a subject
                      </option>
                      {classData
                        .find(({ className }) => className === classSelected)
                        ?.subject?.map((subj) => (
                          <option key={subj} value={subj}>
                            {subj}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="row form-group d-flex align-items-end">
                <div className="col-md-6">
                  <label htmlFor="fromDate" className="form-label">
                    From Date:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setToDate(e.target.value); // Set "to date" to match "from date" initially
                      setAttendanceData([]); // Clear attendance data when date changes
                      setEditedStudentList([]); // Clear edited student list
                    }}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end my-2">
                  <button
                    className="button btn"
                    onClick={handleFetchAttendance}
                    disabled={loading || !classSelected}
                  >
                    {loading ? "Loading..." : "Fetch Attendance"}
                  </button>
                </div>
              </div>

              {editedStudentList.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Attendance for {attendanceData[0]?.date ? new Date(attendanceData[0].date).toLocaleDateString() : fromDate}
                  </h2>
                  <ReusableTable
                    rows={rowData}
                    columns={columnDefs}
                    onCellValueChange={handleCellValueChange}
                  />
                </div>
              )}
              
              {editedStudentList.length === 0 && attendanceData.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 rounded">
                  <p className="text-yellow-800">No student data found in the attendance record.</p>
                </div>
              )}
            </div>

            {editedStudentList.length > 0 && (
              <div className='flex justify-center mt-4 mb-4'>
                <button
                  onClick={saveEditedAttendance}
                  className="button btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};


export default StudentAttendanceEdit;