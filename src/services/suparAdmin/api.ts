import axiosInstance from "../../services/Utils/apiUtils";

export const fetchSchools = async () => {
    const response = await axiosInstance.get("/school/get");
    return response.data;
};

export const saveSchool = async (payload: any) => {
    const response = await axiosInstance.post("/school/save", payload);
    return response.data;
};

export const updateSchool = async (payload: any) => {
    const response = await axiosInstance.post("/school/update", payload);
    return response.data;
};

export const deleteSchool = async (id: string) => {
    const response = await axiosInstance.post(`/school/delete?id=${id}`);
    return response.data;
};