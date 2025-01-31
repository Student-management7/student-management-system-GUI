import { SetStateAction } from "react";

export interface Faculty {
    factId: string;
    attendance: 'Present' | 'Absent';
    name: string;
  }
  
  export interface AttendanceEntry {
    id: SetStateAction<string>;
    date: string;
    factList: Faculty[];
  }
  
  
// facultyAttendanceEditSave Type define  
  export interface Faculty {
    factId: string;
    name: string;
    attendance: 'Present' | 'Absent';
  }
  