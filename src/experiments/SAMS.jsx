import './SAMS.css';
import React, { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const StudentManagementSystem = () => {
    // State setup
    const [classes, setClasses] = useState([]); // Class and subject data from API
    const [subjects, setSubjects] = useState([]); // Subjects for the selected class
    const [selectedClass, setSelectedClass] = useState(""); // Selected class
    const [selectedSubject, setSelectedSubject] = useState(""); // Selected subject
    const [students, setStudents] = useState([]); // Students list from API
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(""); // Error state

    // Fetch classes and subjects from the API
    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await fetch('localhost:8080/class/data'); // Correct API endpoint
            const data = await response.json();
            setClasses(data.classData); // Set class data
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch classes data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses(); // Fetch classes on component mount
    }, []);

    // Handle class change
    const handleClassChange = (event) => {
        const selectedClass = event.target.value;
        setSelectedClass(selectedClass); // Set selected class
        const selectedClassData = classes.find(c => c.className === selectedClass); // Use classes state
        
        if (selectedClassData) {
            setSubjects(selectedClassData.subject);  // Update subjects dropdown
        } else {
            setSubjects([]); // Clear subjects if no class is selected
        }
    };

    // Handle subject change
    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value); // Set selected subject
    };



    // Fetch students based on selected class and subject
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.example.com/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    className: selectedClass,
                    subject: selectedSubject
                }),
            });
            const data = await response.json();
            setStudents(data.students); // Set students data
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch students data");
            setLoading(false);
        }
    };

    // Submit attendance to the backend
    const submitAttendance = async () => {
        try {
            const payload = {
                className: selectedClass,
                subject: selectedSubject,
                studentList: students.map(student => ({
                    stdId: student.stdId,
                    attendance: student.attendance || "Present" // Default to Present if not set
                }))
            };
            const response = await fetch('https://api.example.com/submitAttendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                alert("Attendance submitted successfully!");
            } else {
                throw new Error("Failed to submit attendance");
            }
        } catch (error) {
            alert("Error submitting attendance: " + error.message);
        }
    };

    // AG Grid column definitions
    const columns = [
        { headerName: "Serial Number", valueGetter: "node.rowIndex + 1", flex: 1 },
        { headerName: "Student ID", field: "stdId", flex: 1 },
        { headerName: "Student Name", field: "name", flex: 2 },
        { headerName: "Class Name", field: "className", flex: 1 },
        { headerName: "Subject", field: "subject", flex: 1 },
        {
            headerName: "Attendance", 
            field: "attendance", 
            cellRenderer: (params) => (
                <select
                    value={params.value || "Present"} 
                    onChange={(e) => {
                        params.setValue(e.target.value); 
                    }}
                >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
            ), 
            flex: 1
        }
    ];

    return (
        <div className="student-management">
            <h2>Student Attendance</h2>

            {/* Error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Class and subject dropdowns */}
            <div className="dropdowns-container">
                <div className="dropdown-group">
                    <label>
                        <select value={selectedClass} onChange={handleClassChange} className="custom-dropdown">
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls.className} value={cls.className}>
                                    Class {cls.className}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <select value={selectedSubject} onChange={handleSubjectChange} className="custom-dropdown" disabled={!selectedClass}>
                            <option value="">Select Subject</option>
                            {subjects.map((sub, index) => (
                                <option key={index} value={sub}>
                                    {sub}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button onClick={fetchStudents} disabled={!selectedClass || !selectedSubject} className="fetch-btn">
                        Fetch Students
                    </button>
                </div>
            </div>

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}

            {/* AG Grid table */}
            <div className="ag-theme-alpine table-container" style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                <AgGridReact
                    rowData={students.map((student) => ({
                        ...student,
                        className: selectedClass,
                        subject: selectedSubject,
                        attendance: student.attendance || "Present" 
                    }))}
                    columnDefs={columns}
                    pagination={true}
                />
            </div>

            {/* Submit attendance button */}
            <button onClick={submitAttendance} disabled={students.length === 0} className="submit-btn">
                Submit 
            </button>
        </div>
    );
};

export default StudentManagementSystem;
