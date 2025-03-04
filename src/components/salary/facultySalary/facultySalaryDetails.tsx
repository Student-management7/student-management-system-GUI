import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import ReusableTable from "../../StudenAttendanceShow/Table/Table";
import { toast, ToastContainer } from "react-toastify";
import EditFacultySalaryForm from "./EditFacultySalaryForm";
import { Pencil } from "lucide-react";
import { formatToDDMMYYYY } from "../../Utils/dateUtils";
import BackButton from "../../Navigation/backButton";

interface FacultyDeduction {
  name: string;
  amount: number;
}

interface FacultySalary {
  id: string;
  fact_id: string;
  creationDateTime: string;
  schoolCode: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: string;
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
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    fetchFacultyDetails();
  }, [id]);

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
        console.log(response.data[0]);
        
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

  console.log("faculty details ",faculty)

  // Switch to edit mode when edit button is clicked
  const handleEditButtonClick = (data: FacultySalary) => {
    // Prepare data for edit form with the structure needed for the edit payload
    setEditData({
      id: data.id,
      facultyID: faculty?.fact_id,  // Include faculty ID from parent component
      facultySalary: data.facultySalary,
      facultyTax: data.facultyTax,
      facultyTransport: data.facultyTransport,
      facultyDeduction: parseDeductions(data.facultyDeduction)
    });
    
    setShowEditForm(true);
  };

  // Handle save from edit form
 // Updated handleSave function
 const handleSave = async (updatedData: any) => {
  try {
    // Make API call with edit payload
    const response = await axiosInstance.post(`/faculty/salary/edit?id=${updatedData.id}`, {
      id: updatedData.id,
      facultyID: updatedData.facultyID,  // Include faculty ID in payload
      facultySalary: updatedData.facultySalary,
      facultyTax: updatedData.facultyTax,
      facultyTransport: updatedData.facultyTransport,
      facultyDeduction: updatedData.facultyDeduction,  // Send as array, not stringify
    });
    
    if (response.status === 200) {
      toast.success("Salary information updated successfully");
      // Refresh data after update
      fetchFacultyDetails();
      // Close edit form
      setShowEditForm(false);
      setEditData(null);
    } else {
      throw new Error("Failed to update salary information");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred during update operation.";
    toast.error(errorMessage);
    console.error("Update error:", err);
  }
};

  // Calculate total salary after deductions and tax

  const handleCancel = () => {
    setShowEditForm(false);
    setEditData(null);
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!faculty) return <div>No data available.</div>;

    return (
    <>
      <div className="box">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex items-center space-x-4 mb-2">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Faculty Salary Details</h1>
          </div>
       

        <div className="box">
          <div className="space-y-1 mb-3">
        <p className="mb-2">
            <strong  className="mr-2">ID:</strong> {faculty.fact_id}
          </p>
          <p className="mb-2 ">
            <strong className="mr-2">Name:</strong> {faculty.fact_Name}
          </p> 
          </div>
          <ReusableTable
            rows={faculty.fact_salary.map((salary) => ({
              id: salary.id,
              creationDateTime: formatToDDMMYYYY(salary.creationDateTime),
              schoolCode: salary.schoolCode,
              facultySalary: salary.facultySalary,
              facultyTax: salary.facultyTax,
              facultyTransport: salary.facultyTransport,
              facultyDeduction: formatDeductionsForDisplay(salary.facultyDeduction),
              total: salary.total,
            }))}
            columns={[
              // { field: "id", headerName: "ID" },
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
    </>
    );
  };

  return (
    <>
      {showEditForm && editData ? (
        <EditFacultySalaryForm
          initialData={editData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        renderContent()
      )}
    </>
  );
};

export default FacultySalaryDetails;