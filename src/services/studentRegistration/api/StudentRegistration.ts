import axiosInstance from "../../Utils/apiUtils";


const API_URL = 'https://s-m-s-keyw.onrender.com'


// Function for making a POST request
export const saveStdDetails = async (data: any) =>{

    try{
        const response = await axiosInstance.post(`${API_URL}/student/save`, data);
        return response.data;
    }catch (error){
        console.log('Error saving details:', error);
        throw error;
    }
};

export const updateStudentDeteails = async (data: any) =>{

    try{
        const response = await axiosInstance.post(`${API_URL}/student/update`, data);
        return response.data;
    }catch (error){
        console.log('Error saving details:', error);
        throw error;
    }
};

export const getStdDetails = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/student/findAllStudent`); // Adjust the endpoint as needed
        return response.data;
    } catch (error) {
        console.log('Error fetching details:', error);
        throw error; // Re-throw the error if you want to handle it later
    }
};


export const fetchClasses = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/class/data`); // Adjust the endpoint as needed
        return response.data;
    } catch (error) {
        console.log('Error fetching details:', error);
        throw error; // Re-throw the error if you want to handle it later
    }
};

export const deleteStudentRecord = async (id: string) =>{

    try{
        const response = await axiosInstance.post(`${API_URL}/student/delete?id=${id}`);
        return response.data;
    }catch (error){
        console.log('Error saving details:', error);
        throw error;
    }
};




