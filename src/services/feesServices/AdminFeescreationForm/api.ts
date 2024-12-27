import axios from "axios";
import { FeeDetails, FeeFormValues } from "./type";
import axiosInstance from "../../Utils/apiUtils"

const BASE_URL = "https://s-m-s-keyw.onrender.com";


// fetchFees

export const fetchFees = async (): Promise<FeeDetails[]> => {
  const response = await axiosInstance.get(`/admin/getAll`,{
    
    
  });
  return response.data;
};



// saveFees
export const saveFees = async (values: FeeFormValues) => {
  try {
    const response = await axiosInstance.post(
      `/admin/save`,
      values
    );
    return response.data;
  } catch (error) {
    throw new Error("Error saving data: " + error);
  }
};

// Function to update a fee record
export const updateFee = async (id: string, data: FeeFormValues): Promise<void> => {
  try {
    await axiosInstance.post(`${BASE_URL}/admin/edit`, data, {
      params: { id },
    });
  } catch (error) {
    console.error(`Failed to update fee record with ID ${id}:`, error);
    throw new Error('Failed to update fee record');
  }
};





// Delete a specific fee by ID
export const deleteFeeRecord = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post(`/admin/delete` ,null, {
      params: { id: id },
    });
    return { success: true, message: "Fee deleted successfully." };
  } catch (error: any) {
    console.error(`Error deleting fee with ID ${id}:`, error);
    return { success: false, message: error.response?.data?.message || "Failed to delete fee." };
  }
};



