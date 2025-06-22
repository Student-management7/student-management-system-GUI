import { SetStateAction } from "react";

export interface Faculty {
  factId: string;
  name: string;
  attendance: string;
  }
  
  export interface AttendanceEntry {
    id: SetStateAction<string>;
    date: string;
    factList: Faculty[];
  }

  export interface EditAttendancePayload {
    id: string;
    date: string;
    factList: Faculty[];
  }
  
  
// facultyAttendanceEditSave Type define  
 