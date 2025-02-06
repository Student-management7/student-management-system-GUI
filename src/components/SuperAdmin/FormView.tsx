import React, { useState, useEffect } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const FormView = () =>{
    const [error, setError] = useState<string | null>(null);


    const initialValues = {
        schoolName: "",
        schoolAddress: "",
        city: "",
        state:"",
        schoolLandlineNo:"",
        ownerName:"",
        gst:"",
        boardType:"",
        adminContact: "",
        serviceStartDate: "",
        currentPlan: "",
        subscriptionType:"",
        renewalDate: "",
        status: "",
        email: "",
        password: ""
    }

    const validatations = Yup.object().shape({
        schoolName: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    })
    
    const handleSubmit = () =>{

    }
    return(
        <>
        <Formik
           initialValues={initialValues}
           validatations={validatations}
           onSubmit={handleSubmit}
          
        >
            {({ errors, touched, setFieldValue }) =>(
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
                            <div className="invalid-feedback">{errors.schoolName}</div>
                            )}
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
                            className={"form-control"}
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
                            className={"form-control"}
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
                        <div className="form-group">
                            <label htmlFor="currentPlan" className="form-label">
                            Current Plan
                            </label>
                            <Field
                            type="text"
                            id="currentPlan"
                            name="currentPlan"
                            className={"form-control"}
                            placeholder="Enter Current Plan"
                            />
                            
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="subscriptionType" className="form-label">Subscription Type
                            </label>
                            <Field
                            type="text"
                            id="subscriptionType"
                            name="subscriptionType"
                            className={"form-control"}
                            placeholder="Enter Subscription Type"
                            />
                            
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
                            <Field
                            type="text"
                            id="status"
                            name="status"
                            className={"form-control"}
                            placeholder="Enter Status"
                            />
                            
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
                            className={"form-control"}
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
                <div className="mt-4">
                    <button
                    //onClick={() => setIsDialogOpen(true)}
                    type="button"
                    className="btn btn-primary button"
                    >
                    Submit
                    </button>
                </div>
            </Form>
            )}
        </Formik>
        
            
        
        </>
    );

}

export default FormView;