import axiosInstance from "../Utils/apiUtils";

export const fetchStudents = async () => {
  const response = await axiosInstance.get("/student/findAllStudent");
  return response.data;
};


export const saveStudentFee = async (feeData: any) => {
  try {
    const response = await axiosInstance.post("/student/saveFees", feeData);
    return response.data;
  } catch (error) {
    console.error("Error saving student fee:", error);
    throw error;
  }
};


// const fetchFees = async () => {
//   try {
//     setLoading(true);
//     const response = await axiosInstance.get<FeeData[]>("/student/findAllStudent");
//     setRowData(response.data);
//   } catch (error) {
//     toast.error("Errorfetching Fee")
//     console.error("Error fetching fees:", error);
//   } finally {
//     setLoading(false);
//   }
// };

// useEffect(() => {
//   fetchFees();
// }, []);