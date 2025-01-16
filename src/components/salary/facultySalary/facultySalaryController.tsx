import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GridView from "./gridView";
import FacultySalaryForm from "./FacultySalaryForm";
import { fetchFacultySalaries, updateFacultySalary, saveFacultySalary } from "../../../services/salary/facultysalary/Api";
import { Eye, Pencil } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columnDefs = [
    { headerName: "Faculty ID", field: "facultyID", sortable: true, filter: true },
    { headerName: "Email", field: "fact_email", sortable: true, filter: true },
    { headerName: "Faculty Name", field: "fact_Name", sortable: true, filter: true },
    { headerName: "Salary", field: "facultySalary", sortable: true, filter: true },
    { headerName: "Tax %", field: "facultyTax", sortable: true, filter: true },
    { headerName: "Transport Allowance", field: "facultyTransport", sortable: true, filter: true },
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

    { headerName: "Total", field: "total", sortable: true, filter: true },
    {
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
      headerName: "View Details",
      cellRenderer: (params: any) => (
        <button
            onClick={() => params.data?.facultyID && handleViewDetails(params.data.facultyID)}
          >
           <Eye size={20} color='blue' />
          </button>
      )}
  ];

  const fetchSalaryDetails = useCallback(async () => {
    
    setError(null);
    try {
      const data: FacultySalaryResponse[] = await fetchFacultySalaries();
      const transformedData = transformFacultySalaryData(data);
      setRowData(transformedData);
    } catch (error) {
      console.error("Error fetching faculty salary details:", error);
      setError("Failed to fetch salary details. Please try again.");
    } finally {
      
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
    setIsLoading(true);
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
      setIsLoading(false);
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
    <div className="box">
      {error && (
        <div className="alert alert-error mb-4">
          {error}
          <button onClick={() => setError(null)} className="ml-2">
            Dismiss
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center my-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading...</p>
        </div>
      )}

      {!showForm ? (
        <>
          <div className="text-right mb-4">
          <h1 className="text-center text-2xl font-bold mb-2 ">Faculty Salary</h1>
            <button
              onClick={() => {
                setShowForm(true);
                setEditData(null);
              }}
              className={`btn btn-default ${isLoading ? "btn-disabled" : ""}`}
              disabled={isLoading}
            >
              Add Salary
            </button>

          </div>
          <GridView
            rowData={rowData}
            columnDefs={columnDefs}
          // loading={isLoading}
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
  );
};

export default FacultySalaryController;