import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img src="loading.gif" alt="loading..." className="w-50 h-65" />
    </div>
  );
}

export default Loader;
