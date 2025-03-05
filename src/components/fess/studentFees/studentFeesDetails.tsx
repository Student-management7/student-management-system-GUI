import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/Utils/apiUtils";
import Loader from "../../loader/loader";
import BackButton from "../../Navigation/backButton";
import ReusableTable from "../../StudenAttendanceShow/Table/Table";
// import { formatToDDMMYYYY1 } from "../../Utils/dateUtils";
import { toast, ToastContainer } from "react-toastify";

 const formatToDDMMYYYY = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString().padStart(2, '0')}-${date.getFullYear()}`;
};



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
  remainingFees?: number; // Add remainingFees field
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
  const [remainingFees, setRemainingFees] = useState<number>(0);

 
  

  // Column definitions for the feeInfo grid
  const columnDefs = [
    {
      headerName: "Fees Submitted Date",
      field: "creationDateTime",
      valueFormatter: (params: { value: string }) => formatToDDMMYYYY1(params.value),
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
          const data = response.data[0]; // Extract first object from array
          console.log("Student Data:", data);
  
          // Format the date inside feeInfo array
          const formattedFeeInfo = data.feeInfo?.map((fee: FeeInfo) => ({
            ...fee,
            creationDateTime: formatToDDMMYYYY(fee.creationDateTime),
          })) || [];
  
          setStudentData(data);
          setFeeInfo(formattedFeeInfo);
  
          if (data.remainingFees !== undefined) {
            setRemainingFees(data.remainingFees);
          }
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

  // Validate fee amount
  const validateFeeAmount = (amount: number): boolean => {
    if (amount <= 0) {
      toast.error("Fee amount must be greater than zero");
      return false;
    }
    
    if (amount > remainingFees) {
      toast.error(`Fee amount cannot exceed remaining fees (${remainingFees})`);
      return false;
    }
    
    return true;
  };

  // Handle fee input change
  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Only update state if value is positive (empty input is allowed in the field)
    if (e.target.value === "" || value > 0) {
      setEditFeeAmount(value || null);
    }
  };

  // Handle save updated fee
  const handleSaveFee = async () => {
    if (!editFeeId || !editFeeAmount) {
      toast.error("Please enter a valid fee amount");
      return;
    }
    
    if (!validateFeeAmount(editFeeAmount)) {
      return;
    }
  
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

          {/* Display Student Name */}
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
              {remainingFees !== undefined && (
                <p className="mb-4">
                  <span className="text-xl font-semibold">Remaining Fees:</span>
                  <span className="ml-2 text-xl"> {remainingFees}</span>
                </p>
              )}
            </>
          ) : (
            <p>No student data found.</p>
           
          )}

{/* Edit Fee Form */}
{editFeeId && (
  <div className="mb-4">
    <label className="block mb-2 font-semibold text-red-500">Edit Fee Amount</label>
    
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="number"
        value={editFeeAmount || ""}
        onChange={handleFeeInputChange}
        min="1"
        max={remainingFees}
        className="w-full p-2 border rounded-md"
        placeholder="Enter amount"
      />
      
      <button
        onClick={handleSaveFee}
        className="btn button px-4 py-2"
      >
        Update Fees
      </button>
      
      <button
        onClick={() => {
          setEditFeeId(null);
          setEditFeeAmount(null);
        }}
        className="btn buttonred px-4 py-2"
      >
        Cancel
      </button>
    </div>
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