import React, { useState, useEffect, useCallback } from "react";
import FeesForm from "./feesForm";
import { FeeDetails, FeeFormValues } from "../../../services/feesServices/AdminFeescreationForm/type";
import { fetchFees, updateFee, saveFees ,deleteFeeRecord} from "../../../services/feesServices/AdminFeescreationForm/api";
import { Pencil, Trash, Trash2 } from "lucide-react";
import Loader from "../../loader/loader";
import ReusableTable from "../../MUI Table/ReusableTable";

const FeesController: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false); // Toggle between grid and form views
  const [rowData, setRowData] = useState<FeeDetails[]>([]); // Holds grid data
  const [editData, setEditData] = useState<FeeDetails | null>(null); // Holds data for editing
  const [loading, setLoading] = useState(false); // State for managing loader visibility

  // Column definitions for GridView
  const columnDefs = [
    
    // { headerName: "Id", field: "id", editable: false  },
    { headerName: "Class", field: "className", editable: false  },
    { headerName: "School Fee", field: "schoolFee", editable: false  },
    { headerName: "Sports Fee", field: "sportsFee", editable: false  },
    { headerName: "Book Fee", field: "bookFee", editable: false  },
    { headerName: "Transportation Fee", field: "transportation", editable: false  },
    {
      headerName: "Other Amounts",
      field: "otherAmount",
      cellRenderer: (params: any) =>
        params.value && params.value.length
      ? params.value.map((item: any) => `${item.name}: ${item.amount}`).join(", ")
      : "0",
    },

    { headerName: "Total Fees", field: "totalFee", editable: false  },
    
    {
        field: 'edit',
        headerName: 'Edit',
        cellRenderer: (params: any) => (
          <button
           
            onClick={() => handleEditButtonClick(params.data)}
          >
            <Pencil size={20} color='orange' />
          </button>
        ),
      },
    
      // Delete Button Column
      {
        field: 'delete',
        headerName: 'Delete',
        cellRenderer: (params: any) => (
          <button
          onClick={() => handleDeleteButtonClick(params.data.id)}
          >
            
          <Trash2 size={20} color="red" />
          </button>
        ),
      },
    
  ];

  // Fetch fee data on mount
  const fetchFeeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFees();
      setRowData(data);
    } catch (error) {
      console.error("Error fetching fee details:", error);
    }
    finally {
      setLoading(false);
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
    <>
    {loading && <Loader />} {/* Show loader when loading */}
    {!loading && (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right">
          <div className="flex items-center space-x-4 ">
            <span >
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Admin Fee Page</h1>
          </div>            <button onClick={() => setShowForm(true)} className="btn btn-default">
              Add Fee
            </button>
          </div>
          <ReusableTable rows={rowData} columns={columnDefs} />
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
    )}
    </>
  );
};

export default FeesController;
function setFeesData(arg0: (prevData: any[]) => any[]) {
  throw new Error("Function not implemented.");
}

