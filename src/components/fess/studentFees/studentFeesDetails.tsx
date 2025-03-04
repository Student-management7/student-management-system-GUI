import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import BackButton from "../../Navigation/backButton";
import ReusableTable from "../../MUI Table/ReusableTable";
import { changeFormatToDDMMYYYY } from "../../Utils/dateUtils";
import { toast, ToastContainer } from "react-toastify";

// Define types for student data and fee info
interface FeeInfo {
  id: string;
  creationDateTime: string;
  fee: number;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  feeInfo: FeeInfo[];
  [key: string]: any; // Allow extra fields in the response
}

const StudentFeesDetails = () => {
  const { id } = useParams(); // Get the student ID from URL
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [feeInfo, setFeeInfo] = useState<FeeInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editFeeId, setEditFeeId] = useState<string | null>(null);
  const [editFeeAmount, setEditFeeAmount] = useState<number | null>(null);

  // Column definitions for the feeInfo grid
  const columnDefs = [
    {
      headerName: "Fees Submitted Date",
      field: "creationDateTime",
      valueFormatter: (params: { value: string }) => changeFormatToDDMMYYYY(params.value),
    },
    { headerName: "Fee", field: "fee" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: any) => (
        <button
          onClick={() => handleEditFee(params.data.id, params.data.fee)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <i className="bi bi-pencil-square"></i> Edit
        </button>
      ),
    },
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
          toast.error("Unexpected API response format or empty data.");
        }
      } catch (error) {
        toast.error("Error fetching student data");
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  // Handle edit fee
  const handleEditFee = (feeId: string, feeAmount: number) => {
    setEditFeeId(feeId);
    setEditFeeAmount(feeAmount);
  };

  // Handle save updated fee
  const handleSaveFee = async () => {
    if (!editFeeId || !editFeeAmount) return;
  
    try {
      const response = await axiosInstance.post(`/student/editFees`, {
        id: editFeeId,
        fee: editFeeAmount,
      });
  
      if (response.status === 200) {  // Check status directly
        toast.success("Fee updated successfully!");
        // Refresh fee info
        const updatedFeeInfo = feeInfo.map((fee) =>
          fee.id === editFeeId ? { ...fee, fee: editFeeAmount } : fee
        );
        setFeeInfo(updatedFeeInfo);
        setEditFeeId(null);
        setEditFeeAmount(null);
      } else {
        toast.error("Failed to update fee. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating fee:", error);
    }
  };
  

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <Loader />
      ) : (
        <div className="box">
          <div className="flex items-center space-x-4 mb-4">
            <span>
              <BackButton />
            </span>
            <h1 className="text-xl items-center font-bold text-[#27727A]">
              Student Fees Details
            </h1>
          </div>

          {/* Display Student ID and Name */}
          {studentData ? (
            <>
              <p className="mb-3">
                <span className="text-xl font-semibold">Name:</span>
                <span className="ml-2 text-xl"> {studentData.name}</span>
              </p>
              <p className="mb-4">
                <span className="text-xl font-semibold">Email:</span>
                <span className="ml-2 text-xl"> {studentData.email}</span>
              </p>
            </>
          ) : (
            <p>No student data found.</p>
          )}

          {/* Edit Fee Form */}
          {editFeeId && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-red-500">Edit Fee Amount</label>
              <input
                type="number"
                value={editFeeAmount || ""}
                onChange={(e) => setEditFeeAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-md mt-2 mb-3 "
              />
              <button
                onClick={handleSaveFee}
                className="btn button mt-0 ml-10 mb-1"
              >
                Update Fees
              </button>
              <button
                onClick={() => {
                  setEditFeeId(null);
                  setEditFeeAmount(null);
                }}
                className="btn buttonred  ml-5 mb-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Grid for Fee Info */}
          {feeInfo.length > 0 ? (
            <ReusableTable rows={feeInfo} columns={columnDefs} />
          ) : (
            <p>No fee information available for this student.</p>
          )}
        </div>
      )}
    </>
  );
};

export default StudentFeesDetails;