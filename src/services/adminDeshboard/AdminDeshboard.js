import axiosInstance from '../Utils/apiUtils';


export const fetchSchoolData = async () => {
  try {
    const response = await axiosInstance.get('/school/get');
    return response.data;
  } catch (error) {
    console.error('Error fetching school data:', error);
    throw error;
  }
};