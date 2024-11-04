// src/constants/apiEndpoints.ts
export const API_ENDPOINTS = {
    CLASS_DATA: 'https://s-m-s-keyw.onrender.com/class/data',
    STUDENT_DATA: (selectedClass: string) => `https://s-m-s-keyw.onrender.com/student/findAllStudent?cls=${selectedClass}`,
    SAVE_ATTENDANCE: 'https://s-m-s-keyw.onrender.com/attendance/save',
};
