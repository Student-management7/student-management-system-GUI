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

export const updateSyllabus = (params: Record<string, string>, data: FormData) => {
  const queryString = new URLSearchParams(params).toString();
  return axiosInstance.post(`${BASE_URL}/update?${queryString}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const deleteSyllabus = (id: string) =>
  axiosInstance.post(`${BASE_URL}/delete?id=${id}`);


export const downloadSyllabus = (id: string) => {
  return axiosInstance.get(`${BASE_URL}/download/${id}`, {
    responseType: 'blob'
  });
};

// SyllabusService.ts
export const updatePublishStatus = (payload: Array<{ id: string; publish: string }>) => {
  return axiosInstance.post(`${BASE_URL}/syllabus/update`, payload);
};