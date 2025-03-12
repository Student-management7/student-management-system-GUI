import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClassData } from "../../services/StudentAttendanceShow/API/api";
import { ClassData } from "../../services/SaveSubjects/Type";
import { handleApiError } from "../Utility/toastUtils";
import axiosInstance from "../../services/Utils/apiUtils";
import { formatToDDMMYYYY } from "../../components/Utils/dateUtils";
import Loader from "../loader/loader";
import Select from 'react-select';

interface Student {
    familyDetails: {
        stdo_FatherName?: string;
    };
    id: string;
    name: string;
}

interface SubjectMarks {
    subject: string;
    marksObtained: number | null;
    maxMarks: number | null;
    remarks: string;
}

const StudentReportForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [classData, setClassData] = useState<ClassData[]>([]);
    const [classSelected, setClassSelected] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [studentSelected, setStudentSelected] = useState("");
    const [examType, setExamType] = useState("");
    const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
    const [rows, setRows] = useState<SubjectMarks[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotalAverageGrade = (marks: SubjectMarks[]) => {
        if (marks.length === 0) return { totalMarks: 0, average: 0, grade: 'N/A' };

        // Filter out null values and calculate totals
        const validMarks = marks.filter(mark => 
            mark.marksObtained !== null && mark.maxMarks !== null);
        
        if (validMarks.length === 0) return { totalMarks: 0, average: 0, grade: 'N/A' };

        const totalMarks = validMarks.reduce((sum, row) => 
            sum + (row.marksObtained as number), 0);
        const totalMaxMarks = validMarks.reduce((sum, row) => 
            sum + (row.maxMarks as number), 0);
        
        const average = totalMarks / validMarks.length;
        const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 75) grade = 'B';
        else if (percentage >= 50) grade = 'C';

        return { totalMarks, average, grade };
    };

    useEffect(() => {
        const loadClassData = async () => {
            setLoading(true);
            try {
                const data = await fetchClassData();
                if (Array.isArray(data) && data.length > 0) {
                    setClassData(data);
                    setClassSelected("");
                } else {
                    toast.info("No class data available");
                }
            } catch (err) {
                handleApiError(err);
            } finally {
                setLoading(false);
            }
        };
        loadClassData();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!classSelected) {
                setStudents([]);
                setStudentSelected("");
                return;
            }

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/student/findAllStudent?cls=${encodeURIComponent(classSelected)}`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setStudents(response.data);
                    setStudentSelected("");
                } else {
                    toast.warning("No students found in this class");
                    setStudents([]);
                }
            } catch (error) {
                toast.error("Failed to fetch students");
                console.error("Error fetching students:", error);
                setStudents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [classSelected]);

    useEffect(() => {
        if (classSelected && classData.length) {
            const selectedClassData = classData.find(c => c.className === classSelected);
            if (selectedClassData && Array.isArray(selectedClassData.subject)) {
                setSubjects(selectedClassData.subject);
                setRows(selectedClassData.subject.map(subject => ({
                    subject,
                    marksObtained: 0,
                    maxMarks: 100,
                    remarks: '',
                })));
            } else {
                setSubjects([]);
                setRows([]);
                toast.warning("No subjects found for this class");
            }
        }
    }, [classSelected, classData]);

    const validateForm = (): boolean => {
        if (!studentSelected) {
            toast.error("Please select a student");
            return false;
        }
        
        if (!examType) {
            toast.error("Please select an exam type");
            return false;
        }
        
        if (!examDate) {
            toast.error("Please select an exam date");
            return false;
        }
        
        if (rows.length === 0) {
            toast.error("No subjects available for marking");
            return false;
        }

        const invalidMarks = rows.some(row =>
            (row.marksObtained !== null && row.maxMarks !== null) && 
            (row.marksObtained > row.maxMarks || row.marksObtained < 0 || row.maxMarks <= 0)
        );

        if (invalidMarks) {
            toast.error("Invalid marks entered. Marks obtained must be between 0 and maximum marks.");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            setLoading(true);
            
            // Convert any null values to 0 for the calculation and submission
            const sanitizedRows = rows.map(row => ({
                ...row,
                marksObtained: row.marksObtained === null ? 0 : row.marksObtained,
                maxMarks: row.maxMarks === null ? 100 : row.maxMarks,
            }));
            
            const { totalMarks, average, grade } = calculateTotalAverageGrade(sanitizedRows);

            const payload = {
                id: studentSelected,
                examType,
                examDate: formatToDDMMYYYY(examDate),
                subjects: sanitizedRows,
                totalMarks,
                average: parseFloat(average.toFixed(2)),
                grade,
            };

            const response = await axiosInstance.post(`/report/save?id=${encodeURIComponent(studentSelected)}`, payload);
            
            if (response.status === 200) {
                toast.success("Marks submitted successfully!");
                
                // Reset form fields except class selection
                setRows(subjects.map(subject => ({
                    subject,
                    marksObtained: 0,
                    maxMarks: 100,
                    remarks: '',
                })));
                setExamType("");
                setExamDate(new Date().toISOString().split('T')[0]);
                setStudentSelected("");
            } else {
                throw new Error(`Failed to submit marks. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting marks:", error);
            toast.error("Failed to submit marks. Please try again.");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.familyDetails?.stdo_FatherName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format students for react-select
    const studentOptions = filteredStudents.map((student) => ({
        value: student.id,
        label: `${student.name} - ${student.familyDetails?.stdo_FatherName || "N/A"}`,
    }));


    return (

        <>


            <ToastContainer position="top-right" autoClose={3000} />

            {loading ? (
                <Loader /> // Show loader while data is being fetched
            ) : (
                <div className="box p-4 mb-4">
                    <ToastContainer position="top-right" autoClose={3000} />

                    <h2 className="mb-4 head1 ">Student Report Form</h2>
                    <div className="card p-4">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="classSelect" className="form-label">Class:</label>
                                <select
                                    id="classSelect"
                                    className="form-select"
                                    value={classSelected}
                                    onChange={(e) => setClassSelected(e.target.value)}
                                    disabled={loading || isSubmitting}
                                >
                                    <option value="">Select Class</option>
                                    {classData.map(({ className }) => (
                                        <option key={className} value={className}>
                                            Class {className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="studentSelect" className="form-label">Student:</label>
                                <Select
                                    id="studentSelect"
                                    options={studentOptions}
                                    value={studentOptions.find((option) => option.value === studentSelected)}
                                    onChange={(selectedOption) =>
                                        setStudentSelected(selectedOption?.value || "")
                                    }
                                    onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                    isDisabled={loading || isSubmitting || !classSelected}
                                    placeholder="Select Student"
                                    isSearchable
                                    noOptionsMessage={() => 
                                        classSelected ? "No students found" : "Please select a class first"
                                    }
                                    menuPlacement="auto"
                                    menuShouldScrollIntoView={true} 
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            zIndex: 9999,
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            zIndex: 1, 
                                        }),
                                    }}
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="examTypeSelect" className="form-label">Exam Type:</label>
                                <select
                                    id="examTypeSelect"
                                    className="form-select"
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                    disabled={loading || isSubmitting}
                                >
                                    <option value="">Select Exam Type</option>
                                    <option value="Test">Test</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Half Yearly">Half Yearly</option>
                                    <option value="Final Year">Final Year</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label htmlFor="examDate" className="form-label">Exam Date:</label>
                                <input
                                    type="date"
                                    id="examDate"
                                    className="form-control"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    disabled={loading || isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="table-responsive mt-4">
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Subject</th>
                                            <th>Marks Obtained</th>
                                            <th>Maximum Marks</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={`${row.subject}-${index}`}>
                                                <td>{row.subject}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="0"
                                                        max={row.maxMarks ?? undefined}
                                                        value={row.marksObtained === null ? "" : row.marksObtained}
                                                        onChange={(e) => {
                                                            const value = e.target.value === "" 
                                                                ? null 
                                                                : Math.max(0, parseFloat(e.target.value));
                                                            setRows(prevRows =>
                                                                prevRows.map((r, i) =>
                                                                    i === index ? { ...r, marksObtained: value } : r
                                                                )
                                                            );
                                                        }}
                                                        disabled={loading || isSubmitting}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        value={row.maxMarks === null ? "" : row.maxMarks}
                                                        onChange={(e) => {
                                                            const value = e.target.value === "" 
                                                                ? null 
                                                                : Math.max(1, parseFloat(e.target.value));
                                                            setRows(prevRows =>
                                                                prevRows.map((r, i) =>
                                                                    i === index ? { ...r, maxMarks: value } : r
                                                                )
                                                            );
                                                        }}
                                                        disabled={loading || isSubmitting}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={row.remarks}
                                                        onChange={(e) => {
                                                            setRows(prevRows =>
                                                                prevRows.map((r, i) =>
                                                                    i === index ? { ...r, remarks: e.target.value } : r
                                                                )
                                                            );
                                                        }}
                                                        disabled={loading || isSubmitting}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        <div className="mt-4 text-center">
                            <button
                                onClick={handleSubmit}
                                className="btn button "
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentReportForm;