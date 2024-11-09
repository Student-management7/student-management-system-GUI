import axios, { AxiosResponse } from 'axios';
import { FacultyFormData ,ApiError , ApiResponse, } from '../Type/FecultyRegistrationType';

const API_URL = 'https://s-m-s-keyw.onrender.com';


// Get Faculty Details
export const getFacultyDetails = async (): Promise<ApiResponse<FacultyFormData[]>> => {
  try {
    const response: AxiosResponse = await axios.get(`${API_URL}/faculty/findAllFaculty`);
    
    // Log the response for debugging
    console.log('Get Faculty Response:', response);

    return {
      status: response.status,
      data: response.data,
      message: 'Faculty details retrieved successfully'
    };
  } catch (error: any) {
    console.error("Error fetching faculty details:", error);
    
    // Properly format error response
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to fetch faculty details',
      status: error.response?.status || 500
    };
    
    throw apiError;
  }
};

// Save Faculty Details
export const saveFacultyDetails = async (data: FacultyFormData): Promise<ApiResponse<FacultyFormData>> => {
  try {
    // Remove any undefined or null values from the data
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
    );

    const response: AxiosResponse = await axios.post(`${API_URL}/faculty/save`, cleanData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Log the response for debugging
    console.log('Save Faculty Response:', response);

    return {
      status: response.status,
      data: response.data,
      message: 'Faculty details saved successfully'
    };
  } catch (error: any) {
    console.error("Error saving faculty details:", error);
    
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to save faculty details',
      status: error.response?.status || 500
    };
    
    throw apiError;
  }
};

// Update Faculty Details
export const updateFacultyDetails = async (data: FacultyFormData, factId: string): Promise<ApiResponse<FacultyFormData>> => {
  try {
    // Clean the data before sending
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
    );

    // Fixed the URL structure and using axios consistently
    const response: AxiosResponse = await axios.post(
      `${API_URL}/faculty/Update`, 
      cleanData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Log the response for debugging
    console.log('Update Faculty Response:', response);

    return {
      status: response.status,
      data: response.data,
      message: 'Faculty details updated successfully'
    };
  } catch (error: any) {
    console.error("Error updating faculty details:", error);
    
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Failed to update faculty details',
      status: error.response?.status || 500
    };
    
    throw apiError;
  }
};


// export const deleteFacultyDetails = async (factId: string): Promise<ApiResponse<void>> => {
//   try {
//     const response: AxiosResponse = await axios.delete(`${API_URL}/faculty/delete${factId}`);

//     return {
//       status: response.status,
//       data: response.data,
//       message: 'Faculty deleted successfully'
//     };
//   } catch (error: any) {
//     console.error("Error deleting faculty:", error);
    
//     const apiError: ApiError = {
//       message: error.response?.data?.message || 'Failed to delete faculty',
//       status: error.response?.status || 500
//     };
    
//     throw apiError;
//   }
// };



export const deleteFacultyDetails = async (facultyId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/faculty/delete/`
      , {
        params: { id: facultyId }, 
      }
    );
    return response;
  } catch (error) {
    console.error('Error deleting faculty:', error);
    throw error;
  }
};