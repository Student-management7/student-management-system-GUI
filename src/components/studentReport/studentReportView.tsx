import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import axiosInstance from "../../services/Utils/apiUtils";
import { User, AlertCircle } from 'lucide-react';
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from "../loader/loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const navigate = useNavigate();

  const [examData, setExamData] = useState<ExamData[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [filteredExam, setFilteredExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<{
    status: boolean;
    message: string;
    type: "error" | "warning" | "info";
  }>({
    status: false,
    message: "",
    type: "error",
  });

  const { id } = useParams<{ id: string }>();
  
  // Early validation for missing ID
  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Missing Student ID</h2>
          <p className="text-gray-600 mb-6">No student ID was provided. Please select a valid student.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError({ status: false, message: "", type: "error" });
  
        // Fetch data from the API
        const [examResponse] = await Promise.all([
          axiosInstance.get(`/report/getStudentReport?id=${id}`),
        ]);
  
        const examData = examResponse.data;
  
        // Check if examData is empty
        if (!examData || examData.length === 0) {
          setError({
            status: true,
            message: "No exam data found for this student.",
            type: "info",
          });
          return;
        }
  
        // Update state with fetched data
        setExamData(examData);
        setStudentData({
          ...examData[0].studentInfo,
        });
  
        console.log("Exam Data:", examData);
  
        if (examData.length > 0) {
          setSelectedExamType(examData[0].examType);
        }
      } catch (error: unknown) {
        console.error("Error:", error); 
  
        // Handle different types of errors
        if (axios.isAxiosError(error)) {
          console.log("Axios Error:", error.response); 
          
          if (error.response?.status === 400) {
            const errorMessage = error.response.data.detail || "Invalid student ID. Please check and try again.";
            setError({
              status: true,
              message: errorMessage,
              type: "error",
            });
          } else if (error.response?.status === 404) {
            setError({
              status: true,
              message: "The student record was not found.",
              type: "error",
            });
          } else if (!error.response) {
            setError({
              status: true,
              message: "Network error. Please check your connection and try again.",
              type: "warning",
            });
          } else {
            setError({
              status: true,
              message: "Failed to fetch student data. Please try again later.",
              type: "error",
            });
          }
          
          // toast.error(error.response?.data?.detail || "Failed to fetch data");
        } else if (error instanceof Error) {
          setError({
            status: true,
            message: error.message || "An unexpected error occurred.",
            type: "error",
          });
          // toast.error(error.message || "An error occurred while fetching data.");
        } else {
          setError({
            status: true,
            message: "An unknown error occurred. Please try again.",
            type: "error",
          });
          toast.error("An unknown error occurred. Please try again.");
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

  // Show error state
  if (error.status) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Student Report</h2>
          <p className="text-gray-600 mb-6">{error.message} or Please First Create Student Report</p>
          <button
            onClick={() => navigate(-1)}
            className="button btn"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // Show "no data" state
  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Student Data</h2>
          <p className="text-gray-600 mb-6">We couldn't find any data for this student ID.</p>
          <button
            onClick={() => navigate(-1)}
            className="button btn"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show "no exam data" state
  if (!filteredExam) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Exam Data</h2>
          <p className="text-gray-600 mb-6">No exam data is available for this student.</p>
          <button
            onClick={() => navigate(-1)}
            className="button btn "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (

    <>
    
    <ToastContainer autoClose={3000} position="top-right"/>

      {loading && <Loader />} {/* Show loader when loading */}
      {!loading && (
        <div className="container-fluid p-5 bg-gray-100 font-sans">
          
          {studentData && (
            
            <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
                  <ToastContainer autoClose={3000} position="top-right"/>

              <div className="flex items-start space-x-4">
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
                    <p className="fs-6 font-bold mt-2 ">{filteredExam.examDate}</p>
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

