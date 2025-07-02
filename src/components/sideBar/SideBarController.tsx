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
                setPermissions(user.permission?.permissions || {});
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
        // Always show these routes
        const alwaysVisibleRoutes = ['/setting', '/profile', '/admindeshboard'];
        if (alwaysVisibleRoutes.includes(path)) return true;

        // Admin has access to specific paths
        if (role === "admin") {
            return path === '/superAdminController' || path === '/schoolpermission';
        }
       

        // If no permissions object, show nothing (except always visible)
        if (!permissions) return false;

        // Map routes to permission paths
        const routePermissions: { [key: string]: string } = {
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
            // 'feesmanagement': 'finance.feesmanagement', 
            "feesManagement":"finance.feesManagement",
            'notification': 'notification.notificationController',
            'createNotification': 'notification.createNotification',
            'holiday': 'notification.holidayFormController',
            'viewNotification': 'notification.notificationList',
            'classSubjectShow': 'subject.classSubjectShow',
            'saveSubjectsToClasses': 'subject.saveSubjectsToClasses',
           
            // 'transferCertificate': 'tc.TransferCertificate',
            "transferCertificate": 'tc.transferCertificate',
            'bulkUpload': 'student.bulkUpload', 
            
            'marksheet': 'tc.marksheet',
             'uploadSyllabus': 'syllabus.uploadSyllabus',
            'syllabusList': 'syllabus.syllabusList',
            'editSyllabus': 'syllabus.editSyllabus',
            'syllabus': 'syllabus.syllabusList' 
        };

        // Get the base route without parameters
        const basePath = path.replace(/^\//, '').split('/')[0];
        const permissionPath = routePermissions[basePath];

        // If no permission mapping exists, don't show the route
        if (!permissionPath) return false;

        // Check the permission
        const [module, permission] = permissionPath.split('.');
        return permissions[module]?.[permission] === true;
    };

    if (loading) {
        return <div>Loading Sidebar...</div>;
    }

    const filteredSideBarData = SideBarData.filter((item) => {
        // Always show super admin menu for admin role
        if (role === "admin") {
            return item.title === "Super Admin";
        }

        // Filter submenu items
        if (item.subNav) {
            item.subNav = item.subNav.filter(subItem => hasPermission(subItem.path));
            return item.subNav.length > 0;
        }

        // Show items without subNav if they have permission
        return hasPermission(item.path || '');
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