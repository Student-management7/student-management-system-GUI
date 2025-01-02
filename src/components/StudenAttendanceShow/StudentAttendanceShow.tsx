import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAttendanceData, fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils";
import AttendanceTable from "./AttendanceTable";
import { ClassData } from "../../services/SaveSubjects/Type";
import { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes";
import { useNavigate } from "react-router-dom";
import "./Attendence.scss";
import  { handleApiError } from '../Utility/toastUtils'
import { sortArrayByKey } from "../Utils/sortArrayByKey";
const StudentAttendanceShow: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [classSelected, setClassSelected] = useState("");
  const [subjectSelected, setSubjectSelected] = useState("");
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([
    { field: "stdId", headerName: "Student ID", width: 120 },
    { field: "name", headerName: "Student Name", width: 150 },
    { field: "remark" , headerName: "Remark", width: 150 },
  ]);
  const [isMasterAttendanceMode, setIsMasterAttendanceMode] = useState(false);

  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true); 
      try {
        const data = await fetchClassData(); 
        if (data?.length > 0) {
          
          const sortedData = sortArrayByKey(data, "className"); 
          setClassData(sortedData); // Set the sorted data
          setClassSelected(sortedData[0].className); 
          setSubjectSelected(sortedData[0]?.subject?.[0] || ""); 
        } else {
          toast.error("No class data found.");
        }
      } catch (err) {
        handleApiError(err); 
      } finally {
        setIsLoading(false);
      }
    };
  
    loadClassData();
  }, []); 
  

  const handleFetchAttendance = useCallback(async () => {
    if (!validateAttendanceForm(fromDate, toDate, classSelected, subjectSelected)) {
      toast.warning("Please fill in all required fields with valid values.");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    if (fromDateObj > toDateObj) {
      toast.warning("From date cannot be later than To date.");
      return;
    }

    setIsLoading(true);
    try {
      const attendanceData = await fetchAttendanceData(
        fromDate,
        toDate,
        classSelected,
        subjectSelected,
        isMasterAttendanceMode
      );

      if (!attendanceData || attendanceData.length === 0) {
        toast.info("No attendance records found for the selected criteria.");
        setRowData([]);
        return;
      }

      const dateRange = getDateRange(fromDate, toDate);
      const dynamicColumns = dateRange.map((date) => ({ field: date, headerName: date, width: 100 }));

      const rows = mapAttendanceToRows(attendanceData, dateRange);

      setColumnDefs([
        { field: "stdId", headerName: "Student ID", width: 120 },
        { field: "name", headerName: "Student Name", width: 150 },
        { field: "remark" , headerName: "Remark", width: 150 },
        ...dynamicColumns,
      ]);
      setRowData(rows);
      toast.success("Attendance data fetched successfully.");
    } catch (err: any) {
      toast.error(`Failed to fetch attendance: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [fromDate,  toDate, classSelected, subjectSelected, isMasterAttendanceMode]);

  const mapAttendanceToRows = (data: AttendanceResponse[], dates: string[]): any[] => {
    const studentMap: { [id: string]: any } = {};
    data.forEach(({ date, students }) => {
      const formattedDate = date.split("T")[0];
      students.forEach(({ stdId, name, attendance }) => {
        if (!studentMap[stdId]) {
          studentMap[stdId] = { stdId, name, ...dates.reduce((acc, d) => ({ ...acc, [d]: "-" }), {}) };
        }
        studentMap[stdId][formattedDate] = attendance;
      });
    });
    return Object.values(studentMap);
  };

  const toggleAttendanceMode = () => setIsMasterAttendanceMode((prev) => !prev);

  return (
    <div className="box p-4">
      <h2 className="text-center mb-4">Student Attendance</h2>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="card p-4">

        <div className="form-group">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="attendanceModeToggle"
              checked={isMasterAttendanceMode}
              onChange={toggleAttendanceMode}
              disabled={isLoading}

            />
            <label className="form-check-label" htmlFor="attendanceModeToggle">
              {isMasterAttendanceMode ? "Master Attendance Mode" : "Subject-wise Attendance Mode"}
            </label>
          </div>
        </div>

        <div className="row">
          {/* Show Class dropdown in Master Attendance Mode */}
          {(isMasterAttendanceMode || !isMasterAttendanceMode) && (
            <div className="col-md-6">
              <label htmlFor="classSelect">Class:</label>
              <select
                id="classSelect"
                className="form-control"
                value={classSelected}
                onChange={(e) => setClassSelected(e.target.value)}
                disabled={isLoading}
              >
                {classData.map(({ className }) => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Subject dropdown only when in Subject-wise Attendance Mode */}
          {!isMasterAttendanceMode && (
            <div className="col-md-6">
              <label htmlFor="subjectSelect">Subject:</label>
              <select
                id="subjectSelect"
                className="form-control"
                value={subjectSelected}
                onChange={(e) => setSubjectSelected(e.target.value)}
                disabled={isLoading}
              >
                {classData.find(({ className }) => className === classSelected)?.subject.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="fromDate">From Date:</label>
            <input
              type="date"
              id="fromDate"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="toDate">To Date:</label>
            <input
              type="date"
              id="toDate"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-12 text-center">
            <button className="btn btn-primary" onClick={handleFetchAttendance} disabled={isLoading}>
              {isLoading ? "Loading..." : "Fetch Attendance"}
            </button>
          </div>
        </div>

        <AttendanceTable columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  );
};

export default StudentAttendanceShow;
