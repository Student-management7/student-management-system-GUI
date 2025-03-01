import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../services/Utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";

interface Student {
  id: string;
  name: string;
  remainingFees: number;
  email: string;
  familyDetails: {
    stdo_FatherName: string;
  };
  cls: string;
}

interface StudentFeesFormProps {
  onClose: () => void;
  editingData?: {
    id: string;
    fee: number;
    name: string;
    email: string;
  } | null;
}

const validationSchema = Yup.object({
  id: Yup.string().required("Student ID is required"),
  fee: Yup.number()
    .typeError("Fee must be a number")
    .required("Fee is required")
    .positive("Fee must be positive"),
});

const StudentFeesForm: React.FC<StudentFeesFormProps> = ({ onClose, editingData }) => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/student/findAllStudent");
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = studentData;
    if (selectedClass) {
      filtered = filtered.filter((s) => s.cls === selectedClass);
    }
    if (searchTerm) {
      filtered = filtered.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredStudents(filtered);

    if (filtered.length === 1) {
      setSelectedEmail(filtered[0].email);
      setSelectedStudent(filtered[0]);
    } else {
      setSelectedEmail("");
      setSelectedStudent(null);
    }
  }, [selectedClass, searchTerm, studentData]);

  const handleStudentSelection = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const email = event.target.value;
    setSelectedEmail(email);
    const student = filteredStudents.find((s) => s.email === email);
    if (student) {
      setSelectedStudent(student);
      setFieldValue("id", student.id);
      setFieldValue("name", student.name);
      setFieldValue("email", student.email);
    }
  };

  return (
    <div className="container mt-3">
      
      <div className="row mb-3">
       <i onClick={onClose} className="bi bi-arrow-left-circle head1 col-1" />
       <h3 className="col head1 mb-4">{editingData ? "Edit Student Fee" : "Add Student Fee"}</h3>
     </div>
      <Formik
        initialValues={{
          id: editingData?.id || (selectedStudent ? selectedStudent.id : ""),
          fee: editingData?.fee || 0,
          name: editingData?.name || (selectedStudent ? selectedStudent.name : ""),
          email: editingData?.email || (selectedStudent ? selectedStudent.email : ""),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const endpoint = editingData
              ? `https://s-m-s-keyw.onrender.com/student/fees/${editingData.id}`
              : "https://s-m-s-keyw.onrender.com/student/saveFees";

            await axiosInstance.post(endpoint, values);
            toast.success(editingData ? "Fee updated successfully!" : "Fee added successfully!");
            onClose();
          } catch (error) {
            toast.error("Failed to save fee. Please try again.");
          }
        }}
        enableReinitialize
      >
        {({ setFieldValue }) => (
         
          <Form>
            {/* Search & Class Selection */}
            <div className="row mb-3 ">
              <div className="col-md-4 mb-3 mr-6 col-sm-12">
                <label className="form-label">Search by Name</label>
                <input
                  type="text"
                  className="form-control "
                  placeholder="Search student name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4 mb-3 col-sm-12">
                <label className="form-label">Filter by Class</label>
                <select className="form-select" onChange={(e) => setSelectedClass(e.target.value)}>
                  <option value="">All Classes</option>
                  {[...new Set(studentData.map((s) => s.cls))].map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Selection */}
            <div className="row mb-3">
              <div className="col-md-4 mb-3`">
                <label className="form-label">Select Student Email</label>
                <select
                  className="form-select small-select"
                  value={selectedEmail}
                  onChange={(e) => handleStudentSelection(e, setFieldValue)}
                  disabled={!!editingData}
                >
                  <option value="" disabled>-- Select Email --</option>
                  {filteredStudents.map((student) => (
                    <option key={student.id} value={student.email}>{student.email}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Details */}
            {selectedStudent && (
              <>
             <div className="row mb-3">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Student Name:</label>
                      <div className="info-box">{selectedStudent.name}</div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">Father Name</label>
                      <div className="info-box">{selectedStudent.familyDetails?.stdo_FatherName}</div>
                    </div>
                  </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Remaining Fees</label>
                    <span className="info-box">₹ {selectedStudent.remainingFees}</span>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fee Amount</label>
                    <Field type="number" name="fee" className="form-control" placeholder="Enter Fee Amount" />
                    <ErrorMessage name="fee" component="div" className="text-danger" />
                  </div>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success">{editingData ? "Update Fee" : "Add Fee"}</button>
              <button type="button" className="btn btn-danger" onClick={onClose}>Cancel</button>
            </div>
          </Form>
        )}
        
      </Formik>
      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

export default StudentFeesForm;
