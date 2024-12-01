import React, { useState, useEffect } from 'react';
import { getStdDetails, deleteStudentRecord } from '../../services/studentRegistration/api/StudentRegistration';
import GridView from './GridView';
import FormView from './FormView';
import { StudentFormData } from '../../services/studentRegistration/type/StudentRegistrationType';
import { data } from '@remix-run/router';
import EditStudentForm from './EditStudentForm';


const StudentRegistrationController = () => {
    
    const [rowData, setRowData] = useState<any[]>([]);
    const [studentData, setStudentData] = useState<boolean>(false);
    const [singleRowData, setSingleRowData] = useState<StudentFormData>();
    const [editFormView, setEditFormView] = useState<boolean>(false);


    const [columnDefs] = useState<any[]>([
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            cellRenderer: (params: any) => (
              <>
                <div className="flex gap-2">
                <button
                  onClick={() => getSingleData(params.data)}
                  className="btn btn-lg btn-edit"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <span></span>
                <button
                  onClick={() => getDeleteData(params.data)}
                  className="btn btn-lg btn-edit"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              </>
              
            ),
          },
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

    
    const fetchStudentDetails = async () => {
        try {
            const data = await getStdDetails();
            setRowData(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const getSingleData =(data: StudentFormData) =>{

        setSingleRowData(data);
        setEditFormView(true);

    }

    const getDeleteData =(data: StudentFormData) =>{

       if(data?.id){
        deleteStudentRecord(data?.id);
       }

    }

    useEffect(()=>{
        console.log(singleRowData);
    },[singleRowData])
    


    return (
        <>
            {!studentData ? (
                editFormView ?(
                    <div className='box'>
                        <div className='headding1'>
                        <h1 onClick={()=> setEditFormView(false)}>
                            <div>
                                <i className="bi bi-arrow-left-circle" /> <span>User Edit</span>
                            </div>
                        </h1>
                    </div>
                    {singleRowData && (
                        <EditStudentForm singleRowData={singleRowData} />
                    )}
                    </div>
                ) : (

                    <div className='box'>
                    <div className='text-right'>
                        
                        <button onClick={()=> setStudentData(true)} className='btn btn-default'>Add Student</button>
                    </div>
                    <GridView rowData={rowData} columnDefs={columnDefs}  />
                </div>
                )
               
            ) : (
                <div className='box'>
                    <div className='headding1'>
                        <h1 onClick={()=> setStudentData(false)}>
                            <div>
                                <i className="bi bi-arrow-left-circle" /> <span>User Details</span>
                            </div>
                        </h1>
                    </div>
                    
                    <FormView />                   
                </div>
            )}
        </>
    );
};

export default StudentRegistrationController;