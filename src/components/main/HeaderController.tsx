import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface UserDetails {
  email: string;
  facultyInfo?: {
    fact_Name: string;
  };
}

const HeaderController: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user details from localStorage
  useEffect(() => {
    const storedDetails = localStorage.getItem("userDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <header className="headerBox bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between">
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 focus:outline-none"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`nav md:flex ${isMenuOpen ? "block" : "hidden"} w-full md:w-auto`}
      >
        {/* Left Side Navigation */}
        <ul className="nav-bar flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-sm md:text-base text-gray-700 font-semibold">
          <li className="nav-item">
            <Link to="/Home" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </li>
        </ul>
      </nav>

      {/* Right Side Icon and Dropdown */}
      <div className="relative flex items-center" ref={dropdownRef}>
        <i
          className="bi bi-person-circle text-2xl cursor-pointer"
          onClick={toggleDropdown}
        ></i>
        {isDropdownOpen && userDetails && (
          <div
            className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10"
            style={{ top: "100%", left: "50%", transform: "translateX(-90%)" }}
          >
            <p className="px-4 py-2 text-gray-700">
              <strong>Name:</strong> {userDetails.facultyInfo?.fact_Name || "N/A"}
            </p>
            <p className="px-4 py-2 text-gray-700">
              <strong>Email:</strong> {userDetails.email || "N/A"}
            </p>
            <p className="px-4 py-2 text-gray-700">
              <strong>Profile</strong>
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderController;
