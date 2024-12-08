import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { FacultySalaryValidationSchema } from "../../../services/salary/facultysalary/validation";
import { FacultySalaryFormProps } from "../../../services/salary/facultysalary/type";
import { saveFacultySalary, updateFacultySalary } from "../../../services/salary/facultysalary/Api";

const FacultySalaryForm: React.FC<FacultySalaryFormProps> = ({
    initialData,
    onCancel,
    onSave,
}) => {
    // Determine if the form is in "edit" mode
    const isEdit = !!initialData;

    // Define initial values for the form
    const initialValues = initialData || {
        facultyID: "",
        facultySalary: 0,
        facultyTax: 0,
        facultyTransport: 0,
        facultyDeduction: [{ name: "", amount: 0 }],
    };

    // Handle form submission
    const handleSubmit = async (values: any) => {
        const payload = {
            ...values,
            facultyDeduction: values.facultyDeduction.filter(
                (deduction: any) => deduction.name && deduction.amount
            ),
        };
    
        try {
            if (isEdit) {
                // Extract the ID for update
                await updateFacultySalary(values.facultyID, payload); // Pass ID and payload
            } else {
                await saveFacultySalary(payload); // Call save API for new data
            }
            onSave(payload); // Trigger parent callback on success
        } catch (error) {
            console.error("Error saving/editing salary:", error);
        }
    };
    
    return (
        <div className="box container mt-4">
            <h2 className="text-center mb-4">
                {isEdit ? "Edit Faculty Salary" : "Create Faculty Salary"}
            </h2>
            <Formik
                initialValues={initialValues}
                validationSchema={FacultySalaryValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form>
                        {/* Faculty ID Field */}
                        <div className="mb-3">
                            <label className="form-label">Faculty ID:</label>
                            <Field
                                name="facultyID"
                                type="text"
                                className="form-control"
                                placeholder="Enter Faculty ID"
                            />
                            <ErrorMessage
                                name="facultyID"
                                component="div"
                                className="text-danger mt-1"
                            />
                        </div>

                        {/* Salary Field */}
                        <div className="mb-3">
                            <label className="form-label">Salary Amount:</label>
                            <Field
                                name="facultySalary"
                                type="number"
                                className="form-control"
                                placeholder="Enter Salary"
                            />
                            <ErrorMessage
                                name="facultySalary"
                                component="div"
                                className="text-danger mt-1"
                            />
                        </div>

                        {/* Tax Field */}
                        <div className="mb-3">
                            <label className="form-label">Tax (%):</label>
                            <Field
                                name="facultyTax"
                                type="number"
                                className="form-control"
                                placeholder="Enter Tax Percentage"
                            />
                            <ErrorMessage
                                name="facultyTax"
                                component="div"
                                className="text-danger mt-1"
                            />
                        </div>

                        {/* Transport Allowance Field */}
                        <div className="mb-3">
                            <label className="form-label">Transport Allowance:</label>
                            <Field
                                name="facultyTransport"
                                type="number"
                                className="form-control"
                                placeholder="Enter Transport Allowance"
                            />
                            <ErrorMessage
                                name="facultyTransport"
                                component="div"
                                className="text-danger mt-1"
                            />
                        </div>

                        {/* Deductions Field Array */}
                        <div className="mb-3">
                            <label className="form-label">Deductions:</label>
                            <FieldArray name="facultyDeduction">
                                {({ remove, push }) => (
                                    <>
                                        {values.facultyDeduction.map((deduction, index) => (
                                            <div key={index} className="row mb-2">
                                                {/* Deduction Name */}
                                                <div className="col-md-5">
                                                    <Field
                                                        name={`facultyDeduction[${index}].name`}
                                                        placeholder="Deduction Name"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name={`facultyDeduction[${index}].name`}
                                                        component="div"
                                                        className="text-danger mt-1"
                                                    />
                                                </div>

                                                {/* Deduction Amount */}
                                                <div className="col-md-4">
                                                    <Field
                                                        name={`facultyDeduction[${index}].amount`}
                                                        type="number"
                                                        placeholder="Deduction Amount"
                                                        className="form-control"
                                                    />
                                                    <ErrorMessage
                                                        name={`facultyDeduction[${index}].amount`}
                                                        component="div"
                                                        className="text-danger mt-1"
                                                    />
                                                </div>

                                                {/* Remove Deduction Button */}
                                                <div className="col-md-3 d-flex align-items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Deduction Button */}
                                        <button
                                            type="button"
                                            onClick={() => push({ name: "", amount: 0 })}
                                            className="btn btn-primary btn-sm mt-2"
                                        >
                                            Add Deduction
                                        </button>
                                    </>
                                )}
                            </FieldArray>
                        </div>

                        {/* Form Actions */}
                        <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btn btn-success">
                                {isEdit ? "Update" : "Save"}
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
    );
};

export default FacultySalaryForm;
