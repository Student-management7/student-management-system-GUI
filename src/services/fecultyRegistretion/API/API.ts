// src/api/facultyApi.ts

import axios from "axios";
import { FacultyFormData } from "../Type/FecultyRegistrationType";

export const saveFacultyData = async (data: FacultyFormData) => {
    try {
        const response = await axios.post("https://s-m-s-keyw.onrender.com/faculty/save", data);
        return response.data;
    } catch (error) {
        console.error("Error saving faculty data:", error);
        throw new Error("Failed to save faculty data");
    }
};
