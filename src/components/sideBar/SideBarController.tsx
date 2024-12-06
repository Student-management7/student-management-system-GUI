import React,{useState} from 'react';
//import '../sideBar/main.scss'
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss'
import { Link } from 'react-router-dom';

const SideBarController = () =>{
const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});

const menuOpen = (index: number) =>{
    setSubmenu((prevState) => ({
        ...prevState,
        [index]: !prevState[index], // Toggle the state of the clicked menu
    }));
    }


    return(

        <>
            
            <div className='sideNav'>
            <div className="font-extrabold text-md md:text-2xl">EasyWaySolution</div>

                {SideBarData.map((item: any, index: number)=>{

                const Icon: any = item.icon;
                const OpenIcon: any = submenu[index]
                ? item?.iconClosed
                : item?.iconeOpened;
                        return(
                                <div>
                                   
                                    {/* <p key={index}><Icon /> <span>{</span></p> */}
                                    

                                  <p onClick={() => menuOpen(index)}
                                   className='menu' key={item.title}>
                                      <Icon />  
                                    <span> <p>{item.title}</p> </span> 
                                      {OpenIcon && <OpenIcon className="menuOpen" />}
                                    </p>
                                    {submenu[index] && (
                                <div>
                                    {item.subNav && <SubManu data={item.subNav} />}
                                </div>
                            )}
                                    {/* <div>{item.subNav && <SubManu data={item.subNav} />}</div> */}
                                </div>
                                );
                

                        })
                
                }
                

            </div>
        </>
    );




}

export default SideBarController;