import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../services/Utils/apiUtils";

interface AddFeesFormProps {
  onClose: () => void; // Function to close the form
}

// Validation Schema for Formik
const validationSchema = Yup.object({
  id: Yup.string().required("Student ID is required"),
  fee: Yup.number()
    .typeError("Fee must be a number")
    .required("Fee is required")
    .positive("Fee must be a positive number"),
});

const StudentFeesForm: React.FC<AddFeesFormProps> = ({ onClose }) => {
  const [studentData, setStudentData] = useState<
    {
      stdo_FatherName: string; id: string; name: string; email: string 
}[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    stdo_FatherName: string;
    id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get("/student/findAllStudent", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          stdo_FatherName: student.familyDetails.stdo_FatherName, // Ensure father's name is mapped correctly
        }));
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  // Ensure the father's name is displayed when the student is selected
  const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = event.target.value;
    const student = studentData.find((s) => s.email === selectedEmail);
    if (student) {
        const updatedStudent = {
            ...student,
            stdo_FatherName: student.stdo_FatherName || '', // Add this line to ensure stdo_FatherName is present
        };
        setSelectedStudent(updatedStudent);
    } else {
        setSelectedStudent(null);
    }
};


  const handleSubmit = async (values: {
    name: any;
    email: any; id: string; fee: number
  }) => {
    const payload = {
      id: values.id,
      name: values.name,
      email: values.email,
      fee: values.fee,
    };

    try {
      const response = await axiosInstance.post(
        "https://s-m-s-keyw.onrender.com/student/saveFees",
        payload
      ); // Replace with actual API endpoint
      alert("Fee added successfully!");
      console.log("API Response:", response.data);
      onClose();
    } catch (error) {
      console.error("Error adding fees:", error);
      alert("Failed to add fee. Please try again.");
    }
  };

  return (
    <div className="box mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <div className="card shadow-lg p-3">
            <h3 className="text-center mb-4">Add Student Fees</h3>
            <Formik
              initialValues={{ id: "", fee: 0, name: "", email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  {/* Email Selection */}
                  <div className="mb-4">
                    <label htmlFor="emailDropdown" className="form-label">
                     Select Student Email:-
                    </label>
                    <select
                      id="emailDropdown"
                      className="form-select"
                      value={selectedStudent?.email || ""}
                      onChange={(e) => {
                        handleEmailChange(e);
                        const selectedEmail = e.target.value;
                        const student = studentData.find(
                          (s) => s.email === selectedEmail
                        );
                        if (student) {
                          setFieldValue("id", student.id);
                        }
                      }}
                    >
                      <option value="" disabled>
                        -- Select Email --
                      </option>
                      {studentData.map((student, index) => (
                        <option key={index} value={student.email}>
                          {student.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Display Selected Student Name */}
                  {selectedStudent && (
                    <div className="mb-4">
                      <label htmlFor="studentName" className="form-label">
                        Student Name:-
                      </label>
                      <input
                        id="studentName"
                        className="form-control"
                        type="text"
                        value={selectedStudent.name}
                        disabled
                      />
                    </div>
                  )}
                  {selectedStudent && (
                    <div className="mb-4">
                      <label htmlFor="studentName" className="form-label">
                         Student Father Name:-
                      </label>
                      <input
                        id="Father Name"
                        className="form-control"
                        type="text"
                        value={selectedStudent.stdo_FatherName} // Ensure value is correctly assigned
                        disabled
                      />
                    </div>
                  )}


                  {/* Fee Amount */}
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
                    <ErrorMessage
                      name="fee"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="d-flex justify-content-between">
                    <button
                      type="submit"
                      className="submit-btn btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Add Fee"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
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
