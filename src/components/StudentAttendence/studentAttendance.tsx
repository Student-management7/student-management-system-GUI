import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClassData, Student, AttendancePayload } from "../../services/StudentAttendence/Type/studentAttendenceType";
import { API_ENDPOINTS } from "../../services/StudentAttendence/API/studentAttendenceApi";
import axiosInstance from "../../services/Utils/apiUtils";

const StudentManagementSystem: React.FC = () => {
    // Existing states
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceMode, setAttendanceMode] = useState<"subject" | "master">("subject");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // New states for enhanced functionality
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [bulkAction, setBulkAction] = useState<string>("");

    // Bulk action handler
    const handleBulkAction = () => {
        if (!bulkAction || selectedRows.length === 0) return;
        
        const updatedStudents = students.map(student => {
            if (selectedRows.includes(student.stdId)) {
                return { ...student, attendance: bulkAction };
            }
            return student;
        });
        setStudents(updatedStudents);
        setBulkAction(""); // Reset bulk action after applying
    };

    // Enhanced columns configuration
    const columns = [
        { 
            headerName: "Sr. No.", 
            valueGetter: "node.rowIndex + 1", 
            width: 80,
            pinned: 'left',
            checkboxSelection: true,
            headerCheckboxSelection: true,
        },
        { 
            headerName: "Student ID", 
            field: "stdId", 
            width: 100,
            pinned: 'left'
        },
        { 
            headerName: "Student Name", 
            field: "name", 
            width: 150,
            pinned: 'left'
        },
        {
            headerName: "Attendance",
            field: "attendance",
            width: 300,
            cellRenderer: (params: any) => (
                <div className="flex gap-3 items-center p-1">
                    {[
                        { value: "Present", label: "Present", color: "bg-green-100", key: "P" },
                        { value: "Late", label: "Late", color: "bg-yellow-100", key: "L" },
                        { value: "Half Day", label: "Half Day", color: "bg-orange-100", key: "H" },
                        { value: "Absent", label: "Absent", color: "bg-red-100", key: "A" }
                    ].map((option) => (
                        <label 
                            key={option.value} 
                            className={`flex items-center gap-1 p-1 rounded cursor-pointer hover:bg-gray-50 ${
                                params.value === option.value ? option.color : ''
                            }`}
                            title={`Press '${option.key}' key for quick selection`}
                        >
                            <input
                                type="radio"
                                name={`attendance-${params.data.stdId}`}
                                value={option.value}
                                checked={params.value === option.value}
                                onChange={() => params.setValue(option.value)}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm whitespace-nowrap">{option.label}</span>
                        </label>
                    ))}
                </div>
            ),
        },
        {
            headerName: "Remarks",
            field: "remark",
            width: 200,
            cellRenderer: (params: any) => (
                <div className="p-1">
                    <input
                        type="text"
                        value={params.value || ""}
                        onChange={(e) => params.setValue(e.target.value)}
                        placeholder="Add remarks..."
                        className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            ),
        }
    ];

    // Grid configuration
    const gridProps = {
        rowData: students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.stdId.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 15,
        suppressMovableColumns: true,
        suppressColumnVirtualisation: true,
        rowSelection: 'multiple',
        rowMultiSelectWithClick: true,
        enableCellTextSelection: true,
        suppressRowClickSelection: true,
        onSelectionChanged: (event: any) => {
            const selectedNodes = event.api.getSelectedNodes();
            const selectedIds = selectedNodes.map((node: any) => node.data.stdId);
            setSelectedRows(selectedIds);
        },
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        }
    };

    // Rest of your existing code remains the same...

    return (
        <div className="box">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Student Attendance</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Enhanced controls section */}
            <div className="controls-container space-y-4">
                {/* Date and Search Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <input 
                        type="date" 
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Attendance Mode and Class Selection */}
                <div className="flex flex-wrap gap-4 items-center">
                    {/* Your existing attendance mode radio buttons */}
                    <div className="attendance-mode-selector">
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

                    {/* Class and Subject Dropdowns */}
                    <select
                        value={selectedClass}
                        onChange={handleClassChange}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? "Loading..." : "Fetch Students"}
                    </button>
                </div>

                {/* Bulk Actions */}
                <div className="flex gap-2 items-center">
                    <select 
                        value={bulkAction} 
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Bulk Action</option>
                        <option value="Present">Mark All Present</option>
                        <option value="Absent">Mark All Absent</option>
                        <option value="Late">Mark All Late</option>
                        <option value="Half Day">Mark All Half Day</option>
                    </select>
                    <button 
                        onClick={handleBulkAction}
                        disabled={!bulkAction || selectedRows.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        Apply to Selected ({selectedRows.length})
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="ag-theme-alpine mt-4" style={{ height: "400px", width: "100%" }}>
                <AgGridReact {...gridProps} />
            </div>

            {/* Submit Button */}
            <button
                onClick={submitAttendance}
                disabled={students.length === 0}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            >
                Submit Attendance
            </button>
        </div>
    );
};

export default StudentManagementSystem;