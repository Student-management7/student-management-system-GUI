import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GridView from "./gridView"; 
import axiosInstance from "../../../services/Utils/apiUtils";
import StudentFeesForm from "./studentFeesForm";

 const StudentFeesController = () => {
  const [rowData, setRowData] = useState([]); 
  const [showForm, setShowForm] = useState(false); 
  const navigate = useNavigate();



  const columnDefs = [
    
    { headerName: "Name", field: "name" },
    { headerName: "Father Name", field: "familyDetails.stdo_FatherName" },
    { headerName: "Contact", field: "contact" },
    { headerName: "Email", field: "email" },
    { headerName: "Class", field: "cls" },
    { headerName: "Total Fees", field: "totalFees" },
    { headerName: "Remaining Fees", field: "remainingFees" },
    {
      headerName: " Transecton Details",
      cellRenderer: (params: any) => (
        <button
          onClick={() => navigate(`/studentfeesDetails/${params.data.id}`)}
          className="bi bi-eye text-blue-600 mr-2 hover:text-blue-800"
          style={{ fontSize: 24 }}
        >
          
        </button>
      ),
    },
  
  ];

  // Fetch data for the grid
  useEffect(() => {
    axiosInstance
      .get("https://s-m-s-keyw.onrender.com/student/findAllStudent") 
      .then((response) => setRowData(response.data))
      .catch((error) => console.error("Error fetching student fees:", error));
  }, []);

  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right mb-3">
            <h1 className="text-center text-3xl font-bold mb-2 ">Student Fees</h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-default"
            >
              Add Fees
            </button>
          </div>
          <GridView rowData={rowData} columnDefs={columnDefs} />
        </>
      ) : (
        <div className="box">
          <StudentFeesForm onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};


export default StudentFeesController