import React, { useState, useEffect } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaRightToBracket, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import '../../global.scss';
import axiosInstance from '../../services/Utils/apiUtils'; // Import axiosInstance to fetch role

const SideBarController = () => {
    const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state
    const [role, setRole] = useState<string>(""); // State to store the role

    // Fetch role from the API
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axiosInstance.get("/self");
                const data = response.data;
                setRole(data.role); // Set the role from the API response
            } catch (error) {
                console.error("Error fetching role:", error);
            }
        };

        fetchRole();
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
                    <p className='fs-4'>EasyWaySolution</p>
                    <span onClick={toggleSidebar}>
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