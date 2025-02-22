import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import axiosInstance from "../../services/Utils/apiUtils";
import { User } from 'lucide-react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Loader from "../loader/loader";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



interface Subject {
  subject: string;
  marksObtained: number;
  maxMarks: number;
  remarks: string;
}

interface ExamData {
  id: string;
  examType: string;
  examDate: string;
  subjects: Subject[];
  totalMarks: number;
  average: number;
  grade: string;
}

interface StudentData {
  cls: string;
  studentInfo: any;
  id: string;
  name: string;
  // attendance: any;
}

interface AttendanceData {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
}

const StudentReport: React.FC = () => {

  const location = useLocation();

  const [examData, setExamData] = useState<ExamData[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [filteredExam, setFilteredExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Error: Missing Student id </div>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [examResponse, ] = await Promise.all([
          axiosInstance.get(`/report/getStudentReport?id=${id}`),
          // axios.get("https://716a9f60-27a0-449f-bb20-e8e3518d7858.mock.pstmn.io/get attendance")
        ]);

        const examData = examResponse.data;
        // const attendanceData = attendanceResponse.data;

        // Check if examData is empty
        if (examData.length === 0) {
          throw new Error("No data found for the given ID.");
        }

        setExamData(examData);
        setStudentData({
          ...examData[0].studentInfo,
          // attendance: attendanceData
        });

        console.log("Exam Data:", examData);
        // console.log("Attendance Data:", attendanceData);

        if (examData.length > 0) {
          setSelectedExamType(examData[0].examType);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error);
          if (error.message === "No data found for the given ID.") {
            toast.error("No data found for the provided ID. Please check the ID and try again.");
          } else {
            toast.error("Failed to fetch data. Please try again or check your network connection.");
          }
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const filtered = examData.find(
      (exam) => exam.examType === selectedExamType
    );
    setFilteredExam(filtered || null);
  }, [selectedExamType, examData]);

  const examTypes = [...new Set(examData.map((exam) => exam.examType))];

  if (loading || !studentData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!filteredExam) {
    return <div className="p-5">No data available</div>;
  }

  // const AttendanceCard: React.FC<{ attendance: AttendanceData }> = ({ attendance }) => (
  //   <div className="bg-white rounded-xl p-5 shadow-md mb-4">
  //     <h3 className=" font-bold head1 mb-3">Attendance</h3>
  //     <div className="grid grid-cols-2 gap-4">
  //       <div>
  //         <p className="text-sm text-gray-600">Total Days</p>
  //         <p className="text-lg font-semibold">{attendance.totalDays}</p>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-600">Present Days</p>
  //         <p className="text-lg font-semibold">{attendance.presentDays}</p>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-600">Absent Days</p>
  //         <p className="text-lg font-semibold">{attendance.absentDays}</p>
  //       </div>
  //       <div>
  //         <p className="text-sm text-gray-600">Attendance Percentage</p>
  //         <p className="text-lg font-semibold">{attendance.attendancePercentage}%</p>
  //       </div>
  //     </div>
  //     <div className="mt-4">
  //       <div className="w-full bg-gray-200 rounded-full h-2.5">
  //         <div
  //           className="bg-indigo-600 h-2.5 rounded-full"
  //           style={{ width: `${attendance.attendancePercentage}%` }}
  //         ></div>
  //       </div>
  //     </div>
  //   </div>
  // );



  return (

    <>
      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (
        <div className="container-fluid p-5 bg-gray-100 font-sans">
          {studentData && (

            <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start space-x-4">
                {/* Avatar Button */}
                <div className="relative group">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  >
                    <User className="w-6 h-6 text-indigo-600" />
                  </button>
                  <div className="hidden group-hover:block absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-500">

                  </div>
                </div>

                {/* Student Info Preview */}
                <div className="flex-1">

                  <div className="flex items-center space-x-4 mt-2">
                    <h3 className="text-lg font-semibold text-gray-800 text-align-center">{studentData.name}</h3>

                  </div>
                </div>
                <label className="font-semibold text-md text-center text-gray-800 mb-2 block mt-1">Select Exam Type</label>
                <Select
                  onValueChange={(value) => setSelectedExamType(value)}
                  value={selectedExamType || ""}
                >
                  {/* Select Input Box */}
                  <SelectTrigger className="border px-4 py-2 rounded-md w-full text-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all flex justify-between items-center">
                    <SelectValue placeholder="Select Exam" className="text-gray-700" />
                    <span className="text-gray-500">▼</span>
                    <SelectContent className="w-full bg-white shadow-lg rounded-md "
                    >
                      {examTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="cursor-pointer px-4 text-md hover:bg-gray-300  transition-all"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>




              </div>

              {/* Basic Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="head1 ">Student Details</h3>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg ">{studentData.name}</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-500">Roll Number</label>
                        <p className="text-lg ">SMS90764389</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-500">Class</label>
                        <p className="text-lg ">{studentData.cls + "th Class" || 'Class X-A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          )}
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-3/4 pr-0 lg:pr-8">
              <div className="mb-3">


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Metric Cards */}


                  <div className="bg-white rounded-xl p-5 text-center shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="flex justify-center items-center mb-2">
                      <div className="text-2xl">📚</div>
                    </div>

                    {/* Exam Type Selector */}
                    <div className="mb-2">
                      {filteredExam && (
                        <div className="rounded-xl text-center ">
                          <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Exam Type</p>
                          <p className="font-bold uppercase mt-1">{filteredExam.examType}</p>
                        </div>
                      )}

                    </div>
                                    
                  </div>

                  {/* Exam Date */}
                  <div className="bg-white rounded-xl p-5 text-center shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="flex justify-center items-center mb-2">
                      <div className="text-2xl">📅</div>
                    </div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Exam Date</p>
                    <p className="fs-6 font-bold mt-2">{filteredExam.examDate}</p>
                  </div>

                  {/* Total Marks */}
                  <div className="bg-white rounded-xl p-5 text-center shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="flex justify-center items-center mb-2">
                      <div className="text-2xl">📊</div>
                    </div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Total Marks</p>
                    <p className="text-2xl font-bold mt-2">{filteredExam.totalMarks}</p>
                  </div>

                  {/* Grade */}
                  <div className="bg-white rounded-xl p-5 text-center shadow-md transition-all hover:translate-y-[-5px] hover:shadow-lg">
                    <div className="flex justify-center items-center mb-2">
                      <div className="text-2xl">🏆</div>
                    </div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-gray-600">Grade</p>
                    <p className="text-2xl font-bold mt-2">{filteredExam.grade}</p>
                  </div>
                </div>
              </div>

              {/* Subject Performance Table */}
              {filteredExam && (
                <div className="bg-white rounded-xl p-5 shadow-md mt-5">
                  <h3 className="text-lg font-semibold mb-3">Subject Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full ">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="text-left p-3">Subject</th>
                          <th className="text-left p-3">Marks Obtained</th>
                          <th className="text-left p-3">Max Marks</th>
                          <th className="text-left p-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExam.subjects.map((subject, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#568e9c] text-white flex items-center justify-center font-bold mr-3">
                                {subject.subject[0]}
                              </div>
                              {subject.subject}
                            </td>
                            <td className="p-3">{subject.marksObtained}</td>
                            <td className="p-3">{subject.maxMarks}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                                {subject.remarks}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>



            <div className="lg:w-1/4 mt-10 lg:mt-0">
              {/* {studentData && (
                // <AttendanceCard attendance={studentData.attendance} />
              )} */}
              {/* Exam Details Card */}
              <div className="bg-white rounded-xl p-4 shadow-md mb-4">
                <h3 className="head1 mb-2">Exam Details</h3>
                <p className="text-sm text-gray-600 mb-2">Exam Type: <span className="font-semibold">{filteredExam.examType}</span></p>
                <p className="text-sm text-gray-600 mb-2">Exam Date: <span className="font-semibold">{filteredExam.examDate}</span></p>
                <p className="text-sm text-gray-600 mb-2">Total Marks: <span className="font-semibold">{filteredExam.totalMarks}</span></p>
                <p className="text-sm text-gray-600 mb-2">Average: <span className="font-semibold">{filteredExam.average}</span></p>
                <p className="text-sm text-gray-600 mb-2">Grade: <span className="font-semibold">{filteredExam.grade}</span></p>
              </div>

              {/* Performance Chart */}
              <div className="bg-white rounded-xl p-4 shadow-md">
                <h3 className=" head1 mb-4">Performance Chart</h3>
                <div className="mt-2">
                  {filteredExam.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                      <span className=" text-sm font-semibold">{subject.subject}</span>
                      <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{ width: `${(subject.marksObtained / subject.maxMarks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{subject.marksObtained}/{subject.maxMarks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default StudentReport;


