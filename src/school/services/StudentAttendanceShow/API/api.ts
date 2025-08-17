
import axiosInstance from "../../Utils/apiUtils";
import { AttendanceResponse, ClassData } from "../type/attendanceTypes";
import { formatDate } from "../dateFormates/dateUtils";

// Fetch attendance data
export const fetchAttendanceData = async (
  fromDate: string,
  toDate: string,
  classSelected: string,
  subjectSelected: string,
  masterAttendance: boolean // Added parameter for master attendance mode
): Promise<AttendanceResponse[]> => {
  try {
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    // Construct API URL with the new masterAttendance parameter
    const apiUrl = `/attendance/getAttendance?cls=${classSelected}&fromDate=${formattedFromDate}&toDate=${formattedToDate}&subject=${subjectSelected}&masterAttendance=${masterAttendance}`;
    
    const response = await axiosInstance.post<AttendanceResponse[]>(apiUrl);

    return response.data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error;
  }
};


// Fetch class data
export const fetchClassData = async (): Promise<ClassData[]> => {
  try {
    const response = await axiosInstance.get(`/class/data`);
    return response.data.classData;
  } catch (error) {
    console.error("Error fetching class data:", error);
    throw error;
  }
};


export const updateAttendance = async (payload: {
  date: string,
  className: string,
  subject?: string,
  studentList: Array<{
    stdId: string,
    name?: string,
    attendance: string,
    remark?: string
  }>,
  
}) => {
  try {
    const response = await axiosInstance.post(`/attendance/update?&masterAttendance=true`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};



