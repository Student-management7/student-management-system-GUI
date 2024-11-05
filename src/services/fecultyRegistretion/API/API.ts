// services/facultyRegistration/facultyRegistrationApi.ts
import axios from "axios";
import { FormData } from "../../fecultyRegistretion/Type/FecultyRegistrationType"; // adjust the path if needed

const API_URL = "https://s-m-s-keyw.onrender.com/faculty/save"; 

export const saveFacultyData = async (data: FormData) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error saving faculty data:", error);
    throw error;
  }
};
