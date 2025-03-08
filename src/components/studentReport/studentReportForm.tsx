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
    familyDetails: any;
    id: string;
    name: string;
    stdo_FatherName: string;
}

interface SubjectMarks {
    subject: string;
    marksObtained: number;
    maxMarks: number;
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


    const calculateTotalAverageGrade = (marks: SubjectMarks[]) => {
        if (marks.length === 0) return { totalMarks: 0, average: 0, grade: 'N/A' };

        const totalMarks = marks.reduce((sum, row) => sum + row.marksObtained, 0);
        const totalMaxMarks = marks.reduce((sum, row) => sum + row.maxMarks, 0);
        const average = totalMarks / marks.length;
        const percentage = (totalMarks / totalMaxMarks) * 100;

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
                if (data?.length) {
                    setClassData(data);
                    setClassSelected("");  // Default empty selection
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

            // setLoading(true);
            try {
                const response = await axiosInstance.get(`/student/findAllStudent?cls=${classSelected}`);
                if (response.status === 200) {
                    setStudents(response.data);
                    setStudentSelected("");  // Default empty selection
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                toast.error("Failed to fetch students");
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
            if (selectedClassData) {
                setSubjects(selectedClassData.subject);
                setRows(selectedClassData.subject.map(subject => ({
                    subject,
                    marksObtained: 0,
                    maxMarks: 100,
                    remarks: '',
                })));
            }
        }
    }, [classSelected, classData]);

    const validateForm = (): boolean => {
        if (!studentSelected || !examType || !examDate || rows.length === 0) {
            toast.error("Please fill all required fields");
            return false;
        }

        const invalidMarks = rows.some(row =>
            row.marksObtained > row.maxMarks ||
            row.marksObtained < 0 ||
            row.maxMarks <= 0
        );

        if (invalidMarks) {
            toast.error("Invalid marks entered");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const { totalMarks, average, grade } = calculateTotalAverageGrade(rows);

        const payload = {
            id: studentSelected,
            examType,
            examDate: formatToDDMMYYYY(examDate),
            subjects: rows,
            totalMarks,
            average,
            grade,
        };

        try {
            setLoading(true);
            const response = await axiosInstance.post(`report/save?id=${studentSelected} `, payload);
            if (response.status === 200) {
                toast.success("Marks submitted successfully!");
                setRows(rows.map(row => ({
                    ...row,
                    marksObtained: 0,
                    maxMarks: 100,
                    remarks: '',
                })));
            } else {
                throw new Error('Failed to submit marks');
            }
        } catch (error) {
            toast.error("Failed to submit marks");
        } finally {
            setLoading(false);
        }
    };


    // Filter students based on search term
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format students for react-select
    const studentOptions = filteredStudents.map((student) => ({
        value: student.id,
        label: `${student.name} - ${student.familyDetails?.stdo_FatherName}`,
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
                            <div className="col-md-3">
                                <label htmlFor="classSelect" className="form-label">Class:</label>
                                <select
                                    id="classSelect"
                                    className="form-select"
                                    value={classSelected}
                                    onChange={(e) => setClassSelected(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Select Class</option>
                                    {classData.map(({ className }) => (
                                        <option key={className} value={className}>
                                            Class {className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="studentSelect" className="form-label">Student:</label>
                                <Select
                                    id="studentSelect"
                                    options={studentOptions}
                                    value={studentOptions.find((option) => option.value === studentSelected)}
                                    onChange={(selectedOption) =>
                                        setStudentSelected(selectedOption?.value || "")
                                    }
                                    onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                    isDisabled={loading || !classSelected}
                                    placeholder="Select Student"
                                    isSearchable
                                    noOptionsMessage={() => "No students found"}
                                    menuPlacement="auto"
                                    menuShouldScrollIntoView={true} // Ensures the menu is scrollable
                                    styles={{
                                        menu: (provided) => ({
                                            ...provided,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            zIndex: 9999,
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            zIndex: 1, // Ensure input field is below the dropdown menu
                                        }),
                                    }}
                                />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="examTypeSelect" className="form-label">Exam Type:</label>
                                <select
                                    id="examTypeSelect"
                                    className="form-select"
                                    value={examType}
                                    onChange={(e) => setExamType(e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="">Select Exam Type</option>
                                    <option value="Test">Test</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Half Yearly">Half Yearly</option>
                                    <option value="Final Year">Final Year</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="examDate" className="form-label">Exam Date:</label>
                                <input
                                    type="date"
                                    id="examDate"
                                    className="form-control"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    disabled={loading}
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
                                        <tr key={row.subject}>
                                            <td>{row.subject}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="0"
                                                    max={row.maxMarks}
                                                    value={row.marksObtained === null ? "" : row.marksObtained} // 🛠 Fix: Allow empty input
                                                    onChange={(e) => {
                                                        const value = e.target.value === "" ? null : Math.max(0, parseFloat(e.target.value));
                                                        setRows(prevRows =>
                                                            prevRows.map((r, i) =>
                                                                i === index ? { ...r, marksObtained: value } : r
                                                            )
                                                        );
                                                    }}
                                                    disabled={loading}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    value={row.maxMarks === null ? "" : row.maxMarks} // 🛠 Fix: Allow empty input
                                                    onChange={(e) => {
                                                        const value = e.target.value === "" ? null : Math.max(1, parseFloat(e.target.value));
                                                        setRows(prevRows =>
                                                            prevRows.map((r, i) =>
                                                                i === index ? { ...r, maxMarks: value } : r
                                                            )
                                                        );
                                                    }}
                                                    disabled={loading}
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
                                                    disabled={loading}
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