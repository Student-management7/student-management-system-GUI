import { Faculty } from './Type';
import axiosInstance from '../../Utils/apiUtils';

const API_URL = 'https://s-m-s-keyw.onrender.com';

export const fetchFacultyData = async (): Promise<Faculty[]> => {
    const response = await axiosInstance.get(`${API_URL}/faculty/findAllFaculty`);
    return response.data.map((faculty: Faculty) => ({
        ...faculty,
        attendance: faculty.attendance || 'Select',
    }));
};

export const submitAttendance = async (payload: any) => {
    return await axiosInstance.post(`${API_URL}/faculty/attendanceSave`, payload);
};