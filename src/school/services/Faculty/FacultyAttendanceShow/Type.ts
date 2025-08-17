
export interface FacultyAttendance {
    factId: string | null; 
    attendance: string; 
    name: string; 
  }
  
  export interface AttendanceEntry {
    date: string; 
    factList: FacultyAttendance[]; 
  }
  
 
  export type AttendanceResponse = AttendanceEntry[];
  




  