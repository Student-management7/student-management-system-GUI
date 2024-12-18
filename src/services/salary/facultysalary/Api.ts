import axiosInstance from "../../Utils/apiUtils";

// Base URL for the Faculty Salary APIs
const BASE_URL = "https://s-m-s-keyw.onrender.com";

export interface DeductionItem {
  name: string;
  amount: number;
}

export interface FacultySalaryFormValues {
  facultyID: string;
  // fact_Name: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: DeductionItem[];
  // total?: number;
}

export interface FacultySalaryDetails {
  fact_id: string;
  facultyID: string;
  fact_Name: string; // Assuming this is required
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: DeductionItem[];
  total?: number;
}




// Fetch all faculty salaries
export const fetchFacultySalaries = async (): Promise<FacultySalaryDetails[]> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/faculty/findAllFaculty`);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty salaries:", error);
    throw new Error("Failed to fetch faculty salaries.");
  }
};

// Save a new faculty salary record
export const saveFacultySalary = async (data: FacultySalaryFormValues): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/faculty/salary/save`, data);
    return response.data;
  } catch (error) {
    console.error("Error saving faculty salary:", error);
    throw new Error("Failed to save faculty salary.");
  }
};

// Update an existing faculty salary record with id as a query parameter
export const updateFacultySalary = async (id: string, data: FacultySalaryFormValues): Promise<any> => {
  try {
    // Create a shallow copy of the data object to avoid mutating the original
    const {  ...payload } = data;

    const response = await axiosInstance.post(
      `${BASE_URL}/faculty/salary/edit`, // Base URL
      payload, // Data for update (without `total`)
      {
        params: { id }, // Sending id as a query parameter
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating salary for faculty ID ${id}:`, error);
    throw new Error("Failed to update faculty salary.");
  }
};

// Fetch faculty salary details by faculty ID

export const fetchFacultySalariesById = async (id: string): Promise<FacultySalaryDetails> => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/faculty/findAllFaculty`, {
      params: { id }, // Send `id` as a query parameter
    });

    // Check if the response has the expected structure and data
    if (!response.data || !response.data.fact_Name || !response.data.fact_id) {
      throw new Error("Invalid data structure received.");
    }

    return response.data;
  } catch (error: any) {
    // Improved error handling with specific error types
    if (error.response) {
      // HTTP error response from the server
      console.error(`HTTP error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // Network error or no response received
      console.error(`Network error: ${error.message}`);
    } else {
      // Any other error (e.g., unexpected logic error)
      console.error("Error:", error.message);
    }

    // Throw a more informative error
    throw new Error("Failed to fetch faculty salary details. Please try again later.");
  }
};

