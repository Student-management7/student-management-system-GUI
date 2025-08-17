import { Student } from "../../StudentAttendence/Type/studentAttendenceType";

export interface StudentAttendance {
    stdId: string;
    name: string;
    attendance: string;
    remark: string | null;
  }
  
  export interface AttendanceResponse {
    studentList: boolean;
    date: string;
    students: StudentAttendance[];
  }
  
  export interface ClassData {
  [x: string]: string;
  className: string;
  subject: string[];
}

export interface Students {
  id: string;
  students: Student[];
  date: string;
 
}

