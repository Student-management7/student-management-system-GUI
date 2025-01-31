import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { FacultySalaryFormValues, FacultySalaryFormProps } from "../../../services/salary/facultysarayform/type";
import { SalaryValidationSchema } from "../../../services/salary/facultysarayform/validation";
import axiosInstance from "../../../services/Utils/apiUtils";

interface FacultyData {
  fact_id: string;
  fact_email: string;
  fact_Name: string;
  
}

const FacultySalaryForm: React.FC<FacultySalaryFormProps> = ({
  initialData,
  onCancel,
  onSave,
}) => {
  const [facultyData, setFacultyData] = useState<FacultyData[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = initialData && initialData.facultyID !== "";

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
      console.error("Error fetching faculty data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    const faculty = facultyData.find(f => f.fact_email === selectedEmail);
    setSelectedFaculty(faculty || null);
  };

  const initialValues: FacultySalaryFormValues = isEditMode
    ? {
        ...initialData,
        facultyDeduction: initialData.facultyDeduction.length
          ? initialData.facultyDeduction
          : [{ name: "", amount: 0 }],
      }
    : {
        facultyID: "",
        facultySalary: 0,
        facultyTax: 0,
        facultyTransport: 0,
        facultyDeduction: [{ name: "", amount: 0 }],
      };

      const handleSubmit = async (values: FacultySalaryFormValues) => {
        const cleanedDeductions = values.facultyDeduction.filter(
          (deduction) => deduction.name && deduction.amount > 0
        );
        
        // Create different payloads for save and update
        const payload = isEditMode ? {
          facultyID: values.facultyID,
          facultySalary: values.facultySalary,
          facultyTax: values.facultyTax,
          facultyTransport: values.facultyTransport,
          facultyDeduction: cleanedDeductions,
        } : {
          ...values,
          facultyDeduction: cleanedDeductions,
        };
      
        try {
          await onSave(payload);
        } catch (error) {
          console.error("Salary save/update error:", error);
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
    <div className="box mt-4">
       
        <h1 className="text-center mt-4 text-3xl">{isEditMode ? "Edit Faculty Salary" : "Add Faculty Salary"}</h1>
          
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
                    Select  Email:
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
                    className={`form-control ${
                      touched.facultyID && errors.facultyID ? "is-invalid" : ""
                    }`}
                    disabled={!!selectedFaculty}
                  />
                  <ErrorMessage
                    name="facultyID"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {/* Rest of the form fields remain the same */}
                {/* Salary */}
                <div className="mb-3">
                  <label className="form-label">Salary Amount:</label>
                  <Field
                    name="facultySalary"
                    type="number"
                    className={`form-control ${
                      touched.facultySalary && errors.facultySalary
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
                    className={`form-control ${
                      touched.facultyTax && errors.facultyTax ? "is-invalid" : ""
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
                    className={`form-control ${
                      touched.facultyTransport && errors.facultyTransport
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
                  <label className="form-label">Deductions</label>
                  <FieldArray name="facultyDeduction">
                    {({ remove, push }) => (
                      <>
                        {values.facultyDeduction.map((_, index) => (
                          <div key={index} className="row mb-2">
                            <div className="col-md-5">
                              <Field
                                name={`facultyDeduction[${index}].name`}
                                placeholder="Deduction Name"
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-5">
                              <Field
                                name={`facultyDeduction[${index}].amount`}
                                type="number"
                                placeholder="Deduction Amount"
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-2">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-danger"
                                disabled={values.facultyDeduction.length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ name: "", amount: 0 })}
                          className="btn btn-secondary button"
                        >
                          Add Deduction
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button type="submit" className="btn btn-primary button">
                    {isEditMode ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary btn-danger"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    
  );
};

export default FacultySalaryForm;