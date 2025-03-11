import * as Yup from "yup";

export const validationSchema = Yup.object({
  className: Yup.string().required("Class is required"),
  schoolFee: Yup.number().required("School fee is required").min(100),
  sportsFee: Yup.number().required("Sports fee is required").min(0),
  bookFee: Yup.number().required("Book fee is required").min(0),
  transportation: Yup.number().required("Transportation fee is required").min(0),
  otherAmount: Yup.array().of(
    Yup.object({
      name: Yup.string().matches(
        /^[A-Za-z\s]+$/,
        "Name must contain only letters and spaces (no numbers or special characters)"
      ),
      amount: Yup.number().min(1, 'Amount must be greater than 0'),
    })
  ),
});
