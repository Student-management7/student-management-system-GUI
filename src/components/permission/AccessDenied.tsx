import React from "react";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
  
  

  
  const navigate = useNavigate();
  const handleback = () =>{
    navigate('/main');
  }
  return (
    <div className="flex flex-col items-center justify-center m-5 p-5 bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-3">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-5">
        You do not have permission to access this page.
      </p>
      <button
        className="px-5 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
        onClick={() => handleback()}
      >
        Go Back
      </button>
    </div>
  );
}

export default AccessDenied;
