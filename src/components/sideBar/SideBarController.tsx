import React, { useState } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaBars, FaRightToBracket } from "react-icons/fa6"; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/authContext';

const SideBarController = () => {
    const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate(); // Navigation hook for redirect

    const menuOpen = (index: number) => {
        setSubmenu((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const { logout } = useAuth();
     

    const handleLogout = async () => {
        await logout(); // Call the logout function
        navigate('/login'); // Redirect to login page
    };
    return (
        <>
            <div className='sideNav'>
                <div className="logo flex">
                    <p className='md:text-2xl'>EasyWaySolution</p>
                    <FaBars />
                </div>

                {SideBarData.map((item: any, index: number) => {
                    const Icon: any = item.icon;
                    const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

                    return (
                        <div key={index}>
                            <p
                                onClick={() => menuOpen(index)}
                                className='menu'
                                key={item.title}>
                                <Icon />
                                <span> <p>{item.title}</p> </span>
                                {OpenIcon && <OpenIcon className="menuOpen" />}
                            </p>
                            {submenu[index] && (
                                <div>
                                    {item.subNav && <SubManu data={item.subNav} />}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Logout Button */}
                <div className='menu' onClick={handleLogout}>
                    <FaRightToBracket />
                    <span>Logout</span>
                </div>
            </div>
        </>
    );
};

export default SideBarController;







// import React, { useState } from 'react';
// import {
//   GraduationCapIcon,
//   ArrowLeftRightIcon,
//   BarChartIcon,
//   BellIcon,
//   UserIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   MenuIcon
// } from 'lucide-react';

// // Types
// interface MenuItem {
//   name: string;
//   icon: React.ElementType;
//   subItems?: string[];
// }

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
//   activePage: string;
//   setActivePage: (page: string) => void;
// }

// // Menu Items Configuration
// const menuItems: MenuItem[] = [
//   { 
//     name: 'School Management', 
//     icon: GraduationCapIcon,
//     subItems: ['Students', 'Teachers', 'Classes', 'Subjects']
//   },
//   { 
//     name: 'Inquiry Management', 
//     icon: ArrowLeftRightIcon,
//     subItems: ['New Inquiries', 'Follow-ups', 'Resolved']
//   },
//   { 
//     name: 'Reports and Analytics', 
//     icon: BarChartIcon,
//     subItems: ['Performance', 'Attendance', 'Financial']
//   },
//   { 
//     name: 'Alerts and Notifications', 
//     icon: BellIcon,
//     subItems: ['System Alerts', 'Messages', 'Updates']
//   },
//   { 
//     name: 'System Users', 
//     icon: UserIcon,
//     subItems: ['Administrators', 'Staff', 'Permissions']
//   },
// ];

// const SideBarController: React.FC<SidebarProps> = ({
//   isOpen,
//   toggleSidebar,
//   activePage,
//   setActivePage
// }) => {
//   const [expandedItems, setExpandedItems] = useState<string[]>([]);

//   const toggleExpand = (item: string) => {
//     setExpandedItems(prev =>
//       prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
//     );
//   };

//   return (
//     <>
//       {/* Main SideBarController */}
//       <div
//         className={`
//           bg-gray-800 text-white h-full fixed left-0 top-0 z-30 
//           transition-all duration-300 ease-in-out 
//           ${isOpen ? 'w-64' : 'w-0 md:w-16'} 
//           overflow-hidden
//         `}
//       >
//         <nav className="h-full flex flex-col pt-16 md:pt-0">
//           {/* Toggle Button - Desktop */}
//           <div className="p-4 flex justify-end">
//             <button
//               onClick={toggleSidebar}
//               className="text-white p-2 rounded-full hover:bg-gray-700 
//                 focus:outline-none focus:ring-2 focus:ring-offset-2 
//                 focus:ring-offset-gray-800 focus:ring-white hidden md:block transition-colors duration-200 "
//             >
//               {isOpen ? (
//                 <ChevronLeftIcon className="h-6 w-6" />
//               ) : (
//                 <ChevronRightIcon className="h-6 w-6" />
//               )}
//             </button>
//           </div>

//           {/* Navigation Menu */}
//           <ul className="flex-1 overflow-y-auto">
//             {menuItems.map((item) => (
//               <li key={item.name} className="mb-2">
//                 {/* Menu Item Button */}
//                 <button
//                   onClick={() => {
//                     setActivePage(item.name);
//                     toggleExpand(item.name);
//                     if (window.innerWidth < 768) {
//                       toggleSidebar();
//                     }
//                   }}
//                   className={`
//                     flex items-center w-full px-4 py-2 text-sm font-medium rounded-md
//                     transition-colors duration-200
//                     ${
//                       activePage === item.name
//                         ? 'bg-gray-900 text-white'
//                         : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                     }
//                   `}
//                 >
//                   <item.icon 
//                     className="mr-3 h-6 w-6" 
//                     aria-hidden="true" 
//                   />
//                   {isOpen && (
//                     <>
//                       <span className="flex-1">{item.name}</span>
//                       {item.subItems && (
//                         <ChevronRightIcon
//                           className={`
//                             ml-2 h-5 w-5 transform transition-transform duration-200
//                             ${expandedItems.includes(item.name) ? 'rotate-90' : ''}
//                           `}
//                         />
//                       )}
//                     </>
//                   )}
//                 </button>

//                 {/* Sub Items */}
//                 {isOpen && item.subItems && expandedItems.includes(item.name) && (
//                   <ul className="mt-1 space-y-1">
//                     {item.subItems.map((subItem) => (
//                       <li key={subItem}>
//                         <a
//                           href="#"
//                           className="
//                             block py-2 pl-11 pr-4 text-sm text-gray-300 
//                             hover:bg-gray-700 hover:text-white rounded-md
//                             transition-colors duration-200
//                           "
//                         >
//                           {subItem}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Mobile Menu Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="
//           fixed top-4 left-4 z-40 md:hidden
//           text-gray-500 hover:text-gray-600
//           bg-white rounded-md p-2 shadow-md
//           transition-colors duration-200
//         "
//       >
//         <MenuIcon className="h-6 w-6" />
//       </button>
//     </>
//   );
// };

// export default SideBarController;











// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/authContext';
// import { FaBars, FaRightToBracket } from "react-icons/fa6";
// import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
// import { SideBarData } from './SideBarData';

// interface SubMenuState {
//   [key: number]: boolean;
// }

// const SideBarController: React.FC = () => {
//   const [submenu, setSubmenu] = useState<SubMenuState>({});
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setIsSidebarOpen(!mobile);
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const menuOpen = (index: number) => {
//     setSubmenu(prevState => ({
//       ...prevState,
//       [index]: !prevState[index],
//     }));
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isMobile && isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed left-0 top-0 h-full bg-gray-800 text-white z-30
//           transition-all duration-300 ease-in-out
//           ${isSidebarOpen ? 'w-64' : 'w-0 md:w-16'}
//           overflow-hidden
//         `}
//       >
//         {/* Logo Section */}
//         <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
//           <div className={`flex items-center space-x-2 ${!isSidebarOpen && 'md:opacity-0'}`}>
//             <p className="text-xl font-semibold truncate">EasyWaySolution</p>
//           </div>
//           <button
//             onClick={toggleSidebar}
//             className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 hidden md:block"
//           >
//             {isSidebarOpen ? (
//               <ChevronLeftIcon className="h-5 w-5" />
//             ) : (
//               <ChevronRightIcon className="h-5 w-5" />
//             )}
//           </button>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="mt-4">
//           {SideBarData.map((item: any, index: number) => {
//             const Icon = item.icon;
//             const OpenIcon = submenu[index] ? item?.iconClosed : item?.iconeOpened;

//             return (
//               <div key={index}>
//                 <button
//                   onClick={() => menuOpen(index)}
//                   className={`
//                     w-full flex items-center px-4 py-2 text-sm
//                     hover:bg-gray-700 transition-colors duration-200
//                     ${submenu[index] ? 'bg-gray-700' : ''}
//                   `}
//                 >
//                   <Icon className="h-5 w-5" />
//                   {isSidebarOpen && (
//                     <>
//                       <span className="ml-3 flex-1">{item.title}</span>
//                       {OpenIcon && (
//                         <OpenIcon 
//                           className={`
//                             h-4 w-4 transform transition-transform duration-200
//                             ${submenu[index] ? 'rotate-180' : ''}
//                           `}
//                         />
//                       )}
//                     </>
//                   )}
//                 </button>

//                 {/* Submenu */}
//                 {isSidebarOpen && submenu[index] && (
//                   <div className="bg-gray-900 py-1">
//                     {item.subNav && (
//                       <div className="pl-4">
//                         {item.subNav.map((subItem: any, subIndex: number) => (
//                           <button
//                             key={subIndex}
//                             onClick={() => navigate(subItem.path)}
//                             className="
//                               w-full flex items-center px-4 py-2 text-sm text-gray-300
//                               hover:bg-gray-700 hover:text-white transition-colors duration-200
//                             "
//                           >
//                             {subItem.icon && <subItem.icon className="h-4 w-4 mr-3" />}
//                             <span>{subItem.title}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className="
//               w-full flex items-center px-4 py-2 text-sm text-red-400
//               hover:bg-gray-700 transition-colors duration-200 mt-4
//             "
//           >
//             <FaRightToBracket className="h-5 w-5" />
//             {isSidebarOpen && <span className="ml-3">Logout</span>}
//           </button>
//         </nav>
//       </div>

//       {/* Mobile Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="
//           fixed top-4 left-4 z-40 md:hidden
//           p-2 rounded-md bg-gray-800 text-white
//           hover:bg-gray-700 transition-colors duration-200
//         "
//       >
//         <FaBars className="h-5 w-5" />
//       </button>
//     </>
//   );
// };

// export default SideBarController;