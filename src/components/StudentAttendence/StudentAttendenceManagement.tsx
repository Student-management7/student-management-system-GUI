import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";
import axiosInstance from "../../services/Utils/apiUtils";

const StudentManagementSystem: React.FC = () => {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceMode, setAttendanceMode] = useState<"subject" | "master">("subject");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Fetch class data
    const fetchClasses = async () => {
        try {
            setError("");
            setLoading(true);
            const response = await axiosInstance.get(API_ENDPOINTS.CLASS_DATA);
            setClasses(response.data.classData);
        } catch (error) {
            setError("Failed to fetch class data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Handle class change
    const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClassName = event.target.value;
        setSelectedClass(selectedClassName);
        const classData = classes.find((cls) => cls.className === selectedClassName);
        setSubjects(classData ? classData.subject : []);
    };

    // Handle subject change
    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(event.target.value);
    };

    // Fetch students based on attendance mode
    const fetchStudents = async () => {
        if (!selectedClass) return;
        try {
            setError("");
            setLoading(true);
            const endpoint = API_ENDPOINTS.STUDENT_DATA(selectedClass, attendanceMode === "master");
            const response = await axiosInstance.get(endpoint);
            const filteredStudents = response.data.map((student: any) => ({
                stdId: student.id,
                name: student.name,
                attendance: "Present",
            }));
            setStudents(filteredStudents);
        } catch (error) {
            setError("Failed to fetch student data");
        } finally {
            setLoading(false);
        }
    };

    // Submit attendance
  const submitAttendance = async () => {
    const payload: AttendancePayload = {
      className: selectedClass,
      subject: attendanceMode === "master" ? "" : selectedSubject, // Empty string for master attendance
      studentList: students.map((student) => ({
        stdId: student.stdId,
        attendance: student.attendance || "Present",
      })),
      masterAttendance: false
    };

    try {
        // Include masterAttendance as a query parameter
        const endpoint = API_ENDPOINTS.SAVE_ATTENDANCE(attendanceMode === "master");
        const response = await axiosInstance.post(endpoint, payload);

        if (response.status === 200) {
            alert("Attendance submitted successfully!");
        } else {
            throw new Error("Failed to submit attendance");
        }
    } catch (error) {
        alert("Error submitting attendance: " + error);
    }
};

  

    const columns = [
        { headerName: "Serial Number", valueGetter: "node.rowIndex + 1", flex: 1 },
        { headerName: "Student ID", field: "stdId", flex: 1 },
        { headerName: "Student Name", field: "name", flex: 2 },
        {
            headerName: "Attendance",
            field: "attendance",
            cellRenderer: (params: any) => (
                <select
                    value={params.value || "Present"}
                    onChange={(e) => {
                        params.setValue(e.target.value);
                    }}
                    className="border border-gray-300 rounded p-1 focus:outline-none"
                >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            ),
            flex: 1,
        },
    ];

    return (
        <div className="box">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Student Attendance</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Radio Button to Toggle Attendance Mode */}
            <div className="attendance-mode-selector mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        name="attendanceMode"
                        value="subject"
                        checked={attendanceMode === "subject"}
                        onChange={() => setAttendanceMode("subject")}
                    />{" "}
                    Subject-Wise Attendance
                </label>
                <label>
                    <input
                        type="radio"
                        name="attendanceMode"
                        value="master"
                        checked={attendanceMode === "master"}
                        onChange={() => setAttendanceMode("master")}
                    />{" "}
                    Master Attendance
                </label>
            </div>

            <div className="dropdowns-container flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    className="custom-dropdown p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls.className} value={cls.className}>
                            Class {cls.className}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    disabled={attendanceMode === "master"}
                    className="custom-dropdown p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Subject</option>
                    {subjects.map((sub, index) => (
                        <option key={index} value={sub}>
                            {sub}
                        </option>
                    ))}
                </select>

                <button
                    onClick={fetchStudents}
                    disabled={!selectedClass}
                    className="fetch-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? "Loading..." : "Fetch Students"}
                </button>
            </div>

            <div className="ag-theme-alpine" style={{ height: "400px", width: "100%", marginTop: "20px" }}>
                <AgGridReact rowData={students} columnDefs={columns} pagination={true} />
            </div>

            <button
                onClick={submitAttendance}
                disabled={students.length === 0}
                className="submit-btn mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                Submit Attendance
            </button>
        </div>
    );
};

export default StudentManagementSystem;
