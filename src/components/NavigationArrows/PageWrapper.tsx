import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageWrapper.css";

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Navigation Handlers
  const goBack = () => navigate(-1); // Go to the previous page
  const goForward = () => navigate(1); // Go to the next page

  return (
    <div className="relative min-h-screen">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
        <button onClick={goBack} className="p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300">
          ← {/* Left Arrow */}
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <button onClick={goForward} className="p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300">
          → {/* Right Arrow */}
        </button>
      </div>

      {/* Page Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default PageWrapper;
