import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GridView from "./gridView"; // Ensure this component is correctly implemented
import axiosInstance from "../../../services/Utils/apiUtils";

// Define types for student data and fee info
interface FeeInfo {
  id: string;
  creationDateTime: string;
  fee: number;
}

interface StudentData {
  id: string;
  name: string;
  feeInfo: FeeInfo[];
  [key: string]: any; // Allow extra fields in the response
}

const StudentFeesDetails = () => {
  const { id } = useParams(); // Get the student ID from URL
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [feeInfo, setFeeInfo] = useState<FeeInfo[]>([]);

  // Column definitions for the feeInfo grid
  const columnDefs = [
    { headerName: "ID", field: "id" },
    {
      headerName: "fees submitted Date",
      field: "creationDateTime",
      valueFormatter: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
    { headerName: "Fee", field: "fee" },
  ];

  // Fetch student data
  useEffect(() => {
    axiosInstance
      .get(`https://s-m-s-keyw.onrender.com/student/findAllStudent?id=${id}`)
      .then((response) => {
        console.log("API Response Data:", response.data); // Log full response

        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0]; // Extract the first object from the array

          console.log("Student ID:", data.id);
          console.log("Student Name:", data.name);
          console.log("Fee Info:", data.feeInfo);

          setStudentData(data); // Store student data
          setFeeInfo(data.feeInfo || []); // Extract feeInfo array
        } else {
          console.error("Unexpected API response format or empty data.");
        }
      })
      .catch((error) => console.error("Error fetching student data:", error));
  }, [id]);

  return (
    <div className="box">
      <h1><b>Fees Details :- </b> </h1>
      <br />

      {/* Display Student ID and Name */}
      {studentData ? (
        <div style={{ marginBottom: "20px" }}>
          
          <p>
            <strong>Name:- </strong> {studentData.name || "N/A"}
          </p>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}

      {/* Grid for Fee Info */}
      {feeInfo.length > 0 ? (
        <GridView rowData={feeInfo} columnDefs={columnDefs} />
      ) : (
        <p>No fee information available for this student. </p>
      )}
    </div>
  );
};

export default StudentFeesDetails;
