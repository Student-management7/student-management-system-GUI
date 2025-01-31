import React, { useState } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaBars, FaRightToBracket } from "react-icons/fa6"; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/authContext';
import '../../global.scss'

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

    const getToggelButton = ()=>{
        const sidNav: any = document.querySelector('.sideNav');
            sidNav.classList.toggle('active');
    }
    return (
        <>
        

            <div id="item" className='sideNav'>
                <div className="logo flex">
                    <p className='fs-4'>EasyWaySolution</p>
                    <span onClick={getToggelButton}><FaBars /></span>
                </div>

                {SideBarData.map((item: any, index: number) => {
                    const Icon: any = item.icon;
                    const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

                    return (
                        <div className='sidebardata' key={index}>
                            <p className='menu'
                                onClick={() => menuOpen(index)}
                                
                                key={item.title}>
                                <Icon className="fs-5"/>
                                <span> <p className='fs-6'>{item.title}</p> </span>
                                {OpenIcon && <OpenIcon className="menuOpen fs-5" />}
                            </p>
                            {submenu[index] && ( 
                                <div className=''>
                                    {item.subNav && <SubManu  data={item.subNav} />}
                                </div>
                            )}
                        </div>
                    );
                })}

               
                <div className='menu' onClick={handleLogout}>
                    <FaRightToBracket />
                    <span>Logout</span>
                </div>
            </div>
            
        </>
    );
};

export default SideBarController;





