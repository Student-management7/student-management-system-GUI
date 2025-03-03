import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft } from "lucide-react";

// Validation schema specific for editing
const EditSalaryValidationSchema = Yup.object().shape({
  facultySalary: Yup.number().required('Salary is required').min(0, 'Salary must be a positive number'),
  facultyTax: Yup.number().required('Tax is required').min(0, 'Tax must be a positive number'),
  facultyTransport: Yup.number().required('Transport allowance is required').min(0, 'Transport allowance must be a positive number'),
  facultyDeduction: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      amount: Yup.number().min(0, 'Deduction amount must be a positive number')
    })
  )
});

interface FacultyDeduction {
  name: string;
  amount: number;
}

interface EditFacultySalaryFormProps {
  initialData: {
    id: string;
    facultyID: string;
    facultySalary: number;
    facultyTax: number;
    facultyTransport: number;
    facultyDeduction: FacultyDeduction[] | string;
  };
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}

const EditFacultySalaryForm: React.FC<EditFacultySalaryFormProps> = ({
  initialData,
  onCancel,
  onSave,
}) => {
  // Parse deductions if they're a string
  const parseDeductions = (deductions: string | FacultyDeduction[]): FacultyDeduction[] => {
    if (typeof deductions === 'string') {
      try {
        return JSON.parse(deductions);
      } catch {
        return [{ name: "", amount: 0 }];
      }
    }
    return deductions.length > 0 ? deductions : [{ name: "", amount: 0 }];
  };

  // Format initial values
  const formInitialValues = {
    id: initialData.id,
    facultyID: initialData.facultyID,
    facultySalary: initialData.facultySalary,
    facultyTax: initialData.facultyTax,
    facultyTransport: initialData.facultyTransport,
    facultyDeduction: parseDeductions(initialData.facultyDeduction),
  };

  const handleSubmit = async (values: any) => {
    const cleanedDeductions = values.facultyDeduction.filter(
      (deduction: FacultyDeduction) => deduction.name && deduction.amount > 0
    );
    
    // Edit payload structure
    const payload = {
      id: values.id,
      facultyID: values.facultyID,
      facultySalary: values.facultySalary,
      facultyTax: values.facultyTax,
      facultyTransport: values.facultyTransport,
      facultyDeduction: cleanedDeductions.map((deduction: FacultyDeduction) => ({
        name: deduction.name,
        amount: deduction.amount,
      })),
    };
    
    try {
      await onSave(payload);
      toast.success("Salary updated successfully");
    } catch (error) {
      toast.error("Failed to update salary");
      console.error("Salary update error:", error);
    }
  };

  return (

    <>
    <div className="box ">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="head1 flex items-center">
        <button onClick={onCancel} className="p-2 rounded-full arrow transition">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <span className="ml-4">Update Salary</span>
      </div>
      <div className="box">
        <Formik
          initialValues={formInitialValues}
          validationSchema={EditSalaryValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form>
              {/* Hidden ID field */}
              <Field type="hidden" name="id" />
              <Field type="hidden" name="facultyID" />
              
              {/* Faculty ID Display */}
              <div className="mb-3">
                <label className="form-label">Faculty ID:</label>
                <div className="form-control bg-gray-100">
                  {values.facultyID}
                </div>
              </div>
              
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
                      {values.facultyDeduction.map((_: any, index: number) => (
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
                              className="btn buttonred"
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
                  Update
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

export default EditFacultySalaryForm;