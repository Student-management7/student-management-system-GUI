import * as Yup from "yup";

export const validationSchema = Yup.object({
  className: Yup.string().required("Class is required"),
  schoolFee: Yup.number().required("School fee is required").min(0),
  sportsFee: Yup.number().required("Sports fee is required").min(0),
  bookFee: Yup.number().required("Book fee is required").min(0),
  transportation: Yup.number().required("Transportation fee is required").min(0),
  otherAmount: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      amount: Yup.number().required("Amount is required").min(0),
    })
  ),
});
