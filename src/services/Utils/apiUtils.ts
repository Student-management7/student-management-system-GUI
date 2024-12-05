import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = 'https://s-m-s-keyw.onrender.com'; // Replace with your base URL

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem('token');
      console.log('Axios Request Config:', { token, headers: config.headers });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Axios Request Error:', error);
      return Promise.reject(error);
    }
  );
  

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response; 
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Token might be invalid or expired.');

      // Handle  expiration
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
