import React, { useState, useEffect } from "react";
import ReusableTable from "../StudenAttendanceShow/Table/Table";
import './../../global.scss';
import FormView from "./FormView";
const SuperAdminController = () =>{
const [superAdminData, setSuperAdminData] = useState<boolean>(false);

    const [columns] = useState<any[]>([
        { field: "schoolName", headerName: "School Name" },
        { field: "Contact", headerName: "Contact" },
        { field: "city", headerName: "city" },
        { field: "joinData", headerName: "Join Date", nestedField: 'familyDetails.stdo_FatherName' },
        
      ]);

    
    return(
        <div className="box">

            
            {superAdminData?(
                <>
                <div className="head1">
                    <h1 onClick={() => setSuperAdminData(false)}>
                    <div>
                        <i className="bi bi-arrow-left-circle" /> <span>Super Admin</span>
                    </div>
                    </h1>
                </div>
                    <FormView />
                </>
            ): (
                <>
                <div className="headding1">
                    <h1>
                    &nbsp;School Registration
                    </h1>
                </div>
                    
                <div className="rightButton">
                  <button className="btn button"
                    onClick={() => setSuperAdminData(true)}
                  >
                    Add Student
                  </button>
            </div>
                    <ReusableTable rows={columns} columns={columns} />
                </>
                ) }
            
           

        </div>
    );



}

export default SuperAdminController;