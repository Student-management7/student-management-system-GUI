import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FacultySalaryForm from "./FacultySalaryForm";
import { fetchFacultySalaries, updateFacultySalary, saveFacultySalary } from "../../../services/salary/facultysalary/Api";
import { Eye, Pencil } from "lucide-react";
import Loader from "../../loader/loader";
import ReusableTable from "../../MUI Table/ReusableTable";
import { toast, ToastContainer } from "react-toastify";
// Define types with improved clarity
type DeductionItem = {
  name: string;
  amount: number;
};

type FacultySalaryDetails = {
  facultyID: string;
  fact_Name?: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: DeductionItem[];
  total: number;
};

type FacultySalaryResponse = {
  fact_email: any;
  fact_id: string;
  fact_Name: string;
  fact_salary: {
    facultySalary?: number;
    facultyTax?: number;
    facultyTransport?: number;
    facultyDeduction?: string; // Stored as a JSON string
    total?: number;
  }[];
};

interface Column {
  field: string;
  headerName: string;
  renderCell?: (row: any) => React.ReactNode;
  editable?: boolean;
  cellRenderer?: (row: any) => React.ReactNode;
}

interface FacultySalaryFormValues extends FacultySalaryDetails { }

const transformFacultySalaryData = (data: FacultySalaryResponse[]): FacultySalaryDetails[] => {
  return data.map((faculty) => {
    const salary = faculty.fact_salary?.[0] || {};
    return {
      facultyID: faculty.fact_id,
      fact_email: faculty.fact_email,
      fact_Name: faculty.fact_Name,
      facultySalary: salary.facultySalary || 0,
      facultyTax: salary.facultyTax || 0,
      facultyTransport: salary.facultyTransport || 0,
      facultyDeduction: JSON.parse(salary.facultyDeduction || "[]"),
      total: salary.total || 0,
    };
  });
};


const FacultySalaryController: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [rowData, setRowData] = useState<FacultySalaryDetails[]>([]);
  const [editData, setEditData] = useState<FacultySalaryDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column[] = [
    // { headerName: "Faculty ID", field: "facultyID", editable: false },
    { headerName: "Email", field: "fact_email", editable: false },
    { headerName: "Faculty Name", field: "fact_Name", editable: false },
    { headerName: "Salary", field: "facultySalary", editable: false },
    { headerName: "Tax %", field: "facultyTax", editable: false },
    { headerName: "Transport Allowance", field: "facultyTransport", editable: false },
    {
      headerName: "Deductions",
      field: "facultyDeduction",
      cellRenderer: (params: any) => {
        if (!params?.value || !Array.isArray(params.value)) return "N/A";
        const deductions: DeductionItem[] = params.value;
        return deductions.length
          ? deductions.map((d: DeductionItem) => `${d.name}: ${d.amount}`).join(", ")
          : "N/A";
      },
    },

    { headerName: "Total", field: "total", editable: false },
    {
      field: "edit",
      headerName: "Edit",
      cellRenderer: (params: any) => (

        <button
          onClick={() => params.data && handleEditButtonClick(params.data)}
        >
          <Pencil size={20} color='orange' />
        </button>

      ),
    },
    {
      field: "view",
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button
          onClick={() => params.data?.facultyID && handleViewDetails(params.data.facultyID)}
        >
          <Eye size={20} color='blue' />
        </button>
      )
    },


  ];

  const fetchSalaryDetails = useCallback(async () => {

    setError(null);
    try {
      setLoading(true);
      const data: FacultySalaryResponse[] = await fetchFacultySalaries();
      const transformedData = transformFacultySalaryData(data);
      setRowData(transformedData);
    } catch (error) {
      toast.error("Error fetching faculty salary details");
      setError("Failed to fetch salary details. Please try again.");
    } finally {
      setLoading(false);

    }
  }, []);

  useEffect(() => {
    fetchSalaryDetails();
  }, [fetchSalaryDetails]);

  const handleEditButtonClick = (data: FacultySalaryDetails) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleSave = async (payload: FacultySalaryFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (editData) {
        await updateFacultySalary(payload.facultyID, payload);
      } else {
        await saveFacultySalary(payload);
      }
      setShowForm(false);
      setEditData(null);
      await fetchSalaryDetails();
    } catch (error) {
      console.error("Error saving faculty salary details:", error);
      setError("Failed to save salary details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (facultyID: string) => {
    navigate(`/FacultySalaryDetails/${facultyID}`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditData(null);
  };

  return (

    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {loading ? (
        <Loader /> // Show loader while data is being fetched
      ) : (
        <div className="box">
          {error && (
            <div className="alert alert-error mb-4">
              {error}
              <button onClick={() => setError(null)} className="ml-2">
                Dismiss
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center my-4">
              <span className="loading loading-spinner loading-lg"></span>
              <p>Loading...</p>
            </div>
          )}

          {!showForm ? (
            <>
              <div className="text-right mb-4">
                <div className="flex items-center space-x-4 mb-4 ">

                  <h1 className="text-xl items-center font-bold text-[#27727A]" >Faculty Salary </h1>
                </div>         
                 <button
                  onClick={() => {
                    setShowForm(true);
                    setEditData(null);
                  }}
                  className='btn float-right button'
                  
                >
                  Add Salary
                </button>

              </div>
              <ReusableTable
                rows={rowData}
                columns={columns}
              // loading={loading}
              />
            </>
          ) : (
            <FacultySalaryForm
              initialData={editData || {
                facultyID: "",
                facultySalary: 0,
                facultyTax: 0,
                facultyTransport: 0,
                facultyDeduction: [],

              }}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}
    </>
  );
};

export default FacultySalaryController;