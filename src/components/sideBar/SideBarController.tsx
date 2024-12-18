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

