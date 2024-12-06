import React from 'react'
import * as FaIcons from 'react-icons/fa';
import { FaHouse, FaHandshakeAngle, FaCaretDown , FaCaretUp, FaUserLarge, FaUserTie   } from "react-icons/fa6";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SideBarData = [

    {
        title: 'Home',
        path: '/Home',
        icon: FaHouse,

    },
    {
        title: 'Student',
        path: '/',
        icon: FaUserLarge ,
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
        icon: FaUserTie ,
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
            }
        ]

    }



]

