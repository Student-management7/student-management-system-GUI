import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { facultyValidationSchema } from '../../services/Faculty/fecultyRegistretion/validation';
import { FacultyFormData } from '../../services/Faculty/fecultyRegistretion/Type/FecultyRegistrationType';
import { saveFacultyDetails, updateFacultyDetails } from '../../services/Faculty/fecultyRegistretion/API/API';
import { toast, ToastContainer, } from 'react-toastify';

interface FacultyFormProps {
  editingFaculty: FacultyFormData | null;
  setIsFormVisible: (visible: boolean) => void;
  fetchFacultyDetails: () => void;
  setEditingFaculty: (faculty: FacultyFormData | null) => void;
}

const FacultyForm: React.FC<FacultyFormProps> = ({
  editingFaculty,
  setIsFormVisible,
  fetchFacultyDetails,
  setEditingFaculty,
}) => {
  const initialValues: FacultyFormData = {
    fact_id: editingFaculty?.fact_id || '',
    fact_Name: editingFaculty?.fact_Name || '',
    email: editingFaculty?.email || '',
    fact_email: editingFaculty?.fact_email || '',
    password: editingFaculty?.password || '',
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

  const handleSubmit = async (values: FacultyFormData, { resetForm }: any) => {
    try {
      const submissionData = {
        ...values,
        fact_id: editingFaculty?.fact_id || values.fact_id,
      };


      let response;
      if (editingFaculty) {
        response = await updateFacultyDetails(submissionData);
        toast.success('Faculty details updated successfully.');

      } else {
        response = await saveFacultyDetails(submissionData);
        toast.success('Faculty details saved successfully.');
      }


      if (response?.status === 200) {
        await fetchFacultyDetails();
        setIsFormVisible(false);
        setEditingFaculty(null);
        resetForm();
      } else {
        
      }
    } catch (error) {
      toast.error('Failed to save faculty details. Please try again.');
      console.error('Error saving faculty details:', error);
      
    }
  };

  return (
    <div className="box">
    <ToastContainer position='top-right' autoClose={3000}  />
      <Formik
        initialValues={initialValues}
        validationSchema={facultyValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, handleSubmit, resetForm }) => {
          console.log('Form errors:', errors); // Debugging
          return (

            <Form className='p-2 m-2' onSubmit={handleSubmit}>

              <div className="row">
                <div className='mb-3' onClick={() => setIsFormVisible(false)}>
                  <i className="bi bi-arrow-left-circle head1 p-2" /> <span className='head1'>Faculty Details </span>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_Name" className="form-label">Full Name   <span className="red">*</span> </label>
                  <Field type="text" id="fact_Name" name="fact_Name" className={`form-control ${errors.fact_Name && touched.fact_Name ? 'is-invalid' : ''}`} placeholder="Enter full name" />
                  <ErrorMessage name="fact_Name" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_email" className="form-label">Email  <span className="red">*</span> </label>
                  <Field type="email" id="fact_email" name="fact_email" className={`form-control ${errors.fact_email && touched.fact_email ? 'is-invalid' : ''}`} placeholder="Enter email" />
                  <ErrorMessage name="fact_email" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_contact" className="form-label">Contact  <span className="red">*</span> </label>
                  <Field type="text" id="fact_contact" name="fact_contact" className={`form-control ${errors.fact_contact && touched.fact_contact ? 'is-invalid' : ''}`} placeholder="Enter contact number" />
                  <ErrorMessage name="fact_contact" component="div" className="invalid-feedback" />
                </div>
              </div>

              {/* Gender, Address, City */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_gender" className="form-label">Gender  <span className="red">*</span> </label>
                  <Field as="select" id="fact_gender" name="fact_gender" className={`form-control ${errors.fact_gender && touched.fact_gender ? 'is-invalid' : ''}`}>
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Field>
                  <ErrorMessage name="fact_gender" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_address" className="form-label">Address  <span className="red">*</span> </label>
                  <Field type="text" id="fact_address" name="fact_address" className={`form-control ${errors.fact_address && touched.fact_address ? 'is-invalid' : ''}`} placeholder="Enter address" />
                  <ErrorMessage name="fact_address" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_city" className="form-label">City  <span className="red">*</span> </label>
                  <Field type="text" id="fact_city" name="fact_city" className={`form-control ${errors.fact_city && touched.fact_city ? 'is-invalid' : ''}`} placeholder="Enter city" />
                  <ErrorMessage name="fact_city" component="div" className="invalid-feedback" />
                </div>
              </div>

              {/* State, Joining Date, Leaving Date */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_state" className="form-label">State </label>
                  <Field type="text" id="fact_state" name="fact_state" className={`form-control `} placeholder="Enter state" />
                  {/* <ErrorMessage name="fact_state" component="div" className="invalid-feedback" /> */}
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_joiningDate" className="form-label">Joining Date  <span className="red">*</span> </label>
                  <Field type="date" id="fact_joiningDate" name="fact_joiningDate" className={`form-control ${errors.fact_joiningDate && touched.fact_joiningDate ? 'is-invalid' : ''}`} />
                  <ErrorMessage name="fact_joiningDate" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="fact_leavingDate" className="form-label">Leaving Date</label>
                  <Field type="date" id="fact_leavingDate" name="fact_leavingDate" className="form-control" />
                </div>
              </div>

              {/* Qualifications Section */}
              <FieldArray name="fact_qualifications">
                {({ push, remove }) => (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="head1">Qualifications </h3>
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
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <FaPlus className="w-4 h-4" /> Add Qualification
                      </button>
                    </div>

                    <div className="space-y-4">
                      {values.fact_qualifications.map((_, index) => (
                        <div key={index} className="relative bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Type</label>
                              <Field
                                name={`fact_qualifications[${index}].type`}
                                placeholder="Type"
                                className="w-full p-2 border rounded-md"
                              />
                             
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Subject</label>
                              <Field
                                name={`fact_qualifications[${index}].grd_sub`}
                                placeholder="Subject"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Branch</label>
                              <Field
                                name={`fact_qualifications[${index}].grd_branch`}
                                placeholder="Branch"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Grade</label>
                              <Field
                                name={`fact_qualifications[${index}].grd_grade`}
                                placeholder="Grade"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">University</label>
                              <Field
                                name={`fact_qualifications[${index}].grd_university`}
                                placeholder="University"
                                className="w-full p-2 border rounded-md"
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">Year</label>
                              <Field
                                name={`fact_qualifications[${index}].grd_yearOfPassing`}
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
                      <h3 className="head1">Classes</h3>
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
                                className="w-full p-2 border rounded-md mt-2.5"
                              />
                              {/* <ErrorMessage
                                name={`Fact_cls[${classIndex}].cls_name`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              /> */}
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
                  <label htmlFor="fact_status" className="form-label head1">Status</label>
                  <Field as="select" id="fact_status" name="fact_status" className={`form-control `}>
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Field>
                </div>
              </div>

              {/* Faculty Credentials */}
              <div className="row mt-3">
                <div className='mt-3 mb-3'>
                  <span className='head1'>Faculty Credentials</span>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="email" className="form-label">Username  <span className="red">*</span> </label>
                  <Field type="text" id="email" name="email" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} placeholder="Enter Username" />
                  <ErrorMessage name="email" component="div" className="invalid-feedback" />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="password" className="form-label">Password  <span className="red">*</span> </label>
                  <Field type="password" id="password" name="password" className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`} placeholder="Enter Password" />
                  <ErrorMessage name="password" component="div" className="invalid-feedback" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="row-1 mt-4 flex justify-around justify-center items-center">
                <span >
                  <button type="submit" className="btn button  ">
                    {editingFaculty ? 'Update' : 'Submit'}
                  </button>
                </span>
                {editingFaculty && (
                  <span >
                    <button
                      type="button"
                      className="btn buttonred  "
                      onClick={() => {
                        setEditingFaculty(null);
                        resetForm();
                        setIsFormVisible(false);
                      }}
                    >
                      Cancel
                    </button>
                  </span>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FacultyForm;