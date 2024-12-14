import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GridView from "./gridView"; // Existing GridView component
import axiosInstance from "../../../services/Utils/apiUtils";
import StudentFeesForm from "./studentFeesForm";

const StudentFeesController = () => {
  const [rowData, setRowData] = useState([]); // For grid data
  const [showForm, setShowForm] = useState(false); // To toggle Add Fees form
  const navigate = useNavigate();

  // Column definitions for the grid


  const columnDefs = [
    { headerName: "Id", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Total Fees", field: "totalFees" },
    { headerName: "Remaining Fees", field: "remainingFees" },
    { headerName: "Contact", field: "contact" },
    { headerName: "Email", field: "email" },
    { headerName: "Class", field: "cls" },
    {
      headerName: "Action",
      cellRenderer: (params: any) => (
        <button
          onClick={() => navigate(`/studentfeesDetails/${params.data.id}`)}
          className="btn btn-primary"
        >
          View Fees Details
        </button>
      ),
    },
  ];

  // Fetch data for the grid
  useEffect(() => {
    axiosInstance
      .get("https://s-m-s-keyw.onrender.com/student/findAllStudent") // Replace with your actual API endpoint
      .then((response) => setRowData(response.data))
      .catch((error) => console.error("Error fetching student fees:", error));
  }, []);

  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right mb-3">
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

export default StudentFeesController;
