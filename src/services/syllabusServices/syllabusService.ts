import axiosInstance from "../Utils/apiUtils";

const BASE_URL = 'https://s-m-s-keyw.onrender.com/doc';

export const getAllSyllabus = () => axiosInstance.get(`${BASE_URL}/getAll`);

export const uploadSyllabus = (params: Record<string, string>, data: FormData) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.post(`${BASE_URL}/upload?${queryString}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const updateSyllabus = (data: FormData) =>
  axiosInstance.post(`${BASE_URL}/update`, data);

export const deleteSyllabus = (id: string) =>
  axiosInstance.post(`${BASE_URL}/delete?id=${id}`);
