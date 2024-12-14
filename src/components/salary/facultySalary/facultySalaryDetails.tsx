import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GridView from "./gridView";
import { fetchFacultySalariesById } from "../../../services/salary/facultysalary/Api";

interface FacultySalary {
  creationDateTime: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: string;
  total: number;
}

interface FacultyDetails {
  fact_Name: string;
  fact_id: string;
  facultySalary: FacultySalary[];
}

const FacultySalaryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facultyDetails, setFacultyDetails] = useState<FacultyDetails | null>(null);
  const [salaryRowData, setSalaryRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: "Date",
      field: "creationDateTime",
      cellRenderer: (params: any) => {
        if (!params.value) return "N/A";
        return new Date(params.value).toLocaleString();
      },
    },
    {
      headerName: "Salary",
      field: "facultySalary",
      valueFormatter: (params: any) => `₹ ${params.value?.toLocaleString() || 0}`,
    },
    {
      headerName: "Tax",
      field: "facultyTax",
      valueFormatter: (params: any) => `${params.value || 0}%`,
    },
    {
      headerName: "Transport Allowance",
      field: "facultyTransport",
      valueFormatter: (params: any) => `₹ ${params.value?.toLocaleString() || 0}`,
    },
    {
      headerName: "Deductions",
      field: "facultyDeduction",
      cellRenderer: (params: any) => {
        try {
          const deductions = JSON.parse(params.value || "[]");
          return deductions
            .map((d: any) => `${d.name}: ₹${d.amount}`)
            .join(", ") || "N/A";
        } catch (error) {
          return "N/A";
        }
      },
    },
    {
      headerName: "Total",
      field: "total",
      valueFormatter: (params: any) => `₹ ${params.value?.toLocaleString() || 0}`,
    },
  ];

  // Fetch faculty details by ID
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (!id) {
        console.error("Faculty ID is missing in URL params.");
        return;
      }

      try {
        console.log(`Fetching faculty details for ID: ${id}`);
        const response = await fetchFacultySalariesById(id);

        if (!response) {
          console.warn("API returned no response or null data.");
          setFacultyDetails(null);
          return;
        }

        console.log("API Response:", response);

        // Ensure faculty details are valid
        const validFacultyDetails: FacultyDetails = {
          fact_Name: response.fact_Name || "N/A",
          fact_id: response.fact_id || "N/A",
          facultySalary: Array.isArray(response.facultySalary) ? response.facultySalary : [],
        };
        setFacultyDetails(validFacultyDetails);

        console.log("Faculty Details after processing:", validFacultyDetails);

        // Map salary data
        const salaryData = Array.isArray(validFacultyDetails.facultySalary)
          ? validFacultyDetails.facultySalary.map((salary: FacultySalary) => ({
              ...salary,
              facultyDeduction: salary.facultyDeduction || "[]",
            }))
          : [];
        setSalaryRowData(salaryData);

        console.log("Mapped Salary Row Data:", salaryData);
      } catch (error) {
        console.error("Error fetching faculty salary details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [id]);

  // Loading state
  if (loading) {
    console.log("Loading faculty details...");
    return <div>Loading...</div>;
  }

  // If no faculty details are found
  if (!facultyDetails) {
    console.warn("No faculty details found.");
    return <div>No Faculty Details Found.</div>;
  }

  console.log("Rendering Faculty Salary Details...");

  return (
    <div className="faculty-salary-details">
      <div className="header mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Faculty Salary Details</h2>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Back to List
          </button>
        </div>
        <div className="faculty-info mt-4">
          <h3 className="text-xl">Name: {facultyDetails.fact_Name}</h3>
          <p>Faculty ID: {facultyDetails.fact_id}</p>
        </div>
      </div>

      <GridView rowData={salaryRowData} columnDefs={columnDefs} />
    </div>
  );
};

export default FacultySalaryDetails;
