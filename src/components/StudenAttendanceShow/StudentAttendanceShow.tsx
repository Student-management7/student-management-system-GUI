import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { fetchAttendanceData, fetchClassData, updateAttendance } from "../../services/StudentAttendanceShow/API/api"
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation"
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils"
import type { ClassData } from "../../services/SaveSubjects/Type"
import type { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes"
import { sortArrayByKey } from "../Utils/sortArrayByKey"
import { Switch } from '@headlessui/react'
// import ReusableTable from "../MUI Table/ReusableTable"
import ReusableTable from "./table/reusabletable"
const StudentAttendanceShow: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [classData, setClassData] = useState<ClassData[]>([])
  const [classSelected, setClassSelected] = useState("")
  const [subjectSelected, setSubjectSelected] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse[]>([])
  const [AttendanceMode, setAttendanceMode] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAttendance, setEditingAttendance] = useState<{
   
    studentId: string
    date: string
    attendance: string
    remark: string
  } | null>(null)



  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchClassData()
        if (data?.length > 0) {
          const sortedData = sortArrayByKey(data, "className")
          setClassData(sortedData)
          setClassSelected("")
          setSubjectSelected("")
          setAttendanceMode(true)  // Explicitly set to true on component mount
        } else {
          alert("No class data found.")
        }
      } catch (err) {
        alert("Failed to load class data.")
      } finally {
        setIsLoading(false)
      }
    }

    loadClassData()
  }, [])

  const handleFetchAttendance = useCallback(async () => {
    const attendanceModeLabel = AttendanceMode ? "Master Attendance" : "Subject-wise Attendance";

    // Adjust validation based on attendance mode
    const isFormValid = AttendanceMode
      ? validateAttendanceForm(fromDate, toDate, classSelected, "", attendanceModeLabel) // Subject not required for Master Mode
      : validateAttendanceForm(fromDate, toDate, classSelected, subjectSelected, attendanceModeLabel); // Subject required for Subject-wise Mode

    if (!isFormValid) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Validate date range
    if (fromDateObj > toDateObj) {
      alert("From date cannot be later than To date.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAttendanceData(fromDate, toDate, classSelected, subjectSelected, AttendanceMode);

      if (!data || data.length === 0) {
        alert("No attendance records found for the selected criteria.");
        setAttendanceData([]);
        return;
      }

      setAttendanceData(data);
      alert("Attendance data fetched successfully.");
    } catch (err: any) {
      alert(`Failed to fetch attendance: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [fromDate, toDate, classSelected, subjectSelected, AttendanceMode]);

  // const toggleAttendanceMode = () => setAttendanceMode((prev) => !prev)

  const handleEditAttendance = (studentId: any, date: string, attendance: any, remark: string  ) => {
    setEditingAttendance({
      studentId,
      date,
      attendance,
      remark: '', // default value for remark
    
    });
    setIsEditModalOpen(true);
  };


  const handleSaveAttendance = async () => {
    if (!editingAttendance) return;
  
    setIsLoading(true);
    try {
      // Fetch complete student list for the selected date
      const completeStudentList = attendanceData
        .find(ad => ad.date.split('T')[0] === editingAttendance.date)
        ?.students.map(student => ({
          stdId: student.stdId,
          name: student.name,
          attendance: student.stdId === editingAttendance.studentId 
            ? editingAttendance.attendance 
            : student.attendance,
          remark: student.stdId === editingAttendance.studentId 
            ? editingAttendance.remark 
            : student.remark
        })) || [];
  
        const payload = {
          date: editingAttendance.date,
          className: classSelected,
          subject: subjectSelected || '',
          studentList: completeStudentList.map(student => ({
            ...student,
            remark: student.remark ?? undefined, // Set remark to undefined if it's null
          })),
         
         
        };

      await updateAttendance(payload);
  
      alert("Attendance updated successfully.");
      handleFetchAttendance(); // Refresh the attendance data
    } catch (err) {
      alert("Failed to update attendance.");
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
      setEditingAttendance(null);
    }
  };
  return (
    <div className="box">
      <h2 className="text-2xl font-bold text-center mb-6">Student Attendance</h2>

      <div className="box">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-700">
            {AttendanceMode ? "Master Attendance" : "Subject-wise Attendance"}
          </span>
          <Switch
            checked={AttendanceMode}
            onChange={setAttendanceMode}
            disabled={isLoading}
            className={`${AttendanceMode ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle attendance mode</span>
            <span
              className={`${AttendanceMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700 mb-1">
              Class:
            </label>
            <select
              id="classSelect"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={classSelected}
              onChange={(e) => setClassSelected(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>
                Select a class
              </option>
              {classData.map(({ className }) => (
                <option key={className} value={className}>
                  Class {className}
                </option>
              ))}
            </select>
          </div>

          {!AttendanceMode && (
            <div>
              <label htmlFor="subjectSelect" className="block text-sm font-medium text-gray-700 mb-1">
                Subject:
              </label>
              <select
                id="subjectSelect"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={subjectSelected}
                onChange={(e) => setSubjectSelected(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {classData
                  .find(({ className }) => className === classSelected)
                  ?.subject.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
              From Date:
            </label>
            <input
              type="date"
              id="fromDate"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
              To Date:
            </label>
            <input
              type="date"
              id="toDate"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleFetchAttendance}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Fetch Attendance"}
          </button>
        </div>


        <div className=" webkit-overflow-scrolling-touch overflow-x-auto ">
          {attendanceData.length > 0 && (
            <div className="mt-8 overflow-x-auto shadow-md rounded-lg">
              <ReusableTable
                columns={[
                  {
                    field: 'name', headerName: 'Student Name',
                    renderCell: undefined
                  },
                  ...getDateRange(fromDate, toDate).map((date) => ({
                    field: date,
                    headerName: date,
                    renderCell: (row: any) => (
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleEditAttendance(row.stdId, date, row[date], '' )}
                      >
                        {row[date] || '-'}
                      </span>
                    ),
                  })),
                ]}
                rows={attendanceData.flatMap(({ students }) =>
                  students.map((student) => {
                    const row: Record<string, any> = {
                      stdId: student.stdId,
                      name: student.name,
                    };
                    getDateRange(fromDate, toDate).forEach((date) => {
                      row[date] =
                        attendanceData
                          .find((d) => d.date.split('T')[0] === date)
                          ?.students.find((s) => s.stdId === student.stdId)
                          ?.attendance || '-';
                    });
                    return row;
                  })
                )}
              />
            </div>
          )}
        </div>



      </div>

      {isEditModalOpen && editingAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Attendance</h3>
            <p>
              Student:{" "}
              {attendanceData.flatMap((d) => d.students).find((s) => s.stdId === editingAttendance.studentId)?.name}
            </p>
            <p>Date: {editingAttendance.date}</p>
            <select
              className="mt-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={editingAttendance.attendance}
              onChange={(e) => setEditingAttendance({ ...editingAttendance, attendance: e.target.value })}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>

            <p className="mt-4">Remark:</p>
            <textarea
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={editingAttendance.remark}
              onChange={(e) => setEditingAttendance({ ...editingAttendance, remark: e.target.value })}
            ></textarea>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveAttendance}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAttendanceShow




