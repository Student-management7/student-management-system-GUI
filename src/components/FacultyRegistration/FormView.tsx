

// const FormView =  () => {


//     import React, { useEffect, useState } from 'react';
//     import './FacultyForm.css'
//     import { Formik, Form, Field, FieldArray } from 'formik';
//     import { facultyValidationSchema } from '../../services/fecultyRegistretion/validation';
//     import { FacultyFormData } from '../../services/fecultyRegistretion/Type/FecultyRegistrationType';
//     import { saveFacultyDetails, getFacultyDetails } from '../../services/fecultyRegistretion/API/API';
//     import GridView from './GridView';
//     import CustomAlert from '../UI/alert';
    
    
    
//     const FacultyRegistrationForm = () => {
//       const [error, setError] = useState<string | null>(null);
//       const [rowData, setRowData] = useState<FacultyFormData[]>([]);
//       const [showSuccess, setShowSuccess] = useState(false);
//       const [facultyData, setFacultyData] = useState<boolean>(false);
    
      

    
    
//       const initialValues: FacultyFormData = {
//         fact_Name: '',
//         fact_email: '',
//         fact_contact: '',
//         fact_gender: 'M',
//         fact_address: '',
//         fact_city: '',
//         fact_state: '',
//         fact_joiningDate: '',
//         fact_leavingDate: '',
    
//         fact_qualification: [{
//           Fact_Graduation: {
//             grd_sub: '',
//             grd_branch: '',
//             grd_grade: '',
//             grd_university: '',
//             grd_yearOfPassing: ''
//           },
//           Fact_PostGraduation: {
//             grd_sub: '',
//             grd_branch: '',
//             grd_grade: '',
//             grd_university: '',
//             grd_yearOfPassing: ''
//           },
//           Fact_0ther: {
//             grd_sub: '',
//             grd_branch: '',
//             grd_grade: '',
//             grd_university: '',
//             grd_yearOfPassing: ''
//           }
//         }],
    
//         Fact_Cls: [{
//           cls_name: '',
//           cls_sub: []
//         }],
    
    
//         Fact_Status: ''
//       };
    
    
    //   //   fetch Feculty list for grideView
    
    //   const fetchFacultyDetails = async () => {
    //     try {
    //       const data = await getFacultyDetails();
    //       setRowData(data);
    //     } catch (err) {
    //       setError('Failed to fetch faculty details');
    //       console.error(err);
    //     }
    //   };
    
    //   useEffect(() => {
    //     fetchFacultyDetails();
    //   }, []);
    
//       const setSwitch = () => {
//         setFacultyData(true);
//       };
//       //  save faculty details  
    
//       const handleSubmit = async (values: FacultyFormData, { resetForm }: any) => {
//         try {
//           await saveFacultyDetails(values);
//           setShowSuccess(true);
//           setTimeout(() => {
//             setShowSuccess(false);
//             resetForm();
//           }, 3000);
//         } catch (err) {
//           setError('Failed to save faculty details');
//           console.error(err);
//         }
//       };
    
//       return (
//         <>
        
//           {!facultyData ? (
//             <div className='box'>
//               <div className='text-right'>
//                 <button onClick={setSwitch} className='btn btn-default'>Add Faculty</button>
//               </div>
//               <GridView rowData={rowData} columnDefs={columnDefs} />
//             </div>
//           ) : (
//             <div className='box'>
//               <div className='heading1'>
    
//               </div>
    
//               {showSuccess && (
//                 <CustomAlert
//                   message="Form submitted successfully!"
//                   type="success"
//                   onClose={() => setShowSuccess(false)}
//                 />
//               )}
    
//               <Formik
//                 initialValues={initialValues}
//                 validationSchema={facultyValidationSchema}
//                 onSubmit={handleSubmit}
//               >
//                 {({ errors, touched, values, setFieldValue }) => (
//                   <Form >
//                     {/* Basic Faculty Information Fields */}
//                     <div className='row'>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_Name" className="form-label">Full Name</label>
//                         <Field
//                           type="text"
//                           id="fact_Name"
//                           name="fact_Name"
//                           className={`form-control ${errors.fact_Name && touched.fact_Name ? 'is-invalid' : ''}`}
//                           placeholder="Enter full name"
//                         />
//                         {errors.fact_Name && touched.fact_Name && (
//                           <div className="invalid-feedback">{errors.fact_Name}</div>
//                         )}
//                       </div>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_email" className="form-label">Email</label>
//                         <Field
//                           type="email"
//                           id="fact_email"
//                           name="fact_email"
//                           className={`form-control ${errors.fact_email && touched.fact_email ? 'is-invalid' : ''}`}
//                           placeholder="Enter email"
//                         />
//                         {errors.fact_email && touched.fact_email && (
//                           <div className="invalid-feedback">{errors.fact_email}</div>
//                         )}
//                       </div>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_contact" className="form-label">Contact</label>
//                         <Field
//                           type="text"
//                           id="fact_contact"
//                           name="fact_contact"
//                           className={`form-control ${errors.fact_contact && touched.fact_contact ? 'is-invalid' : ''}`}
//                           placeholder="Enter contact number"
//                         />
//                         {errors.fact_contact && touched.fact_contact && (
//                           <div className="invalid-feedback">{errors.fact_contact}</div>
//                         )}
//                       </div>
//                     </div>
    
//                     {/* Gender, Address, and City Fields */}
//                     <div className='row'>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_gender" className="form-label">Gender</label>
//                         <Field
//                           as="select"
//                           id="fact_gender"
//                           name="fact_gender"
//                           className={`form-control ${errors.fact_gender && touched.fact_gender ? 'is-invalid' : ''}`}
//                         >
//                           <option value="">Select</option>
//                           <option value="M">Male</option>
//                           <option value="F">Female</option>
//                           <option value="O">Other</option>
//                         </Field>
//                         {errors.fact_gender && touched.fact_gender && (
//                           <div className="invalid-feedback">{errors.fact_gender}</div>
//                         )}
//                       </div>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_address" className="form-label">Address</label>
//                         <Field
//                           type="text"
//                           id="fact_address"
//                           name="fact_address"
//                           className={`form-control ${errors.fact_address && touched.fact_address ? 'is-invalid' : ''}`}
//                           placeholder="Enter address"
//                         />
//                         {errors.fact_address && touched.fact_address && (
//                           <div className="invalid-feedback">{errors.fact_address}</div>
//                         )}
//                       </div>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_city" className="form-label">City</label>
//                         <Field
//                           type="text"
//                           id="fact_city"
//                           name="fact_city"
//                           className={`form-control ${errors.fact_city && touched.fact_city ? 'is-invalid' : ''}`}
//                           placeholder="Enter city"
//                         />
//                         {errors.fact_city && touched.fact_city && (
//                           <div className="invalid-feedback">{errors.fact_city}</div>
//                         )}
//                       </div>
//                     </div>
    
//                     {/* State and Date Fields */}
//                     <div className='row'>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_state" className="form-label">State</label>
//                         <Field
//                           type="text"
//                           id="fact_state"
//                           name="fact_state"
//                           className={`form-control ${errors.fact_state && touched.fact_state ? 'is-invalid' : ''}`}
//                           placeholder="Enter state"
//                         />
//                         {errors.fact_state && touched.fact_state && (
//                           <div className="invalid-feedback">{errors.fact_state}</div>
//                         )}
//                       </div>
//                       <div className='col-md-4'>
//                         <label htmlFor="fact_joiningDate" className="form-label">Joining Date</label>
//                         <Field
//                           type="date"
//                           id="fact_joiningDate"
//                           name="fact_joiningDate"
//                           className={`form-control ${errors.fact_joiningDate && touched.fact_joiningDate ? 'is-invalid' : ''}`}
//                         />
//                         {errors.fact_joiningDate && touched.fact_joiningDate && (
//                           <div className="invalid-feedback">{errors.fact_joiningDate}</div>
//                         )}
//                       </div>
                    //   <div className='col-md-4'>
                    //     <label htmlFor="fact_leavingDate" className="form-label">Leaving Date</label>
                    //     <Field
                    //       type="date"
                    //       id="fact_leavingDate"
                    //       name="fact_leavingDate"
                    //       className="form-control"
                    //     />
                    //   </div>
//                     </div>
    
                   
    
    
//                     {/* Qualification Section */}
//                     <div className="row mt-4">
//                       <h4>Qualification Details</h4>
    
//                       {/* Graduation Section */}
//                       <div className="col-md-12">
//                         <h5>Graduation</h5>
//                         <div className="row">
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Graduation.grd_sub" className="form-label">Subject</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Graduation.grd_sub"
//                               name="fact_qualification[0].Fact_Graduation.grd_sub"
//                               className="form-control"
//                               placeholder="Enter subject"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Graduation.grd_branch" className="form-label">Branch</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Graduation.grd_branch"
//                               name="fact_qualification[0].Fact_Graduation.grd_branch"
//                               className="form-control"
//                               placeholder="Enter branch"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Graduation.grd_grade" className="form-label">Grade</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Graduation.grd_grade"
//                               name="fact_qualification[0].Fact_Graduation.grd_grade"
//                               className="form-control"
//                               placeholder="Enter grade"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Graduation.grd_university" className="form-label">University</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Graduation.grd_university"
//                               name="fact_qualification[0].Fact_Graduation.grd_university"
//                               className="form-control"
//                               placeholder="Enter university"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Graduation.grd_yearOfPassing" className="form-label">Year of Passing</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Graduation.grd_yearOfPassing"
//                               name="fact_qualification[0].Fact_Graduation.grd_yearOfPassing"
//                               className="form-control"
//                               placeholder="Enter year"
//                             />
//                           </div>
//                         </div>
//                       </div>
    
//                       {/* Post Graduation Section */}
//                       <div className="col-md-12 mt-3">
//                         <h5>Post Graduation</h5>
//                         <div className="row">
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_PostGraduation.grd_sub" className="form-label">Subject</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_PostGraduation.grd_sub"
//                               name="fact_qualification[0].Fact_PostGraduation.grd_sub"
//                               className="form-control"
//                               placeholder="Enter subject"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_PostGraduation.grd_branch" className="form-label">Branch</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_PostGraduation.grd_branch"
//                               name="fact_qualification[0].Fact_PostGraduation.grd_branch"
//                               className="form-control"
//                               placeholder="Enter branch"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_PostGraduation.grd_grade" className="form-label">Grade</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_PostGraduation.grd_grade"
//                               name="fact_qualification[0].Fact_PostGraduation.grd_grade"
//                               className="form-control"
//                               placeholder="Enter grade"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_PostGraduation.grd_university" className="form-label">University</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_PostGraduation.grd_university"
//                               name="fact_qualification[0].Fact_PostGraduation.grd_university"
//                               className="form-control"
//                               placeholder="Enter university"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_PostGraduation.grd_yearOfPassing" className="form-label">Year of Passing</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_PostGraduation.grd_yearOfPassing"
//                               name="fact_qualification[0].Fact_PostGraduation.grd_yearOfPassing"
//                               className="form-control"
//                               placeholder="Enter year"
//                             />
//                           </div>
//                         </div>
//                       </div>
    
//                       {/* Other Qualification Section */}
//                       <div className="col-md-12 mt-3">
//                         <h5>Other Qualification</h5>
//                         <div className="row">
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Other.grd_sub" className="form-label">Subject</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Other.grd_sub"
//                               name="fact_qualification[0].Fact_Other.grd_sub"
//                               className="form-control"
//                               placeholder="Enter subject"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Other.grd_branch" className="form-label">Branch</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Other.grd_branch"
//                               name="fact_qualification[0].Fact_Other.grd_branch"
//                               className="form-control"
//                               placeholder="Enter branch"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Other.grd_grade" className="form-label">Grade</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Other.grd_grade"
//                               name="fact_qualification[0].Fact_Other.grd_grade"
//                               className="form-control"
//                               placeholder="Enter grade"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Other.grd_university" className="form-label">University</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Other.grd_university"
//                               name="fact_qualification[0].Fact_Other.grd_university"
//                               className="form-control"
//                               placeholder="Enter university"
//                             />
//                           </div>
//                           <div className="col-md-3">
//                             <label htmlFor="fact_qualification[0].Fact_Other.grd_yearOfPassing" className="form-label">Year of Passing</label>
//                             <Field
//                               type="text"
//                               id="fact_qualification[0].Fact_Other.grd_yearOfPassing"
//                               name="fact_qualification[0].Fact_Other.grd_yearOfPassing"
//                               className="form-control"
//                               placeholder="Enter year"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
    
    
    
//                        {/* Submit Button */}
    
//                       <div className='text-center mt-4'>
//                       <button type="submit" className="btn btn-primary" >Submit</button>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           )}
//         </>
//       );
        
    
//     }
    
    
//     export default FacultyRegistrationForm;
    
    
    
    
    
    
    
    
    
    




// }
// export default FormView










// export interface FacultyFormData {
//     fact_Name: string;
//     fact_email: string;
//     fact_contact: string;
//     fact_gender: string;
//     fact_address: string;
//     fact_city: string;
//     fact_state: string;
//     fact_joiningDate: string;
//     fact_leavingDate: string;
//     Fact_Status: string;
//     fact_qualification: Qualification[];
//     Fact_Cls: Class[];
//   }
  
//   export interface Qualification {
//     Fact_Graduation: {
//       grd_sub: string;
//       grd_branch: string;
//       grd_grade: string;
//       grd_university: string;
//       grd_yearOfPassing: string;
//     };
//     Fact_PostGraduation: {
//       grd_sub: string;
//       grd_branch: string;
//       grd_grade: string;
//       grd_university: string;
//       grd_yearOfPassing: string;
//     };
//     Fact_0ther: {
//       grd_sub: string;
//       grd_branch: string;
//       grd_grade: string;
//       grd_university: string;
//       grd_yearOfPassing: string;
//     };
//   }
  
//   export interface Class {
//     cls_name: string;
//     cls_sub: string[];
//   }
  
  
  














// upadateing



// import React, { useEffect, useState } from 'react';
// import { Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';

// import { FaPlus, FaMinus } from 'react-icons/fa';
// import { facultyValidationSchema } from '../../services/fecultyRegistretion/validation';
// import { FacultyFormData, } from '../../services/fecultyRegistretion/Type/FecultyRegistrationType';
// import { saveFacultyDetails, getFacultyDetails, updateFacultyDetails } from '../../services/fecultyRegistretion/API/API';
// import GridView from './GridView';
// import CustomAlert from '../UI/alert';

// const FacultyRegistrationForm: React.FC = () => {
//   const [rowData, setRowData] = useState<FacultyFormData[]>([]);
//   const [editingFaculty, setEditingFaculty] = useState<FacultyFormData | null>(null);
//   const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
//   const [showSuccess, setShowSuccess] = useState<boolean>(false);
//   const [showError, setShowError] = useState<boolean>(false);

//   const initialValues: FacultyFormData = editingFaculty || {

//     fact_id: '',
//     fact_Name: '',
//     fact_email: '',
//     fact_contact: '',
//     fact_gender: '',
//     fact_address: '',
//     fact_city: '',
//     fact_state: '',
//     fact_joiningDate: '',
//     fact_leavingDate: '',
//     fact_status: '',
//     qualifications: [
//       { type: 'Graduation', subject: '', branch: '', grade: '', university: '', yearOfPassing: '' }
//     ],
//     fact_cls: [{ cls_name: '', cls_sub: [''] }],
//   };

//   // Fetch faculty details
//   const fetchFacultyDetails = async () => {
//     try {
//       const data = await getFacultyDetails();
//       if (Array.isArray(data)) {
//         setRowData(data);
//       } else {
//         console.error('Unexpected data format');
//       }
//     } catch (error) {
//       console.error('Failed to fetch faculty details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchFacultyDetails();
//   }, []);

//   // Define handleSubmit with proper type annotations

//   const handleSubmit = async (
//     data: FacultyFormData, { resetForm }: FormikHelpers<FacultyFormData>) => {
//     try {
//       let response;
//       if (editingFaculty) {
//         response = await updateFacultyDetails(data, editingFaculty.fact_id);

//       } else {

//         response = await saveFacultyDetails(data);
//       }

//       if (response?.status === 200) {

//         {
//           const updatedData = editingFaculty
//             ? rowData.map((item) => item.fact_id === editingFaculty.fact_id ? data : item)
//             : [...rowData, data];

//           setRowData(updatedData);
//           setShowSuccess(true);
//           setShowError(false);
//           setIsFormVisible(false);
//           setEditingFaculty(null);
//           resetForm(); // reset the form upon success
//         }

//       } else {
//         setShowError(true);
//         console.error('Failed to save data on the server');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert("An error occurred while submitting the form. Please check the console for details.");
//       setShowError(true);
//     }
//   };


//   // Handle edit button click
//   const handleEdit = (facultyData: FacultyFormData) => {
//     setIsFormVisible(true); // Show the form
//     setEditingFaculty(facultyData); // Store the current data to be edited
//     // setInitialValues(facultyData); // Set form values to current row data
//   };

//   // Toggle form visibility
//   const toggleFormVisibility = () => {
//     setIsFormVisible((prev) => !prev);
//   };


//   return (
//     <>
//       {!isFormVisible ? (
//         <div className="box">
//           <button onClick={toggleFormVisibility} className="btn btn-default">
//             {isFormVisible ? 'Hide Form' : 'Add Faculty'}
//           </button>



//           {showSuccess && (
//             <CustomAlert
//               message="Form submitted successfully!"
//               type="success"
//               onClose={() => setShowSuccess(false)}
//             />
//           )}

//           {showError && (
//             <CustomAlert
//               message="There was an error submitting the form. Please try again."
//               // type="danger"
//               onClose={() => setShowError(false)}
//             />
//           )}


//           <GridView rowData={rowData} columnDefs={[
//             { field: 'fact_Name', headerName: 'Name' },
//             { field: 'fact_city', headerName: 'City' },
//             { field: 'fact_contact', headerName: 'Contact' },
//             { field: 'fact_address', headerName: 'Address' },
//             { field: 'fact_gender', headerName: 'Gender' },
//             { field: 'fact_state', headerName: 'State' },
//             { field: 'fact_email', headerName: 'Email' },
//             { field: 'fact_status', headerName: 'Status' },
//             {
              
//                 field: 'edit',
//                 headerName: 'Edit',
//                 cellRendererFramework: (params: any) => (
//                   <button onClick={() => handleEdit(params.data)} className="btn btn-primary btn-sm">
//                     ✏️ Edit
//                   </button>
//                 ),
//               },
          

//           ]} />
//         </div>
//       ) : (
//         <div className="box">
//           {showSuccess && <CustomAlert message="Form submitted successfully!" type="success" onClose={() => setShowSuccess(false)} />}

//           <Formik
//             initialValues={editingFaculty || initialValues}
//             validationSchema={facultyValidationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ values, errors, touched, handleSubmit, resetForm }) => (
//               <Form onSubmit={handleSubmit}>
//                 {/* Basic  Fields */}
//                 <div className="row">
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_Name" className="form-label">Full Name</label>
//                     <Field type="text" id="fact_Name" name="fact_Name" className={`form-control ${errors.fact_Name && touched.fact_Name ? 'is-invalid' : ''}`} placeholder="Enter full name" />
//                     <ErrorMessage name="fact_Name" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_email" className="form-label">Email</label>
//                     <Field type="email" id="fact_email" name="fact_email" className={`form-control ${errors.fact_email && touched.fact_email ? 'is-invalid' : ''}`} placeholder="Enter email" />
//                     <ErrorMessage name="fact_email" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_contact" className="form-label">Contact</label>
//                     <Field type="text" id="fact_contact" name="fact_contact" className={`form-control ${errors.fact_contact && touched.fact_contact ? 'is-invalid' : ''}`} placeholder="Enter contact number" />
//                     <ErrorMessage name="fact_contact" component="div" className="invalid-feedback" />
//                   </div>
//                 </div>

//                 {/* Gender, Address, City */}
//                 <div className="row">
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_gender" className="form-label">Gender</label>
//                     <Field as="select" id="fact_gender" name="fact_gender" className={`form-control ${errors.fact_gender && touched.fact_gender ? 'is-invalid' : ''}`}>
//                       <option value="">Select</option>
//                       <option value="M">Male</option>
//                       <option value="F">Female</option>
//                       <option value="O">Other</option>
//                     </Field>
//                     <ErrorMessage name="fact_gender" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_address" className="form-label">Address</label>
//                     <Field type="text" id="fact_address" name="fact_address" className={`form-control ${errors.fact_address && touched.fact_address ? 'is-invalid' : ''}`} placeholder="Enter address" />
//                     <ErrorMessage name="fact_address" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_city" className="form-label">City</label>
//                     <Field type="text" id="fact_city" name="fact_city" className={`form-control ${errors.fact_city && touched.fact_city ? 'is-invalid' : ''}`} placeholder="Enter city" />
//                     <ErrorMessage name="fact_city" component="div" className="invalid-feedback" />
//                   </div>
//                 </div>

//                 {/* State, Joining Date, Leaving Date */}
//                 <div className="row">
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_state" className="form-label">State</label>
//                     <Field type="text" id="fact_state" name="fact_state" className={`form-control ${errors.fact_state && touched.fact_state ? 'is-invalid' : ''}`} placeholder="Enter state" />
//                     <ErrorMessage name="fact_state" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_joiningDate" className="form-label">Joining Date</label>
//                     <Field type="date" id="fact_joiningDate" name="fact_joiningDate" className={`form-control ${errors.fact_joiningDate && touched.fact_joiningDate ? 'is-invalid' : ''}`} />
//                     <ErrorMessage name="fact_joiningDate" component="div" className="invalid-feedback" />
//                   </div>
//                   <div className="col-md-4 mb-3">
//                     <label htmlFor="fact_leavingDate" className="form-label">Leaving Date</label>
//                     <Field type="date" id="fact_leavingDate" name="fact_leavingDate" className="form-control" />
//                   </div>
//                 </div>

//                 {/* Qualifications Section */}
//                 <FieldArray name="qualifications">
//                   {({ push, remove }) => (
//                     <div className="mt-4">
//                       <label className="form-label">Qualifications</label>
//                       <button type="button" onClick={() => push({ type: '', subject: '', branch: '', grade: '', university: '', yearOfPassing: '' })} className="btn btn-grey btn-sm">
//                         <FaPlus />
//                       </button>
//                       {values.qualifications.map((_, index) => (
//                         <div key={index} className="row mb-2">
//                           <div className="col-md-2 mb-1">
//                             <Field name={`qualifications[${index}].type`} placeholder="Type" className="form-control" />
//                             <ErrorMessage name={`qualifications[${index}].type`} component="div" className="text-danger" />

//                           </div>
//                           <div className="col-md-2 mb-1">
//                             <Field name={`qualifications[${index}].subject`} placeholder="Subject" className="form-control" />
//                           </div>
//                           <div className="col-md-2 mb-1">
//                             <Field name={`qualifications[${index}].branch`} placeholder="Branch" className="form-control" />
//                           </div>
//                           <div className="col-md-2 mb-1">
//                             <Field name={`qualifications[${index}].grade`} placeholder="Grade" className="form-control" />
//                           </div>
//                           <div className="col-md-2 mb-1">
//                             <Field name={`qualifications[${index}].university`} placeholder="University" className="form-control" />
//                           </div>

//                           <div className="col-md-2">
//                             <Field name={`qualifications[${index}].yearOfPassing`} type="date" placeholder="Year of Passing" className="form-control" />
//                             <ErrorMessage name={`qualifications[${index}].yearOfPassing`} component="div" className="text-danger" />
//                           </div>

//                           <div className="col-md-1 d-flex align-items-center">
//                             {index > 0 && (
//                               <button type="button" onClick={() => remove(index)} className="btn btn-grey btn-sm">
//                                 <FaMinus />
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </FieldArray>


//                 {/* Classes Section */}
//                 <FieldArray name="fact_cls">
//                   {({ push, remove }) => (
//                     <div className="mt-4">
//                       <label className="form-label"> Classes</label>
//                       <button type="button" onClick={() => push({ cls_name: '', cls_sub: [''] })} className="btn btn-grey btn-sm">
//                         <FaPlus />
//                       </button>
//                       {values.fact_cls.map((_, classIndex) => (
//                         <div key={classIndex} className="mb-3">
//                           <div className="row mb-2">
//                             <div className="col-md-3">
//                               <Field
//                                 name={`fact_cls[${classIndex}].cls_name`}
//                                 placeholder="Class Name"
//                                 className="form-control"
//                               />
//                               <ErrorMessage name={`fact_cls[${classIndex}].cls_name`} component="div" className="text-danger" />
//                             </div>
//                             <div className="col-md-7">
//                               <FieldArray name={`fact_cls[${classIndex}].cls_sub`}>
//                                 {({ push: pushSubject, remove: removeSubject }) => (
//                                   <div>
//                                     <label className="form-label">Subjects</label>
//                                     <button type="button" onClick={() => pushSubject('')} className="btn btn-grey btn-sm">
//                                       <FaPlus />
//                                     </button>
//                                     {values.fact_cls[classIndex].cls_sub.map((_, subIndex) => (
//                                       <div key={`${classIndex}-${subIndex}`} className="input-group mb-2">
//                                         <Field
//                                           name={`fact_cls[${classIndex}].cls_sub[${subIndex}]`}
//                                           placeholder="Subject"
//                                           className="form-control"
//                                         />
//                                         <button
//                                           type="button"
//                                           onClick={() => removeSubject(subIndex)}
//                                           className="btn btn-danger btn-sm"
//                                         >
//                                           <FaMinus />
//                                         </button>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}
//                               </FieldArray>
//                             </div>
//                             <div className="col-md-2 d-flex align-items-center">
//                               {classIndex > 0 && (
//                                 <button type="button" onClick={() => remove(classIndex)} className="btn btn-grey btn-sm">
//                                   <FaMinus />
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </FieldArray>



//                 {/* Status */}
//                 <div className="row mt-3">
//                   <div className="col-md-4">
//                     <label htmlFor="fact_status" className="form-label">Status</label>
//                     <Field as="select" id="fact_status" name="fact_status" className={`form-control ${errors.fact_status && touched.fact_status ? 'is-invalid' : ''}`}>
//                       <option value="">Select Status</option>
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </Field>
//                     <ErrorMessage name="fact_status" component="div" className="invalid-feedback" />
//                   </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="row mt-4 flex justify-center items-center">
//                   <div className="col-md-4">
//                     <button type="submit" className="btn btn-primary w-50 mb-5   ">{editingFaculty ? 'Update' : 'Submit'}</button>
//                   </div>
//                   {editingFaculty && <div className="col-md-4">
//                     <button type="button" className="btn btn-danger w-50 mb-5" onClick={() => {
//                       setEditingFaculty(null);
//                       resetForm();
//                       setIsFormVisible(false);
//                     }} >Cancel</button>
//                   </div>}
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       )}
//     </>
//   );
// };

// export default FacultyRegistrationForm;

