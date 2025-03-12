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
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

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

interface FormValues {
    classSelected: string;
    studentSelected: string;
    examType: string;
    examDate: string;
    subjects: SubjectMarks[];
}

const StudentReportForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [classData, setClassData] = useState<ClassData[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form validation schema
    const validationSchema = Yup.object({
        classSelected: Yup.string().required('Class selection is required'),
        studentSelected: Yup.string().required('Student selection is required'),
        examType: Yup.string().required('Exam type is required'),
        examDate: Yup.string().required('Exam date is required'),
        subjects: Yup.array().of(
            Yup.object().shape({
                marksObtained: Yup.number()
                    .nullable()
                    .transform((value) => (isNaN(value) ? null : value))
                    .test(
                        'valid-marks',
                        'Marks must be between 0 and maximum marks',
                        function (value, context) {
                            const { maxMarks } = context.parent;
                            if (value === null) return true;
                            return value >= 0 && maxMarks !== null && value <= maxMarks;
                        }
                    ),
                maxMarks: Yup.number()
                    .nullable()
                    .transform((value) => (isNaN(value) ? null : value))
                    .min(1, 'Maximum marks must be at least 1')
                    .required('Maximum marks is required'),
                remarks: Yup.string(),
            })
        ),
    });

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
            try {
                const data = await fetchClassData();
                if (Array.isArray(data) && data.length > 0) {
                    setClassData(data);
                } else {
                    toast.info("No class data available");
                }
            } catch (err) {
                handleApiError(err);
            }
        };
        loadClassData();
    }, []);

    const fetchStudents = async (classSelected: string) => {
        if (!classSelected) {
            setStudents([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/student/findAllStudent?cls=${encodeURIComponent(classSelected)}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                setStudents(response.data);
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

    const getSubjectsForClass = (classSelected: string, classData: ClassData[]) => {
        if (!classSelected || !classData.length) return [];

        const selectedClassData = classData.find(c => c.className === classSelected);
        if (selectedClassData && Array.isArray(selectedClassData.subject)) {
            setSubjects(selectedClassData.subject);
            return selectedClassData.subject.map(subject => ({
                subject,
                marksObtained: 0,
                maxMarks: 100,
                remarks: '',
            }));
        } else {
            setSubjects([]);
            toast.warning("No subjects found for this class");
            return [];
        }
    };

    const handleSubmit = async (
        values: FormValues,
        { resetForm, setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            setIsSubmitting(true);
            setLoading(true);

            // Convert any null values to 0 for the calculation and submission
            const sanitizedRows = values.subjects.map(row => ({
                ...row,
                marksObtained: row.marksObtained === null ? 0 : row.marksObtained,
                maxMarks: row.maxMarks === null ? 100 : row.maxMarks,
            }));

            const { totalMarks, average, grade } = calculateTotalAverageGrade(sanitizedRows);

            const payload = {
                id: values.studentSelected,
                examType: values.examType,
                examDate: formatToDDMMYYYY(values.examDate),
                subjects: sanitizedRows,
                totalMarks,
                average: parseFloat(average.toFixed(2)),
                grade,
            };

            const response = await axiosInstance.post(
                `/report/save?id=${encodeURIComponent(values.studentSelected)}`,
                payload
            );

            if (response.status === 200) {
                toast.success("Marks submitted successfully!");

                // Reset form fields except class selection
                resetForm({
                    values: {
                        ...values,
                        studentSelected: '',
                        examType: '',
                        examDate: new Date().toISOString().split('T')[0],
                        subjects: getSubjectsForClass(values.classSelected, classData)
                    }
                });
            } else {
                throw new Error(`Failed to submit marks. Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error submitting marks:", error);
            toast.error("Failed to submit marks. Please try again.");
        } finally {
            setLoading(false);
            setIsSubmitting(false);
            setSubmitting(false);
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

    // Initial form values
    const initialValues: FormValues = {
        classSelected: '',
        studentSelected: '',
        examType: '',
        examDate: new Date().toISOString().split('T')[0],
        subjects: []
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="box p-4 mb-4">
                <h2 className="mb-4 head1">Student Report Form</h2>
                <div className="card p-4">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, setFieldValue, errors, touched, isValid, dirty }) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="classSelected" className="form-label">Class:</label>
                                        <Field
                                            as="select"
                                            id="classSelected"
                                            name="classSelected"
                                            className={`form-select ${errors.classSelected && touched.classSelected ? 'is-invalid' : ''}`}
                                            
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedClass = e.target.value;
                                                setFieldValue('classSelected', selectedClass);
                                                setFieldValue('studentSelected', '');

                                                // Get subjects for this class and set them
                                                const newSubjects = getSubjectsForClass(selectedClass, classData);
                                                setFieldValue('subjects', newSubjects);

                                                // Fetch students for this class
                                                fetchStudents(selectedClass);
                                            }}
                                        >
                                            <option value="">Select Class</option>
                                            {classData.map(({ className }) => (
                                                <option key={className} value={className}>
                                                    Class {className}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="classSelected" component="div" className="text-danger" />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="studentSelected" className="form-label">Student:</label>
                                        <Select
                                            id="studentSelected"
                                            options={studentOptions}
                                            value={studentOptions.find((option) => option.value === values.studentSelected)}
                                            onChange={(selectedOption) => {
                                                setFieldValue('studentSelected', selectedOption?.value || "");
                                            }}
                                            onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                            isDisabled={loading || isSubmitting || !values.classSelected}
                                            placeholder="Select Student"
                                            isSearchable
                                            noOptionsMessage={() =>
                                                values.classSelected ? "No students found" : "Please select a class first"
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
                                                    borderColor: errors.studentSelected && touched.studentSelected
                                                        ? '#dc3545'
                                                        : provided.borderColor,
                                                }),
                                            }}
                                        />
                                        <ErrorMessage name="studentSelected" component="div" className="text-danger" />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="examType" className="form-label">Exam Type:</label>
                                        <Field
                                            as="select"
                                            id="examType"
                                            name="examType"
                                            className={`form-select ${errors.examType && touched.examType ? 'is-invalid' : ''}`}
                                            
                                        >
                                            <option value="">Select Exam Type</option>
                                            <option value="Test">Test</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Half Yearly">Half Yearly</option>
                                            <option value="Final Year">Final Year</option>
                                        </Field>
                                        <ErrorMessage name="examType" component="div" className="text-danger" />
                                    </div>

                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="examDate" className="form-label">Exam Date:</label>
                                        <Field
                                            type="date"
                                            id="examDate"
                                            name="examDate"
                                            className={`form-control ${errors.examDate && touched.examDate ? 'is-invalid' : ''}`}
                                            
                                        />
                                        <ErrorMessage name="examDate" component="div" className="text-danger" />
                                    </div>
                                </div>

                                <div className="table-responsive mt-4">
                                    <FieldArray name="subjects">
                                        {() => (
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
                                                    {values.subjects.map((_, index) => (
                                                        <tr key={`subject-${index}`}>
                                                            <td>{values.subjects[index].subject}</td>
                                                            <td>
                                                                <Field
                                                                    type="number"
                                                                    name={`subjects.${index}.marksObtained`}
                                                                    className={`form-control ${errors.subjects?.[index]?.marksObtained &&
                                                                            touched.subjects?.[index]?.marksObtained ? 'is-invalid' : ''
                                                                        }`}
                                                                    min="0"
                                                                    max={values.subjects[index].maxMarks ?? undefined}
                                                                    
                                                                />
                                                                <ErrorMessage
                                                                    name={`subjects.${index}.marksObtained`}
                                                                    component="div"
                                                                    className="text-danger"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Field
                                                                    type="number"
                                                                    name={`subjects.${index}.maxMarks`}
                                                                    className={`form-control ${errors.subjects?.[index]?.maxMarks &&
                                                                            touched.subjects?.[index]?.maxMarks ? 'is-invalid' : ''
                                                                        }`}
                                                                    min="1"
                                                                    
                                                                />
                                                                <ErrorMessage
                                                                    name={`subjects.${index}.maxMarks`}
                                                                    component="div"
                                                                    className="text-danger"
                                                                />
                                                            </td>
                                                            <td>
                                                                <Field
                                                                    type="text"
                                                                    name={`subjects.${index}.remarks`}
                                                                    className="form-control"
                                                                    
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </FieldArray>
                                </div>

                                <div className="mt-4 text-center">
                                    <button
                                        type="submit"
                                        className="btn button"
                                        disabled={loading || isSubmitting || !isValid || !dirty}
                                    >
                                       Submit
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default StudentReportForm;