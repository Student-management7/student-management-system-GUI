import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import GridView from "./gridView";
import FacultySalaryForm from "./FacultySalaryForm";
import { FacultySalaryDetails, FacultySalaryFormValues, FacultySalaryResponse } from "../../../services/salary/facultysalary/type";
import { fetchFacultySalaries, updateFacultySalary, saveFacultySalary, deleteFacultySalary } from "../../../services/salary/facultysalary/Api";

const transformFacultySalaryData = (data: FacultySalaryResponse[]) => {
  return data.map(faculty => ({
    ...faculty,
    facultySalary: faculty.fact_salary[0]?.facultySalary || 0,
    facultyTax: faculty.fact_salary[0]?.facultyTax || 0,
    facultyTransport: faculty.fact_salary[0]?.facultyTransport || 0,
    facultyDeduction: faculty.fact_salary[0]?.facultyDeduction || '[]',
    total: faculty.fact_salary[0]?.total || 0,
    // Add an identifier for operations
    id: faculty.fact_id
  }));
};

const FacultySalaryController: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any[]>([]); // Changed to any to accommodate transformed data
  const [editData, setEditData] = useState<FacultySalaryDetails | null>(null);

  const columnDefs = [
    { headerName: "Faculty ID", field: "fact_id", sortable: true, filter: true },
    { headerName: "Faculty Name", field: "fact_Name", sortable: true, filter: true },
    { headerName: "Salary", field: "facultySalary", sortable: true, filter: true },
    { headerName: "Tax %", field: "facultyTax", sortable: true, filter: true },
    { headerName: "Transport Allowance", field: "facultyTransport", sortable: true, filter: true },
    {
      headerName: "Deductions",
      field: "facultyDeduction",
      cellRenderer: (params: any) => {
        try {
          const deductions = JSON.parse(params.value || "[]");
          return deductions.map((d: any) => `${d.name}: ${d.amount}`).join(", ") || "N/A";
        } catch (error) {
          return "N/A";
        }
      },
    },
    { headerName: "Total", field: "total", sortable: true, filter: true },
    {
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button 
          onClick={() => navigate(`/faculty-salary/${params.data.fact_id}`)}
          className="btn btn-info btn-sm"
        >
          View Details
        </button>
      ),
    },
    {
      headerName: "Edit",
      cellRenderer: (params: any) => (
        <button 
          onClick={() => handleEditButtonClick()}
          className="btn btn-warning btn-sm"
        >
          Edit
        </button>
      ),
    },
    {
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button 
          onClick={() => handleDeleteButtonClick(params.data.fact_id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
   
  ];

  // Fetch faculty salary details
  const fetchSalaryDetails = useCallback(async () => {
    try {
      const data: FacultySalaryResponse[] = await fetchFacultySalaries();
      // Transform data for grid display
      const transformedData = transformFacultySalaryData(data );
      setRowData(transformedData);
      console.log("Transformed Data:", transformedData);
    } catch (error) {
      console.error("Error fetching faculty salary details:", error);
    
    }
  }, []);

  useEffect(() => {
    fetchSalaryDetails();
  }, [fetchSalaryDetails]);

  // Handle Edit button 
  const handleEditButtonClick = (data: any) => {
    setEditData({
      ...data,
      
      fact_salary: data.fact_salary || []
    }); 
    setShowForm(true);
  };

  // Handle Save button
  const handleSave = async (data: FacultySalaryFormValues) => {
    try {
      if (editData) {
        // Update existing record
        await updateFacultySalary(editData.fact_id ,data);
      } else {
        // Save new record
        await saveFacultySalary(data);
      }
      fetchSalaryDetails(); 
      setShowForm(false); 
      setEditData(null); // Clear edit data
    } catch (error) {
      console.error("Error saving faculty salary details:", error);
      // Optional: Add error handling toast or alert
    }
  };

  // Handle Delete button click
  const handleDeleteButtonClick = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await deleteFacultySalary(id);
      fetchSalaryDetails(); // Refresh grid
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting faculty salary record:", error);
      alert("An unexpected error occurred while deleting the record.");
    }
  };


  
  function handleViewdeatils() {
    navigate("/facultysalaryView");

  }
  // Render
  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right mb-4">
            <button 
              onClick={() => setShowForm(true)} 
              className=""
            >
              Add Salary
            </button>
          </div>
          <GridView rowData={rowData} columnDefs={columnDefs} />
        </>
      ) : (
        <FacultySalaryForm
          initialData={editData || undefined}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default FacultySalaryController;

