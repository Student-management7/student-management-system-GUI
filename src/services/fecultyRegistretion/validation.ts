
import  * as Yup from 'yup';
export const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters'),
    address: Yup.string()
        .required('Address is required'),
    city: Yup.string()
        .required('City is required'),
    state: Yup.string()
        .required('State is required'),
    contact: Yup.string()
        .required('Contact number is required')
        .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
    gender: Yup.string()
        .required('Gender is required')
        .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender'),
    dob: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth cannot be in the future'),
    cls: Yup.string()
        .required('Class is required'),
    category: Yup.string()
        .required('Category is required'),
    familyDetails: Yup.object().shape({
        stdo_FatherName: Yup.string()
            .required("Father's name is required"),
        stdo_primaryContact: Yup.string()
            .required('Primary contact is required')
            .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
    })
});