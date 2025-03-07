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
  fact_leavingDate: string;
  fact_qualification: {
    type: string;
    grd_name: string;
    grd_branch: string;
    grd_grade: string;
    grd_university: string;
    grd_yearOfPassing: string;
  }[];
  Fact_Cls: {
    cls_name: string;
    cls_sub: string[];
  }[];
  Fact_Status: string;
}


export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

// Add error type
export interface ApiError {
  message: string;
  status?: number;
}