
// import axios from 'axios';
import axiosInstance from "../../Utils/apiUtils";

export const fetchFacultyAttendanceData = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const response = await axiosInstance.get(
      `/faculty/getAttendance`,
      {
        params: { fromDate, toDate },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty attendance data:", error);
    throw error;
  }
};


