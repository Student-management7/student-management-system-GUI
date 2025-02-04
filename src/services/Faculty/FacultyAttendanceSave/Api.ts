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

export const submitAttendance = async (facultyList: Faculty[]) => {
    // ✅ 2️⃣ Ensure Faculty Data is Sent in Payload
    const factsWithAttendance = facultyList.filter(faculty => faculty.attendance && faculty.attendance !== 'Select');

    if (factsWithAttendance.length === 0) {
        throw new Error('No attendance data provided');
    }

    const payload = {
        factList: factsWithAttendance.map(faculty => ({
            factId: faculty.fact_id,
            name: faculty.fact_Name,
            attendance: faculty.attendance,
        })),
    };

    return await axiosInstance.post(`${API_URL}/faculty/attendanceSave`, payload);
};
