import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { fetchAttendanceData, fetchClassData, updateAttendance } from "../../services/StudentAttendanceShow/API/api"
import { validateAttendanceForm } from "../../services/StudentAttendanceShow/validation/attendanceValidation"
import { getDateRange } from "../../services/StudentAttendanceShow/dateFormates/dateUtils"
import type { ClassData } from "../../services/SaveSubjects/Type"
import type { AttendanceResponse } from "../../services/StudentAttendanceShow/type/attendanceTypes"
import { sortArrayByKey } from "../Utils/sortArrayByKey"
import { Switch } from '@headlessui/react'
import ReusableTable from "./Table/Table"
// import ReusableTable from "./Table/Table"
import Loader from "../loader/loader"
import BackButton from "../Navigation/backButton"
import { toast, ToastContainer } from "react-toastify"
import { Pencil } from "lucide-react"
import { useNavigate } from 'react-router-dom';



const StudentAttendanceShow: React.FC = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassData[]>([])
  const [classSelected, setClassSelected] = useState("")
  const [subjectSelected, setSubjectSelected] = useState("")
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split("T")[0])
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0])
  const [attendanceData, setAttendanceData] = useState<AttendanceResponse[]>([])
  const [AttendanceMode, setAttendanceMode] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadClassData = async () => {

      try {
        setLoading(true);
        setLoading(true);
        const data = await fetchClassData()
        if (data?.length > 0) {
          const sortedData = sortArrayByKey(data, "className")
          setClassData(sortedData)
          setClassSelected("")
          setSubjectSelected("")
          setAttendanceMode(true)  // Explicitly set to true on component mount
        } else {
          toast.warning("No class data found.")
        }
      } catch (err) {
        toast.warning("Failed to load class data.")
      } finally {
        setLoading(false)
        setLoading(false);

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
      toast.warning("Please fill in all required fields with valid values.");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Validate date range
    if (fromDateObj > toDateObj) {
      toast.warning("From date cannot be later than To date.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAttendanceData(fromDate, toDate, classSelected, subjectSelected, AttendanceMode);

      if (!data || data.length === 0) {
        toast.warning("No attendance records found for the selected criteria.");
        setAttendanceData([]);
        return;
      }

      setAttendanceData(data);
      toast.success("Attendance data fetched successfully.");
    } catch (err: any) {
      toast.error(`No data found on this range of time`);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, classSelected, subjectSelected, AttendanceMode]);



  const handleEditButtonClick = () => {

    navigate("/studentAttendanceEdit", {

    });
  };





  return (


    <>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (


        <>
          <ToastContainer position="top-right" autoClose={3000} />

          <div className="box">
            <div className="flex items-center space-x-4 mb-4">
              <span>
                <BackButton />
              </span>
              <h1 className="text-xl items-center font-bold text-[#27727A]" >Student Attendance View</h1>
            </div>

            <div className="box">
              <div className="flex items-center space-x-7 mb-10">
                <span className="text-gray-900 font-semibold ">
                  {AttendanceMode ? "Master Attendance" : "Subject-wise Attendance"}
                </span>
                <Switch
                  checked={AttendanceMode}
                  onChange={setAttendanceMode}
                  disabled={loading}
                  className={`
    float-left 
    ${AttendanceMode ? 'bg-[#3a8686]' : 'bg-gray-200'}  // Active/Inactive track colors
    relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
    focus:outline-none focus:ring-2 focus:ring-[#126666]-500 focus:ring-offset-2 mt-1
  `}

                >
                  <span className="sr-only">Toggle attendance mode</span>
                  <span
                    className={`${AttendanceMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>



                <span className="">

                <button onClick={handleEditButtonClick}
                  className="button btn  "
                >
                  <Pencil size={20} color='White' />
                </button>
                </span>



              </div>

              <div className="row form-group ">
                <div className="col-md-6">
                  <label htmlFor="classSelect" className="form-label">
                    Class:
                  </label>
                  <select
                    id="classSelect"
                    className="form-control"
                    value={classSelected}
                    onChange={(e) => setClassSelected(e.target.value)}
                    disabled={loading}
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
                  <div className="col-md-6">
                    <label htmlFor="subjectSelect" className="form-label">
                      Subject:
                    </label>
                    <select
                      id="subjectSelect"
                      className="form-control"
                      value={subjectSelected}
                      onChange={(e) => setSubjectSelected(e.target.value)}
                      disabled={loading}
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

              </div>

              <div className="row form-group">

                <div className="col-md-6">
                  <label htmlFor="fromDate" className="form-label">
                    From Date:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="toDate" className="form-label">
                    To Date:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

              </div>

              <div className="text-center mt-4">
                <button
                  className="button btn "
                  onClick={handleFetchAttendance}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Fetch Attendance"}
                </button>
              </div>



              {attendanceData.length > 0 && (
                <div className="overflow-x-auto ">
                  <ReusableTable

                    columns={[
                                        {
                                          field: 'name', headerName: 'Student Name',
                  
                                        },
                                        ...getDateRange(fromDate, toDate).map((date) => ({
                                          field: date,
                                          headerName: date,
                                          renderCell: (row: any) => (
                                            <span
                                             
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
        </>
      )};
    </>

  )
}

export default StudentAttendanceShow




