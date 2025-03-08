// FacultySalaryForm.validation.ts
import * as Yup from "yup";

export const SalaryValidationSchema = Yup.object().shape({
  facultyID: Yup.string().required("Faculty ID is required"),
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
    paymentMode: Yup.string().required("Payment mode is required"),


  
 
});
