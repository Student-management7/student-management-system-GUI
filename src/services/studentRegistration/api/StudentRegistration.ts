import axios from "axios";


const API_URL = 'http://localhost:8080'


// Function for making a POST request
export const saveStdDetails = async (data: any) =>{

    try{
        const response = await axios.post(`${API_URL}/student/save`, data);
        return response.data;
    }catch (error){
        console.log('Error saving details:', error);
        throw error;
    }
};