import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GridView from './gridView';
import { 

  FacultySalaryResponse, 
  FacultySalaryDetails as SalaryDetail } from '../../../services/salary/facultysalary/type';
import { fetchFacultySalariesById } from '../../../services/salary/facultysalary/Api';

const FacultySalaryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facultyDetails, setFacultyDetails] = useState<FacultySalaryResponse | null>(null);
  const [salaryRowData, setSalaryRowData] = useState<any[]>([]);

  
  const columnDefs = [
    { 
      headerName: "Date", 
      field: "creationDateTime", 
      cellRenderer: (params: any) => {
        return new Date(params.value).toLocaleString();
      }
    },
    { 
      headerName: "Salary", 
      field: "facultySalary",
      valueFormatter: (params: any) => `₹ ${params.value.toLocaleString()}`
    },
    { 
      headerName: "Tax", 
      field: "facultyTax",
      valueFormatter: (params: any) => `${params.value}%`
    },
    { 
      headerName: "Transport Allowance", 
      field: "facultyTransport",
      valueFormatter: (params: any) => `₹ ${params.value.toLocaleString()}`
    },
    {
      headerName: "Deductions",
      field: "facultyDeduction",
      cellRenderer: (params: any) => {
        try {
          const deductions = JSON.parse(params.value || "[]");
          return deductions.map((d: any) => `${d.name}: ₹${d.amount}`).join(", ") || "N/A";
        } catch (error) {
          return "N/A";
        }
      },
    },
    { 
      headerName: "Total", 
      field: "total",
      valueFormatter: (params: any) => `₹ ${params.value.toLocaleString()}`
    }
  ];

  // Fetch faculty details by ID
  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (!id) return;

      try {
        const data: FacultySalaryResponse = await fetchFacultySalariesById(id);
        setFacultyDetails(data);
        
       
        const transformedSalaryData = data.fact_salary.map(salary => ({
          ...salary,
          
        }));
        
        setSalaryRowData(transformedSalaryData);
      } catch (error) {
        console.error("Error fetching faculty salary details:", error);
        
      }
    };

    fetchFacultyDetails();
  }, [id]);

  // If no details found
  if (!facultyDetails) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="faculty-salary-details">
      <div className="header mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Faculty Salary Details
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            Back to List
          </button>
        </div>
        <div className="faculty-info mt-4">
          <h3 className="text-xl">
            Name: {facultyDetails.fact_Name}
          </h3>
          <p>Faculty ID: {facultyDetails.fact_id}</p>
        </div>
      </div>

      <GridView 
        rowData={salaryRowData} 
        columnDefs={columnDefs} 
      />
    </div>
  );
};

export default FacultySalaryDetails;