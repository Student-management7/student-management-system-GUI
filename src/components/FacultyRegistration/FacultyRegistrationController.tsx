import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';

import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

import { facultyValidationSchema } from '../../services/Faculty/fecultyRegistretion/validation';
import { saveFacultyDetails, getFacultyDetails, updateFacultyDetails, deleteFacultyDetails } from '../../services/Faculty/fecultyRegistretion/API/API';
import GridView from './GridView';
import CustomAlert from '../UI/alert';
import DeleteConfirmationModal from '../../services/DeleteModele/DeleteConfirmationModal';
import { FacultyFormData } from '../../services/Faculty/fecultyRegistretion/Type/FecultyRegistrationType';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    fact_Username: editingFaculty?.fact_Username || '',
    fact_email: editingFaculty?.fact_email || '',
    fact_password: editingFaculty?.fact_password || '',
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
        toast.success(' Faculty submitted successfully!', {
          position: "top-right", // You can change the position
          autoClose: 3000, // Notification auto-close time in milliseconds
          hideProgressBar: false, // Optional: Show progress bar
          closeOnClick: true, // Optional: Close on click
          pauseOnHover: true, // Optional: Pause on hover
      });
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

      const response = await deleteFacultyDetails(selectedFacultyToDelete.fact_id);

      if (response?.status === 200) {
        setShowSuccess(true);
        await fetchFacultyDetails(); // Refresh the grid
        setShowDeleteModal(false);
        toast.success('Faculty delete successfully!', {
          position: "top-right", // You can change the position
          autoClose: 3000, // Notification auto-close time in milliseconds
          hideProgressBar: false, // Optional: Show progress bar
          closeOnClick: true, // Optional: Close on click
          pauseOnHover: true, // Optional: Pause on hover
      });
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
    { field: 'fact_Username', headerName: 'Username' },
    { field: 'fact_city', headerName: 'City' },
    { field: 'fact_contact', headerName: 'Contact' },
    { field: 'fact_address', headerName: 'Address' },
    { field: 'fact_gender', headerName: 'Gender' },
    { field: 'fact_state', headerName: 'State' },
    { field: 'fact_email', headerName: 'Email' },
    { field: 'fact_password', headerName: 'password' },
    { field: 'fact_status', headerName: 'Status' },


    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleEdit(params.data)}
          className=" bi bi-pen text-blue-600"
        >
          
        </button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleDelete(params.data)}
          className="bi bi-trash text-red-600"
        >
          
        </button>
      ),
    },
    


  ];


  return (
    <>
   <ToastContainer/>
      {!isFormVisible ? (
        <div className="box">
          <div className='text-right'>
            <button onClick={() => setIsFormVisible(true)} className="btn btn-default">
              Add Faculty
            </button>
          </div>

       

          {showSuccess && (
            <CustomAlert
              message="Form submitted successfully!"
              type="success"
              onClose={() => setShowSuccess(false)}
            />
            
            
          ) 
          }

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
                toast.success
              }}
            />
          )}



        </div>
      ) : (
        <div className="box">
          {showSuccess && <CustomAlert message="Form submitted successfully!" type="success" onClose={() => setShowSuccess(false)} />}

          <Formik
            initialValues={initialValues}
            validationSchema={facultyValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true} // Fixed: Added to handle editing properly
          >
            {({ values, errors, touched, handleSubmit, resetForm }) => (
              <Form onSubmit={handleSubmit}>
                {/* Basic  Fields */}
                <div className="row">
                   <div onClick={() => setIsFormVisible(false)}>
                                <i className="bi bi-arrow-left-circle fs-4 text-primary" /> <span className='fs-4 text-primary'>Faculty Details</span>
                            </div>
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

                <FieldArray name="fact_qualifications">
                  {({ push, remove }) => (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg  fs-4 text-primary">Qualifications</h3>
                        <button
                          type="button"
                          onClick={() => push({
                            type: '',
                            grd_sub: '',
                            grd_branch: '',
                            grd_grade: '',
                            grd_university: '',
                            grd_yearOfPassing: ''
                          })}
                          className="flex items-center  gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <FaPlus className="w-4 h-4 " /> Add Qualification
                        </button>
                      </div>

                      <div className="space-y-4">
                        {values.fact_qualifications.map((_, index) => (
                          <div key={index} className="relative bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Type</label>
                                <Field
                                  name={`qualifications[${index}].type`}
                                  placeholder="Type"
                                  className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                  name={`qualifications[${index}].type`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-1 block">Subject</label>
                                <Field
                                  name={`qualifications[${index}].subject`}
                                  placeholder="Subject"
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-1 block">Branch</label>
                                <Field
                                  name={`qualifications[${index}].branch`}
                                  placeholder="Branch"
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-1 block">Grade</label>
                                <Field
                                  name={`qualifications[${index}].grade`}
                                  placeholder="Grade"
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-1 block">University</label>
                                <Field
                                  name={`qualifications[${index}].university`}
                                  placeholder="University"
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-1 block">Year</label>
                                <Field
                                  name={`qualifications[${index}].yearOfPassing`}
                                  type="date"
                                  className="w-full p-2 border rounded-md"
                                />
                              </div>
                            </div>

                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute -right-2 -top-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                              >
                                <FaMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FieldArray>

                {/* Classes and Subjects Section */}
                <FieldArray name="Fact_cls">
                  {({ push, remove }) => (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg  fs-4 text-primary">Classes</h3>
                        <button
                          type="button"
                          onClick={() => push({ cls_name: '', cls_sub: [''] })}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <FaPlus className="w-4 h-4" /> Add Class
                        </button>
                      </div>

                      <div className="space-y-6">
                        {values.Fact_cls.map((_, classIndex) => (
                          <div key={classIndex} className="relative bg-gray-50 p-4 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Class Name</label>
                                <Field
                                  name={`Fact_cls[${classIndex}].cls_name`}
                                  placeholder="Class Name"
                                  className="w-full p-2 border rounded-md"
                                />
                                <ErrorMessage
                                  name={`Fact_cls[${classIndex}].cls_name`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <FieldArray name={`Fact_cls[${classIndex}].cls_sub`}>
                                  {({ push: pushSubject, remove: removeSubject }) => (
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium">Subjects</label>
                                        <button
                                          type="button"
                                          onClick={() => pushSubject('')}
                                          className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                        >
                                          <FaPlus className="w-3 h-3" /> Add Subject
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {values.Fact_cls[classIndex].cls_sub.map((_, subIndex) => (
                                          <div key={`${classIndex}-${subIndex}`} className="flex items-center gap-2">
                                            <Field
                                              name={`Fact_cls[${classIndex}].cls_sub[${subIndex}]`}
                                              placeholder="Subject"
                                              className="flex-1 p-2 border rounded-md"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeSubject(subIndex)}
                                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md"
                                            >
                                              <FaMinus className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            </div>

                            {classIndex > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(classIndex)}
                                className="absolute -right-2 -top-2 p-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                              >
                                <FaMinus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FieldArray>


                {/* Status */}
                <div className="row mt-3 md-1">
                  <div className="col-md-4 ml-6">
                    <label htmlFor="fact_status" className="form-label fs-4 text-primary ">Status</label>
                    <Field as="select" id="fact_status" name="fact_status" className={`form-control ${errors.Fact_status && touched.Fact_status ? 'is-invalid' : ''}`}>
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Field>
                    <ErrorMessage name="fact_status" component="div" className="invalid-feedback" />
                  </div>
                </div>
                <div className="row mt-3">
                          <div className='mt-3 mb-3'>
                           <span className='fs-4 text-primary'>Faculty Credentials</span>
                            </div>
               
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_Name" className="form-label">Username</label>
                    <Field type="text" id="fact_Username" name="fact_Username" className={`form-control ${errors.fact_Username && touched.Username ? 'is-invalid' : ''}`} placeholder="Enter Username" />
                    <ErrorMessage name="fact_Username" component="div" className="invalid-feedback" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fact_email" className="form-label">Password</label>
                    <Field type="email" id="fact_password" name="fact_password" className={`form-control ${errors.fact_password && touched.fact_password ? 'is-invalid' : ''}`} placeholder="Enter Password" />
                    <ErrorMessage name="fact_password" component="div" className="invalid-feedback" />
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

