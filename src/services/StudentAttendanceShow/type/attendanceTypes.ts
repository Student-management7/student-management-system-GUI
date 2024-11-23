export interface StudentAttendance {
    stdId: string;
    name: string;
    attendance: string;
    remark: string | null;
  }
  
  export interface AttendanceResponse {
    date: string;
    students: StudentAttendance[];
  }
  
  export interface ClassData {
  className: string;
  subject: string[];
}
