// import React, { useState, useEffect } from 'react';
// import { SideBarData } from './SideBarData';
// import SubManu from './SubManu';
// import './SideMenu.scss';
// import { FaRightToBracket, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import '../../global.scss';
// import axiosInstance from '../../services/Utils/apiUtils'; 
// import logo from "../../assets/ews-full-white.png"
// const SideBarController = () => {
//     const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
//     const [role, setRole] = useState<string>("");

//     // Fetch role from the API
//     useEffect(() => {
//         const fetchRole = async () => {
//             try {
//                 const response = await axiosInstance.get("/self");
//                 const data = response.data;
//                 setRole(data.role); 
//             } catch (error) {
//                 console.error("Error fetching role:", error);
//             }
//         };

//         fetchRole();
//     }, []);

//     const menuOpen = (index: number) => {
//         setSubmenu((prevState) => ({
//             ...prevState,
//             [index]: !prevState[index],
//         }));
//     };


//     const toggleSidebar = () => {
//         const sidNav: any = document.querySelector('.sideNav');
//         sidNav.classList.toggle('active');
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     // Filter SideBarData based on role
//     const filteredSideBarData = SideBarData.filter((item) => {
//         if (role === "admin") {
//             // Only show "Super Admin" menu for admin
//             return item.title === "Super Admin";
//         } else {
//             // Show all menus except "Super Admin" for user and sub-user
//             return item.title !== "Super Admin";
//         }
//     });

//     return (
//         <>
//             <div></div>
//             <div id="item" className='sideNav'>
//                 <div className="logo flex">
//                     {/* <p className='fs-4'>EasyWaySolution</p> */}
//                     <img src={logo} alt="" className='fs-4 md:w-[170px] w-[110px]' />
//                     <span className='sideIcone' onClick={toggleSidebar}>
//                         {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
//                     </span>
//                 </div>

//                 {filteredSideBarData.map((item: any, index: number) => {
//                     const Icon: any = item.icon;
//                     const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

//                     return (
//                         <div className='sidebardata' key={index}>
//                             <p className='menu' onClick={() => menuOpen(index)} key={item.title}>
//                                 <Icon className="fs-5" />
//                                 <span> <p className='fs-6'>{item.title}</p> </span>
//                                 {OpenIcon && <OpenIcon className="menuOpen fs-5" />}
//                             </p>
//                             {submenu[index] && (
//                                 <div>
//                                     {item.subNav && <SubManu data={item.subNav} />}
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </>
//     );
// };

// export default SideBarController;

import React, { useState, useEffect } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import '../../global.scss';
import logo from "../../assets/ews-full-white.png";

const SideBarController = () => {
    const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [role, setRole] = useState<string>("");

    // Fetch role from local storage instead of making an API call
    useEffect(() => {
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const user = JSON.parse(userDetails);
            setRole(user.role); // Set role from local storage
            console.log(role)
        } else {
            console.error("User details not found in local storage.");
        }
    }, []);

    const menuOpen = (index: number) => {
        setSubmenu((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    const toggleSidebar = () => {
        const sidNav: any = document.querySelector('.sideNav');
        sidNav.classList.toggle('active');
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter SideBarData based on role
    const filteredSideBarData = SideBarData.filter((item) => {
        if (role === "admin") {
            // Only show "Super Admin" menu for admin
            return item.title === "Super Admin";
        } else {
            // Show all menus except "Super Admin" for user and sub-user
            return item.title !== "Super Admin";
        }
    });

    return (
        <>
            <div></div>
            <div id="item" className='sideNav'>
                <div className="logo flex">
                    <img src={logo} alt="" className='fs-4 md:w-[170px] w-[110px]' />
                    <span className='sideIcone' onClick={toggleSidebar}>
                        {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
                    </span>
                </div>

                {filteredSideBarData.map((item: any, index: number) => {
                    const Icon: any = item.icon;
                    const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

                    return (
                        <div className='sidebardata' key={index}>
                            <p className='menu' onClick={() => menuOpen(index)} key={item.title}>
                                <Icon className="fs-5" />
                                <span> <p className='fs-6'>{item.title}</p> </span>
                                {OpenIcon && <OpenIcon className="menuOpen fs-5" />}
                            </p>
                            {submenu[index] && (
                                <div>
                                    {item.subNav && <SubManu data={item.subNav} />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default SideBarController;
