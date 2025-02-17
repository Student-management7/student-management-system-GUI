import React, { useState } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaRightToBracket, FaChevronLeft, FaChevronRight } from "react-icons/fa6"; 

import '../../global.scss';

const SideBarController = () => {
    const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
   
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar state

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

                {SideBarData.map((item: any, index: number) => {
                    const Icon: any = item.icon;
                    const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

                    return (
                        <div className='sidebardata' key={index}>
                            <p className='menu' onClick={() => menuOpen(index)} key={item.title}>
                                <Icon className="fs-5"/>
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
