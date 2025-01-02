import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderController = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="headerBox bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between">

            <div className="md:hidden">
                <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Navigation Links */}
            <nav
                className={`nav md:flex ${isMenuOpen ? "block" : "hidden"} w-full md:w-auto`}
            >
                <ul className="nav-bar flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-sm md:text-base text-gray-700 font-semibold">
                    <li className="nav-item">
                        <Link to="/Home" className="hover:text-blue-600 transition-colors">Home</Link>
                    </li>


                </ul>
            </nav>
            <div className="absolute right-6 md:right-10 flex items-center">
                <Link
                    to="/Notification"
                    className="bi bi-bell-fill text-gray-700 text-xl relative cursor-pointer hover:text-blue-600 animate-shake"
                ></Link>
            </div>
        </header>
    );
};

export default HeaderController;
