import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderController = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="headerBox bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between">
            {/* Logo */}
            {/* <div className="text-blue-600 font-extrabold text-lg md:text-2xl">
                EasyWaySolution
            </div> */}

            {/* Hamburger Icon for Mobile */}
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
                    {/* <li className="nav-item">
                        <Link to="/StudentRegistrationController" className="hover:text-blue-600 transition-colors">Student Registration</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/FacultyRegistration" className="hover:text-blue-600 transition-colors">Faculty Registration</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/StudentAttendanceShow" className="hover:text-blue-600 transition-colors">View Student Attendance</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/FacultyAttendanceShow" className="hover:text-blue-600 transition-colors">View Faculty Attendance</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/SaveSubjectsToClasses" className="hover:text-blue-600 transition-colors">Save Subjects</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/StudentAttendenceManagement" className="hover:text-blue-600 transition-colors">Studence Attendance</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/facultyAttendanceSave" className="hover:text-blue-600 transition-colors">Faculty Attendance</Link>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/holiday" className="hover:text-blue-600 transition-colors">holiday</Link>
<<<<<<< HEAD
                    </li>
                    <li className="nav-item">
                        <Link to="/fees" className="hover:text-blue-600 transition-colors">Admin fees</Link>
                    </li>
=======
                    </li> */}
 {/* e15c575e20d0d57dd72800820a076737390eb183 */}
                    
                </ul>
            </nav>
        </header>
    );
};

export default HeaderController;