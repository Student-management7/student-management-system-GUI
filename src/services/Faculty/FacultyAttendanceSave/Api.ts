
import { Faculty } from './Type';
import axiosInstance from '../../Utils/apiUtils';

const API_URL = 'https://s-m-s-keyw.onrender.com';

export const fetchFacultyData = async (): Promise<Faculty[]> => {
    const response = await axiosInstance.get(`${API_URL}/faculty/findAllFaculty`);
    return response.data.map((faculty: Faculty) => ({
        ...faculty,
        attendance: '',
    }));
};

export const submitAttendance = async (facultyList: Faculty[]) => {
    const factsWithAttendance = facultyList.filter(faculty => faculty.attendance);
    const payload = {
        factList: factsWithAttendance.map(faculty => ({
            factId: faculty.fact_id,
            name: faculty.fact_Name,
            attendance: faculty.attendance,
        })),
    };
    const response = await axiosInstance.post(`${API_URL}/faculty/attendanceSave`, payload);
    return response;
};
