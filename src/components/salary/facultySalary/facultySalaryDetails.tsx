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
  paymentMode: string;
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

// Switch to edit mode when edit button is clicked
const handleEditButtonClick = (data: FacultySalary) => {
  console.log("Original facultyDeduction string:", data.facultyDeduction);
  
  let parsedDeductions = [];
  
  try {
    // The data is coming as a JSON string of an array, so directly parse it
    parsedDeductions = JSON.parse(data.facultyDeduction);
    console.log("Successfully parsed deductions:", parsedDeductions);
  } catch (error) {
    console.error("Error parsing facultyDeduction:", error);
    
    // If JSON parsing fails, try to extract individual items
    try {
      // If the string contains a comma-separated list
      if (data.facultyDeduction.includes(',')) {
        const items = data.facultyDeduction.split(',');
        parsedDeductions = items.map(item => {
          const [name, amountStr] = item.split(':').map(s => s.trim());
          return { name, amount: parseFloat(amountStr) };
        }).filter(item => !isNaN(item.amount));
      } else if (data.facultyDeduction.includes(':')) {
        // Single item case
        const [name, amountStr] = data.facultyDeduction.split(':').map(s => s.trim());
        const amount = parseFloat(amountStr);
        if (!isNaN(amount)) {
          parsedDeductions = [{ name, amount }];
        }
      }
      
      console.log("Parsed from string format:", parsedDeductions);
      
      // If parsing failed and we have an empty array, use default
      if (parsedDeductions.length === 0) {
        parsedDeductions = [{ name: "Default", amount: 0 }];
      }
    } catch (innerError) {
      console.error("Fallback parsing failed:", innerError);
      parsedDeductions = [{ name: "Default", amount: 0 }];
    }
  }
  
  const updatedEditData = {
    id: data.id,
    facultyID: faculty?.fact_id,
    facultySalary: data.facultySalary,
    facultyTax: data.facultyTax,
    facultyTransport: data.facultyTransport,
    facultyDeduction: parsedDeductions,
  };
  
  console.log("Final edit data:", updatedEditData);
  
  setEditData(updatedEditData);
  setShowEditForm(true);
};


const handleSave = async (updatedData: any) => {
  try {
    // Parse facultyDeduction if it's a string, or use it directly if it's already an array
    let facultyDeductionArray;
    
    if (typeof updatedData.facultyDeduction === 'string') {
      try {
        // If it's already a string, parse it to get the array
        facultyDeductionArray = JSON.parse(updatedData.facultyDeduction);
      } catch (error) {
        console.error("Error parsing facultyDeduction string:", error);
        facultyDeductionArray = [{ name: "Default", amount: 0 }];
      }
    } else if (Array.isArray(updatedData.facultyDeduction)) {
      // If it's already an array, use it directly
      facultyDeductionArray = updatedData.facultyDeduction;
    } else {
      // Fallback
      facultyDeductionArray = [{ name: "Default", amount: 0 }];
    }
    
    console.log("Sending facultyDeduction as array:", facultyDeductionArray);
    
    // Make API call with facultyDeduction as an array, not a string
    const response = await axiosInstance.post(`/faculty/salary/edit?id=${updatedData.id}`, {
      id: updatedData.id,
      facultyID: updatedData.facultyID,
      facultySalary: updatedData.facultySalary,
      facultyTax: updatedData.facultyTax,
      facultyTransport: updatedData.facultyTransport,
      facultyDeduction: facultyDeductionArray, // Send as array, not as a string
    });
    
    if (response.status === 200) {
      toast.success("Salary information updated successfully");
      fetchFacultyDetails();
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
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="box">
        <div className="flex items-center space-x-4 mb-2">
            <span>
              <BackButton />
            </span>
            <h1 className="head1" >Faculty Salary Details</h1>
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
              paymentMode: salary.paymentMode
            }))}
            columns={[
              // { field: "id", headerName: "ID" },
              { field: "creationDateTime", headerName: "Creation Date" },
              { field: "facultySalary", headerName: "Salary" },
              { field: "facultyTax", headerName: "Tax (%)" },
              { field: "facultyTransport", headerName: "Transport" },
              { field: "facultyDeduction", headerName: "Deductions" },
              { field: "total", headerName: "Total" },
              { field: "paymentMode", headerName: "Payment Mode" },
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
            <ToastContainer position="top-right" autoClose={3000} />
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