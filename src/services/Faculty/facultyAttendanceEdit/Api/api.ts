import axios from 'axios';
import { formatDate } from '../../../../components/Utils/dateUtils';
import { AttendanceEntry , Faculty } from '../Type/type';


export const fetchAttendance = async (selectedDate: string): Promise<AttendanceEntry[]> => {
  try {
    const formattedDate = formatDate(selectedDate);
    const url = `https://s-m-s-keyw.onrender.com/faculty/getAttendance?fromDate=${formattedDate}&toDate=${formattedDate}`;
    const response = await axios.get<AttendanceEntry[]>(url);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};



// facultyAttendanceEditSave Api 
interface EditAttendancePayload {
  id: string;
  date: string;
  factList: Faculty[];
}

export const saveAttendanceEdit = async (payload: EditAttendancePayload): Promise<void> => {
  try {
    await axios.post('https://s-m-s-keyw.onrender.com/faculty/attendanceEdit', payload);
  } catch (err) {
    console.error('Error saving attendance:', err);
    throw err;
  }
};
