

import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

interface DeductionItem {
  name: string;
  amount: number;
}

interface FacultySalaryFormValues {
  facultyID: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: DeductionItem[];
  total?: number;
}

interface FacultySalaryFormProps {
  initialData?: FacultySalaryFormValues;
  onSave: (payload: FacultySalaryFormValues) => Promise<void>;
  onCancel: () => void;
}

const SalaryValidationSchema = Yup.object().shape({
  facultyID: Yup.string()
    .required("Faculty ID is required"),
   
  facultySalary: Yup.number()
    .positive("Salary must be positive")
    .required("Salary is required"),
  facultyTax: Yup.number()
    .min(0, "Tax cannot be negative")
    .max(50, "Tax cannot exceed 50%")
    .required("Tax is required"),
  facultyTransport: Yup.number()
    .min(0, "Transport allowance cannot be negative")
    .required("Transport allowance is required"),
  facultyDeduction: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Deduction name is required"),
      amount: Yup.number()
        .positive("Deduction amount must be positive")
        .required("Deduction amount is required")
    })
  )
});

const FacultySalaryForm: React.FC<FacultySalaryFormProps> = ({
  initialData,
  onCancel,
  onSave,
}) => {
  // Explicitly check if it's edit mode
  const isEditMode = initialData && initialData.facultyID !== "";

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
      
        const payload = {
          ...values,
          facultyDeduction: cleanedDeductions,
        };
      
        try {
          await onSave(payload);
        } catch (error) {
          console.error("Salary save/update error:", error);
        }
      };
      

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">
            {isEditMode ? "Edit Faculty Salary" : "Add New Faculty Salary"}
          </h2>
        </div>
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={SalaryValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label">Faculty ID:</label>
                  <Field
                    name="facultyID"
                    type="text"
                    className={`form-control ${
                      touched.facultyID && errors.facultyID ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter Faculty ID (e.g., FACT-1234)"
                  />
                  <ErrorMessage
                    name="facultyID"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Salary Amount:</label>
                  <Field
                    name="facultySalary"
                    type="number"
                    className={`form-control ${
                      touched.facultySalary && errors.facultySalary ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter Salary"
                  />
                  <ErrorMessage
                    name="facultySalary"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tax (%):</label>
                  <Field
                    name="facultyTax"
                    type="number"
                    className={`form-control ${
                      touched.facultyTax && errors.facultyTax ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter Tax Percentage"
                  />
                  <ErrorMessage
                    name="facultyTax"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Transport Allowance:</label>
                  <Field
                    name="facultyTransport"
                    type="number"
                    className={`form-control ${
                      touched.facultyTransport && errors.facultyTransport ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter Transport Allowance"
                  />
                  <ErrorMessage
                    name="facultyTransport"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

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
                          className="btn btn-secondary"
                        >
                          Add Deduction
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    {isEditMode ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
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
  );
};

export default FacultySalaryForm;



