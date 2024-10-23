import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Main component for the Student Attendance System
const StudentAttendanceSystem = () => {
  const [rowData, setRowData] = useState([]); // Data for the grid
  const [classes, setClasses] = useState([]); // Available classes
  const [subjects, setSubjects] = useState([]); // Available subjects
  const [selectedClass, setSelectedClass] = useState(''); // Currently selected class
  const [selectedSubject, setSelectedSubject] = useState(''); // Currently selected subject
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for displaying error messages

  // Column definitions for the AgGrid
  const columnDefs = [
    { headerName: 'SN', field: 'sn', width: 70 }, // Serial Number
    { headerName: 'Student Name', field: 'name', width: 150 }, // Student's name
    { headerName: 'Student Class', field: 'class', width: 120 }, // Class of the student
    { headerName: 'Subject', field: 'subject', width: 120 }, // Subject of the attendance
    {
      headerName: 'Attendance',
      field: 'attendance',
      width: 120,
      cellRenderer: 'attendanceDropdown', // Custom dropdown for attendance
      cellRendererParams: {
        onChange: (params) => handleAttendanceChange(params), // Handle changes to attendance
      },
    },
  ];

  // Fetch classes when the component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch subjects when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  // Function to fetch classes from the API
  const fetchClasses = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    console.log("Fetching classes...");
    try {
      const response = await fetch('/api/classes'); // Fetch classes
      console.log("Response received:", response);
      if (!response.ok) throw new Error('Failed to fetch classes'); // Handle error
      const data = await response.json(); // Parse response data
      console.log("Data parsed:", data);

      // Update classes state with the fetched data
      setClasses(data.classData.map(item => ({
        id: item.className, // Use className as ID
        name: item.className, // Use className as name
      })));
    } catch (error) {
      console.error('Error fetching classes:', error); // Log error to console
      setError('Failed to load classes. Please try again.'); // Update error state
      setClasses([]); // Reset classes state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to fetch subjects based on the selected class
  const fetchSubjects = async (classId) => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const response = await fetch(`/api/subjects?class=${classId}`); // Fetch subjects for the selected class
      if (!response.ok) throw new Error('Failed to fetch subjects'); // Handle error
      const data = await response.json(); // Parse response data
      
      // Update subjects state from the fetched subject string
      const subjects = JSON.parse(data.classData.find(item => item.className === classId).subject);
      setSubjects(subjects); // Update subjects state
    } catch (error) {
      console.error('Error fetching subjects:', error); // Log error to console
      setError('Failed to load subjects. Please try again.'); // Update error state
      setSubjects([]); // Reset subjects state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to fetch students based on the selected class and subject
  const fetchStudents = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      const classData = { class: selectedClass }; // Data for the selected class
      
      // Request to select the class
      const selectClassResponse = await fetch('/api/select-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
      if (!selectClassResponse.ok) throw new Error('Failed to select class'); // Handle error
      
      // Request to fetch students of the selected class
      const studentsResponse = await fetch(`/api/students?class=${selectedClass}`);
      if (!studentsResponse.ok) throw new Error('Failed to fetch students'); // Handle error
      const studentsData = await studentsResponse.json(); // Parse response data
      
      // Format student data for the grid
      const formattedData = studentsData.map((student, index) => ({
        sn: index + 1, // Serial number
        id: student.id, // Student ID
        name: student.name, // Student name
        class: selectedClass, // Selected class
        subject: selectedSubject, // Selected subject
        attendance: 'Present', // Default attendance status
      }));
      setRowData(formattedData); // Update row data for the grid
    } catch (error) {
      console.error('Error fetching students:', error); // Log error to console
      setError('Failed to load students. Please try again.'); // Update error state
      setRowData([]); // Reset row data
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to handle changes in attendance status
  const handleAttendanceChange = (params) => {
    // Update the attendance status for the modified row
    const updatedData = rowData.map((row) =>
      row.id === params.data.id ? { ...row, attendance: params.value } : row
    );
    setRowData(updatedData); // Update row data
  };

  // Function to save attendance data to the server
  const saveAttendance = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset error state
    try {
      // Prepare attendance data for each student
      const attendanceData = {
        className: selectedClass, // Selected class name
        subject: selectedSubject, // Selected subject
        studentList: rowData.map((row) => ({
          stdId: row.id, // Student ID
          attendance: row.attendance, // Attendance status
        })),
      };

      // Send attendance data to the server
      const response = await fetch('/api/save-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData), // Convert attendance data to JSON
      });
      if (!response.ok) throw new Error('Failed to save attendance'); // Handle error
      alert('Attendance saved successfully!'); // Show success message
    } catch (error) {
      console.error('Error saving attendance:', error); // Log error to console
      setError('Failed to save attendance. Please try again.'); // Update error state
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Custom dropdown component for selecting attendance status
  const AttendanceDropdown = (params) => {
    return (
      <select
        value={params.value} // Current value for the dropdown
        onChange={(e) => params.onChange({ ...params, value: e.target.value })} // Handle change
      >
        <option value="Present">Present</option> // Option for Present
        <option value="Absent">Absent</option> // Option for Absent
      </select>
    );
  };

  // Render the component
  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        {/* Dropdown for selecting class */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)} // Update selected class
          className="w-1/4"
        >
          <option value="">Select Class</option> // Default option
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} // Class name
            </option>
          ))}
        </select>
        {/* Dropdown for selecting subject */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)} // Update selected subject
          className="w-1/4"
          disabled={!selectedClass} // Disable if no class is selected
        >
          <option value="">Select Subject</option> // Default option
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>
              {subject} // Subject name
            </option>
          ))}
        </select>
        {/* Button to load students */}
        <button 
          onClick={fetchStudents} 
          disabled={!selectedClass || !selectedSubject || loading} // Disable if no selection or loading
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Loading...' : 'Load Students'} // 
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>} 
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs} // Column definitions for the grid
          rowData={rowData} // Row data for the grid
          frameworkComponents={{
            attendanceDropdown: AttendanceDropdown, // Custom attendance dropdown component
          }}
        />
      </div>
      {/* Button to save attendance data */}
      <button 
        onClick={saveAttendance} 
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300" 
        disabled={rowData.length === 0 || loading} // Disable if no data or loading
      >
        {loading ? 'Saving...' : 'Save Attendance'} 
      </button>
    </div>
  );
};

export default StudentAttendanceSystem; // Export the component for use in other parts of the application
