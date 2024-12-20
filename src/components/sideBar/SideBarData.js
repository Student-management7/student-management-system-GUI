
import { FaHouse, FaHandshakeAngle, FaCaretDown, FaCaretUp, FaMoneyBill, FaUserLarge, FaUserTie } from "react-icons/fa6";
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
                icon: FaHandshakeAngle,
            },
            {
                title: 'Student Attendance',
                path: '/StudentAttendanceShow',
                icon: FaHandshakeAngle,
            },
            {
                title: 'Studence Attendance Managemnet',
                path: '/StudentAttendenceManagement',
                icon: FaHandshakeAngle,
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
                icon: FaHandshakeAngle,
            },
            {
                title: 'Faculty Attendance',
                path: '/FacultyAttendanceShow',
                icon: FaHandshakeAngle,
            },
            {
                title: 'Faculty Attendance Management',
                path: '/facultyAttendanceSave',
                icon: FaHandshakeAngle,
            },
            {
                title: 'Save Subjects',
                path: '/SaveSubjectsToClasses',
                icon: FaHandshakeAngle,
            },
            {
                title: 'Hollyday',
                path: '/holiday',
                icon: FaHandshakeAngle,
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
        icon: FaHandshakeAngle,
        iconClosed: FaCaretUp,
        iconeOpened: FaCaretDown,
        subNav: [

            {
                title: 'Notification',
                path: '/CreateNotification',
                icon: FaMoneyBill,
            },
            {
                title: 'View Notification',
                path: '/ViewNotification',
                icon: FaMoneyBill,
            },
        ]
    }

]