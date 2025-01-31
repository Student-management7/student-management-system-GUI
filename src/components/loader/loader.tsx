import React from "react";
import loading from "./loading.gif"; // Correct relative path

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src={loading} alt="loading..." className="w-50 h-65" />
    </div>
  );
}

export default Loader;
