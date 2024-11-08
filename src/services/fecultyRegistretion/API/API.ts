import axios from 'axios';
import { FacultyFormData } from '../../fecultyRegistretion/Type/FecultyRegistrationType';

const API_URL = 'https://s-m-s-keyw.onrender.com';

// Get Faculty Details
export const getFacultyDetails = async (): Promise<FacultyFormData[]> => {
  try {
    const response = await axios.get(`${API_URL}/faculty/findAllFaculty`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      throw new Error(`Failed to fetch faculty details: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching faculty details:", error);
    throw error;  // This allows error handling in the calling function
  }
};

// Save Faculty Details
export const saveFacultyDetails = async (data: FacultyFormData): Promise<{ status: number; data: FacultyFormData }> => {
  try {
    const response = await axios.post(`${API_URL}/faculty/save`, data);
    
    // Log and check the response object structure
    console.log("API response:", response);
    if (response.status === 200) {
      return response;  // Full response object including status and data
    } else {
      console.error(`Unexpected response status: ${response.status}`);
      throw new Error(`Failed to save faculty details: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error saving faculty details:");
    throw error;  // Ensures that error handling is consistent in calling function
  }
};
