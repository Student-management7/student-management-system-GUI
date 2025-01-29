// StudentFeesController.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import GridView from "./gridView";
import axiosInstance from "../../../services/Utils/apiUtils";
import StudentFeesForm from "./studentFeesForm";

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
      headerName: "View",
      cellRenderer: (params: { data: FeeData }) => (
        <button
          onClick={() => navigate(`/studentfeesDetails/${params.data.id}`)}
          className=" text-blue-600 hover:text-blue-800"
          aria-label="View Details"
        >
           <Eye size={20}  />
        </button>
      ),
    },
    {
      headerName: "Edit",
      cellRenderer: (params: { data: FeeData }) => (
        <button
          onClick={() => handleEdit(params.data)}
          className="text-yellow-600 hover:text-yellow-800"
          aria-label="Edit Details"
        >
          <Pencil size={20} />
        </button>
      ),
    },
    {
      headerName: "Delete",
      cellRenderer: (params: { data: FeeData }) => (
        <button
          onClick={() => handleDelete(params.data.id)}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete Record"
        >
          <Trash2 size={20} />
        </button>
      ),
    },
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

  const fetchFees = async () => {
    try {
      const response = await axiosInstance.get<FeeData[]>("https://s-m-s-keyw.onrender.com/student/findAllStudent");
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="box">
      {!showForm ? (
        <>
          <div className="text-right mb-3">
            <h1 className="text-center text-3xl font-bold mb-2">Student Fees</h1>
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
        <StudentFeesForm
          onClose={() => {
            setShowForm(false);
            setEditingFee(null);
            fetchFees();
          }}
          editingData={editingFee}
        />
      )}
    </div>
  );
};

export default StudentFeesController;
