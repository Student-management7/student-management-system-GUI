import { useEffect, useState } from "react";

import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";
import axiosInstance from "../../services/Utils/apiUtils";
import { sortArrayByKey } from "../Utils/sortArrayByKey";
import Loader from "../loader/loader";
import BackButton from "../Navigation/backButton";
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

    const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
        setStudents(prevStudents => {
            // Ensure rowIndex is within bounds
            if (rowIndex >= 0 && rowIndex < prevStudents.length) {
                const newStudents = [...prevStudents];
                newStudents[rowIndex] = {
                    ...newStudents[rowIndex],
                    [field]: value
                };
                console.log('Updated students:', newStudents);
                return newStudents;
            } else {
                console.error('Invalid rowIndex:', rowIndex);
                return prevStudents;
            }
        });
    };



    const applyBulkAttendance = (value: string) => {
        if (!bulkAttendance) {
            toast.warning("Please select an attendance status before applying.");
            return;
        }


        setStudents((prevList: any) =>
            prevList.map((faculty: any) => ({ ...faculty, attendance: bulkAttendance }))
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
                // Use a local state to manage the radio button's checked state
                const [selectedValue, setSelectedValue] = React.useState(params.value);

                React.useEffect(() => {
                    // Sync the local state with the params.value
                    setSelectedValue(params.value);
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
                                        // Update the local state immediately
                                        setSelectedValue(option);
                                        // Call the setValue function to update the parent state
                                        params.setValue(option);
                                        // Call the handleCellValueChange function
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
                        
                            <h1 className="head1Class Fee Page">Student Attendance</h1>
                       

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


                        <div className="overflow-x-auto">


                            <div className="bulk-attendanceflex items-center space-x-4 float-right ">
                                <select
                                    value={bulkAttendance}
                                    onChange={(e) => {
                                        setBulkAttendance(e.target.value);
                                        applyBulkAttendance(e.target.value); // Directly apply attendance
                                    }}
                                    className="border rounded-md px-4 py-2 "
                                >
                                    <option value="">Select Attendance</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="Leave">Leave</option>
                                </select>
                            </div>

                            <ReusableTable
                                rows={students}
                                columns={Column}
                                rowsPerPageOptions={[5, 10, 25]}
                                onCellValueChange={handleCellValueChange}
                            />
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
