import React from "react";
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
  const handleSubmit = async (values: { id: string; fee: number }) => {
    const payload = {
      id: values.id,
      fee: values.fee,
    };

    try {
      const response = await axiosInstance.post("https://s-m-s-keyw.onrender.com/student/saveFees", payload); // Replace with actual API endpoint
      alert("Fee added successfully!");
      console.log("API Response:", response.data);
      onClose(); 
    } catch (error) {
      console.error("Error adding fees:", error);
      alert("Failed to add fee. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <div className="card shadow-lg p-3">
            <h3 className="text-center mb-4">Add Student Fees</h3>
            <Formik
              initialValues={{ id: "", fee: 0 }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="id" className="form-label">
                      Student ID:
                    </label>
                    <Field
                      type="text"
                      id="id"
                      name="id"
                      className="form-control"
                      placeholder="Enter Student ID"
                    />
                    <ErrorMessage
                      name="id"
                      component="div"
                      className="text-danger"
                    />
                  </div>
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
