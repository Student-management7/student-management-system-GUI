import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage ,FormikHelpers} from 'formik';

import { FaPlus, FaMinus } from 'react-icons/fa';
import { facultyValidationSchema } from '../../services/fecultyRegistretion/validation';
import { FacultyFormData,  } from '../../services/fecultyRegistretion/Type/FecultyRegistrationType';
import { saveFacultyDetails, getFacultyDetails } from '../../services/fecultyRegistretion/API/API';
import GridView from './GridView';
import CustomAlert from '../UI/alert';


const FacultyRegistrationForm: React.FC = () => {
  const [rowData, setRowData] = useState<FacultyFormData[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const initialValues: FacultyFormData = {
    fact_Name: '',
    fact_email: '',
    fact_contact: '',
    fact_gender: '',
    fact_address: '',
    fact_city: '',
    fact_state: '',
    fact_joiningDate: '',
    fact_leavingDate: '',
    fact_status: '',
    qualifications: [
      { type: 'Graduation', subject: '', branch: '', grade: '', university: '', yearOfPassing: '' }
    ],
    fact_cls: [{ cls_name: '', cls_sub: [''] }],
  };

  // Fetch faculty details
  const fetchFacultyDetails = async () => {
    try {
      const data = await getFacultyDetails();
      if (Array.isArray(data)) {
        setRowData(data);
      } else {
        console.error('Unexpected data format');
      }
    } catch (error) {
      console.error('Failed to fetch faculty details:', error);
    }
  };

  useEffect(() => {
    fetchFacultyDetails();
  }, []);

  // Define handleSubmit with proper type annotations

  const handleSubmit = async (
    data: FacultyFormData,
    { resetForm }: FormikHelpers<FacultyFormData>
) => {
    try {
        const response = await saveFacultyDetails(data);
        if (response.status === 200) {
            setRowData((prev) => [...prev, data]);
            setShowSuccess(true);
            setShowError(false);
            setIsFormVisible(false);
            resetForm(); // reset the form upon success
        } else {
            setShowError(true);
            console.error('Failed to save data on the server');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert("An error occurred while submitting the form. Please check the console for details.");
        setShowError(true);
    }
};



  // Toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };




  return (
    <>
      {!isFormVisible ? (
        <div className="box">
          <button onClick={toggleFormVisibility} className="btn btn-default">
            {isFormVisible ? 'Hide Form' : 'Add Faculty'}
          </button>



          {showSuccess && (
            <CustomAlert
              message="Form submitted successfully!"
              type="success"
              onClose={() => setShowSuccess(false)}
            />
          )}

          {showError && (
            <CustomAlert
              message="There was an error submitting the form. Please try again."
              // type="danger"
              onClose={() => setShowError(false)}
            />
          )}


          <GridView rowData={rowData} columnDefs={[
            { field: 'fact_Name', headerName: 'Name' },
            { field: 'fact_city', headerName: 'City' },
            { field: 'fact_contact', headerName: 'Contact' },
            { field: 'fact_address', headerName: 'Address' },
            { field: 'fact_gender', headerName: 'Gender' },
            { field: 'fact_state', headerName: 'State' },
            { field: 'fact_email', headerName: 'Email' },
            { field: 'fact_status', headerName: 'Status' },
          ]} />
        </div>
      ) : (
        <div className="box">
          {showSuccess && <CustomAlert message="Form submitted successfully!" type="success" onClose={() => setShowSuccess(false)} />}

          <Formik
            initialValues={initialValues}
            
            validationSchema={facultyValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                {/* Basic  Fields */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_Name" className="form-label">Full Name</label>
                    <Field type="text" id="fact_Name" name="fact_Name" className={`form-control ${errors.fact_Name && touched.fact_Name ? 'is-invalid' : ''}`} placeholder="Enter full name" />
                    <ErrorMessage name="fact_Name" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_email" className="form-label">Email</label>
                    <Field type="email" id="fact_email" name="fact_email" className={`form-control ${errors.fact_email && touched.fact_email ? 'is-invalid' : ''}`} placeholder="Enter email" />
                    <ErrorMessage name="fact_email" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_contact" className="form-label">Contact</label>
                    <Field type="text" id="fact_contact" name="fact_contact" className={`form-control ${errors.fact_contact && touched.fact_contact ? 'is-invalid' : ''}`} placeholder="Enter contact number" />
                    <ErrorMessage name="fact_contact" component="div" className="invalid-feedback" />
                  </div>
                </div>

                {/* Gender, Address, City */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_gender" className="form-label">Gender</label>
                    <Field as="select" id="fact_gender" name="fact_gender" className={`form-control ${errors.fact_gender && touched.fact_gender ? 'is-invalid' : ''}`}>
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </Field>
                    <ErrorMessage name="fact_gender" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_address" className="form-label">Address</label>
                    <Field type="text" id="fact_address" name="fact_address" className={`form-control ${errors.fact_address && touched.fact_address ? 'is-invalid' : ''}`} placeholder="Enter address" />
                    <ErrorMessage name="fact_address" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_city" className="form-label">City</label>
                    <Field type="text" id="fact_city" name="fact_city" className={`form-control ${errors.fact_city && touched.fact_city ? 'is-invalid' : ''}`} placeholder="Enter city" />
                    <ErrorMessage name="fact_city" component="div" className="invalid-feedback" />
                  </div>
                </div>

                {/* State, Joining Date, Leaving Date */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_state" className="form-label">State</label>
                    <Field type="text" id="fact_state" name="fact_state" className={`form-control ${errors.fact_state && touched.fact_state ? 'is-invalid' : ''}`} placeholder="Enter state" />
                    <ErrorMessage name="fact_state" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_joiningDate" className="form-label">Joining Date</label>
                    <Field type="date" id="fact_joiningDate" name="fact_joiningDate" className={`form-control ${errors.fact_joiningDate && touched.fact_joiningDate ? 'is-invalid' : ''}`} />
                    <ErrorMessage name="fact_joiningDate" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_leavingDate" className="form-label">Leaving Date</label>
                    <Field type="date" id="fact_leavingDate" name="fact_leavingDate" className="form-control" />
                  </div>
                </div>

                {/* Qualifications Section */}
                <FieldArray name="qualifications">
                  {({ push, remove }) => (
                    <div className="mt-4">
                      <label className="form-label">Qualifications</label>
                      <button type="button" onClick={() => push({ type: '', subject: '', branch: '', grade: '', university: '', yearOfPassing: '' })} className="btn btn-grey btn-sm">
                        <FaPlus />
                      </button>
                      {values.qualifications.map((_, index) => (
                        <div key={index} className="row mb-2">
                          <div className="col-md-2 mb-1">
                            <Field name={`qualifications[${index}].type`} placeholder="Type" className="form-control" />
                            <ErrorMessage name={`qualifications[${index}].type`} component="div" className="text-danger" />

                          </div>
                          <div className="col-md-2 mb-1">
                            <Field name={`qualifications[${index}].subject`} placeholder="Subject" className="form-control" />
                          </div>
                          <div className="col-md-2 mb-1">
                            <Field name={`qualifications[${index}].branch`} placeholder="Branch" className="form-control" />
                          </div>
                          <div className="col-md-2 mb-1">
                            <Field name={`qualifications[${index}].grade`} placeholder="Grade" className="form-control" />
                          </div>
                          <div className="col-md-2 mb-1">
                            <Field name={`qualifications[${index}].university`} placeholder="University" className="form-control" />
                          </div>

                          <div className="col-md-2">
                            <Field name={`qualifications[${index}].yearOfPassing`} type="date" placeholder="Year of Passing" className="form-control" />
                            <ErrorMessage name={`qualifications[${index}].yearOfPassing`} component="div" className="text-danger" />
                          </div>

                          <div className="col-md-1 d-flex align-items-center">
                            {index > 0 && (
                              <button type="button" onClick={() => remove(index)} className="btn btn-grey btn-sm">
                                <FaMinus />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>


                {/* Classes Section */}
                <FieldArray name="fact_cls">
                  {({ push, remove }) => (
                    <div className="mt-4">
                      <label className="form-label"> Classes</label>
                      <button type="button" onClick={() => push({ cls_name: '', cls_sub: [''] })} className="btn btn-grey btn-sm">
                        <FaPlus />
                      </button>
                      {values.fact_cls.map((_, classIndex) => (
                        <div key={classIndex} className="mb-3">
                          <div className="row mb-2">
                            <div className="col-md-3">
                              <Field
                                name={`fact_cls[${classIndex}].cls_name`}
                                placeholder="Class Name"
                                className="form-control"
                              />
                              <ErrorMessage name={`fact_cls[${classIndex}].cls_name`} component="div" className="text-danger" />
                            </div>
                            <div className="col-md-7">
                              <FieldArray name={`fact_cls[${classIndex}].cls_sub`}>
                                {({ push: pushSubject, remove: removeSubject }) => (
                                  <div>
                                    <label className="form-label">Subjects</label>
                                    <button type="button" onClick={() => pushSubject('')} className="btn btn-grey btn-sm">
                                      <FaPlus />
                                    </button>
                                    {values.fact_cls[classIndex].cls_sub.map((_, subIndex) => (
                                      <div key={`${classIndex}-${subIndex}`} className="input-group mb-2">
                                        <Field
                                          name={`fact_cls[${classIndex}].cls_sub[${subIndex}]`}
                                          placeholder="Subject"
                                          className="form-control"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeSubject(subIndex)}
                                          className="btn btn-danger btn-sm"
                                        >
                                          <FaMinus />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                            <div className="col-md-2 d-flex align-items-center">
                              {classIndex > 0 && (
                                <button type="button" onClick={() => remove(classIndex)} className="btn btn-grey btn-sm">
                                  <FaMinus />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>



                {/* Status */}
                <div className="row mt-3">
                  <div className="col-md-4">
                    <label htmlFor="fact_status" className="form-label">Status</label>
                    <Field as="select" id="fact_status" name="fact_status" className={`form-control ${errors.fact_status && touched.fact_status ? 'is-invalid' : ''}`}>
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Field>
                    <ErrorMessage name="fact_status" component="div" className="invalid-feedback" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row mt-4 flex justify-center items-center">
                  <div className="col-md-4">
                  <button type="submit" className="btn btn-primary w-50 mb-5   ">Submit</button>
                  </div>
                </div>




              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default FacultyRegistrationForm;

