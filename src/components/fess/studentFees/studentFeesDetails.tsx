import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import BackButton from "../../Navigation/backButton";
import ReusableTable from "../../MUI Table/ReusableTable";


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
  const [loading, setLoading] = useState(false);

  // Column definitions for the feeInfo grid
  const columnDefs = [
    // { headerName: "ID", field: "id" },
    {
      headerName: "Fees Submitted Date",
      field: "creationDateTime",
      valueFormatter: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
    { headerName: "Fee", field: "fee" },
  ];

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `https://s-m-s-keyw.onrender.com/student/findAllStudent?id=${id}`
        );
        console.log("API Response Data:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0]; // Extract the first object from the array
          console.log("Student Data:", data);

          setStudentData(data); // Store student data
          setFeeInfo(data.feeInfo || []); // Extract feeInfo array
        } else {
          console.error("Unexpected API response format or empty data.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loader /> // Show loader while data is being fetched
      ) : (

        <div className="box">

          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]" >Student Fees Details</h1>
          </div>

          {/* Display Student ID and Name */}
          {studentData ? (
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Name:- </strong> {studentData.name || "N/A"}
              </p>
            </div>
          ) : (
            <p>No student data found.</p>
          )}

          {/* Grid for Fee Info */}
          {feeInfo.length > 0 ? (
            <ReusableTable rows={feeInfo} columns={columnDefs} />
          ) : (
            <p>No fee information available for this student.</p>
          )}
        </div >
      )}
    </>
  );
};

export default StudentFeesDetails;
