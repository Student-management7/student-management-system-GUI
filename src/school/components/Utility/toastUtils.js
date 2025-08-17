// toastUtils.js
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleApiError = (error) => {
  if (error.response && error.response.status && error.response.data?.detail) {
    toast.error(`Error ${error.response.status}: ${error.response.data.detail}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  } else if (error.message) {
    toast.error(`Error: ${error.message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  } else {
    toast.error("An unknown error occurred.", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  }
};
