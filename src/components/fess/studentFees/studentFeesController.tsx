import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import axiosInstance from "../../../services/Utils/apiUtils";
import StudentFeesForm from "./studentFeesForm";
import Loader from "../../loader/loader";
import AlertDialog from "../../alert/AlertDialog";
import ReusableTable from "../../MUI Table/ReusableTable";
import { toast, ToastContainer } from "react-toastify";

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

const StudentFeesController: React.FC = () => {
  const [rowData, setRowData] = useState<FeeData[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingFee, setEditingFee] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const columns= [
    
   
    
    { 
      field: "name", 
      headerName: "Name",
      editable: false 
    },
    { 
      field: "familyDetails.stdo_FatherName", 
      headerName: "Father Name",
      nestedField: "familyDetails.stdo_FatherName",
      editable: false,
    },
    { field: "cls", headerName: "Class", editable: false },
    { field: "totalFee", headerName: "Total Fees", editable: false },
    { field: "remainingFees", headerName: "Remaining Fees", editable: false },
    {
      field: "view",
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button onClick={() => params.data?.id && handleViewDetails(params.data.id)}>
          <Eye size={20} color="blue" />
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Edit",
      cellRenderer: (row: FeeData) => (
        <button onClick={() => handleEdit(row)} className="text-yellow-600 hover:text-yellow-800">
          <Pencil size={20} />
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Delete",
      cellRenderer: (params: any) => (
        <button
          onClick={() => {
            if (params.data?.id) {
              handleDelete(params.data.id);
            } else {
              console.error("ID is undefined:", params.data);
            }
          }}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={20} />
        </button>
      )
    }
    
  ];

  const handleViewDetails = (id: string) => {
    navigate(`/studentFeesDetails/${id}`);
  };

  const handleEdit = (feeData: FeeData) => {
    setEditingFee(feeData);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteId) {
      try {
        await axiosInstance.post(`/student/deleteFees?id=${id}`);
        fetchFees();
      } catch (error) {
        toast.error("Failed to delete fee record");
      } finally {
        setAlertOpen(false);
        setDeleteId(null);
      }
    }
  };

  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<FeeData[]>("/student/findAllStudent");
      setRowData(response.data);
    } catch (error) {
      toast.error("Errorfetching Fee")
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
          <ToastContainer position="top-right" autoClose={3000} />
    
      {loading && <Loader />}
      {!loading && (
        <div className="box">
          <h1 className="head1">Student Fees</h1>
          <div className="text-right mb-3">
            <button onClick={() => setShowForm(true)} className="btn button">
              Add Fees
            </button>
          </div>
          {!showForm ? (
            <ReusableTable rows={rowData} columns={columns} rowsPerPageOptions={[5, 10, 25]} />
          ) : (
            <StudentFeesForm
              onClose={() => {
                setShowForm(false);
                setEditingFee(null);
                fetchFees();
              }}
            />
          )}
        </div>
      )}
      <AlertDialog
        title="Delete Confirmation"
        message="Are you sure you want to delete this fee record?"
        isOpen={alertOpen}
        onConfirm={handleDelete}
        onCancel={() => setAlertOpen(false)}
      />
    </>
  );
};

export default StudentFeesController;
