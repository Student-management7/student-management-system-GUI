import * as Yup from 'yup';

export const facultyValidationSchema = (editmode: boolean) => 
  Yup.object().shape({
    fact_Name: Yup.string().required('Full Name is required'),
    fact_email: Yup.string().email('Invalid email').required('Email is required'),
    fact_contact: Yup.string().required('Contact is required'),
    fact_gender: Yup.string().required('Gender is required'),
    fact_address: Yup.string().required('Address is required'),
    fact_city: Yup.string().required('City is required'),
    // fact_state: Yup.string().required('State is required'),
    fact_joiningDate: Yup.date().required('Joining Date is required'),

    // Conditional Validation based on edit mode
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .when([], {
        is: () => editmode,
        then: schema => schema.required('Email is required in edit mode'),
      }),

    fact_password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .when([], {
        is: () => editmode,
        then: schema => schema.required('Password is required in edit mode'),
      }),
  });
