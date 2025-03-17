import * as Yup from 'yup';

export const facultyValidationSchema = (editmode: boolean) => 
  Yup.object().shape({
    fact_Name: Yup.string().required('Full Name is required')
    .min(3, "Name must be at least 3  characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Name must contain only letters and spaces (no numbers or special characters)"
    ).max(40, "Name must be at most 20 characters"),
    fact_email: Yup.string().email('Invalid email').required('Email is required'),
    fact_contact: Yup.string().required('Contact is required').matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),

    fact_gender: Yup.string().required('Gender is required'),
    fact_address: Yup.string().required('Address is required')
    .min(3, "Address must be at least 3 characters")
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
      "Address must contain at least one letter and can include numbers, spaces, and .,-"
    ).max(60, "Name must be at most 20 characters"),
    fact_city: Yup.string().required('City is required').matches(
      /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
      "City must contain at least one letter and can include numbers, spaces, and .,-"
    ).max(40, "Name must be at most 20 characters"),
    fact_state: Yup.string().required('State is required').matches(
      /^[A-Za-z\s.-]+$/,
      "State must contain only letters, spaces, dots, or hyphens (no numbers or other special characters)"
    ).max(40, "Name must be at most 20 characters"),
   
    fact_joiningDate: Yup.date()
    .required('Joining Date is required'),
    

    // Conditional Validation based on edit mode
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .when([], {
        is: () => editmode,
        then: schema => schema.required('Email is required in edit mode'),
      }),

    fact_password: Yup.string().required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .when([], {
        is: () => editmode,
        then: schema => schema.required('Password is required in edit mode'),
      }),
  });
