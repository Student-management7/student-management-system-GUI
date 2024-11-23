import axios from "axios";
import { AttendanceResponse ,ClassData } from "../type/attendanceTypes";
import { formatDate } from "../dateFormates/dateUtils";

export const fetchAttendanceData = async (
  fromDate: string,
  toDate: string,
  classSelected: string,
  subjectSelected: string
) => {
  try {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const apiUrl = `https://s-m-s-keyw.onrender.com/attendance/getAttendance?cls=${classSelected}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&subject=${subjectSelected}`;
    const response = await axios.post<AttendanceResponse[]>(apiUrl);

    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};

export const fetchClassData = async (): Promise<ClassData[]> => {
  const response = await axios.get("https://s-m-s-keyw.onrender.com/class/data");
  return response.data.classData;
};