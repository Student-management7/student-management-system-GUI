import axiosInstance from "../Utils/apiUtils";
export const getClassData = async () => {
  try {
    const response = await axiosInstance.get(`/class/data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class data:", error);
    throw error;
  }
};
