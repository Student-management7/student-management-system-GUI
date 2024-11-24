
import axios from 'axios';


export const fetchFacultyAttendanceData = async (
  fromDate: string,
  toDate: string
) => {
  try {
    const response = await axios.get(
      `https://s-m-s-keyw.onrender.com/faculty/getAttendance`,
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


