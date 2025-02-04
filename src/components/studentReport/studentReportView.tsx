import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/Utils/apiUtils";
import { User } from 'lucide-react';
import axios from "axios";
import Loader from "../loader/loader";
import { useParams } from "react-router-dom";
import './studentReportView.css'

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
    attendance: any;
}

interface AttendanceData {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
}

const StudentReport: React.FC = () => {
    const [examData, setExamData] = useState<ExamData[]>([]);
    const [selectedExamType, setSelectedExamType] = useState<string>("");
    const [filteredExam, setFilteredExam] = useState<ExamData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [examResponse, attendanceResponse] = await Promise.all([
                    axiosInstance.get(`/report/getStudentReport?id=${id}`),
                    axios.get("https://716a9f60-27a0-449f-bb20-e8e3518d7858.mock.pstmn.io/get attendance")
                ]);

                const examData = examResponse.data;
                const attendanceData = attendanceResponse.data;

                setExamData(examData);
                setStudentData({
                    ...examData[0].studentInfo,
                    attendance: attendanceData
                });

                if (examData.length > 0) {
                    setSelectedExamType(examData[0].examType);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const filtered = examData.find((exam) => exam.examType === selectedExamType);
        setFilteredExam(filtered || null);
    }, [selectedExamType, examData]);

    const examTypes = [...new Set(examData.map((exam) => exam.examType))];

    if (loading || !studentData) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!filteredExam) {
        return <div className="no-data">No data available</div>;
    }

    const AttendanceCard: React.FC<{ attendance: AttendanceData }> = ({ attendance }) => (
        <div className="attendance-card">
            <h3>Attendance</h3>
            <div className="attendance-grid">
                <div>
                    <p>Total Days</p>
                    <p>{attendance.totalDays}</p>
                </div>
                <div>
                    <p>Present Days</p>
                    <p>{attendance.presentDays}</p>
                </div>
                <div>
                    <p>Absent Days</p>
                    <p>{attendance.absentDays}</p>
                </div>
                <div>
                    <p>Attendance Percentage</p>
                    <p>{attendance.attendancePercentage}%</p>
                </div>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress" 
                    style={{ width: `${attendance.attendancePercentage}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="student-report">
            {loading && <Loader />}
            {!loading && (
                <div className="container">
                    {studentData && (
                        <div className="student-info">
                            <div className="avatar-container">
                                <button onClick={() => setIsModalOpen(true)}>
                                    <User />
                                </button>
                            </div>
                            <div className="student-details">
                                <h3>{studentData.name}</h3>
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-header">
                                    <h3>Student Details</h3>
                                    <button onClick={() => setIsModalOpen(false)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <div>
                                        <label>Full Name</label>
                                        <p>{studentData?.name}</p>
                                    </div>
                                    <div>
                                        <label>Roll Number</label>
                                        <p>SMS90764389</p>
                                    </div>
                                    <div>
                                        <label>Class</label>
                                        <p>{studentData?.cls + "th Class" || 'Class X-A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="exam-metrics">
                        <div className="metric-card">
                            <div>📚</div>
                            <p>Exam Type</p>
                            <p>{filteredExam.examType}</p>
                        </div>
                        <div className="metric-card">
                            <div>📅</div>
                            <p>Exam Date</p>
                            <p>{filteredExam.examDate}</p>
                        </div>
                        <div className="metric-card">
                            <div>📊</div>
                            <p>Total Marks</p>
                            <p>{filteredExam.totalMarks}</p>
                        </div>
                        <div className="metric-card">
                            <div>🏆</div>
                            <p>Grade</p>
                            <p>{filteredExam.grade}</p>
                        </div>
                    </div>

                    <div className="subject-performance">
                        <h3>Subject Performance</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Marks Obtained</th>
                                    <th>Max Marks</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExam.subjects.map((subject, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="subject-icon">
                                                {subject.subject[0]}
                                            </div>
                                            <div>{subject.subject}</div>
                                        </td>
                                        <td>{subject.marksObtained}</td>
                                        <td>{subject.maxMarks}</td>
                                        <td>
                                            <span className="remarks">{subject.remarks}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="sidebar">
                        {studentData.attendance && (
                            <AttendanceCard attendance={studentData.attendance} />
                        )}
                        <div className="exam-details">
                            <h3>Exam Details</h3>
                            <p>Exam Type: <span>{filteredExam.examType}</span></p>
                            <p>Exam Date: <span>{filteredExam.examDate}</span></p>
                            <p>Total Marks: <span>{filteredExam.totalMarks}</span></p>
                            <p>Average: <span>{filteredExam.average}</span></p>
                            <p>Grade: <span>{filteredExam.grade}</span></p>
                        </div>

                        <div className="performance-chart">
                            <h3>Performance Chart</h3>
                            {filteredExam.subjects.map((subject, index) => (
                                <div key={index} className="chart-item">
                                    <span>{subject.subject}</span>
                                    <div className="chart-bar">
                                        <div
                                            className="chart-progress"
                                            style={{ width: `${(subject.marksObtained / subject.maxMarks) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span>{subject.marksObtained}/{subject.maxMarks}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentReport;