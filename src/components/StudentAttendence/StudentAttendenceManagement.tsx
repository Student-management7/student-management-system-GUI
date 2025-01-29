import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";
import axiosInstance from "../../services/Utils/apiUtils";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";


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
          const response = await axiosInstance.get("/class/data");
          const sortedClasses = sortArrayByKey(response.data.classData, "className"); // Sort data by className
          setClasses(sortedClasses); // Set the sorted class data
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
            subject: attendanceMode === "master" ? "" : selectedSubject,
            studentList: students.map((student) => ({
                stdId: student.stdId,
                remark: student.remark || "",
                name: student.name,
                attendance: student.attendance || "Present",
            })),
            masterAttendance: attendanceMode === "master",
        };

        try {
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

    // Table columns
    const column = [
        { headerName: "SN", valueGetter: "node.rowIndex + 1", flex: 1 }, // Serial Number Column
        { headerName: "Student Name", field: "name", flex: 2 },
        {
            headerName: "Attendance",
            field: "attendance",
            flex: 2,
            cellRenderer: (params: any) => (
                <div className="flex gap-2">
                    {["Present", "Absent", "Half Day", "Late"].map((option) => (
                        <label key={option} className="flex items-center gap-1">
                            <input
                                type="radio"
                                name={`attendance-${params.data.stdId}`}
                                value={option}
                                checked={params.value === option}
                                onChange={() => params.setValue(option)}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            ),
        },
        {
            headerName: "Remarks",
            field: "remark",
            flex: 2,
            editable: true,
            cellRenderer: (params: any) => (
                <input
                    type="text"
                    value={params.value || ""}
                    onChange={(e) => params.setValue(e.target.value)}
                    placeholder="Enter remarks"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400 hover:border-gray-400 shadow-sm mb-2"
                />
            ),
        },
        
    ];

    return (

        
    <>
    {loading && <Loader />} {/* Show loader when loading */}
    {!loading && (

        <>
        
        <div className="box">
        <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Student Attendance </h1>
          </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Attendance Mode Selector */}
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

            {/* Dropdowns */}
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

          

            {/* Data Grid */}
            <div className="ag-theme-alpine" style={{ height: "400px", width: "100%", marginTop: "20px" }}>
                <AgGridReact rowData={students} columns={column} pagination={true} />
            </div>

            {/* Submit Button */}
            <button
                onClick={submitAttendance}
                disabled={students.length === 0}
                className="submit-btn px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-6"
            >
                Submit Attendance
            </button>
        </div>
        </>
    )}
    </>
    );
};

export default StudentManagementSystem;
``