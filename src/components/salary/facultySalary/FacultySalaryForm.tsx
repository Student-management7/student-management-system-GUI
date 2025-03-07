import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { SalaryValidationSchema } from "../../../services/salary/facultysarayform/validation";
import axiosInstance from "../../../services/Utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";

interface FacultyData {
  fact_id: string;
  fact_email: string;
  fact_Name: string;
}

interface FacultySalaryFormProps {
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

const FacultySalaryForm: React.FC<FacultySalaryFormProps> = ({
  onCancel,
  onSave,
}) => {
  const [facultyData, setFacultyData] = useState<FacultyData[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/faculty/findAllFaculty');
      setFacultyData(response.data);
    } catch (err) {
      setError("Failed to fetch faculty data. Please try again later.");
      toast.error("Error fetching faculty data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    const faculty = facultyData.find(f => f.fact_email === selectedEmail);
    setSelectedFaculty(faculty || null);
  };

  const initialValues = {

    facultyID: "",
    facultySalary: 0,
    facultyTax: 0,
    facultyTransport: 0,
    facultyDeduction: [{ name: "", amount: 0 }],
  };

  const handleSubmit = async (values: any) => {
    const cleanedDeductions = values.facultyDeduction.filter(
      (deduction: any) => deduction.name && deduction.amount > 0
    );
    

    const formattedDeductions = cleanedDeductions.map((deduction: any) => ({
      name: deduction.name,
      amount: deduction.amount,
    }));


    // Save payload structure
    const payload = {
      facultyID: values.facultyID,
      facultySalary: values.facultySalary,
      facultyTax: values.facultyTax,
      facultyTransport: values.facultyTransport,
      facultyDeduction: formattedDeductions, // Pass as array, handleSave will stringify if needed

    };

    try {
      await onSave(payload);
      toast.success("Salary information saved successfully");
    } catch (error) {
      toast.error("Failed to save salary information");
      console.error("Salary save error:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-4">Loading faculty data...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="head1 flex items-center">
        <button onClick={onCancel} className="p-2 rounded-full arrow transition">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <span className="ml-4">Add Faculty Salary</span>
      </div>
      <div className="box ">

        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={SalaryValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form>
                {/* Email Selection */}
                <div className="mb-4">
                  <label htmlFor="emailDropdown" className="form-label">
                    Select Email:
                  </label>
                  <select
                    id="emailDropdown"
                    className="form-select"
                    value={selectedFaculty?.fact_email || ""}
                    onChange={(e) => {
                      handleEmailChange(e);
                      const selectedEmail = e.target.value;
                      const faculty = facultyData.find(
                        (f) => f.fact_email === selectedEmail
                      );
                      if (faculty) {
                        setFieldValue("facultyID", faculty.fact_id);
                      }
                    }}
                  >
                    <option value="" disabled>
                      -- Select Email --
                    </option>
                    {facultyData.map((faculty, index) => (
                      <option key={index} value={faculty.fact_email}>
                        {faculty.fact_email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Selected Faculty Details */}
                {selectedFaculty && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="facultyName" className="form-label">
                        Faculty Name:
                      </label>
                      <input
                        id="facultyName"
                        className="form-control"
                        type="text"
                        value={selectedFaculty.fact_Name}
                        disabled
                      />
                    </div>
                  </>
                )}

                {/* Faculty ID */}
                <div className="mb-3">
                  <label className="form-label">Faculty ID:</label>
                  <Field
                    name="facultyID"
                    type="text"
                    className={`form-control ${touched.facultyID && errors.facultyID ? "is-invalid" : ""
                      }`}
                    disabled={!!selectedFaculty}
                  />
                  <ErrorMessage
                    name="facultyID"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Salary */}
                <div className="mb-3">
                  <label className="form-label">Salary Amount:</label>
                  <Field
                    name="facultySalary"
                    type="number"
                    className={`form-control ${touched.facultySalary && errors.facultySalary
                      ? "is-invalid"
                      : ""
                      }`}
                    placeholder="Enter Salary"
                  />
                  <ErrorMessage
                    name="facultySalary"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Tax */}
                <div className="mb-3">
                  <label className="form-label">Tax (%):</label>
                  <Field
                    name="facultyTax"
                    type="number"
                    className={`form-control ${touched.facultyTax && errors.facultyTax ? "is-invalid" : ""
                      }`}
                    placeholder="Enter Tax Percentage"
                  />
                  <ErrorMessage
                    name="facultyTax"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Transport Allowance */}
                <div className="mb-3">
                  <label className="form-label">Transport Allowance:</label>
                  <Field
                    name="facultyTransport"
                    type="number"
                    className={`form-control ${touched.facultyTransport && errors.facultyTransport
                      ? "is-invalid"
                      : ""
                      }`}
                    placeholder="Enter Transport Allowance"
                  />
                  <ErrorMessage
                    name="facultyTransport"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Deductions */}
                <div className="mb-3">
                  <label className="form-label">Other</label>
                  <FieldArray name="facultyDeduction">
                    {({ remove, push }) => (
                      <>
                        {values.facultyDeduction.map((_, index) => (
                          <div key={index} className="row mb-2 align-items-center">
                            <div className="col-md-1 text-center">
                              <button
                                type="button"
                                onClick={() => push({ name: "", amount: 0 })}
                                className="bi bi-plus-circle-fill text-blue-500 text-lg"
                              />
                            </div>
                            <div className="col-md-5">
                              <Field
                                name={`facultyDeduction[${index}].name`}
                                placeholder=" Name"
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-4">
                              <Field
                                name={`facultyDeduction[${index}].amount`}
                                type="number"
                                placeholder=" Amount"
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-2 text-center">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="bi bi-dash-circle-fill text-red-600 text-lg"
                                disabled={values.facultyDeduction.length <= 1}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </div>


                {/* Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button type="submit" className="btn btn-primary button">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn buttonred"
                  >
                    Cancel
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

export default FacultySalaryForm;