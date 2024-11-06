import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { getStdDetails, saveStdDetails } from '../../services/studentRegistration/api/StudentRegistration';
import { StudentFormData, FamilyDetails } from '../../services/studentRegistration/type/StudentRegistrationType';



import GridView from './GridView';
// import { Alert, AlertTitle } from '@/components/ui/alert';

import CustomAlert from '../UI/alert'; // Import the new custom alert component

const validationSchema = Yup.object().shape({
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

const StudentRegistrationController = (props: StudentFormData) => {
    const [error, setError] = useState<string | null>(null);
    const [rowData, setRowData] = useState<any[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);


    const [columnDefs] = useState<any[]>([
        { field: 'name', headerName: 'Name' },
        { field: 'city', headerName: 'City' },
        { field: 'cls', headerName: 'Class' },
        { field: 'address', headerName: 'Address' },
        { field: 'gender', headerName: 'Gender' },
        { field: 'state', headerName: 'State' },
        { field: 'familyDetails.stdo_FatherName', headerName: 'Father Name' },
        { field: 'familyDetails.stdo_MotherName', headerName: 'Mother Name' },
        { field: 'familyDetails.stdo_primaryContact', headerName: 'Contact' }
    ]);
    const [switchForm, setSwitchForm] = useState<boolean>(false);
    const [studentData, setStudentData] = useState<boolean>(false);

    const initialValues = {
        name: '',
        address: '',
        city: '',
        state: '',
        contact: '',
        gender: '',
        dob: '',
        email: '',
        cls: '',
        department: '',
        category: '',
        familyDetails: {
            stdo_FatherName: '',
            stdo_MotherName: '',
            stdo_primaryContact: '',
            stdo_secondaryContact: '',
            stdo_city: '',
            stdo_state: '',
            stdo_email: ''
        }
    };

    const fetchStudentDetails = async () => {
        try {
            const data = await getStdDetails();
            setRowData(data);
        } catch (err) {
            setError('Failed to fetch student details');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const addForm = () => {
        setSwitchForm(true);
    };

    const setSwitch = () => {
        setStudentData(true);
    };

    const handleSubmit = async (values: StudentFormData, { resetForm }: any) => {
        try {
            await saveStdDetails(values);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                resetForm();
            }, 3000);
        } catch (err) {
            setError('Failed to save student details');
            console.error(err);
        }
    };

    return (
        <>
            {!studentData ? (
                <div className='box'>
                    <div className='text-right'>
                        <button onClick={setSwitch} className='btn btn-default'>Add Student</button>
                    </div>
                    <GridView rowData={rowData} columnDefs={columnDefs} onAddRow={addForm} />
                </div>
            ) : (
                <div className='box'>
                    <div className='headding1'>
                        <h1>
                            <Link to='/'>
                                <i className="bi bi-arrow-left-circle" /> <span>User Details</span>
                            </Link>
                        </h1>
                    </div>


                    {showSuccess && (
                        <CustomAlert
                            message="Form submitted successfully!"
                            type="success"
                            onClose={() => setShowSuccess(false)}
                        />
                    )}


                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="name" className="form-label">Full Name (Required)</label>
                                            <Field
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                                                placeholder='Enter full name'
                                            />
                                            {errors.name && touched.name && (
                                                <div className="invalid-feedback">{errors.name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <Field
                                                type="text"
                                                id="address"
                                                name="address"
                                                className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`}
                                                placeholder='Enter Address'
                                            />
                                            {errors.address && touched.address && (
                                                <div className="invalid-feedback">{errors.address}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="city" className="form-label">City</label>
                                            <Field
                                                type="text"
                                                id="city"
                                                name="city"
                                                className={`form-control ${errors.city && touched.city ? 'is-invalid' : ''}`}
                                                placeholder='Enter city'
                                            />
                                            {errors.city && touched.city && (
                                                <div className="invalid-feedback">{errors.city}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Continue with all other fields following the same pattern */}
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="state" className="form-label">State</label>
                                            <Field
                                                type="text"
                                                id="state"
                                                name="state"
                                                className={`form-control ${errors.state && touched.state ? 'is-invalid' : ''}`}
                                                placeholder='Enter state'
                                            />
                                            {errors.state && touched.state && (
                                                <div className="invalid-feedback">{errors.state}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="contact" className="form-label">Contact</label>
                                            <Field
                                                type="text"
                                                id="contact"
                                                name="contact"
                                                className={`form-control ${errors.contact && touched.contact ? 'is-invalid' : ''}`}
                                                placeholder='Enter contact'
                                            />
                                            {errors.contact && touched.contact && (
                                                <div className="invalid-feedback">{errors.contact}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="gender" className="form-label">Gender</label>
                                            <Field
                                                as="select"
                                                id="gender"
                                                name="gender"
                                                className={`form-control ${errors.gender && touched.gender ? 'is-invalid' : ''}`}
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Field>
                                            {errors.gender && touched.gender && (
                                                <div className="invalid-feedback">{errors.gender}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="dob" className="form-label">Date Of Birth</label>
                                            <Field
                                                type="date"
                                                id="dob"
                                                name="dob"
                                                className={`form-control ${errors.dob && touched.dob ? 'is-invalid' : ''}`}
                                            />
                                            {errors.dob && touched.dob && (
                                                <div className="invalid-feedback">{errors.dob}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                placeholder='Enter email'
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="cls" className="form-label">Admission Class</label>
                                            <Field
                                                type="text"
                                                id="cls"
                                                name="cls"
                                                className={`form-control ${errors.cls && touched.cls ? 'is-invalid' : ''}`}
                                                placeholder='Enter Class'
                                            />
                                            {errors.cls && touched.cls && (
                                                <div className="invalid-feedback">{errors.cls}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="department" className="form-label">Department</label>
                                            <Field
                                                type="text"
                                                id="department"
                                                name="department"
                                                className="form-control"
                                                placeholder='Enter Department'
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <Field
                                                type="text"
                                                id="category"
                                                name="category"
                                                className={`form-control ${errors.category && touched.category ? 'is-invalid' : ''}`}
                                                placeholder='Enter category'
                                            />
                                            {errors.category && touched.category && (
                                                <div className="invalid-feedback">{errors.category}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <hr className='hr' />
                                <div className='titel'><h2>Family Details</h2></div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_FatherName" className="form-label">Father's Name</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_FatherName"
                                                name="familyDetails.stdo_FatherName"
                                                className={`form-control ${errors.familyDetails?.stdo_FatherName &&
                                                    touched.familyDetails?.stdo_FatherName ? 'is-invalid' : ''
                                                    }`}
                                                placeholder="Enter father's name"
                                            />
                                            {errors.familyDetails?.stdo_FatherName &&
                                                touched.familyDetails?.stdo_FatherName && (
                                                    <div className="invalid-feedback">
                                                        {errors.familyDetails.stdo_FatherName}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_MotherName" className="form-label">Mother's Name</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_MotherName"
                                                name="familyDetails.stdo_MotherName"
                                                className="form-control"
                                                placeholder="Enter mother's name"
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_primaryContact" className="form-label">Primary Contact</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_primaryContact"
                                                name="familyDetails.stdo_primaryContact"
                                                className={`form-control ${errors.familyDetails?.stdo_primaryContact &&
                                                    touched.familyDetails?.stdo_primaryContact ? 'is-invalid' : ''
                                                    }`}
                                                placeholder="Enter primary contact"
                                            />
                                            {errors.familyDetails?.stdo_primaryContact &&
                                                touched.familyDetails?.stdo_primaryContact && (
                                                    <div className="invalid-feedback">
                                                        {errors.familyDetails.stdo_primaryContact}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_secondaryContact" className="form-label">Secondary Contact</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_secondaryContact"
                                                name="familyDetails.stdo_secondaryContact"
                                                className="form-control"
                                                placeholder="Enter secondary Contact"
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_city" className="form-label">Family Address</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_city"
                                                name="familyDetails.stdo_city"
                                                className="form-control"
                                                placeholder="Enter family address"
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_state" className="form-label">Family State</label>
                                            <Field
                                                type="text"
                                                id="familyDetails.stdo_state"
                                                name="familyDetails.stdo_state"
                                                className="form-control"
                                                placeholder="Enter family state"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <label htmlFor="familyDetails.stdo_email" className="form-label">Family Email Id</label>
                                            <Field
                                                type="email"
                                                id="familyDetails.stdo_email"
                                                name="familyDetails.stdo_email"
                                                className="form-control"
                                                placeholder="Enter family Email"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='text-center mt-4'>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </>
    );
};

export default StudentRegistrationController;