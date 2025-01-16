
import { FaBook, FaIdCard, FaRegEdit, FaUserEdit,  } from "react-icons/fa";
import { FaHouse, FaHandshakeAngle, FaCaretDown, FaCaretUp, FaMoneyBill, FaUserLarge, FaUserTie ,FaBell, FaUserPlus ,FaClipboardList , } from "react-icons/fa6";
export const SideBarData = [

    {
        title: 'Home',
        path: '/Home',
        icon: FaHouse,

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
                title: 'Student Attendance',
                path: '/StudentAttendanceShow',
                icon: FaClipboardList,
            },
            {
                title: 'Studence Attendance Managemnet',
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
                title: 'Faculty Attendance',
                path: '/FacultyAttendanceShow',
                icon: FaClipboardList,
            },
            {
                title: 'Faculty Attendance Management',
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
            {
                title: 'View Report',
                path: '/StudentReport',
                icon: FaIdCard,
            },
            
        ]
    }

]