import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bool, boolean } from 'yup';
import { getStdDetails, saveStdDetails } from '../../services/studentRegistration/api/StudentRegistration';
import { StudentFormData, FamilyDetails } from '../../services/studentRegistration/type/StudentRegistrationType';
import GridView from './GridView';


const StudentRegistrationController = (props: StudentFormData) =>{

    const [formData, setFormData] = useState({
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
            stdo_city: '',
            stdo_state: '',
            stdo_email: ''
        }
      });
        const [error, setError] = useState<string | null>(null);
        const [rowData, setRowData] = useState<any[]>([]);
        const [columnDefs] = useState<any[]>([
            { field: 'name', headerName: 'Name' },
            { field: 'city', headerName: 'City' },
            { field: 'cls', headerName: 'Class' },
            { field: 'address', headerName: 'Address' },
            { field: 'gender', headerName: 'Gender' },
            { field: 'state', headerName: 'State' },
            { field: 'familyDetails.stdo_FatherName', headerName: 'Father Name' },
            { field: 'familyDetails.stdo_MotherName', headerName: 'Mother Name' },
            { field: 'familyDetails.stdo_primaryContact', headerName: 'Contact' }
            
            
        ]);
        const [switchForm, setSwitchForm] = useState<boolean>(false)
        const [studentData, setStudentData] = useState<boolean>(false)

      const handleInputChange = (
        e: any,
        fieldName: keyof StudentFormData | keyof FamilyDetails,
        familyField: boolean = false
      ) => {
        const { value } = e.target;
        setFormData((prevValues) => ({
          ...prevValues,
          ...(familyField
            ? { familyDetails: { ...prevValues.familyDetails, [fieldName]: value } }
            : { [fieldName]: value }),
        }));
      };
    
      const handleSubmit = async () => {
        
    
         
          console.log('Form submitted successfully:', formData);
          saveStdDetails(formData);
       
      };

      const fetchStudentDetails = async () => {
        try {
            debugger;
            const data = await getStdDetails();
            setRowData(data);
        } catch (err) {
            setError('Failed to fetch student details');
            console.error(err);
        }
    };
      useEffect(() => {
    
        fetchStudentDetails();
        console.log('rowData', rowData);
    }, []);
    const addForm = ()=>{
        setSwitchForm(true);
    }

    const setSwitch = ()=>{
        setStudentData(true);
    }
    
 return (
    <> 
    {!studentData? (<div className='box'>
        <div className='text-right'><button onClick={setSwitch} className='btn btn-default'>Add Student</button></div>
        <GridView rowData={rowData} columnDefs={columnDefs} onAddRow={addForm} />
        </div>):(
            <div className='box'>
            <div className='headding1'>
                <h1><Link to='/'><i className="bi bi-arrow-left-circle" /> <span>User Details</span></Link></h1>
            </div>
            <form>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="fulName" className="form-label">Full Name</label>
                        <input type="text" id="fulName"
                        value={formData.name} onChange={(e) => handleInputChange(e, 'name')}
                         className="form-control"
                         placeholder='Enter full name'
                          aria-describedby="fulName" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div>
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" id="address"
                        placeholder='Enter Address'
                        value={formData.address} onChange={(e) => handleInputChange(e, 'address')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" id="city"
                        value={formData.city} onChange={(e) => handleInputChange(e, 'city')}
                        placeholder='Enter city'
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="state" className="form-label">State</label>
                        <input type="text" id="state"
                        placeholder='Enter state'
                        value={formData.state} onChange={(e) => handleInputChange(e, 'state')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div>
                        <label htmlFor="contact" className="form-label">Contect</label>
                        <input type="text" id="contact"
                        placeholder='Enter contect'
                        value={formData.contact} onChange={(e) => handleInputChange(e, 'contact')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select id='gender'
                        value={formData.gender} onChange={(e) => handleInputChange(e, 'gender')}
                        className='form-control'>
                            <option>Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="dob" className="form-label">Date Of Birth</label>
                        <input type="date" id="dob"
                        value={formData.dob} onChange={(e) => handleInputChange(e, 'dob')}
                        placeholder='Enter DOB'
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="Eail" id="email"
                        placeholder='Enter email'
                        value={formData.email} onChange={(e) => handleInputChange(e, 'email')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="addmitionClass" className="form-label">Addmition class</label>
                        <input type="text" id="addmitionClass"
                        placeholder='Enter Class'
                        value={formData.cls} onChange={(e) => handleInputChange(e, 'cls')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="department" className="form-label">Department</label>
                        <input type="text" id="department"
                        value={formData.department} onChange={(e) => handleInputChange(e, 'department')}
                        placeholder='Enter Department'
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div>
                        <label htmlFor="email" className="form-label">Category</label>
                        <input type="text" id="category"
                        placeholder='Enter category'
                        value={formData.category} onChange={(e) => handleInputChange(e, 'category')}
                        className="form-control" aria-describedby="passwordHelpBlock" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                
            </div>
            <hr className='hr' />
            <div className='titel'><h2>Family Details</h2></div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="fname" className="form-label">Father's Name</label>
                        <input type="text" id="fname"
                        value={formData.familyDetails.stdo_FatherName} onChange={(e) => handleInputChange(e, 'stdo_FatherName', true)}
                        placeholder="Enter father's name"
                         className="form-control" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div className='form-group'>
                        <label htmlFor="mName" className="form-label">Mother's Name</label>
                        <input type="text" id="mName"
                         placeholder="Enter mother's name"
                         value={formData.familyDetails.stdo_MotherName} onChange={(e) => handleInputChange(e, 'stdo_MotherName', true)}
                          className="form-control" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="primaryContect" className="form-label">Primary Contact</label>
                        <input type="text" id="primaryContect"
                        value={formData.familyDetails.stdo_primaryContact} onChange={(e) => handleInputChange(e, 'stdo_primaryContact', true)}
                        placeholder='Enter primary contact'
                         className="form-control"/>
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="scondoryContact" className="form-label">Secondary Contact</label>
                        <input type="text" id="scondoryContact"
                        value={formData.familyDetails.stdo_secondaryContact} onChange={(e) => handleInputChange(e, 'stdo_secondaryContact', true)}
                        placeholder="Enter secondary Contact"
                         className="form-control" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                <div className='form-group'>
                        <label htmlFor="familyAddress" className="form-label">Family Address</label>
                        <input type="text" id="familyAddress"
                        value={formData.familyDetails.stdo_city} onChange={(e) => handleInputChange(e, 'stdo_city', true)}
                         placeholder="Enter mother's Name"
                          className="form-control" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="fState" className="form-label"> Family State</label>
                        <input type="text" id="fState"
                        value={formData.familyDetails.stdo_state} onChange={(e) => handleInputChange(e, 'stdo_state', true)}
                        placeholder="Enter family State"
                         className="form-control"/>
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='form-group'>
                        <label htmlFor="fmailyEmail" className="form-label">Family Email Id</label>
                        <input type="text" id="fmailyEmail"
                        placeholder="Enter family Email"
                        value={formData.familyDetails.stdo_email} onChange={(e) => handleInputChange(e, 'stdo_email', true)}
                         className="form-control" />
                        <div id="passwordHelpBlock" className="form-text">
                        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='text-center'>
                <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit</button>
            </div>
            </form>
        </div>
        )}
    
        
    </>
 );   
}

export default StudentRegistrationController;