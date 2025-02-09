import React, { useState, useEffect } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { saveStdDetails } from "../../services/studentRegistration/api/StudentRegistration";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import axiosInstance from "../../services/Utils/apiUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertDialog from "../alert/AlertDialog";
import { sortArrayByKey } from "../Utils/sortArrayByKey";

interface FormViewProps {
  onCancel: () => void;
}
const FormView  =({ onCancel }) => {
  const [classes, setClasses] = React.useState<ClassData[]>([]);
  const [selectedFee, setSelectedFee] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [formikValues, setFormikValues] = useState<any>(null); // Store form values temporarily
  const [formikHelpers, setFormikHelpers] = useState<any>(null);
  
  interface ClassData {
    id: string;
    className: string;
    totalFee: number;
    schoolFee: number;
    sportsFee: number;
    bookFee: number;
    transportation: number;
    otherAmount: any[];
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get<ClassData[]>("/admin/getAll");
        const data = response.data;

        // Sort the data
        const sortedData = sortArrayByKey(data, "className");
        setClasses(sortedData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Handle dropdown change
  const handleClassChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const selectedClass = event.target.value;
    setFieldValue("cls", selectedClass);

    // Find the selected class details and update the fee
    const classData = classes.find((cls) => cls.className === selectedClass);
    if (classData) {
      setSelectedFee(classData.totalFee.toString());
      setFieldValue("totalFee", classData.totalFee);
    } else {
      setSelectedFee("");
      setFieldValue("totalFee", "");
    }
  };

  const initialValues = {
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    gender: "",
    dob: "",
    email: "",
    cls: "",
    department: "",
    category: "",
    totalFee: "",
    familyDetails: {
      stdo_FatherName: "",
      stdo_MotherName: "",
      stdo_primaryContact: "",
      stdo_secondaryContact: "",
      stdo_city: "",
      stdo_state: "",
      stdo_email: "",
    },
  };

  const [error, setError] = useState<string | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    contact: Yup.string()
      .required("Contact number is required")
      .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["Male", "Female", "Other"], "Please select a valid gender"),
    dob: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    cls: Yup.string().required("Class is required"),
    category: Yup.string().required("Category is required"),
    familyDetails: Yup.object().shape({
      stdo_FatherName: Yup.string().required("Father's name is required"),
      stdo_primaryContact: Yup.string()
        .required("Primary contact is required")
        .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
    }),
  });

  const handleSubmit = async (values: StudentFormData, { resetForm }: any) => {
    try {
      await saveStdDetails(values);

      // Show success notification
      toast.success("Student submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        setSelectedFee("");
      }, 3000);
    } catch (err) {
      // Show error notification
      toast.error("Failed to save student details. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      setError("Failed to save student details");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false); // Close the dialog on cancel
  };

  const handleConfirmSubmit = (values: StudentFormData, formikHelpers: any) => {
    setIsDialogOpen(false); // Close the dialog on confirm
    handleSubmit(values, formikHelpers);
    // setIsDialogOpen(false); // Call the submit function
  };
  return (
    <>
      <div>
        <ToastContainer />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          
        >
          
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name  <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${errors.name && touched.name ? "is-invalid" : ""
                        }`}
                      placeholder="Enter full name"
                    />
                    {errors.name && touched.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className={`form-control ${errors.address && touched.address ? "is-invalid" : ""
                        }`}
                      placeholder="Enter Address"
                    />
                    {errors.address && touched.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <Field
                      type="text"
                      id="city"
                      name="city"
                      className={`form-control ${errors.city && touched.city ? "is-invalid" : ""
                        }`}
                      placeholder="Enter city"
                    />
                    {errors.city && touched.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>
                </div>
              </div>
              {/* Continue with all other fields following the same pattern */}
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <Field
                      type="text"
                      id="state"
                      name="state"
                      className={`form-control ${errors.state && touched.state ? "is-invalid" : ""
                        }`}
                      placeholder="Enter state"
                    />
                    {errors.state && touched.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="contact" className="form-label">
                      Contact  <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="contact"
                      name="contact"
                      className={`form-control ${errors.contact && touched.contact ? "is-invalid" : ""
                        }`}
                      placeholder="Enter contact"
                    />
                    {errors.contact && touched.contact && (
                      <div className="invalid-feedback">{errors.contact}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">
                      Gender  <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="gender"
                      name="gender"
                      className={`form-control ${errors.gender && touched.gender ? "is-invalid" : ""
                        }`}
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
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="dob" className="form-label">
                      Date Of Birth  <span className="red">*</span>
                    </label>
                    <Field
                      type="date"
                      id="dob"
                      name="dob"
                      className={`form-control ${errors.dob && touched.dob ? "is-invalid" : ""
                        }`}
                    />
                    {errors.dob && touched.dob && (
                      <div className="invalid-feedback">{errors.dob}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email 
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="cls" className="form-label">
                      Admission Class  <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="cls"
                      name="cls"
                      className="form-control"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleClassChange(e, setFieldValue)}
                    >
                      <option value="" disabled>
                        Select a class
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.className}>
                          {cls.className}
                        </option>
                      ))}
                    </Field>


                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">
                      Department
                    </label>
                    <Field
                      type="text"
                      id="department"
                      name="department"
                      className="form-control"
                      placeholder="Enter Department"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Category   <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className={`form-control ${errors.category && touched.category ? "is-invalid" : ""}`}
                    >
                      <option value="">Select Category</option>
                      <option value="category1">General</option>
                      <option value="category2">OBC</option>
                      <option value="category3">SC</option>
                      <option value="category4">ST</option>
                      {/* Add more options as needed */}
                    </Field>
                    {errors.category && touched.category && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>

                </div>
              </div>
              <hr className="hr" />
              <div className="titel">
                <h2 className="head1">Family Details</h2>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_FatherName"
                      className="form-label"
                    >
                      Father's Name  <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_FatherName"
                      name="familyDetails.stdo_FatherName"
                      className={`form-control ${errors.familyDetails?.stdo_FatherName &&
                        touched.familyDetails?.stdo_FatherName
                        ? "is-invalid"
                        : ""
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_MotherName"
                      className="form-label"
                    >
                      Mother's Name
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_MotherName"
                      name="familyDetails.stdo_MotherName"
                      className="form-control"
                      placeholder="Enter mother's name"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_primaryContact"
                      className="form-label"
                    >
                      Primary Contact
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_primaryContact"
                      name="familyDetails.stdo_primaryContact"
                      className={`form-control ${errors.familyDetails?.stdo_primaryContact &&
                        touched.familyDetails?.stdo_primaryContact
                        ? "is-invalid"
                        : ""
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
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_secondaryContact"
                      className="form-label"
                    >
                      Secondary Contact
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_secondaryContact"
                      name="familyDetails.stdo_secondaryContact"
                      className="form-control"
                      placeholder="Enter secondary Contact"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_city"
                      className="form-label"
                    >
                      Family Address
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_city"
                      name="familyDetails.stdo_city"
                      className="form-control"
                      placeholder="Enter family address"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_state"
                      className="form-label"
                    >
                      Family State
                    </label>
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
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label
                      htmlFor="familyDetails.stdo_email"
                      className="form-label"
                    >
                      Family Email Id
                    </label>
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

              {/* Fee Field */}
              <div className="form-group">
                <label
                  htmlFor="totalFee"
                  className="form-label head1 "
                >
                  Total Fee
                </label>
                <Field
                  type="text"
                  id="totalFee"
                  name="totalFee"
                  className="form-control"
                  value={selectedFee}
                  readOnly
                />
              </div>

              <div className="row-1 mt-4 flex justify-around justify-center items-center md-4">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  type="button"
                  className="btn button head1 text-white"
                >
                  Submit
                </button>
                <button
                  onClick={() => onCancel}
                  type="button"
                  className="btn buttonred head1 text-white"
                >
                  Cancel
                </button>

                

                
                <AlertDialog
                  title="Confirm Submit"
                  message="Are you sure you want to submit this item?"
                  isOpen={isDialogOpen}
                  onConfirm={async () => handleConfirmSubmit(values, formikHelpers)} // Pass values and helpers here
                  onCancel={handleCancel}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default FormView;
