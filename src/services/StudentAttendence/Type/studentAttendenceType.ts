// src/types/studentManagementTypes.ts
export interface ClassData {
    className: string;
    subject: string[];
}

export interface Student {
    stdId: string;
    name: string;
    attendance?: string; // Default to "Present" if not provided
}

export interface AttendancePayload {
    className: string;
    subject: string;
    // name: string;
    studentList: {
        stdId: string;
        attendance: string;
    }[];
}
