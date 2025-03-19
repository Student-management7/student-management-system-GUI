import React, { useState, useEffect, useCallback } from "react";
import { fetchClassData, fetchAttendanceData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import type { ClassData } from "../../services/SaveSubjects/Type";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import { Switch } from '@headlessui/react';
import ReusableTable from "./Table/Table";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";
import { toast, ToastContainer } from "react-toastify";
import { formatToDDMMYYYY, } from "../Utils/dateUtils";
import axiosInstance from "../../services/Utils/apiUtils";

interface CurrentStudent {
  id: string;
  creationDateTime: string;
  name: string;
}

interface Student {
  stdId: string;
  name: string;
  attendance: string;
  remark: string | null;
}

interface AttendanceRecord {
  date: string;
  students: Student[];
}

const StudentAttendanceEdit: React.FC = () => {
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [editedStudentList, setEditedStudentList] = useState<Student[]>([]);
  const [attendanceMode, setAttendanceMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentStudents, setCurrentStudents] = useState<CurrentStudent[]>([]);

  // Fetch class data on component mount
  useEffect(() => {
    const loadClassData = async () => {
      try {
        setLoading(true);
        const data = await fetchClassData();
        if (data?.length > 0) {
          const sortedData = sortArrayByKey(data, "className");
          setClassData(sortedData);
        } else {
          toast.warning("No class data found.");
        }
      } catch (err) {
        toast.error("Failed to load class data.");
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, []);

  // Fetch current students
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

  // Handle fetch attendance button click
 
// Update the fetch attendance function to use only fromDate
const handleFetchAttendance = useCallback(async () => {
  const attendanceModeLabel = attendanceMode ? "Master Attendance" : "Subject-wise Attendance";

  const isFormValid = attendanceMode
    ? validateAttendanceForm(fromDate, fromDate, classSelected, "", attendanceModeLabel) // Use fromDate for both from and to dates
    : validateAttendanceForm(fromDate, fromDate, classSelected, subjectSelected, attendanceModeLabel);

  if (!isFormValid) {
    toast.warning("Please fill in all required fields with valid values.");
    return;
  }

  setAttendanceData([]);
  setEditedStudentList([]);


  setLoading(true);
  try {
    const data = await fetchAttendanceData(
      fromDate,
      fromDate, // Use fromDate for both from and to dates
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

    // Filter attendance data to include only current students
    const currentStudentIds = new Set(currentStudents.map(student => student.id));
    const filteredData = data.map((record: any) => ({
      date: record.date,
      students: record.students.filter((student: any) =>
        currentStudentIds.has(String(student.stdId))
      ),
    }));

    setAttendanceData(filteredData);
    setEditedStudentList(filteredData[0]?.students || []);
    toast.success("Attendance data fetched successfully.");
  } catch (err) {
    console.error("Error fetching attendance data:", err);
    toast.error("No data found for this date.");
  } finally {
    setLoading(false);
  }
}, [fromDate, classSelected, subjectSelected, attendanceMode, currentStudents]);
  // Handle cell value changes
  const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
    setEditedStudentList((prevStudents) => {
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
        const stdId = params.data.stdId;
        const student = editedStudentList.find((student: Student) => student.stdId === stdId);
        const currentValue = student ? student.attendance : "Present";

        return (
          <div className="flex gap-2" key={`${stdId}-${refreshKey}`}>
            {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`attendance-${stdId}`}
                  value={option}
                  checked={currentValue === option}
                  onChange={() => {
                    setEditedStudentList((prevList: Student[]) =>
                      prevList.map((student: Student) =>
                        student.stdId === stdId
                          ? { ...student, attendance: option }
                          : student
                      )
                    );
                    setRefreshKey((prev) => prev + 1);
                    if (typeof params.setValue === "function") {
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

  const rowData = editedStudentList.map((student, index) => ({
    ...student,
    rowIndex: index,
  }));

  return (
    <>

      <ToastContainer position="top-right" autoClose={3000} />
        {loading && <Loader />}   
        {!loading && (
      <div className="box">
        <div className="flex items-center space-x-4 mb-4">
          <span>
            <BackButton />
          </span>
          <h1 className="head1">Student Attendance Update</h1>
        </div>

        <div className="box">
          {/* Attendance Mode Toggle */}
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

          {/* Class and Subject Selection */}
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
                  setSubjectSelected("");
                  setAttendanceData([]);
                  setEditedStudentList([]);
                }}
                disabled={loading || classData.length === 0}
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
                    setAttendanceData([]);
                    setEditedStudentList([]);
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

          {/* Date Range Selection */}
          <div className="row form-group">
            <div className="col-md-6">
              <label htmlFor="fromDate" className="form-label">
                Date:
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
          </div>

          {/* Fetch Attendance Button */}
          <div className="text-center mt-4">
            <button
              className="button btn"
              onClick={handleFetchAttendance}
            >
              {loading ? "Loading..." : "Fetch Attendance"}
            </button>
          </div>

          {/* Attendance Table */}
          {!loading && editedStudentList.length > 0 && (
            <div className="mt-4">
             
              <ReusableTable
                rows={rowData}
                columns={columnDefs}
                onCellValueChange={handleCellValueChange}
              />
            </div>
          )}

          {/* Save Button */}
          {!loading && editedStudentList.length > 0 && (
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
      </div>
      )}
    </>
  );
};

export default StudentAttendanceEdit;