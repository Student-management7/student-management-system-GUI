import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationArrows: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        display: "flex",
        gap: "10px",
      }}
    >
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Go to previous page"
      >
        <span
          style={{
            fontSize: "24px",
            color: "#007bff",
          }}
        >
          ←
        </span>
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => navigate(1)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Go to next page"
      >
        <span
          style={{
            fontSize: "24px",
            color: "#007bff",
          }}
        >
          →
        </span>
      </button>
    </div>
  );
};

export default NavigationArrows;
