import axiosInstance from "../../Utils/apiUtils";
import { FacultySalaryFormValues, FacultySalaryDetails , FacultySalaryResponse} from "./type";

// Base URL for the Faculty Salary APIs
const BASE_URL = "https://s-m-s-keyw.onrender.com";

// Fetch all faculty salaries
export const fetchFacultySalaries = async (): Promise<FacultySalaryDetails[]> => {
  const response = await axiosInstance.get(`${BASE_URL}/faculty/findAllFaculty`);
  return response.data;
};

// Save a new faculty salary record
export const saveFacultySalary = async (data: FacultySalaryFormValues): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/faculty/salary/save`, data);
};

// Update an existing faculty salary record
export const updateFacultySalary = async (id: string, data: FacultySalaryFormValues): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/faculty/salary/edit/${id}`, data);
};

// Delete a faculty salary record
export const deleteFacultySalary = async (id: string): Promise<void> => {
  await axiosInstance.post(`${BASE_URL}/faculty/salary/delete/${id}`);
};

export const fetchFacultySalariesById = async (id: string): Promise<FacultySalaryResponse> => {
  const response = await axiosInstance.get(`${BASE_URL}/faculty/findAllFaculty/${id}`);
  return response.data;
};