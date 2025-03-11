import * as Yup from "yup";

export const validationSchema = Yup.object({
  className: Yup.string().required("Class is required"),
  schoolFee: Yup.number().required("School fee is required ").min(100),
  sportsFee: Yup.number().required("Sports fee is required and correct format").min(0),
  bookFee: Yup.number().required("Book fee is required").min(0),
  transportation: Yup.number().required("Transportation fee is required").min(0),
  otherAmount: Yup.array().of(
    Yup.object({
      name: Yup.string() .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
        " must contain at least one letter and can include numbers, spaces, and "
      ),
      amount: Yup.number().min(0, 'Amount must be 0 ot greater then 0'),
    })
  ),
});
