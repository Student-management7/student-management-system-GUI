import { useEffect, useState } from "react";

import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";
import axiosInstance from "../../services/Utils/apiUtils";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import Loader from "../loader/loader";
import '../../global.scss'
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import { toast, ToastContainer } from "react-toastify";
import React from "react";


const StudentManagementSystem: React.FC = () => {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [AttendanceMode, setAttendanceMode] = useState<"subject" | "master">("subject");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [bulkAttendance, setBulkAttendance] = useState<string>('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);





    // Fetch class data
    const fetchClasses = async () => {
        try {
            setError("");
            setLoading(true);

            const response = await axiosInstance.get("/class/data");
            const sortedClasses = sortArrayByKey(response.data.classData, "className");
            setClasses(sortedClasses); // Set the sorted class data
            setAttendanceMode("master")
        } catch (error) {

            toast.warning("Failed to fetch class data")
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
            const endpoint = API_ENDPOINTS.STUDENT_DATA(selectedClass, AttendanceMode === "master");
            const response = await axiosInstance.get(endpoint);
            const filteredStudents = response.data.map((student: any) => ({
                stdId: student.id,
                name: student.name,
                attendance: "",
                remark: "",
            }));
            setStudents(filteredStudents);
            if (filteredStudents.length === 0) {
                toast.warning("No students found for the selected class.");
            }

        } catch (error) {

            setError("Failed to fetch student data");
            toast.error("Failed to fetch student data try again")
        } finally {
            setLoading(false);
        }
    };



    // Submit attendance
    const submitAttendance = async () => {
        const payload: AttendancePayload = {
            className: selectedClass,
            subject: AttendanceMode === "master" ? "" : selectedSubject,
            studentList: students.map((student) => ({
                stdId: student.stdId,
                remark: student.remark || "",
                name: student.name,
                attendance: student.attendance || "Absent",
            })),
            masterAttendance: AttendanceMode === "master",
        };

        try {
            const endpoint = API_ENDPOINTS.SAVE_ATTENDANCE(AttendanceMode === "master");
            const response = await axiosInstance.post(endpoint, payload);

            if (response.status === 200) {
                toast.success("Attendance submitted successfully!");
            } else {
                throw new Error("Failed to submit attendance");
            }
        } catch (error) {
            toast.error("Error submitting attendance");
        }
    };

    // In your StudentManagementSystem component
    // const handleCellValueChange = (factId: string, field: string, value: any) => {
    //     console.log(`Updating factId: ${factId}, field: ${field}, value: ${value}`);
    //     setFacultyList(prevList =>
    //       prevList.map(faculty =>
    //         faculty.fact_id === factId
    //           ? { ...faculty, [field]: value }
    //           : faculty
    //       )
    //     );
    //   };

    const handleCellValueChange = (stdId: string, field: string, value: any) => {
        console.log(`Updating stdId: ${stdId}, field: ${field}, value: ${value}`);
        setStudents(prevList =>
            prevList.map(student =>
                student.stdId === stdId
                    ? { ...student, [field]: value }
                    : student
            )
        );
    };


    const onCellValueChange = (rowIndexOrId: number | string, field: string, value: any) => {
        // Check if rowIndexOrId is a string (factId) or number (rowIndex)
        if (typeof rowIndexOrId === 'string') {
            // Handle factId-based updates
            handleCellValueChange(rowIndexOrId, field, value);
        } else {
            // Handle index-based updates
            const student = students[rowIndexOrId as number];
            if (student) {
                handleCellValueChange(student.stdId, field, value);
            }
        }
    };




    const applyBulkAttendance = (value: string) => {
        if (!value) {
            toast.warning("Please select an attendance status before applying.");
            return;
        }

        setStudents((prevList: any) =>
            prevList.map((faculty: any) => ({ ...faculty, attendance: value }))
        );
    };

    const Column = [
        {
            headerName: "Student Name",
            field: "name"
        },
        {
            headerName: "Attendance",
            field: "attendance",
            editable: true,
            cellRenderer: (params: any) => {
                const stdId = params.data.stdId;
                const student = students.find((student: any) => student.stdId === stdId);
                const currentValue = student ? student.attendance : "";

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
                                        // Update the state directly
                                        setStudents((prevList: any) =>
                                            prevList.map((student: any) =>
                                                student.stdId === stdId
                                                    ? { ...student, attendance: option }
                                                    : student
                                            )
                                        );
                                        // Force refresh the component
                                        setRefreshKey((prev) => prev + 1);
                                        // Attempt to update the table if possible
                                        if (typeof params.setValue === "function") {
                                            params.setValue(option);
                                        }
                                    }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                );
            },
        },

        {
            headerName: "Remarks",
            field: "remark",
            editable: true,
            cellRenderer: (params: any) => (
                <input
                    type="text"
                    value={params.value || ""}
                    onChange={(e) => params.setValue(e.target.value)}
                    placeholder="Enter remarks"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            ),
        },
    ];

    return (


        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {loading && <Loader />} {/* Show loader when loading */}
            {!loading && (

                <div className="box">
                    <div className="box grid grid-cols-1 gap-6 p-6">

                        {/* <h1 className="head1Class Fee Page">Student Attendance</h1> */}
                        <h1 className="head1">Student Attendance</h1>

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="attendance-mode-selector flex items-center space-x-4">
                                <span className="font-medium">
                                    {AttendanceMode === "subject" ? "Subject-Wise Attendance" : "Master Attendance"}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={AttendanceMode === "master"}
                                        onChange={() =>
                                            setAttendanceMode(AttendanceMode === "subject" ? "master" : "subject")
                                        }
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#3a8686] dark:peer-focus:ring-[#3a8686] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3a8686]"></div>
                                </label>
                            </div>

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
                                hidden={AttendanceMode === "master"}

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
                                className="fetch-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 button"
                            >
                                {loading ? "Loading..." : "Fetch Students"}
                            </button>

                        </div>


                        <div className="mt-2">


                            <div className="bulk-attendance flex items-center space-x-4 float-right">
                                <select
                                    value={bulkAttendance}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        setBulkAttendance(selectedValue);
                                        applyBulkAttendance(selectedValue); // Apply the correct selected value
                                    }}
                                    className="border rounded-md px-4 py-2"
                                >
                                    <option value="">Select Attendance</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="Late">Late</option>
                                    <option value="Leave">Leave</option>
                                </select>
                            </div>

                            <div className="mt-2">

                                <ReusableTable
                                    rows={students}
                                    columns={Column}
                                    rowsPerPageOptions={[5, 10, 20,30]}
                                    onCellValueChange={onCellValueChange}
                                    page={currentPage}
                                    onPageChange={(newPage: React.SetStateAction<number>) => setCurrentPage(newPage)}
                                />
                            </div>

                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={submitAttendance}
                                disabled={students.length === 0}
                                className="mt-4 button py-2 px-4 bg-[#27727A] text-white"
                            >
                                Submit Attendance
                            </button>
                        </div>
                    </div>
                </div>


            )}
        </>
    );
};

export default StudentManagementSystem;