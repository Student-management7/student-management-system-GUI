


import * as Yup from 'yup';

export const facultyValidationSchema = Yup.object().shape({
    fact_Name: Yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters'),
    fact_email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    fact_address: Yup.string()
        .required('Address is required'),
    fact_city: Yup.string()
        .required('City is required'),
    fact_state: Yup.string()
        .required('State is required'),
    fact_contact: Yup.string()
        .required('Contact number is required')
        .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
    fact_gender: Yup.string()
        .required('Gender is required')
        .oneOf(['M', 'F', 'Other'], 'Please select a valid gender'),
    fact_joiningDate: Yup.date()
        .required('Joining date is required')
        .max(new Date(), 'Joining date cannot be in the future'),
    fact_leavingDate: Yup.date()
        .nullable()
        .max(new Date(), 'Leaving date cannot be in the future'),
    fact_status: Yup.string()
        .required('Status is required'),
    qualifications: Yup.array().of(
        Yup.object().shape({
            type: Yup.string().required('Qualification type is required'),
            subject: Yup.string().required('Subject is required'),
            branch: Yup.string().required('Branch is required'),
            grade: Yup.string().required('Grade is required'),
            university: Yup.string().required('University is required'),
            yearOfPassing: Yup.string()
                .required('Year of passing is required')
               
        })
    ),
    fact_cls: Yup.array().of(
        Yup.object().shape({
            cls_name: Yup.string().required('Class name is required'),
            cls_sub: Yup.array().of(Yup.string().required('Subject is required')),
        })
    ),
});
