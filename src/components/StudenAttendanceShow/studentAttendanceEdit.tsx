import React, { useState, useEffect } from "react";
import { fetchAttendanceData, fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation";
import "./Attendence.scss";
import AttendanceTable from "./AttendanceTable";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const StudentAttendanceEdit: React.FC = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any[]>([]);
  const [classSelected, setClassSelected] = useState<string>("");
  const [subjectSelected, setSubjectSelected] = useState<string>("");
  const [date, setDate] = useState<string>("2024-11-07");
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading
    const loadClassData = async () => {
      try {
        const data = await fetchClassData();
        setClassData(data);

        if (data.length > 0) {
          setClassSelected(data[0].className);
          setSubjectSelected(data[0].subject[0] || "");
        }
      } catch (error: any) {
        console.error("Failed to fetch class data:", error);
        toast.error(`Error fetching class data: ${error.message || "Unknown error"}`);
      }
    };

    loadClassData();
  }, []);

  useEffect(() => {
    if (classSelected && subjectSelected && date) handleFetchAttendance();
  }, [classSelected, subjectSelected, date]);

  const handleFetchAttendance = async () => {
    if (!validateAttendanceForm(date, date, classSelected, subjectSelected)) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      const attendanceData = await fetchAttendanceData(date, date, classSelected, subjectSelected);

      if (!attendanceData || attendanceData.length === 0) {
        toast.warning(`No attendance data found for ${date}.`);
        setRowData([]); // Clear the table if no data is found
        return;
      }

      const rows = mapAttendanceToRows(attendanceData, date);

      setColumnDefs([
        { field: "stdId", headerName: "Student ID" },
        { field: "name", headerName: "Student Name" },
        {
          field: date,
          headerName: "Attendance",
          cellStyle: (params: { value: string }) => ({
            backgroundColor: params.value === "Present" ? "#FFFFFF" : "#FFFFFF",
            color: params.value === "Present" ? "#3C763D" : "#A94442",
          }),
        },
        {
          field: "edit",
          headerName: "Actions",
          cellRenderer: (params: any) => (
            <button
              className="edit-button"
              onClick={() =>
                handleEditButtonClick(params.data.stdId, date, params.data.attendanceDetails)
              }
            >
              Edit
            </button>
          ),
        },
      ]);

      setRowData(rows);
    } catch (error: any) {
      console.error("Failed to fetch attendance:", error);
      toast.error(`Error fetching attendance: ${error.message || "Unknown error"}`);
    }
  };
  

  const mapAttendanceToRows = (data: any[], date: string): any[] => {
    return data.flatMap((entry) =>
      entry.students.map((student: any) => ({
        name: student.name,
        stdId: student.stdId,
        attendanceDetails: entry.students,
        [date]: student.attendance,
      }))
    );
  };

  const handleEditButtonClick = (id: string, date: string, attendanceDetails: any[]) => {
    navigate("/studentAttendanceEditSave", {
      state: { 
        studentData: attendanceDetails, 
        date, 
        className: classSelected, 
        subject: subjectSelected 
      },
    });
    
  };
  

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = e.target.value;
    setClassSelected(selectedClass);

    const selectedClassData = classData.find((cls) => cls.className === selectedClass);
    setSubjectSelected(selectedClassData?.subject[0] || "");
  };

  return (
    <>
   <ToastContainer/>
   <div className="box">
      
      <div className="filters">
        <label>Class:</label>
        <select value={classSelected} onChange={handleClassSelect}>
          {classData.map((classItem) => (
            <option key={classItem.className} value={classItem.className}>
              {classItem.className}
            </option>
          ))}
        </select>

        <label>Subject:</label>
        <select value={subjectSelected} onChange={(e) => setSubjectSelected(e.target.value)}>
          {classData
            .find((cls) => cls.className === classSelected)
            ?.subject.map((subject: string) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
        </select>

        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <button className="btn button" onClick={handleFetchAttendance}>Fetch Attendance</button>
      </div>

      <div className="attendance-table">
        <AttendanceTable rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
    </>
  );
};

export default StudentAttendanceEdit;
