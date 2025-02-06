import React, { useState, useEffect } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/Utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";

const FormView = ({ editData, onSubmitSuccess }: any) => {


    
    // during update data set in form from table 
    const initialValues = {
        id: editData?.id || "",
        schoolName: editData?.schoolName || "",
        schoolAddress: editData?.schoolAddress || "",
        city: editData?.city || "",
        state: editData?.state || "",
        schoolLandlineNo: editData?.schoolLandlineNo || "",
        ownerName: editData?.ownerName || "",
        gst: editData?.gst || "",
        boardType: editData?.boardType || "",
        adminContact: editData?.adminContact || "",
        serviceStartDate: editData?.serviceStartDate || "",
        currentPlan: editData?.currentPlan || "",
        subscriptionType: editData?.subscriptionType || "",
        renewalDate: editData?.renewalDate || "",
        status: editData?.status || "",
        email: editData?.email || "",
        password: ""    //   ffor resion privacy its not required
    }

    const validationSchema = Yup.object().shape({
        schoolName: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
        schoolAddress: Yup.string().required("Address is required").min(2, "Address must be at least 2 characters"),
        adminContact: Yup.string().required("Admin contact is required"),
        serviceStartDate: Yup.date().required("Service start date is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),

    })

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
        try {
            let response;
            if (values.id) {
                console.log(" ID:", values.id);
                // Update 
                response = await axiosInstance.post(`/school/update`, values);
                console.log("Form updated successfully:", response.data);
                toast.success("Form updated successfully.");
            } else {
                // Submit 
                response = await axiosInstance.post("/school/save", values);
                console.log("Form submitted successfully:", response.data);
                toast.success("Form submitted successfully.");
            }
            resetForm();
            onSubmitSuccess();
        } catch (error) {
            toast.error("An error occurred while processing the form.");
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <>
            <Formik
                initialValues={initialValues}
                validatations={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
               

            >
                {({ errors, touched, isSubmitting , }) => (
                    <Form>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="schoolName" className="form-label">
                                        School Name <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="schoolName"
                                        name="schoolName"
                                        className={`form-control ${errors.schoolName && touched.schoolName ? "is-invalid" : ""
                                            }`}
                                        placeholder="Enter full school name"
                                    />
                                    {errors.schoolName && touched.schoolName && (
                                        <div className="invalid-feedback">{String(errors.schoolName)}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="address" className="form-label">
                                       School Address <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="address"
                                        name="address"
                                        className={`form-control ${errors.schoolAddress && touched.schoolAddress ? 'is-invalid' : ''}`}
                                        placeholder="Enter address"
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="city" className="form-label">City
                                    </label>
                                    <Field
                                        type="text"
                                        id="city"
                                        name="city"
                                        className={"form-control"}
                                        placeholder="Enter city"
                                    />

                                </div>
                            </div>
                        </div>
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
                                        className={"form-control"}
                                        placeholder="Enter state"
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="landline" className="form-label">
                                        Landline
                                    </label>
                                    <Field
                                        type="text"
                                        id="landline"
                                        name="landline"
                                        className={"form-control"}
                                        placeholder="Enter landline no. "
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="ownerName" className="form-label">Owner Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="ownerName"
                                        name="ownerName"
                                        className={"form-control"}
                                        placeholder="Enter Owner Name"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="gst" className="form-label">
                                        GST No.
                                    </label>
                                    <Field
                                        type="text"
                                        id="gst"
                                        name="gst"
                                        className={"form-control"}
                                        placeholder="Enter gst no."
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="boardType" className="form-label">
                                        Board Type
                                    </label>
                                    <Field
                                        type="text"
                                        id="boardType"
                                        name="boardType"
                                        className={"form-control"}
                                        placeholder="Enter board Type"
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="adminContact" className="form-label">
                                        Contact <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="adminContact"
                                        name="adminContact"
                                        className={`form-control ${errors.adminContact && touched.adminContact ? 'is-invalid' : ''}`}
                                        placeholder="Enter Admin Contact"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="serviceStartDate" className="form-label">
                                        Service StartDate<span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="serviceStartDate"
                                        name="serviceStartDate"
                                        className={"form-control"}
                                        placeholder="Enter Service Start Date"
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className=" form-group">
                                    <label htmlFor="currentPlan" className="form-label">
                                        Current Plan
                                    </label>
                                    <Field as="select" id="currentPlan" name="currentPlan" className="form-select">
                                        <option value="" disabled>Select Current Plan</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Premium">Premium</option>
                                    </Field>
                                </div>

                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="subscriptionType" className="form-label">Subscription Type
                                    </label>
                                    <Field as="select" id="subscriptionType" name="subscriptionType" className="form-select">
                                        <option value="" disabled>Select Subscription Type</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Monthly">Quatarly</option>
                                        <option value="Yearly">Half Yearly</option>
                                        <option value="Yearly">Yearly</option>
                                    </Field>
                                    

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="renewalDate" className="form-label">
                                        Renewal Date
                                    </label>
                                    <Field
                                        type="text"
                                        id="renewalDate"
                                        name="renewalDate"
                                        className={"form-control"}
                                        placeholder="Enter Renewal Date."
                                    />

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="status" className="form-label">
                                        Status
                                    </label>
                                    <Field as = "select" id="status" name="status" className="form-select">
                                        <option value="" disabled>Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Expired</option>
                                    </Field>
                                     

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email
                                    </label>
                                    <Field
                                        type="text"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                        placeholder="Enter Email"
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password <span className="red">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="password"
                                        name="password"
                                        className={"form-control"}
                                        placeholder="Enter password"
                                    />

                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                        <button className="btn btn-primary button mt-3" type="submit" disabled={isSubmitting}>
                            {editData ? "Update" : "Save"}
                        </button>

                        
                    </Form>
                )}
            </Formik>



        </>
    );

}

export default FormView;


