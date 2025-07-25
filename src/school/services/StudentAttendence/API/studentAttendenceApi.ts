export const API_ENDPOINTS = {
    CLASS_DATA: 'https://s-m-s-keyw.onrender.com/class/data',
    STUDENT_DATA: (selectedClass: string, masterAttendance: boolean) =>
        `https://s-m-s-keyw.onrender.com/student/findAllStudent?cls=${selectedClass}&masterAttendance=${masterAttendance}`,
    SAVE_ATTENDANCE: (masterAttendance: boolean) =>
        `https://s-m-s-keyw.onrender.com/attendance/save?masterAttendance=${masterAttendance}`,
};
