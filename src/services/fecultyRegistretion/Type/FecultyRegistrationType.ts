// // types/facultyTypes.ts

// export interface FacultyFormData {
//   fact_Name: string;
//   fact_email: string;
//   fact_contact: string;
//   fact_gender: string;
//   fact_address: string;
//   fact_city: string;
//   fact_state: string;
//   fact_joiningDate: string;
//   fact_leavingDate?: string;
//   fact_status: string;
//   qualifications: Qualification[];
//   fact_cls: Class[];
// }

// export interface Qualification {
//   type: string;
//   subject: string;
//   branch: string;
//   grade: string;
//   university: string;
//   yearOfPassing: string;
// }

// export interface Class {
//   cls_name: string;
//   cls_sub: string[];
// }

// export interface AlertProps {
//   message: string;
//   type: "success" | "error" | "danger"; // Add "danger" as an accepted type
//   onClose: () => void;
// }





export interface Qualification {
  type: string;
  subject: string;
  branch: string;
  grade: string;
  university: string;
  yearOfPassing: string;
}

export interface Class {
  cls_name: string;
  cls_sub: string[];
}

export interface FacultyFormData {
  fact_Name: string;
  fact_email: string;
  fact_contact: string;
  fact_gender: string;
  fact_address: string;
  fact_city: string;
  fact_state: string;
  fact_joiningDate: string;
  fact_leavingDate?: string;
  fact_status: string;
  qualifications: Qualification[];
  fact_cls: Class[];
}
