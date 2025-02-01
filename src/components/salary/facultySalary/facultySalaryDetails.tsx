import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import ReusableTable from "../../MUI Table/ReusableTable";

// Define interfaces for data structures
interface FacultySalary {
  id: string;
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

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/faculty/findAllFaculty`, {
          params: { id },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setFaculty(response.data[0]); // Assuming the response is an array
        } else {
          setError("No data found for the given ID.");
        }
      } catch (err) {
        setError((err as Error).message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacultyDetails();
    }
  }, [id]);

  const parseDeductions = (deductions: string): string => {
    try {
      return JSON.parse(deductions)
        .map((deduction: { name: string; amount: number }) => `${deduction.name}: ${deduction.amount}`)
        .join(", ");
    } catch {
      return "Invalid Deduction Data";
    }
  };

  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!faculty) return <div>No data available.</div>;

    return (
      <div className="box p-4">
        <div className="header mb-4">
          <h2 className="text-2xl font-bold">Faculty Details</h2>
          <p>
            <strong>ID:</strong> {faculty.fact_id}
          </p>
          <p>
            <strong>Name:</strong> {faculty.fact_Name}
          </p>
        </div>

        <div className="box p-4">
          <h3 className="text-xl font-semibold mb-2">Salary Details</h3>
          <ReusableTable
            rows={faculty.fact_salary.map((salary) => ({
              // id: salary.id,
              creationDateTime: salary.creationDateTime,
              schoolCode: salary.schoolCode,
              facultySalary: salary.facultySalary,
              facultyTax: salary.facultyTax,
              facultyTransport: salary.facultyTransport,
              facultyDeduction: parseDeductions(salary.facultyDeduction),
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
            ]}
          />
        </div>
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default FacultySalaryDetails;
