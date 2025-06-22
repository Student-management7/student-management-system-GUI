import React, { useState, useEffect } from 'react';
import { SideBarData } from './SideBarData';
import SubManu from './SubManu';
import './SideMenu.scss';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import '../../global.scss';
import logo from "../../assets/ews-full-white.png";

interface Permission {
  [module: string]: {
    [permission: string]: boolean;
  };
}

const SideBarController = () => {
    const [submenu, setSubmenu] = useState<{ [key: number]: boolean }>({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [role, setRole] = useState<string>("");
    const [permissions, setPermissions] = useState<Permission | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const user = JSON.parse(userDetails);
            if (user?.role) {
                setRole(user.role);
                setPermissions(user.permission?.permissions || null);
                setLoading(false);
            } else {
                console.error("Role not found in user data.");
                setLoading(false);
            }
        } else {
            console.error("User details not found in local storage.");
            setLoading(false);
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

    const hasPermission = (path: string): boolean => {
        if (role === "admin") {
            return path === '/superAdminController' || path === '/schoolpermission';
        }
        if (!permissions) return true;

        const alwaysVisibleRoutes = ['/setting', '/profile', '/admindeshboard'];
        if (alwaysVisibleRoutes.includes(path)) return true;

        const routeKey = path.replace(/^\//, '').split('/')[0];

        const routePermissions: {[key: string]: string} = {
            'studentRegistrationController': 'student.studentRegistrationController',
            'studentAttendanceShow': 'student.studentAttendanceShow',
            'studentAttendenceManagement': 'student.studentAttendenceManagement',
            'studentAttendanceEdit': 'student.studentAttendanceEdit',
            'studentAttendanceEditSave': 'student.studentAttendanceEditSave',
            'studentFeesController': 'student.studentFeesController',
            'studentFeesDetails': 'student.studentFeesDetails',
            'studentReportForm': 'student.studentReportForm',
            'studentReport': 'student.studentReport',
            'studentDetails': 'student.studentDetails',
            'facultyRegistration': 'faculty.facultyRegistrationForm',
            'facultyAttendanceShow': 'faculty.facultyAttendanceShow',
            'facultyAttendanceSave': 'faculty.facultyAttendanceSave',
            'facultyAttendanceEdit': 'faculty.facultyAttendanceEdit',
            'facultyAttendanceEditSave': 'faculty.facultyAttendanceEditSave',
            'facultySalary': 'faculty.facultySalaryController',
            'facultySalaryDetails': 'faculty.facultySalaryDetails',
            'facultyDetails': 'faculty.facultyDetails',
            'fees': 'finance.adminFees',
            'permission': 'finance.permission',
            'notification': 'notification.notificationController',
            'createNotification': 'notification.createNotification',
            'holiday': 'notification.holidayFormController',
            'viewNotification': 'notification.notificationList',
            'classSubjectShow': 'subject.classSubjectShow',
            'saveSubjectsToClasses': 'subject.saveSubjectsToClasses',
            'bulkUpload': 'student.bulkUpload',
            "syllabus": "syallabus.SyllabusList",
            "UploadSyllabus": "syallabus.UploadSyllabus",
            "syllabus/edit/:id": "syallabus.EditSyllabus"

        };

        const permissionPath = routePermissions[routeKey];
        if (!permissionPath) return false;

        const [module, permission] = permissionPath.split('.');
        return permissions[module]?.[permission] === true;
    };

    if (loading) {
        return <div>Loading Sidebar...</div>;
    }

    const filteredSideBarData = SideBarData.filter((item) => {
        if (role === "admin") {
            return item.title === "Super Admin";
        }

        if (item.subNav) {
            item.subNav = item.subNav.filter(subItem => hasPermission(subItem.path));
            return item.subNav.length > 0;
        }

        return true;
    });

    return (
        <div id="item" className='sideNav'>
            <div className="logo flex">
                <img src={logo} alt="Logo" className='fs-4 md:w-[170px] w-[110px]' />
                <span className='sideIcone' onClick={toggleSidebar}>
                    {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </span>
            </div>

            {filteredSideBarData.map((item: any, index: number) => {
                const Icon: any = item.icon;
                const OpenIcon: any = submenu[index] ? item?.iconClosed : item?.iconeOpened;

                return (
                    <div className='sidebardata' key={index}>
                        <p className='menu' onClick={() => menuOpen(index)}>
                            <Icon className="fs-5" />
                            <span><p className='fs-6'>{item.title}</p></span>
                            {item.subNav && item.subNav.length > 0 && OpenIcon && (
                                <OpenIcon className="menuOpen fs-5" />
                            )}
                        </p>
                        {submenu[index] && item.subNav && item.subNav.length > 0 && (
                            <div>
                                <SubManu data={item.subNav} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SideBarController;
