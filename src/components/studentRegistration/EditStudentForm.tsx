import React, {useState, useEffect} from "react";
import { StudentFormData } from "../../services/studentRegistration/type/StudentRegistrationType";
import { updateStudentDeteails } from '../../services/studentRegistration/api/StudentRegistration';
//import {onSave} from "../"

interface EditStudentFormProps  {
    singleRowData: StudentFormData;
    
}

const EditStudentForm = (props: EditStudentFormProps) =>{

    const [editFormView, setEditFormView] = useState<boolean>(false);
    const {singleRowData} = props;

    if (!singleRowData) return <div>Loading...</div>;
    console.log('singleRowData', singleRowData);

     const [formData, setFormData] = useState<StudentFormData>(
        {
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
            stdo_address: '',
            stdo_city: '',
            stdo_state: '',
            stdo_email: ''
        }
    }
    );

    useEffect(() => {

        if (singleRowData) {
            setFormData({
                id: singleRowData?.id,
                name: singleRowData?.name,
                address: singleRowData?.address,
                city: singleRowData?.city,
                state: singleRowData?.state,
                contact: singleRowData?.contact,
                gender: singleRowData?.gender,
                dob: singleRowData?.dob,
                email: singleRowData?.email,
                cls: singleRowData?.cls,
                department: singleRowData?.department,
                category: singleRowData?.category,
                familyDetails: {
                    stdo_FatherName: singleRowData?.familyDetails?.stdo_FatherName,
                    stdo_MotherName: singleRowData?.familyDetails?.stdo_MotherName,
                    stdo_primaryContact: singleRowData?.familyDetails?.stdo_primaryContact,
                    stdo_secondaryContact: singleRowData?.familyDetails?.stdo_secondaryContact,
                    stdo_address: singleRowData?.familyDetails?.stdo_address,
                    stdo_city: singleRowData?.familyDetails?.stdo_city,
                    stdo_state: singleRowData?.familyDetails?.stdo_state,
                    stdo_email: singleRowData?.familyDetails?.stdo_email
                }
            });
        }

    }, [singleRowData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData({...formData, [name]:[value]})
    };
   


   
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Here, you can handle the save logic, e.g., send data to API
        updateStudentDeteails(formData); 
        console.log(formData)
        
    };


    return(
        <>
             <div>            
                <form >
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="name" className="form-label">Full Name (Required)</label>
                                <input type="text" name="name" className="form-control" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})  } />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e: any) => setFormData({...formData, address: e.target.value})  }
                                    //value={singleRowData.address}
                                    //onChange={handleChange}
                                    className="form-control"
                                    placeholder='Enter Address'
                                />
                                
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="city" className="form-label">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={(e: any) => setFormData({...formData, city: e.target.value})  }
                                    //value={singleRowData.city}
                                    className="form-control"
                                    placeholder='Enter city'
                                    //onChange={handleChange}
                                />
                                
                            </div>
                        </div>
                    </div>
                    {/* Continue with all other fields following the same pattern */}
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="state" className="form-label">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={(e: any) => setFormData({...formData, state: e.target.value})  }
                                    //value={singleRowData.state}
                                    className="form-control"
                                    placeholder='Enter state'
                                    //onChange={handleChange}
                                />
                                 
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="contact" className="form-label">Contact</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={(e: any) => setFormData({...formData, contact: e.target.value})  }
                                    //value={singleRowData.contact}
                                    className="form-control"
                                    placeholder='Enter contact'
                                    //onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select
                                    
                                    id="gender"
                                    name="gender"
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={(e: any) => setFormData({...formData, gender: e.target.value})  }
                                    // value={singleRowData.gender}
                                    // onChange={handleChange}
                                    
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                               
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="dob" className="form-label">Date Of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    //onChange={handleChange}
                                    value={formData.dob}
                                    onChange={(e: any) => setFormData({...formData, dob: e.target.value})  }
                                    name="dob"
                                    //value={singleRowData.dob}
                                    className="form-control"
                                />                       
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e: any) => setFormData({...formData, email: e.target.value})  }
                                    //value={singleRowData.email}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder='Enter email'
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="cls" className="form-label">Admission Class</label>
                                <input
                                    type="text"
                                    id="cls"
                                    name="cls"
                                    className="form-control"
                                    value={formData.cls}
                                    onChange={(e: any) => setFormData({...formData, cls: e.target.value})  }
                                    //value={singleRowData.cls}
                                    //onChange={handleChange}
                                    placeholder='Enter Class'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="department" className="form-label">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    //value={singleRowData.department}
                                    value={formData.department}
                                    onChange={(e: any) => setFormData({...formData, department: e.target.value})  }
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder='Enter Department'
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="category" className="form-label">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e: any) => setFormData({...formData, category: e.target.value})  }
                                    //value={singleRowData.category}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder='Enter category'
                                />
                            </div>
                        </div>
                    </div>
                    <hr className='hr' />
                    <div className='titel'><h2>Family Details</h2></div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_FatherName" className="form-label">Father's Name</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_FatherName"
                                    name="familyDetails.stdo_FatherName"
                                    value={formData.familyDetails?.stdo_FatherName}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_FatherName: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_FatherName}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter father's name"
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_MotherName" className="form-label">Mother's Name</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_MotherName"
                                    name="familyDetails.stdo_MotherName"
                                    value={formData.familyDetails?.stdo_MotherName}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_MotherName: e.target.value,
                                            },
                                        }))
                                    }
                                    //={singleRowData.familyDetails.stdo_MotherName}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter mother's name"
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_primaryContact" className="form-label">Primary Contact</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_primaryContact"
                                    name="familyDetails.stdo_primaryContact"
                                    value={formData.familyDetails?.stdo_primaryContact}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_primaryContact: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_primaryContact}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter primary contact"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_secondaryContact" className="form-label">Secondary Contact</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_secondaryContact"
                                    name="familyDetails.stdo_secondaryContact"
                                    value={formData.familyDetails?.stdo_secondaryContact}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_secondaryContact: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_secondaryContact}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter secondary Contact"
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_city" className="form-label">Family Address</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_city"
                                    name="familyDetails.stdo_city"
                                    value={formData.familyDetails?.stdo_city}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_city: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_city}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter family address"
                                />
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_state" className="form-label">Family State</label>
                                <input
                                    type="text"
                                    id="familyDetails.stdo_state"
                                    name="familyDetails.stdo_state"
                                    value={formData.familyDetails?.stdo_state}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_state: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_state}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter family state"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='form-group'>
                                <label htmlFor="familyDetails.stdo_email" className="form-label">Family Email Id</label>
                                <input
                                    type="email"
                                    id="familyDetails.stdo_email"
                                    name="familyDetails.stdo_email"
                                    value={formData.familyDetails?.stdo_email}
                                    onChange={(e: any) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            familyDetails: {
                                                ...prev.familyDetails,
                                                stdo_email: e.target.value,
                                            },
                                        }))
                                    }
                                    //value={singleRowData.familyDetails.stdo_email}
                                    className="form-control"
                                    //onChange={handleChange}
                                    placeholder="Enter family Email"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className='text-center mt-4 col' >
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Update</button>
                    </div>
                    <div className='text-center mt-4 col ' >
                        <button className="btn btn-danger" >Canel</button>
                    </div>
                    </div>
                </form>
                      
            </div>
        </>
    );
}

export default EditStudentForm;