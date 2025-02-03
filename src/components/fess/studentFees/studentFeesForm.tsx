import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../services/Utils/apiUtils";



interface Student {
  id: string;
  name: string;
  email: string;
  stdo_FatherName: string;
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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/student/findAllStudent");
        const data = response.data.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          stdo_FatherName: student.familyDetails?.stdo_FatherName || "",
        }));
        setStudentData(data);

        if (editingData) {
          const student = data.find((s: { id: string; }) => s.id === editingData.id);
          setSelectedStudent(student || null);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [editingData]);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const selectedEmail = event.target.value;
    const student = studentData.find((s) => s.email === selectedEmail);
    if (student) {
      setSelectedStudent(student);
      setFieldValue("id", student.id);
      setFieldValue("name", student.name);
      setFieldValue("email", student.email);
    }
  };

  const handleSubmit = async (values: {
    id: string;
    fee: number;
    name: string;
    email: string;
  }) => {
    try {
      const endpoint = editingData
        ? `https://s-m-s-keyw.onrender.com/student/fees/${editingData.id}`
        : "https://s-m-s-keyw.onrender.com/student/saveFees";

      const method = editingData ? "post" : "post";

      await axiosInstance[method](endpoint, {
        id: values.id,
        name: values.name,
        email: values.email,
        fee: values.fee,
      });

      alert(editingData ? "Fee updated successfully!" : "Fee added successfully!");
      onClose();
    } catch (error) {
      alert("Failed to save fee. Please try again.");
    }
  };

  return (
    <div className="box mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <div className="card shadow-lg p-3">
            <h3 className="text-center mb-4">
              {editingData ? "Edit Student Fee" : "Add Student Fee"}
            </h3>
            <Formik
              initialValues={{
                id: editingData?.id || "",
                fee: editingData?.fee || 0,
                name: editingData?.name || "",
                email: editingData?.email || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="emailDropdown" className="form-label">
                      Select Student Email:
                    </label>
                    <select
                      id="emailDropdown"
                      className="form-select"
                      value={selectedStudent?.email || ""}
                      onChange={(e) => handleEmailChange(e, setFieldValue)}
                      disabled={!!editingData}
                    >
                      <option value="" disabled>
                        -- Select Email --
                      </option>
                      {studentData.map((student) => (
                        <option key={student.id} value={student.email}>
                          {student.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedStudent && (
                    <>
                      <div className="mb-4">
                        <label className="form-label">Student Name:</label>
                        <input
                          className="form-control"
                          type="text"
                          value={selectedStudent.name}
                          disabled
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Father Name:</label>
                        <input
                          className="form-control"
                          type="text"
                          value={selectedStudent.stdo_FatherName}
                          disabled
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label htmlFor="fee" className="form-label">
                      Fee Amount:
                    </label>
                    <Field
                      type="number"
                      id="fee"
                      name="fee"
                      className="form-control"
                      placeholder="Enter Fee Amount"
                    />
                    <ErrorMessage name="fee" component="div" className="text-danger" />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="submit"
                      className="btn button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingData
                        ? "Update Fee"
                        : "Add Fee"}
                    </button>
                    <button
                      type="button"
                      className="btn buttonred"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeesForm;
