// src/services/StudentAttendance/types.ts

// services/SaveSubjects/Type.ts
export interface ClassData {
    data: any;
    id?: string; // Optional for newly created entries
    className: string;
    subject: string[]; // Array of subjects
  }
  