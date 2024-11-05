import React from "react";
import { motion } from "framer-motion";

const HeaderController = () => {
    return (
        <div className="headerBox bg-white shadow-md py-4 px-6 md:px-10 flex items-center justify-between">
            {/* Logo */}
            <motion.div
                className="text-blue-600 font-extrabold text-lg md:text-2xl cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                EasyWaySolution
            </motion.div>

            {/* Navigation Links */}
            <motion.nav 
                className="nav"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <ul className="nav-bar flex space-x-6 text-sm md:text-base text-gray-700 font-semibold">
                    <motion.li
                        className="nav-item"
                        whileHover={{ scale: 1.1, color: "#2563EB" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <a href="/Home" className="hover:text-blue-600 transition-colors">Home</a>
                    </motion.li>
                    <motion.li
                        className="nav-item"
                        whileHover={{ scale: 1.1, color: "#2563EB" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <a href="/StudentRegistrationController" className="hover:text-blue-600 transition-colors">Registration</a>
                    </motion.li>
                    <motion.li
                        className="nav-item"
                        whileHover={{ scale: 1.1, color: "#2563EB" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <a href="/StudentAttendenceManagementSystem" className="hover:text-blue-600 transition-colors">Attendance</a>
                    </motion.li>
                    <motion.li
                        className="nav-item"
                        whileHover={{ scale: 1.1, color: "#2563EB" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <a href="/SaveSubjectsToClasses" className="hover:text-blue-600 transition-colors">SaveSubjects</a>
                    </motion.li>
                </ul>
            </motion.nav>
        </div>
    );
};

export default HeaderController;
