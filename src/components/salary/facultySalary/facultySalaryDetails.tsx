import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import ReusableTable from "../../MUI Table/ReusableTable";
import { toast, ToastContainer } from "react-toastify";
import EditFacultySalaryForm from "./EditFacultySalaryForm";
import { Pencil } from "lucide-react";

interface FacultyDeduction {
  name: string;
  amount: number;
}

interface FacultySalary {
  id: string;
  creationDateTime: string;
  schoolCode: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: string; // Stored as a JSON string in DB
  parsedDeductions?: FacultyDeduction[]; // Added for internal use
  total: number;
}

interface Faculty {
  fact_id: string;
  fact_Name: string;
  fact_salary: FacultySalary[];
}

const FacultySalaryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editData, setEditData] = useState<FacultySalary | null>(null);

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verify that id is defined before making the request
        if (!id) {
          throw new Error("Faculty ID is required");
        }

        const response = await axiosInstance.get(`/faculty/findAllFaculty`, {
          params: { id },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setFaculty(response.data[0]);
        } else {
          toast.error("No data found for the given ID.");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching data.";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacultyDetails();
    } else {
      setError("Faculty ID is missing");
      setLoading(false);
    }
  }, [id]);

  // Parse deductions from JSON string to array of objects
  const parseDeductions = (deductions: string): FacultyDeduction[] => {
    try {
      return JSON.parse(deductions);
    } catch {
      return [{ name: "Default", amount: 0 }];
    }
  };

  // Format deductions for display in the table
  const formatDeductionsForDisplay = (deductions: string): string => {
    try {
      return parseDeductions(deductions)
        .map((deduction: FacultyDeduction) => `${deduction.name}: ${deduction.amount}`)
        .join(", ");
    } catch {
      return "Invalid Deduction Data";
    }
  };

  const handleEditButtonClick = (data: FacultySalary) => {
    // Create a copy of the data with parsed deductions
    const preparedData = {
      ...data,
      parsedDeductions: parseDeductions(data.facultyDeduction)
    };
    
    setEditData(preparedData);
    setShowEditForm(true);
  };

  const handleSave = async (updatedData: FacultySalary) => {
    try {
      // Convert parsed deductions back to string for storage
      const dataToSave = {
        ...updatedData,
        facultyDeduction: JSON.stringify(updatedData.parsedDeductions),
        // Recalculate total
        total: calculateTotal(updatedData)
      };

      // Remove temporary field before saving to backend
      delete dataToSave.parsedDeductions;

      // Update the faculty salary in the table
      if (faculty) {
        const updatedSalary = faculty.fact_salary.map((salary) =>
          salary.id === dataToSave.id ? dataToSave : salary
        );
        setFaculty({ ...faculty, fact_salary: updatedSalary });
      }
      
      setShowEditForm(false);
      toast.success("Salary information updated successfully");
    } catch (err) {
      toast.error("Failed to update salary information");
      console.error("Update error:", err);
    }
  };

  // Calculate total salary after deductions and tax
  const calculateTotal = (data: FacultySalary): number => {
    const baseSalary = data.facultySalary;
    const taxAmount = (baseSalary * data.facultyTax) / 100;
    
    // Calculate total deductions
    const deductionsTotal = data.parsedDeductions 
      ? data.parsedDeductions.reduce((sum, deduction) => sum + deduction.amount, 0)
      : 0;
    
    // Total = Base Salary + Transport - Tax - Deductions
    return baseSalary + data.facultyTransport - taxAmount - deductionsTotal;
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setEditData(null);
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!faculty) return <div>No data available.</div>;

    return (
      <div className="box p-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="mb-4">
          <h2 className="head1">Faculty Details</h2>
          <p>
            <strong>ID:</strong> {faculty.fact_id}
          </p>
          <p>
            <strong>Name:</strong> {faculty.fact_Name}
          </p>
        </div>

        <div className="p-4">
          <ReusableTable
            rows={faculty.fact_salary.map((salary) => ({
              id: salary.id,
              creationDateTime: salary.creationDateTime,
              schoolCode: salary.schoolCode,
              facultySalary: salary.facultySalary,
              facultyTax: salary.facultyTax,
              facultyTransport: salary.facultyTransport,
              facultyDeduction: formatDeductionsForDisplay(salary.facultyDeduction),
              total: salary.total,
            }))}
            columns={[
              { field: "id", headerName: "ID" },
              { field: "creationDateTime", headerName: "Creation Date" },
              { field: "facultySalary", headerName: "Salary" },
              { field: "facultyTax", headerName: "Tax (%)" },
              { field: "facultyTransport", headerName: "Transport" },
              { field: "facultyDeduction", headerName: "Deductions" },
              { field: "total", headerName: "Total" },
              {
                field: "edit",
                headerName: "Edit",
                cellRenderer: (params: any) => (
                  <button
                    onClick={() => handleEditButtonClick(params.data)}
                    className="btn-icon"
                    title="Edit Salary Details"
                  >
                    <Pencil size={20} color="orange" />
                  </button>
                ),
              },
            ]}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      {showEditForm && editData && (
        <EditFacultySalaryForm
          initialData={editData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default FacultySalaryDetails;