import { toast } from "react-toastify";
import axiosInstance from "../../services/Utils/apiUtils";

export const fetchSchools = async () => {
    const response = await axiosInstance.get("/school/get");
    return response.data;
};

export const saveSchool = async (payload: any) => {
    try {
        const response = await axiosInstance.post("/school/save", payload);
        toast.success('School saved successfully!');
        return response.data;
    } catch (error: any) {
        if (error.response || error.response.data) {
            const { data } = error.response;
             setTimeout(() => {
                toast.error(data.detail)
             }, 1000);
        } else {
            setTimeout(()=> toast.error('An error occurred while saving school data.'),1000)
        }
        throw error;
    }
};

export const updateSchool = async (payload: any) => {
    const response = await axiosInstance.post("/school/update", payload);
    return response.data;
};

export const deleteSchool = async (id: string) => {
    const response = await axiosInstance.post(`/school/delete?id=${id}`);
    return response.data;
};