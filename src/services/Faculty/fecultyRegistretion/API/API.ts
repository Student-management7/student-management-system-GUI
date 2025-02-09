



import { AxiosResponse } from 'axios';
import axiosInstance from '../../../Utils/apiUtils';
import { FacultyFormData } from '../Type/FecultyRegistrationType';
import {  ApiError , ApiResponse, } from '../Type/FecultyRegistrationType';
const API_URL = 'https://s-m-s-keyw.onrender.com';
export const saveFacultyDetails = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/faculty/save`, data);
    return response;
  } catch (error) {
    console.error('Error saving faculty details:', error);
    throw error;
  }
};

export const getFacultyDetails = async () => {
  try {
    const response = await axiosInstance.get(`/faculty/findAllFaculty`);
    return response;
  } catch (error) {
    console.error('Error fetching faculty details:', error);
    throw error;
  }
};

export const updateFacultyDetails = async (data: FacultyFormData, ): Promise<ApiResponse<FacultyFormData>> => {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined)
    );

    const response: AxiosResponse = await axiosInstance.post(
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


export const deleteFacultyDetails = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/faculty/delete?id=${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting faculty details:', error);
    throw error;
  }
};
