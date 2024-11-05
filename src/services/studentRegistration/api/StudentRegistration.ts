import axios from "axios";


const API_URL = 'https://s-m-s-keyw.onrender.com'


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

export const getStdDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/student/findAllStudent`); // Adjust the endpoint as needed
        return response.data;
    } catch (error) {
        console.log('Error fetching details:', error);
        throw error; // Re-throw the error if you want to handle it later
    }
};


export const fetchClasses = async () => {
    try {
        const response = await axios.get(`${API_URL}/class/data`); // Adjust the endpoint as needed
        return response.data;
    } catch (error) {
        console.log('Error fetching details:', error);
        throw error; // Re-throw the error if you want to handle it later
    }
};




    // // Fetch classes and subjects from the API

    // const fetchClasses = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch('localhost:8080/class/data'); // Correct API endpoint
    //         const data = await response.json();
    //         setClasses(data.classData); // Set class data
    //         setLoading(false);
    //     } catch (error) {
    //         setError("Failed to fetch classes data");
    //         setLoading(false);
    //     }
    // };
