import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import StudentFeesForm from "./studentFeesForm";
import Loader from "../../loader/loader";
import ReusableTable from "../../StudenAttendanceShow/Table/Table";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/Utils/apiUtils";

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
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Name", editable: false },
    // { field: "familyDetails.stdo_FatherName", headerName: "Father Name", editable: false },
    { field: "cls", headerName: "Class", editable: false },
    { field: "totalFee", headerName: "Total Fees", editable: false },
    { field: "remainingFees", headerName: "Remaining Fees", editable: false },
    
    {
      field: "view",
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button onClick={() => handleViewDetails(params.data.id)}>
          <Eye size={20} color="blue" />
        </button>
      ),
    },
    
  ];

  const handleViewDetails = (id: string) => {
    navigate(`/studentFeesDetails/${id}`);
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
  }, []);;

  return (
   
  <>
    <ToastContainer position="top-right" autoClose={3000} />
    {loading && <Loader />}
    {!loading && (
      <div className="box">
        {!showForm && (  // Only show when the form is not active
          <>
            <h1 className="head1">Student Fees</h1>
            <button onClick={() => setShowForm(true)} className="btn button float-right mt-1">
              Add Fees
            </button>
          </>
        )}
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
  </>
);

  
};

export default StudentFeesController;