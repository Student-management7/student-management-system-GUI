
import { FaBook, FaChartBar, FaIdCard, FaRegEdit, FaUserEdit,  } from "react-icons/fa";
import {  FaHandshakeAngle, FaCaretDown, FaCaretUp, FaMoneyBill, FaUserLarge, FaUserTie ,FaBell, FaUserPlus ,FaClipboardList, FaUserGroup , } from "react-icons/fa6";
export const SideBarData = [

    {
        title: 'Admin',
        path: '/Admin',
        icon: FaUserLarge,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav :[
            {
                title: 'School Management',
                path: '/SchoolManagement',
                icon: FaUserPlus,
            },
            {
                title: 'Inquiry Management ',
                path: '/InquiryManagement',
                icon: FaChartBar,
            },
            {
                title: 'Reports and Analytics',
                path: '/ReportsAndAnalytics',
                icon: FaChartBar,
            },
            {
                title: 'Alerts and Notifications',
                path: '/NotificationList',
                icon: FaBell,
            },
            {
                title: 'System Users',
                path: '/SystemUsersManagement',
                icon: FaUserGroup,
            },
           
        ]

    },
    {
        title: 'Student',
        path: '/',
        icon: FaUserLarge,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [
            {
                title: 'Student Registration',
                path: '/StudentRegistrationController',
                icon: FaUserPlus,
            },
            {
                title: 'Student Attendance View',
                path: '/StudentAttendanceShow',
                icon: FaClipboardList,
            },
            {
                title: 'Studence Attendance ',
                path: '/StudentAttendenceManagement',
                icon: FaUserEdit,
            }
        ]

    },
    {
        title: 'Faculty',
        path: '/',
        icon: FaUserTie,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [
            {
                title: 'Faculty Registration',
                path: '/FacultyRegistration',
                icon: FaUserPlus,
            },
            {
                title: 'Faculty Attendance View',
                path: '/FacultyAttendanceShow',
                icon: FaClipboardList,
            },
            {
                title: 'Faculty Attendance ',
                path: '/facultyAttendanceSave',
                icon: FaRegEdit,
            },
            
           
        ]

    },

    {
        title: 'Finance',
        path: '/',
        icon: FaHandshakeAngle,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Admin Fees',
                path: '/fees',
                icon: FaMoneyBill,
            },
            {
                title: 'Student Fees',
                path: '/StudentFeesController',
                icon: FaMoneyBill,
            },
            {
                title: 'Faculty Salary',
                path: '/FacultySalary',
                icon: FaMoneyBill,
            },
            {
                title: 'Permission',
                path: '/permission',
                icon: FaMoneyBill,
            },
        ]
    },
    {
        title: 'Notification',
        path: '/',
        icon: FaBell,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Notification',
                path: '/Notification',
                icon: FaBell,
            },
            {
                title: 'Hollyday',
                path: '/holiday',
                icon: FaBell,
            },
            
        ]
    },
    {
        title: 'Class & Subject',
        path: '/',
        icon: FaBook,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Save Subjects',
                path: '/ClassSubjectShow',
                icon: FaBook,
            },
            
        ]
    },
    {
        title: 'Student Report',
        path: '/',
        icon: FaIdCard,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Create Report',
                path: '/StudentReportForm',
                icon: FaIdCard,
            },
            
            
        ]
    }

]

