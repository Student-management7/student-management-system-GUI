import React, { useState, useEffect } from "react";
import { fetchAttendanceData, fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils";
import './Attendence.scss';
import AttendanceTable from "./AttendanceTable";
import { ClassData } from "../../services/SaveSubjects/Type";
import { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes";
import { useNavigate } from 'react-router-dom';
import { styleText } from "util";
import { color } from "framer-motion";

const StudentAttendanceShow: React.FC = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState<string>("");
  const [subjectSelected, setSubjectSelected] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("2024-11-07");
  const [toDate, setToDate] = useState<string>("2024-11-10");
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { field: "stdId", headerName: "Student ID" },
    { field: "name", headerName: "Student Name" },
  ]);

  const [errorMessage, setErrorMessage] = useState<string>(""); // New state for error messages

  // Class data load
  useEffect(() => {
    const loadClassData = async () => {
      try {
        const data = await fetchClassData();
        setClassData(data);
        if (data.length > 0) {
          setClassSelected(data[0].className);
          setSubjectSelected(data[0].subject[0]);
        }
      } catch (error) {
        setErrorMessage("Failed to load class data. Please try again.");
        console.error("Failed to fetch class data:", error);
      }
    };

    loadClassData();
  }, []);

  useEffect(() => {
    handleFetchAttendance();
  }, [classSelected, subjectSelected, fromDate, toDate]);

  // Fetch attendance data
  const handleFetchAttendance = async () => {
    if (!validateAttendanceForm(fromDate, toDate, classSelected, subjectSelected)) {
      return;
    }

    try {
      const attendanceData = await fetchAttendanceData(
        fromDate,
        toDate,
        classSelected,
        subjectSelected
      );

      const dateRange = getDateRange(fromDate, toDate);
      const dynamicColumns = dateRange.map((date) => ({
        field: date,
        headerName: date,
      }));

      const rows = mapAttendanceToRows(attendanceData, dateRange);

      setColumnDefs([
        { field: "stdId", headerName: "Student ID" },
        { field: "name", headerName: "Student Name" },
        ...dynamicColumns
      ]);
      setRowData(rows);
    } catch (error) {
      setErrorMessage(`Failed to fetch attendance. Please check your inputs and try again. ;`);
      console.error("Failed to fetch attendance:", error);
    }
  };

  const mapAttendanceToRows = (data: AttendanceResponse[], dates: string[]): any[] => {
    const studentMap: { [id: string]: any } = {};

    data.forEach((entry) => {
      const date = entry.date.split("T")[0];
      entry.students.forEach((student) => {
        if (!studentMap[student.stdId]) {
          studentMap[student.stdId] = { stdId: student.stdId, name: student.name };
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
    if (selectedClassData && selectedClassData.subject.length > 0) {
      setSubjectSelected(selectedClassData.subject[0]);
    } else {
      setSubjectSelected("");
    }
  };

  const handleEditRedirect = () => {
    navigate('/studentAttendanceEdit');
  };

  return (
    <div className="box">
      <div className="filters">
        <label>Class:</label>
        <select value={classSelected} onChange={handleClassSelect}>
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
        />
        <label>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={handleFetchAttendance}>Fetch Attendance</button>

        <span className="buttons ml-3">
          <button
            onClick={handleEditRedirect}
            className="bi bi-pencil-square red-button"
          >
          </button>
        </span>
      </div>

      {errorMessage && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Close</button>
        </div>
      )}

      <div className="attendance-table">
        <AttendanceTable rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default StudentAttendanceShow;
