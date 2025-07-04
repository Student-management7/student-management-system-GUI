"use client"

import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { saveStdDetails, updateStdDetails } from "../../services/studentRegistration/api/StudentRegistration"
import type { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType"
import axiosInstance from "../../services/Utils/apiUtils"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AlertDialog from "../alert/AlertDialog"
import { sortArrayByKey } from "../Utils/sortArrayByKey"

interface FormViewProps {
  setStudentData: (arg: boolean) => void
  initialValues?: StudentFormData
  isEdit?: boolean
  fetchStudentDetails: () => void
}

const FormView: React.FC<FormViewProps> = ({
  setStudentData,
  initialValues: propInitialValues,
  isEdit = false,
  fetchStudentDetails,
}) => {
  const [classes, setClasses] = React.useState<ClassData[]>([])
  const [selectedFee, setSelectedFee] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formValues, setFormValues] = useState<StudentFormData | null>(null)
  const [formikHelpers, setFormikHelpers] = useState<any>(null)
  const [stdo_email, setstdo_email] = useState("")

  const handleOpenDialog = (values: StudentFormData, helpers: any) => {
    setFormValues(values)
    setFormikHelpers(helpers)
    setIsDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    if (formValues && formikHelpers) {
      setIsDialogOpen(false)
      await handleSubmit(formValues, formikHelpers)
    }
  }

  interface ClassData {
    id: string
    className: string
    totalFee: number
    schoolFee: number
    sportsFee: number
    bookFee: number
    transportation: number
    otherAmount: any[]
  }

  // Function to generate student ID
  const generatestdo_email = (name: string, contact: string) => {
    if (name && contact && contact.length >= 5) {
      const cleanName = name.replace(/\s+/g, "").toLowerCase()
      const contactFirst5 = contact.substring(0, 5)
      return `${cleanName}${contactFirst5}`
    }
    return ""
  }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get<ClassData[]>("/admin/getAll")
        const data = response.data
        const sortedData = sortArrayByKey(data, "className")
        setClasses(sortedData)
        // After classes are loaded, set the fee for edit mode
        if (isEdit && propInitialValues?.cls) {
          const classData = sortedData.find((cls) => cls.className === propInitialValues.cls)
          if (classData) {
            setSelectedFee(classData.totalFee.toString())
          }
        }
      } catch (error) {
        toast.warning("Please create class first")
      }
    }

    fetchClasses()
  }, [isEdit, propInitialValues])

  // Generate student ID when component mounts in edit mode
  useEffect(() => {
    if (isEdit && propInitialValues?.name && propInitialValues?.contact) {
      const generatedId = generatestdo_email(propInitialValues.name, propInitialValues.contact)
      setstdo_email(generatedId)
    }
  }, [isEdit, propInitialValues])

  const handleClassChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    const selectedClass = event.target.value
    setFieldValue("cls", selectedClass)
    const classData = classes.find((cls) => cls.className === selectedClass)
    if (classData) {
      setSelectedFee(classData.totalFee.toString())
      setFieldValue("totalFee", classData.totalFee)
    } else {
      setSelectedFee("")
      setFieldValue("totalFee", "")
    }
  }

  const defaultInitialValues = {
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
      stdo_email: "", // Changed from stdo_email to stdo_email
    },
  }

  const initialValues = propInitialValues || defaultInitialValues

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Full name is required")
      .min(3, "Name must be at least 3 characters")
      .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces (no numbers or special characters)")
      .max(20, "Name must be at most 20 characters"),
    address: Yup.string()
      .required("Address is required")
      .min(3, "Address must be at least 3 characters")
      .max(60, "Address must be at most 60 characters"),
    department: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
        "Department must contain at least one letter and can include numbers, spaces, and .,-",
      )
      .max(40, "Department must be at most 40 characters"),
    city: Yup.string()
      .required("City is required")
      .min(3, "City must be at least 3 characters")
      .matches(
        /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
        "must contain at least one letter and can include numbers, spaces, and .,-",
      ),
    state: Yup.string()
      .required("State is required")
      .matches(
        /^[A-Za-z\s.-]+$/,
        "State must contain only letters, spaces, dots, or hyphens (no numbers or other special characters)",
      )
      .max(30, "State must be at most 30 characters"),
    contact: Yup.string()
      .required("Contact number is required")
      .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["Male", "Female", "Other"], "Please select a valid gender"),
    dob: Yup.date().required("Date of birth is required").max(new Date(), "Date of birth cannot be in the future"),
    cls: Yup.string().required("Class is required"),
    category: Yup.string().required("Category is required"),
    familyDetails: Yup.object().shape({
      stdo_FatherName: Yup.string()
        .required("Father's name is required")
        .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces (no numbers or special characters)")
        .max(20, "Name must be at most 20 characters"),
      stdo_MotherName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces (no numbers or special characters)")
        .max(20, "Name must be at most 20 characters"),
      stdo_primaryContact: Yup.string()
        .required("Primary contact is required")
        .matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
      stdo_secondaryContact: Yup.string().matches(/^[0-9]{10}$/, "Contact number must be 10 digits"),
      stdo_city: Yup.string()
        .min(3, "City must be at least 3 characters")
        .matches(
          /^(?=.*[A-Za-z])[A-Za-z0-9\s.,-]*$/,
          "City must contain at least one letter and can include numbers, spaces .,-",
        )
        .max(40, "City must be at most 40 characters"),
      stdo_state: Yup.string()
        .matches(
          /^[A-Za-z\s.-]+$/,
          "State must contain only letters, spaces, dots, or hyphens (no numbers or other special characters)",
        )
        .max(30, "State must be at most 30 characters"),
      stdo_email: Yup.string(), // Added validation for stdo_email
    }),
  })

  const handleSubmit = async (values: StudentFormData, { resetForm }: any) => {
    try {
      // Ensure stdo_email is included in the payload
      const submitValues = {
        ...values,
        familyDetails: {
          ...values.familyDetails,
          stdo_email: stdo_email,
        },
      }

      if (isEdit) {
        await updateStdDetails(submitValues)
        toast.success("Student updated successfully!")
      } else {
        await saveStdDetails(submitValues)
        toast.success("Student submitted successfully!")
      }

      setTimeout(() => {
        setStudentData(false)
        resetForm()
        fetchStudentDetails()
      }, 1000)
    } catch (err) {
      toast.error("Failed to save student details. Please try again.")
      console.error(err)
    }
  }

  // Auto-generate student ID when name or contact changes
  useEffect(() => {
    if (propInitialValues?.name && propInitialValues?.contact) {
      const generatedId = generatestdo_email(propInitialValues.name, propInitialValues.contact)
      setstdo_email(generatedId)
    }
  }, [propInitialValues])

  return (
    <div className="mt-[26px]">
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, helpers) => handleOpenDialog(values, helpers)}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                      placeholder="Enter full name"
                    />
                    {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="address" className="form-label">
                      Address <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className={`form-control ${errors.address && touched.address ? "is-invalid" : ""}`}
                      placeholder="Enter address"
                    />
                    {errors.address && touched.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">
                      City <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="city"
                      name="city"
                      className={`form-control ${errors.city && touched.city ? "is-invalid" : ""}`}
                      placeholder="Enter city"
                    />
                    {errors.city && touched.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">
                      State <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="state"
                      name="state"
                      className={`form-control ${errors.state && touched.state ? "is-invalid" : ""}`}
                      placeholder="Enter state"
                    />
                    {errors.state && touched.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="contact" className="form-label">
                      Mobile No. <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="contact"
                      name="contact"
                      className={`form-control ${errors.contact && touched.contact ? "is-invalid" : ""}`}
                      placeholder="Enter contact"
                    />
                    {errors.contact && touched.contact && <div className="invalid-feedback">{errors.contact}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">
                      Gender <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="gender"
                      name="gender"
                      className={`form-control ${errors.gender && touched.gender ? "is-invalid" : ""}`}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    {errors.gender && touched.gender && <div className="invalid-feedback">{errors.gender}</div>}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="dob" className="form-label">
                      Date of Birth <span className="red">*</span>
                    </label>
                    <Field
                      type="date"
                      id="dob"
                      name="dob"
                      className={`form-control ${errors.dob && touched.dob ? "is-invalid" : ""}`}
                    />
                    {errors.dob && touched.dob && <div className="invalid-feedback">{errors.dob}</div>}
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
                      className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                      placeholder="Enter email"
                    />
                    {errors.email && touched.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="cls" className="form-label">
                      Class <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="cls"
                      name="cls"
                      className={`form-control ${errors.cls && touched.cls ? "is-invalid" : ""}`}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleClassChange(e, setFieldValue)}
                    >
                      <option value="">Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.className}>
                          {cls.className}
                        </option>
                      ))}
                    </Field>
                    {errors.cls && touched.cls && <div className="invalid-feedback">{errors.cls}</div>}
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
                      className={`form-control ${errors.department && touched.department ? "is-invalid" : ""}`}
                      placeholder="Enter department"
                    />
                    {errors.department && touched.department && (
                      <div className="invalid-feedback">{errors.department}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label">
                      Category <span className="red">*</span>
                    </label>
                    <Field
                      as="select"
                      id="category"
                      name="category"
                      className={`form-control ${errors.category && touched.category ? "is-invalid" : ""}`}
                    >
                      <option value="">Select category</option>
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </Field>
                    {errors.category && touched.category && <div className="invalid-feedback">{errors.category}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="totalFee" className="form-label">
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
                </div>
              </div>
              <hr className="hr" />
              <div className="titel">
                <h2 className="head1 mt-4">Family Details</h2>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_FatherName" className="form-label">
                      Father's Name <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_FatherName"
                      name="familyDetails.stdo_FatherName"
                      className={`form-control ${
                        errors.familyDetails?.stdo_FatherName && touched.familyDetails?.stdo_FatherName
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter father's name"
                    />
                    {errors.familyDetails?.stdo_FatherName && touched.familyDetails?.stdo_FatherName && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_FatherName}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_MotherName" className="form-label">
                      Mother's Name
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_MotherName"
                      name="familyDetails.stdo_MotherName"
                      className={`form-control ${
                        errors.familyDetails?.stdo_MotherName && touched.familyDetails?.stdo_MotherName
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter mother's name"
                    />
                    {errors.familyDetails?.stdo_MotherName && touched.familyDetails?.stdo_MotherName && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_MotherName}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_primaryContact" className="form-label">
                      Primary Contact <span className="red">*</span>
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_primaryContact"
                      name="familyDetails.stdo_primaryContact"
                      className={`form-control ${
                        errors.familyDetails?.stdo_primaryContact && touched.familyDetails?.stdo_primaryContact
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter primary contact"
                    />
                    {errors.familyDetails?.stdo_primaryContact && touched.familyDetails?.stdo_primaryContact && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_primaryContact}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_secondaryContact" className="form-label">
                      Secondary Contact
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_secondaryContact"
                      name="familyDetails.stdo_secondaryContact"
                      className={`form-control ${
                        errors.familyDetails?.stdo_secondaryContact && touched.familyDetails?.stdo_secondaryContact
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter secondary contact"
                    />
                    {errors.familyDetails?.stdo_secondaryContact && touched.familyDetails?.stdo_secondaryContact && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_secondaryContact}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_city" className="form-label">
                      Family City
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_city"
                      name="familyDetails.stdo_city"
                      className={`form-control ${
                        errors.familyDetails?.stdo_city && touched.familyDetails?.stdo_city ? "is-invalid" : ""
                      }`}
                      placeholder="Enter family city"
                    />
                    {errors.familyDetails?.stdo_city && touched.familyDetails?.stdo_city && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_city}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_state" className="form-label">
                      Family State
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_state"
                      name="familyDetails.stdo_state"
                      className={`form-control ${
                        errors.familyDetails?.stdo_state && touched.familyDetails?.stdo_state ? "is-invalid" : ""
                      }`}
                      placeholder="Enter family state"
                    />
                    {errors.familyDetails?.stdo_state && touched.familyDetails?.stdo_state && (
                      <div className="invalid-feedback">{errors.familyDetails.stdo_state}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="familyDetails.stdo_email" className="form-label">
                      Student ID
                    </label>
                    <Field
                      type="text"
                      id="familyDetails.stdo_email"
                      name="familyDetails.stdo_email"
                      className="form-control"
                      value={stdo_email}
                      disabled
                      placeholder="Auto-generated student ID"
                    />
                  </div>
                </div>
              </div>
              <div className="row-1 mt-4 flex justify-around items-center md-4">
                <button type="submit" className="btn button head1 text-white">
                  {isEdit ? "Update" : "Submit"}
                </button>
                <button type="button" className="btn buttonred head1 text-white" onClick={() => setStudentData(false)}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
        {isDialogOpen && (
          <AlertDialog
            title="Confirm Submit"
            message="Are you sure you want to submit this item?"
            isOpen={isDialogOpen}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        )}
      </div>
    </div>
  )
}

export default FormView
