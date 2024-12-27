import React, { useState, useEffect, useCallback } from "react";
import GridView from "./GridView";
import FeesForm from "./feesForm";
import { FeeDetails, FeeFormValues } from "../../../services/feesServices/AdminFeescreationForm/type";
import { fetchFees, updateFee, saveFees ,deleteFeeRecord} from "../../../services/feesServices/AdminFeescreationForm/api";

const FeesController: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false); // Toggle between grid and form views
  const [rowData, setRowData] = useState<FeeDetails[]>([]); // Holds grid data
  const [editData, setEditData] = useState<FeeDetails | null>(null); // Holds data for editing

  // Column definitions for GridView
  const columnDefs = [
    { headerName: "Id", field: "id", sortable: true, filter: true },
    { headerName: "Class", field: "className", sortable: true, filter: true },
    { headerName: "School Fee", field: "schoolFee", sortable: true, filter: true },
    { headerName: "Sports Fee", field: "sportsFee", sortable: true, filter: true },
    { headerName: "Book Fee", field: "bookFee", sortable: true, filter: true },
    { headerName: "Transportation Fee", field: "transportation", sortable: true, filter: true },
    {
      headerName: "Other Amounts",
      field: "otherAmount",
      cellRenderer: (params: any) =>
        params.value && params.value.length
      ? params.value.map((item: any) => `${item.name}: ${item.amount}`).join(", ")
      : "0",
    },

    { headerName: "Total Fees", field: "totalFee", sortable: true, filter: true },
    
    {
        field: 'edit',
        headerName: 'Edit',
        cellRenderer: (params: any) => (
          <button
            className="bi bi-pencil-square text-blue-600"
            onClick={() => handleEditButtonClick(params.data)}
          >
            Edit
          </button>
        ),
      },
    
      // Delete Button Column
      {
        field: 'delete',
        headerName: 'Delete',
        cellRenderer: (params: any) => (
          <button
            className="bi bi-trash text-red-600"
            onClick={() => handleDeleteButtonClick(params.data.id)}
          >
            Delete
          </button>
        ),
      },
    
    


    
  ];

  // Fetch fee data on mount
  const fetchFeeDetails = useCallback(async () => {
    try {
      const data = await fetchFees();
      setRowData(data);
    } catch (error) {
      console.error("Error fetching fee details:", error);
    }
  }, []);

  useEffect(() => {
    fetchFeeDetails();
  }, [fetchFeeDetails]);

  // Handle Edit button click
  const handleEditButtonClick = (data: FeeDetails) => {
    setEditData(data);
    setShowForm(true);
  };
  
  const handleSave = async (data: FeeFormValues) => {
    try {
      if (editData) {
        console.log('Updating Fee with ID:', editData.id, 'Data:', data);
        await updateFee(editData.id, data);
      } else {
        console.log('Saving New Fee Data:', data);
        await saveFees(data);
      }
      fetchFeeDetails();
      setShowForm(false);
      setEditData(null);
    } catch (error) {
      console.error("Error saving fee details:", error);
    }
  };
  


  const handleDeleteButtonClick = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;
  
    try {
      const result = await deleteFeeRecord(id);
      if (result.success) {
        alert("Record deleted successfully!");
        // Update state to remove the deleted record
        setFeesData((prevData: any[]) => prevData.filter((item) => item.id !== id));
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Unexpected error during deletion:", error);
      alert("An unexpected error occurred while deleting the record.");
    }
  };
  
  
   
  
  // Render
  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right mb-4">
            <button onClick={() => setShowForm(true)} className="btn btn-default">
              Add Fee
            </button>
          </div>
          <GridView rowData={rowData} columnDefs={columnDefs} />
        </>
      ) : (
        <FeesForm
        initialData={editData || undefined} // Pass data for editing or empty for new
        onCancel={() => {
          console.log('Cancelling Edit');
          setShowForm(false);
          setEditData(null);
        }}
        onSave={handleSave}
      />
      
      )}
    </div>
  );
};

export default FeesController;
function setFeesData(arg0: (prevData: any[]) => any[]) {
  throw new Error("Function not implemented.");
}

