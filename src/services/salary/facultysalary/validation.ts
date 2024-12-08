import * as Yup from "yup";

export const FacultySalaryValidationSchema = Yup.object({
  facultyID: Yup.string().required("Faculty ID is required"),
  facultySalary: Yup.number()
    .required("Salary amount is required")
    .min(1, "Salary must be greater than 0"),
  facultyTax: Yup.number()
    .required("Tax percentage is required")
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100%"),
  facultyTransport: Yup.number()
    .required("Transport allowance is required")
    .min(0, "Transport allowance cannot be negative"),
  facultyDeduction: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Deduction name is required"),
      amount: Yup.number()
        .required("Deduction amount is required")
        .min(0, "Deduction amount cannot be negative"),
    })
  ),
});
