

import { types } from "util";

export interface Qualification {
  type: string;
  grd_sub: string;
  grd_branch: string;
  grd_grade: string;
  grd_university: string;
  grd_yearOfPassing: string;
}

export interface Class {
  cls_name: string;
  cls_sub: string[];
}

export interface EditState {
  isFormVisible: boolean;
  editingFaculty: FacultyFormData | null;
  isEditMode: boolean;
}

export interface FacultyFormData {
  
  fact_id: string;
  fact_Name: string;
  email: string;
  fact_email: string;
  password: string;
  fact_contact: string;
  fact_gender: string;
  fact_address: string;
  fact_city: string;
  fact_state: string;
  fact_joiningDate: string;
  fact_leavingDate?: string;
  fact_qualifications: Qualification[];
  Fact_cls: Class[];
  Fact_status: string;

  
}

// Define response types
export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

// Add error type
export interface ApiError {
  message: string;
  status?: number;
}


