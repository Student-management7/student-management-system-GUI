export interface ClassData {
    
    className: string;
    subject: string[];
}

export interface Student {
    remark: string;
    stdId: string;
    name: string;
    attendance?: string; // Default to "Present" if not provided
}

export interface AttendancePayload {
    className: string;
    subject?: string; // Optional for Master Attendance
    masterAttendance: boolean;
    studentList: {
        stdId: string;
        name: string;
        attendance: string;
        remark: string | null;
    }[];
}
