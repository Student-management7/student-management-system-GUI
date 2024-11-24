import * as Yup from 'yup';

export const facultyValidationSchema = Yup.object().shape({
    fact_Name: Yup.string()
        .required('Full name is required'),
    fact_email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    fact_contact: Yup.string()
        .required('Contact number is required')
        .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
    fact_gender: Yup.string()
        .required('Gender is required'),
    fact_address: Yup.string()
        .required('Address is required'),
    fact_city: Yup.string()
        .required('City is required'),
    fact_state: Yup.string()
        .required('State is required'),
    fact_joiningDate: Yup.string()
        .required('Joining date is required'),
    fact_leavingDate: Yup.string()
        .nullable(),
        
});
