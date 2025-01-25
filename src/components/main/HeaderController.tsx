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

// Fetch user details from localStorag
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
        className={`nav md:flex ${
          isMenuOpen ? "block" : "hidden"
        } w-full md:w-auto`}
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
            style={{
              top: "100%",
              left: "50%",
              transform: "translateX(-90%)",
            }}
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






// import React, { useEffect, useState } from 'react';
// import { Menu, Transition } from '@headlessui/react';
// import { UserCircleIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
// import { IconType } from 'react-icons';
// import { FaCaretDown, FaCaretLeft, FaCaretRight } from 'react-icons/fa';

// // Types
// interface UserDetails {
//   email: string;
//   facultyInfo?: {
//     fact_Name: string;
//   };
// }

// interface SideBarItem {
//   title: string;
//   path?: string;
//   icon: IconType;
//   subNav?: SideBarItem[];
// }

// // Header Component
// const HeaderController: React.FC = () => {
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const storedDetails = localStorage.getItem('userDetails');
//     if (storedDetails) {
//       setUserDetails(JSON.parse(storedDetails));
//     }

//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const userName = userDetails?.facultyInfo?.fact_Name || 'Guest User';

//   return (
//     <header className={ `sideNav sticky top-0 bg-white   z-50 transition-all duration-300 
//       ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center space-x-4">
//             <img
//               src="/images/logo.png"
//               alt="Logo"
//               className="h-8 w-auto"
//             />
//             <span className="text-xl font-semibold text-gray-900 hidden sm:inline">
//               {userName}
//             </span>
//           </div>

//           <Menu as="div" className="relative">
//             {({ open }) => (
//               <>
//                 <Menu.Button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
//                   <UserCircleIcon className="h-8 w-8 text-gray-600" />
//                   <span className="hidden sm:inline text-sm font-medium text-gray-700">
//                     {userName}
//                   </span>
//                   <FaCaretDown className="h-4 w-4 text-gray-500" />
//                 </Menu.Button>

//                 <Transition
//                   show={open}
//                   enter="transition ease-out duration-200"
//                   enterFrom="transform opacity-0 scale-95"
//                   enterTo="transform opacity-100 scale-100"
//                   leave="transition ease-in duration-150"
//                   leaveFrom="transform opacity-100 scale-100"
//                   leaveTo="transform opacity-0 scale-95"
//                 >
//                   <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="#profile"
//                           className={`${active ? 'bg-gray-100' : ''
//                             } flex items-center px-4 py-2 text-sm text-gray-700`}
//                         >
//                           <UserIcon className="mr-3 h-4 w-4" />
//                           Profile
//                         </a>
//                       )}
//                     </Menu.Item>
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="#settings"
//                           className={`${active ? 'bg-gray-100' : ''
//                             } flex items-center px-4 py-2 text-sm text-gray-700`}
//                         >
//                           <SettingsIcon className="mr-3 h-4 w-4" />
//                           Settings
//                         </a>
//                       )}
//                     </Menu.Item>
//                     <Menu.Item>
//                       {({ active }) => (
//                         <a
//                           href="#logout"
//                           className={`${active ? 'bg-gray-100' : ''
//                             } flex items-center px-4 py-2 text-sm text-gray-700`}
//                         >
//                           <LogOutIcon className="mr-3 h-4 w-4" />
//                           Logout
//                         </a>
//                       )}
//                     </Menu.Item>
//                   </Menu.Items>
//                 </Transition>
//               </>
//             )}
//           </Menu>
//         </div>
//       </div>
//     </header>
//   );
// };
// export  default HeaderController;
