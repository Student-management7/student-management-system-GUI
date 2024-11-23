import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';

import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { facultyValidationSchema } from '../../services/fecultyRegistretion/validation';
import { FacultyFormData, Qualification ,Class} from '../../services/fecultyRegistretion/Type/FecultyRegistrationType';
import { saveFacultyDetails, getFacultyDetails, updateFacultyDetails ,deleteFacultyDetails } from '../../services/fecultyRegistretion/API/API';
import GridView from './GridView';
import CustomAlert from '../UI/alert';
import DeleteConfirmationModal from '../../services/DeleteModele/DeleteConfirmationModal';


const FacultyRegistrationForm: React.FC = () => {
  const [rowData, setRowData] = useState<FacultyFormData[]>([]);
  const [editingFaculty, setEditingFaculty] = useState<FacultyFormData | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  //
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedFacultyToDelete, setSelectedFacultyToDelete] = useState<FacultyFormData | null>(null);
 //

  const initialValues: FacultyFormData = {
    fact_id: editingFaculty?.fact_id || '',
    fact_Name: editingFaculty?.fact_Name || '',
    fact_email: editingFaculty?.fact_email || '',
    fact_contact: editingFaculty?.fact_contact || '',
    fact_gender: editingFaculty?.fact_gender || '',
    fact_address: editingFaculty?.fact_address || '',
    fact_city: editingFaculty?.fact_city || '',
    fact_state: editingFaculty?.fact_state || '',
    fact_joiningDate: editingFaculty?.fact_joiningDate || '',
    fact_leavingDate: editingFaculty?.fact_leavingDate || '',
    fact_qualifications: editingFaculty?.fact_qualifications || [
      { type: 'Graduation', grd_sub: '', grd_branch: '', grd_grade: '', grd_university: '', grd_yearOfPassing: '' },
    ],
    Fact_cls: editingFaculty?.Fact_cls || [{ cls_name: '', cls_sub: [''] }],
    Fact_status: editingFaculty?.Fact_status || '',
  };
  
  useEffect(() => {
    fetchFacultyDetails();
  }, []);
  
  const fetchFacultyDetails = async () => {
    try {
      const response = await getFacultyDetails();
      if (Array.isArray(response?.data)) {
        setRowData(response.data);
      } else {
        console.error('Unexpected data format:', response);
        setShowError(true);
      }
    } catch (error) {
      console.error('Failed to fetch faculty details:', error);
      setShowError(true);
    }
  };

  const handleSubmit = async (
    values: FacultyFormData,
    { resetForm, setSubmitting }: FormikHelpers<FacultyFormData>
  ) => {
    try {
      const submissionData = {
        ...values,
        fact_id: editingFaculty?.fact_id || values.fact_id,
      };

      let response;
      if (editingFaculty) {
        response = await updateFacultyDetails(submissionData, editingFaculty.fact_id);
      } else {
        response = await saveFacultyDetails(submissionData);
        console.log(response.data);
      }

      if (response?.status === 200) {
        await fetchFacultyDetails();
        setShowSuccess(true);
        setShowError(false);
        setIsFormVisible(false);
        setEditingFaculty(null);
        resetForm();
      } else {
        setShowError(true);
        console.error('Server response:', response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };
    


  const handleEdit = async (facultyData: FacultyFormData) => {
    try {
      if (!facultyData.fact_id) {
        console.error('Faculty ID is missing');
        return;
      }

      const response = await getFacultyDetails();
      console.log(response.data);
      const selectedFaculty = response.data.find(
        (faculty) => faculty.fact_id === facultyData.fact_id
      );

      if (selectedFaculty) {
        setIsFormVisible(true);
        setEditingFaculty(selectedFaculty);
        setIsEditMode(true);
      } else {
        console.error('Faculty not found');
      }
    } catch (error) {
      console.error('Error fetching faculty details:', error);
    }
  };

  //

  const handleDelete = async (facultyData: FacultyFormData) => {
    setSelectedFacultyToDelete(facultyData);
    setShowDeleteModal(true);
  };

  //

  const confirmDelete = async () => {
    try {
      if (!selectedFacultyToDelete?.fact_id) {
        console.error('Faculty ID is missing');
        return;
      }

      const response = await deleteFacultyDetails( selectedFacultyToDelete.fact_id);

      if (response?.status === 200) {
        setShowSuccess(true);
        await fetchFacultyDetails(); // Refresh the grid
        setShowDeleteModal(false);
        setSelectedFacultyToDelete(null);
      } else {
        setShowError(true);
        console.error('Delete failed:', response);
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      setShowError(true);
    }
  };

  //

  const columnDefs: any[] = [
    { field: 'fact_Name', headerName: 'Name' },
    { field: 'fact_city', headerName: 'City' },
    { field: 'fact_contact', headerName: 'Contact' },
    { field: 'fact_address', headerName: 'Address' },
    { field: 'fact_gender', headerName: 'Gender' },
    { field: 'fact_state', headerName: 'State' },
    { field: 'fact_email', headerName: 'Email' },
    { field: 'fact_status', headerName: 'Status' },


   {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(params.data)}
            className="btn btn-primary btn-sm"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => handleDelete(params.data)}
            className="btn btn-danger btn-sm"
          >
            <FaTrash /> Delete
          </button>
        </div>
      ),
    },

    
  ];


  return (
    <>
      {!isFormVisible ? (
        <div className="box">
          <button onClick={() => setIsFormVisible(true)} className="btn btn-default">
            Add Faculty
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
              message="There was an error. Please try again."
              type="error"
              onClose={() => setShowError(false)}
            />
          )}
   
          <GridView
            rowData={rowData}
            columnDefs={columnDefs}
          />

         {/* delete Modele implement he */}

         {showDeleteModal && selectedFacultyToDelete && (
            <DeleteConfirmationModal
              faculty={selectedFacultyToDelete}
              onConfirm={confirmDelete}
              onCancel={() => {
                setShowDeleteModal(false);
                setSelectedFacultyToDelete(null);
              }}
            />
          )}

         //



        </div>
      ) : (
        <div className="box">
          {showSuccess && <CustomAlert message="Form submitted successfully!" type="success" onClose={() => setShowSuccess(false)} />}

          <Formik
            initialValues={ initialValues}
            validationSchema={facultyValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // Fixed: Added to handle editing properly
          >
            {({ values, errors, touched, handleSubmit, resetForm }) => (
              <Form onSubmit={handleSubmit}>
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
                      {values.fact_qualifications.map((_, index) => (
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
                      <div className='row'>
                        <div className='col-md-4'>
                          <label className="form-label"> Classes</label>
                          <button type="button" onClick={() => push({ cls_name: '', cls_sub: [''] })} className="btn btn-grey btn-sm">
                            <FaPlus />
                          </button>
                        </div>
                        <div className='col-md-8'>
                            <label className="form-label">Subjects</label>
                            <button type="button" onClick={() => pushSubject('')} className="btn btn-grey btn-sm">
                              <FaPlus />
                            </button>
                            </div>
                        </div>
                     
                      
                      {values.Fact_cls.map((_, classIndex) => (
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
                                    
                                    {values.Fact_cls[classIndex].cls_sub.map((_, subIndex) => (
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
                    <Field as="select" id="fact_status" name="fact_status" className={`form-control ${errors.Fact_status && touched.Fact_status ? 'is-invalid' : ''}`}>
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
                    <button type="submit" className="btn btn-primary w-50 mb-5   ">{editingFaculty ? 'Update' : 'Submit'}</button>
                  </div>
                  {editingFaculty && <div className="col-md-4">
                    <button type="button" className="btn btn-danger w-50 mb-5" onClick={() => {
                      setEditingFaculty(null);
                      resetForm();
                      setIsFormVisible(false);
                    }} >Cancel</button>
                  </div>}
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

