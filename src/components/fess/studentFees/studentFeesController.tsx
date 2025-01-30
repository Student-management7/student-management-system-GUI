import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import axiosInstance from "../../../services/Utils/apiUtils";
import StudentFeesForm from "./studentFeesForm";
import Loader from "../../loader/loader";
import BackButton from "../../Navigation/backButton";
import ReusableTable from "../../MUI Table/ReusableTable";

interface FeeData {
  id: string;
  name: string;
  familyDetails: {
    stdo_FatherName: string;
  };
  contact: string;
  email: string;
  cls: string;
  totalFees: number;
  remainingFees: number;
}

interface Column {
  field: string;
  headerName: string;
  renderCell?: (row: any) => React.ReactNode;
  editable?: boolean;
  cellRenderer?: (row: any) => React.ReactNode;
}

const StudentFeesController: React.FC = () => {
  const [rowData, setRowData] = useState<FeeData[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingFee, setEditingFee] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns: Column[] = [
    { 
      field: "id", 
      headerName: "ID",
      editable: false  
    },
    { 
      field: "name", 
      headerName: "Name",
      editable: false 
    },
    { 
      field: "familyDetails.stdo_FatherName", 
      headerName: "Father Name",
      editable: false  
    },
    // { 
    //   field: "contact", 
    //   headerName: "Contact",
    //   editable: false  
    // },
    // { 
    //   field: "email", 
    //   headerName: "Email",
    //   editable: false  
    // },
    { 
      field: "cls", 
      headerName: "Class",
      editable: false  
    },
    { 
      field: "totalFees", 
      headerName: "Total Fees",
      editable: false  
    },
    { 
      field: "remainingFees", 
      headerName: "Remaining Fees",
      editable: false  
    },
    {
      field: "actions",
      headerName: "View",
      cellRenderer: (row: FeeData) => (
        <button
          onClick={() => navigate(`/studentfeesDetails/${row.id}`)}
          className="text-blue-600 hover:text-blue-800"
          aria-label="View Details"
        >
          <Eye size={20} />
        </button>
      )
    },
    {
      field: "actions",
      headerName: "Edit",
      cellRenderer: (row: FeeData) => (
        <button
          onClick={() => handleEdit(row)}
          className="text-yellow-600 hover:text-yellow-800"
          aria-label="Edit Details"
        >
          <Pencil size={20} />
        </button>
      )
    },
    {
      field: "actions",
      headerName: "Delete",
      cellRenderer: (row: FeeData) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete Record"
        >
          <Trash2 size={20} />
        </button>
      )
    }
  ];

  const handleEdit = (feeData: FeeData) => {
    setEditingFee(feeData);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this fee record?")) {
      try {
        await axiosInstance.delete(`https://s-m-s-keyw.onrender.com/student/fees/${id}`);
        fetchFees();
      } catch (error) {
        alert("Failed to delete fee record");
      }
    }
  };

  const handleRowUpdate = (updatedRow: any, rowIndex: number) => {
    const newRows = [...rowData];
    newRows[rowIndex] = updatedRow;
    setRowData(newRows);
    // Here you can also make an API call to update the data on the server
    // Example: axiosInstance.put(`/student/fees/${updatedRow.id}`, updatedRow);
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<FeeData[]>("https://s-m-s-keyw.onrender.com/student/findAllStudent");
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="box">
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]">
              Student Fees
            </h1>
          </div>
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
              <ReusableTable 
                rows={rowData} 
                columns={columns}
                onRowUpdate={handleRowUpdate}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          ) : (
            <StudentFeesForm
              onClose={() => {
                setShowForm(false);
                setEditingFee(null);
                fetchFees();
              }}
              // editingData={editingFee}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StudentFeesController;