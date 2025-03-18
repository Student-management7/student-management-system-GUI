// import React, { useState } from 'react';
// import { useLocation,  } from 'react-router-dom';
// import { formatToDDMMYYYY } from '../Utils/dateUtils';
// import axiosInstance from '../../services/Utils/apiUtils';
// import { toast, ToastContainer } from 'react-toastify';
// import ReusableTable from './Table/Table';
// import BackButton from '../Navigation/backButton';

// const StudentAttendanceEditSave: React.FC = () => {
//   const location = useLocation();

//   const { studentData, date, className, subject, AttendanceMode } = location.state || {};

//   if (!studentData || !date || !className || AttendanceMode === undefined) {
//     return (
//       <div>
//         <p>Error: Missing or invalid attendance data. Please go back and try again.</p>
//       </div>
//     );
//   }
  
//   console.log("studentData:", studentData);
//   const studenttsList = studentData?.[0]?.students || [];

//   console.log("studenttsList:", studenttsList);


//   const [editedStudentList, setEditedStudentList] = useState(
//     studentData?.[0]?.students || []
//   );

//   console.log("Extracted students list:", studenttsList);

  
//   const saveEditedAttendance = async () => {
//     try {
//       const payload = {
//         date: formatToDDMMYYYY(date),
//         className,
//         subject: AttendanceMode ? '' : subject,
//         studentList: editedStudentList.map((student: { stdId: any; name: any; attendance: any; remark: any; }) => ({
//           stdId: student.stdId,
//           name: student.name,
//           attendance: student.attendance,
//           remark: student.remark || '',
//         })),
//       };

//       console.log("Payload to be sent:", payload);

//       await axiosInstance.post(
//         `/attendance/update?masterAttendance=${AttendanceMode}`,
//         payload
//       );
//       toast.success('Attendance updated successfully!');
//       // navigate('/studentAttendanceEdit');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to save changes. Please try again.');
//     }
//   };

//   const columnDefs = [
//     { headerName: 'Student Name', field: 'name', editable: false },
//     {
//       headerName: 'Attendance',
//       field: 'attendance',
//       editable: true,
//       cellRenderer: (params: any) => {
//         const [selectedValue, setSelectedValue] = React.useState(params.value);

//         React.useEffect(() => {
//           setSelectedValue(params.value);
//         }, [params.value]);

//         return (
//           <div className="flex gap-2">
//             {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
//               <label key={option} className="flex items-center gap-1">
//                 <input
//                   type="radio"
//                   name={`attendance-${params.data.stdId}`}
//                   value={option}
//                   checked={selectedValue === option}
//                   onChange={() => {
//                     setSelectedValue(option);
//                     params.setValue(option);
//                     handleCellValueChange(params.rowIndex, 'attendance', option);
//                   }}
//                   className="form-radio h-4 w-4 text-blue-600"
//                 />
//                 <span className="text-sm">{option}</span>
//               </label>
//             ))}
//           </div>
//         );
//       },
//     },
//     {
//       headerName: 'Remarks',
//       field: 'remark',
//       editable: true,
//       cellRenderer: (params: any) => (
//         <input
//           type="text"
//           value={params.value || ''}
//           onChange={(e) => params.setValue(e.target.value)}
//           placeholder="Enter remarks"
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//       ),
//     },
//   ];

//   const rowData = editedStudentList.map((student: any, index: any) => ({
//     ...student,
//     rowIndex: index,
//   }));

//   const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
//     setEditedStudentList((prevStudents: any[]) => {
//       if (rowIndex >= 0 && rowIndex < prevStudents.length) {
//         const newStudents = [...prevStudents];
//         newStudents[rowIndex] = {
//           ...newStudents[rowIndex],
//           [field]: value,
//         };
//         console.log('Updated students:', newStudents);
//         return newStudents;
//       } else {
//         console.error('Invalid rowIndex:', rowIndex);
//         return prevStudents;
//       }
//     });
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="box">
//         <div className="flex items-center space-x-4 mb-4">
//           <span>
//             <BackButton />
//           </span>
//           <h1 className="head1" >Student Attendance Update</h1>
//         </div>
//         <div className="row mb-4 p-3 border rounded-lg bg-light shadow-sm d-flex flex-wrap align-items-center gap-3 ml-1 mr-1">

//           <h2 className="text-lg font-bold col-md-auto d-flex align-items-center gap-2">
//             📅 <span>Date:</span> {date}
//           </h2>

//           <h3 className="col-md-auto d-flex align-items-center gap-2">
//             🏫 <span>Class:</span> {className}
//           </h3>

//           <h3 className="col-md-auto d-flex align-items-center gap-2">
//             📖 <span>Subject:</span> {subject || 'N/A'}
//           </h3>

//           <h3 className="col-md-auto d-flex align-items-center gap-2">
//             🎯 <span>Attendance Mode:</span> {AttendanceMode ? 'Class wise' : 'Subject Wise'}
//           </h3>

//         </div>



//         <ReusableTable
//           rows={rowData}
//           columns={columnDefs}
//           onCellValueChange={handleCellValueChange}
//         />

//         <div className='flex justify-center mt-4 mb-4'>

//           <button
//             onClick={saveEditedAttendance}
//             className="button btn   "
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentAttendanceEditSave;











// import React, { useState, useEffect, useCallback } from "react";
// import { fetchAttendance, saveAttendanceEdit } from '../../services/Faculty/facultyAttendanceEdit/Api/api';
// import ReusableTable from '../StudenAttendanceShow/Table/Table';
// import Loader from "../loader/loader";
// import BackButton from "../Navigation/backButton";
// import { toast, ToastContainer } from "react-toastify";
// import axiosInstance from "../../services/Utils/apiUtils";

// interface Faculty {
//   factId: string;
//   name: string;
//   attendance: string;
// }

// interface AttendanceEntry {
//   date: string;
//   id: string;
//   factList: Faculty[];
// }

// interface CurrentFaculty {
//   fact_id: string;
//   fact_Name: string;
// }

// const FacultyAttendanceEdit: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState("");
//   const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
//   const [editedFacultyList, setEditedFacultyList] = useState<Faculty[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [currentFaculty, setCurrentFaculty] = useState<CurrentFaculty[]>([]);

//   // Fetch current faculty members
//   useEffect(() => {
//     const fetchCurrentFaculty = async () => {
//       try {
//         const response = await axiosInstance.get("https://s-m-s-keyw.onrender.com/faculty/findAllFaculty");
//         setCurrentFaculty(response.data);
//       } catch (err) {
//         toast.error("Failed to fetch current faculty.");
//       }
//     };

//     fetchCurrentFaculty();
//   }, []);

//   // Handle fetch attendance button click
//   const handleFetchAttendance = useCallback(async () => {
   

   
//     setAttendanceData([]);
//     setEditedFacultyList([]);

//     setLoading(true);
//     try {
//       const data = await fetchAttendance(selectedDate);

//       if (!data || data.length === 0) {
//         toast.warning("No attendance records found for the selected date.");
//         setAttendanceData([]);
//         setEditedFacultyList([]);
//         return;
//       }

//       // Filter attendance data to include only current faculty
//       const currentFacultyIds = new Set(currentFaculty.map(faculty => faculty.fact_id));
//       const filteredData = data.map((record: AttendanceEntry) => ({
//         id: record.id,
//         date: record.date,
//         factList: record.factList.filter((faculty: Faculty) =>
//           currentFacultyIds.has(faculty.factId)
//         ),
//       }));

//       setAttendanceData(filteredData);
//       setEditedFacultyList(filteredData[0]?.factList || []);
//       toast.success("Faculty attendance data fetched successfully.");
//     } catch (err) {
//       console.error("Error fetching attendance data:", err);
//       toast.error("No data found for this date.");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedDate, currentFaculty]);

//   // Handle cell value changes
//   const handleCellValueChange = (rowIndex: number, field: string, value: any) => {
//     setEditedFacultyList((prevFaculty) => {
//       if (rowIndex >= 0 && rowIndex < prevFaculty.length) {
//         const newFaculty = [...prevFaculty];
//         newFaculty[rowIndex] = {
//           ...newFaculty[rowIndex],
//           [field]: value,
//         };
//         return newFaculty;
//       }
//       return prevFaculty;
//     });
//   };

//   // Save edited attendance
//   const saveEditedAttendance = async () => {
//     if (editedFacultyList.length === 0 || attendanceData.length === 0) {
//       toast.warning("No attendance data to save.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         id: attendanceData[0]?.id,
//         date: attendanceData[0]?.date,
//         factList: editedFacultyList.map((faculty) => ({
//           factId: faculty.factId,
//           name: faculty.name,
//           attendance: faculty.attendance,
//         })),
//       };

//       await saveAttendanceEdit(payload);
//       toast.success('Faculty attendance updated successfully!');
//     } catch (err) {
//       console.error("Error saving attendance:", err);
//       toast.error('Failed to save changes. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Column definitions for the table
//   const columnDefs = [
//     { headerName: 'Faculty Name', field: 'name', editable: false },
//     {
//       headerName: 'Attendance',
//       field: 'attendance',
//       editable: true,
//       cellRenderer: (params: any) => {
//         const factId = params.data.factId;
//         const faculty = editedFacultyList.find((faculty: Faculty) => faculty.factId === factId);
//         const currentValue = faculty ? faculty.attendance : "Present";

//         return (
//           <div className="flex gap-2" key={`${factId}-${refreshKey}`}>
//             {["Present", "Absent", "Half Day", "Late", "Leave"].map((option) => (
//               <label key={option} className="flex items-center gap-1">
//                 <input
//                   type="radio"
//                   name={`attendance-${factId}`}
//                   value={option}
//                   checked={currentValue === option}
//                   onChange={() => {
//                     setEditedFacultyList((prevList: Faculty[]) =>
//                       prevList.map((faculty: Faculty) =>
//                         faculty.factId === factId
//                           ? { ...faculty, attendance: option }
//                           : faculty
//                       )
//                     );
//                     setRefreshKey((prev) => prev + 1);
//                     if (typeof params.setValue === "function") {
//                       params.setValue(option);
//                     }
//                   }}
//                   className="form-radio h-4 w-4 text-blue-600"
//                 />
//                 <span className="text-sm">{option}</span>
//               </label>
//             ))}
//           </div>
//         );
//       },
//     },
//   ];

//   const rowData = editedFacultyList.map((faculty, index) => ({
//     ...faculty,
//     rowIndex: index,
//   }));

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       {loading && <Loader />}
//       {!loading && (
//         <div className="box">
//           <div className="flex items-center space-x-4 mb-4">
//             <span>
//               <BackButton />
//             </span>
//             <h1 className="head1">Faculty Attendance Update</h1>
//           </div>

//           <div className="box">
//             {/* Date Selection */}
//             <div className="row form-group">
//               <div className="col-md-6">
//                 <label htmlFor="selectedDate" className="form-label">
//                   Date:
//                 </label>
//                 <input
//                   type="date"
//                   id="selectedDate"
//                   className="form-control"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Fetch Attendance Button */}
//             <div className="text-center mt-4">
//               <button
//                 className="button btn"
//                 onClick={handleFetchAttendance}
//                 disabled={loading}
//               >
//                 {loading ? "Loading..." : "Fetch Attendance"}
//               </button>
//             </div>

//             {/* Attendance Table */}
//             {!loading && editedFacultyList.length > 0 && (
//               <div className="mt-4">
//                 <h2 className="text-lg font-semibold mb-2">
//                   Faculty Attendance for {attendanceData[0]?.date ? new Date(attendanceData[0].date).toLocaleDateString() : selectedDate}
//                 </h2>
//                 <ReusableTable
//                   rows={rowData}
//                   columns={columnDefs}
//                   onCellValueChange={handleCellValueChange}
//                 />
//               </div>
//             )}

//             {/* Save Button */}
//             {!loading && editedFacultyList.length > 0 && (
//               <div className='flex justify-center mt-4 mb-4'>
//                 <button
//                   onClick={saveEditedAttendance}
//                   className="button btn"
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default FacultyAttendanceEdit;



import React from 'react'

function studentAttendanceEditSave() {
  return (
    <div>studentAttendanceEditSave</div>
  )
}

export default studentAttendanceEditSave