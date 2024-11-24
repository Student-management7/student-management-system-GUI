export interface Faculty {
    factId: string;
    attendance: 'Present' | 'Absent';
    name: string;
  }
  
  export interface AttendanceEntry {
    date: string;
    factList: Faculty[];
  }
  
  
// facultyAttendanceEditSave Type define  
  export interface Faculty {
    factId: string;
    name: string;
    attendance: 'Present' | 'Absent';
  }
  