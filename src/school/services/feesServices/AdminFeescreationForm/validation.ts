import * as Yup from "yup";

export const validationSchema = Yup.object({
  className: Yup.string().required("Class is required"),
  schoolFee: Yup.number().required("School fee is required ").min(100,"School fee must be greater than or equal to 100"),
  sportsFee: Yup.number().required("Sports fee is required and correct format").min(0,"Sports fee must be greater than or equal to 0"),
  bookFee: Yup.number().required("Book fee is required").min(0,"Book fee must be greater than or equal to 0"),
  transportation: Yup.number().required("Transportation fee is required").min(0,"Transportation fee must be greater than or equal to 0"),
  otherAmount: Yup.array().of(
    Yup.object({
      name: Yup.string() .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
        " Name must contain at least one letter and can include numbers, spaces, and dot"
      ),
      amount: Yup.number().min(0," Other amount fee must be greater than or equal to 0"),
    })
  ),
});
