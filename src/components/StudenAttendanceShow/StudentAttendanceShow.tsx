import React, { useState, useEffect, useCallback } from "react";
import { fetchAttendanceData, fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils";
import './Attendence.scss';
import AttendanceTable from "./AttendanceTable";
import { ClassData } from "../../services/SaveSubjects/Type";
import { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes";
import { useNavigate } from 'react-router-dom';

const StudentAttendanceShow: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState<string>("");
  const [subjectSelected, setSubjectSelected] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { field: "stdId", headerName: "Student ID" },
    { field: "name", headerName: "Student Name" },
  ]);
  const [error, setError] = useState<{
    message: string;
    type: 'error' | 'warning' | 'info';
  } | null>(null);

  // Debounced error clearing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Load class data
  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchClassData();
        if (data && data.length > 0) {
          setClassData(data);
          setClassSelected(data[0].className);
          if (data[0].subject && data[0].subject.length > 0) {
            setSubjectSelected(data[0].subject[0]);
          }
        } else {
          setError({
            message: "No classes available. Please add classes first.",
            type: 'warning'
          });
        }
      } catch (error) {
        setError({
          message: "Failed to load class data. Please try again later.",
          type: 'error'
        });
        console.error("Failed to fetch class data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassData();
  }, []);

  // Memoized fetch attendance function
  const handleFetchAttendance = useCallback(async () => {
    if (!validateAttendanceForm(fromDate, toDate, classSelected, subjectSelected)) {
      setError({
        message: "Please fill in all required fields with valid values.",
        type: 'warning'
      });
      return;
    }

    // Validate date range
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    if (fromDateObj > toDateObj) {
      setError({
        message: "From date cannot be later than To date",
        type: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const attendanceData = await fetchAttendanceData(
        fromDate,
        toDate,
        classSelected,
        subjectSelected
      );

      if (!attendanceData || attendanceData.length === 0) {
        setError({
          message: "No attendance records found for the selected criteria.",
          type: 'info'
        });
        setRowData([]);
        return;
      }

      const dateRange = getDateRange(fromDate, toDate);
      const dynamicColumns = dateRange.map((date) => ({
        field: date,
        headerName: date,
        width: 100,
      }));

      const rows = mapAttendanceToRows(attendanceData, dateRange);
      
      setColumnDefs([
        { field: "stdId", headerName: "Student ID", width: 120 },
        { field: "name", headerName: "Student Name", width: 150 },
        ...dynamicColumns
      ]);
      setRowData(rows);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError({
        message: `Failed to fetch attendance: ${errorMessage}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, classSelected, subjectSelected]);

  // Fetch attendance when dependencies change
  useEffect(() => {
    if (classSelected && subjectSelected) {
      handleFetchAttendance();
    }
  }, [handleFetchAttendance]);

  const mapAttendanceToRows = (data: AttendanceResponse[], dates: string[]): any[] => {
    const studentMap: { [id: string]: any } = {};

    data.forEach((entry) => {
      const date = entry.date.split("T")[0];
      entry.students.forEach((student) => {
        if (!studentMap[student.stdId]) {
          studentMap[student.stdId] = {
            stdId: student.stdId,
            name: student.name,
            ...dates.reduce((acc, date) => ({ ...acc, [date]: '-' }), {})
          };
        }
        studentMap[student.stdId][date] = student.attendance;
      });
    });

    return Object.values(studentMap);
  };

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = e.target.value;
    setClassSelected(selectedClass);
  
    const selectedClassData = classData.find((cls) => cls.className === selectedClass);
    
    // Check if selectedClassData exists and has subject array
    if (selectedClassData && Array.isArray(selectedClassData.subject) && selectedClassData.subject.length > 0) {
      setSubjectSelected(selectedClassData.subject[0]);
    } else {
      setSubjectSelected("");
      setErrorMessage("No subjects available for selected class");
    }
  };

  const handleEditRedirect = () => {
    navigate('/studentAttendanceEdit');
  };

  return (
    <div className="box">
      <div className="filters">
        <label>Class:</label>
        <select 
          value={classSelected} 
          onChange={handleClassSelect}
          disabled={isLoading}
        >
          {classData.map((classItem) => (
            <option key={classItem.className} value={classItem.className}>
              Class {classItem.className}
            </option>
          ))}
        </select>

        <label>Subject:</label>
        <select
          value={subjectSelected}
          onChange={(e) => setSubjectSelected(e.target.value)}
          disabled={isLoading || !classSelected}
        >
          {classData
            .find((cls) => cls.className === classSelected)
            ?.subject.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
        </select>

        <label>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          disabled={isLoading}
          max={toDate}
        />
        <label>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          disabled={isLoading}
          min={fromDate}
        />

        <button 
          onClick={handleFetchAttendance}
          disabled={isLoading || !classSelected || !subjectSelected}
        >
          {isLoading ? 'Loading...' : 'Fetch Attendance'}
        </button>

        <span className="buttons ml-3">
          <button
            onClick={handleEditRedirect}
            className="bi bi-pencil-square red-button"
            disabled={isLoading}
          >
          </button>
        </span>
      </div>

      {error && (
        <div className={`notification ${error.type}`}>
          <p>{error.message}</p>
          <button onClick={() => setError(null)} className="close-button">
            ×
          </button>
        </div>
      )}

      <div className="attendance-table">
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <AttendanceTable rowData={rowData} columnDefs={columnDefs} />
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceShow;

function setErrorMessage(arg0: string) {
  throw new Error("Function not implemented.");
}
