
import { FaBook, FaIdCard, FaRegEdit, FaUserEdit, } from "react-icons/fa";
import {  FaLandmark,FaCoins,FaPiggyBank, FaCaretDown, FaCaretUp,FaUserShield, FaMoneyBill, FaUserLarge, FaUserTie ,FaBell, FaUserPlus ,FaClipboardList ,FaFile } from "react-icons/fa6";
export const SideBarData = [

   
    {
        title: 'Super Admin',
        path: '/',
        icon: FaUserLarge,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
       
        subNav: [
            {
                title: 'School Registration ',
                path: '/superAdminController',
                icon: FaUserPlus,
                
            },
            
            {
                title: 'School Permission ',
                path: '/schoolpermission',
                icon: FaUserShield,
                
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
        icon: FaLandmark,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Class Fees',
                path: '/fees',
                icon: FaCoins,
            },
            {
                title: 'Student Fees',
                path: '/studentFeesController',
                icon: FaPiggyBank,
            },
            {
                title: 'Faculty Salary',
                path: '/facultySalary',
                icon: FaMoneyBill,
            },
             {
                title: 'Fees Management',
                path: '/FeesManagement',
                icon: FaIdCard,
              },
            {
                title: 'Permission',
                path: '/permission',
                icon: FaUserShield,
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
    },
    {
        title: 'Syllabus',
        path: '/',
        icon: FaFile,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Syllabus',
                path: '/syllabus',
                icon: FaFile,
            },
        
            
        ]
    },
    {
        title: 'TC',
        path: '/',
        icon: FaFile,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

             {
                title: 'Transfer Certificate',
                path: '/tc',
                icon: FaIdCard,
              },
            
            
             {
                title: 'Marksheet',
                path: '/marksheet',
                icon: FaIdCard,
              },
            
        ]
    },
 


]

