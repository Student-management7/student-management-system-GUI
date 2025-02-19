
import { FaBook, FaIdCard, FaRegEdit, FaUserEdit,  } from "react-icons/fa";
import {  FaHandshakeAngle, FaCaretDown, FaCaretUp, FaMoneyBill, FaUserLarge, FaUserTie ,FaBell, FaUserPlus ,FaClipboardList , } from "react-icons/fa6";
export const SideBarData = [

   
    {
        title: 'Super Admin',
        path: '/',
        icon: FaUserLarge,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
       
        subNav: [
            {
                title: 'Super Admin Registration',
                path: '/superAdminController',
                icon: FaUserPlus,
                
            }
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
                path: '/studentRegistrationController',
                icon: FaUserPlus,
            },
            {
                title: 'Student Attendance View',
                path: '/studentAttendanceShow',
                icon: FaClipboardList,
            },
            {
                title: 'Studence Attendance ',
                path: '/studentAttendenceManagement',
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
                path: '/facultyRegistration',
                icon: FaUserPlus,
            },
            {
                title: 'Faculty Attendance View',
                path: '/facultyAttendanceShow',
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
                title: 'Class Fees',
                path: '/fees',
                icon: FaMoneyBill,
            },
            {
                title: 'Student Fees',
                path: '/studentFeesController',
                icon: FaMoneyBill,
            },
            {
                title: 'Faculty Salary',
                path: '/facultySalary',
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
                path: '/notification',
                icon: FaBell,
            },
            {
                title: 'Holiday',
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
                path: '/classSubjectShow',
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
                path: '/studentReportForm',
                icon: FaIdCard,
            },
            
            
        ]
    }

]

