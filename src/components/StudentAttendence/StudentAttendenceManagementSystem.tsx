// src/components/StudentManagementSystem.tsx
import { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from "axios";
import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";

const StudentManagementSystem: React.FC = () => {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchClasses = async () => {
        try {
            setError("");
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.CLASS_DATA);
            setClasses(response.data.classData);
        } catch (error) {
            setError("Failed to fetch classes data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClassName = event.target.value;
        setSelectedClass(selectedClassName);
        const selectedClassData = classes.find(c => c.className === selectedClassName);
        setSubjects(selectedClassData ? selectedClassData.subject : []);
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };

    const fetchStudents = async () => {
        if (!selectedClass) return;
        try {
            setError("");
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.STUDENT_DATA(selectedClass));
            const filteredStudents = response.data.map((student: any) => ({
                stdId: student.id,
                name: student.name,
                attendance: "Present",
            }));
            setStudents(filteredStudents);
        } catch (error) {
            setError("Failed to fetch students data");
        } finally {
            setLoading(false);
        }
    };

    const submitAttendance = async () => {
        const payload: AttendancePayload = {
            className: selectedClass,
            subject: selectedSubject,
            studentList: students.map(student => ({
                stdId: student.stdId,
                attendance: student.attendance || "Present",
            })),
        };

        try {
            const response = await axios.post(API_ENDPOINTS.SAVE_ATTENDANCE, payload);
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
        <div className="student-management max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 mb-25">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Student Attendance</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

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
                    disabled={!selectedClass}
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
                    disabled={!selectedClass || !selectedSubject}
                    className="fetch-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? "Loading..." : "Fetch Students"}
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading...</p>}

            <div className="ag-theme-alpine table-container" style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                <AgGridReact
                    rowData={students}
                    columnDefs={columns}
                    pagination={true}
                />
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
