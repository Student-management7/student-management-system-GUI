import * as Yup from 'yup';

export const facultyValidationSchema = Yup.object().shape({
  fact_Name: Yup.string().required('Full Name is required'),
  fact_email: Yup.string().email('Invalid email').required('Email is required'),
  fact_contact: Yup.string().required('Contact is required'),
  fact_gender: Yup.string().required('Gender is required'),
  fact_address: Yup.string().required('Address is required'),
  fact_city: Yup.string().required('City is required'),
  // fact_state: Yup.string().required('State is required'),
  fact_joiningDate: Yup.date().required('Joining Date is required'),
  // fact_qualifications: Yup.array().of(
  //   Yup.object().shape({
  //     type: Yup.string().required('Type is required'),
  //     grd_sub: Yup.string().required('Subject is required'),
  //     grd_branch: Yup.string().required('Branch is required'),
  //     grd_grade: Yup.string().required('Grade is required'),
  //     grd_university: Yup.string().required('University is required'),
  //     grd_yearOfPassing: Yup.date().required('Year of Passing is required'),
  //   })
  // ),
  // Fact_cls: Yup.array().of(
  //   Yup.object().shape({
  //     cls_name: Yup.string().required('Class Name is required'),
  //     cls_sub: Yup.array().of(Yup.string().required('Subject is required')),
  //   })
  // ),

  email: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});