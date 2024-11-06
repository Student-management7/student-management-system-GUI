export interface Qualification {
  grd_sub: string;
  grd_branch: string;
  grd_grade: string;
  grd_university: string;
  grd_yearOfPassing: string;
}

export interface ClassSubject {
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
  fact_leavingDate: string;
  fact_qualification: {
      Fact_Graduation: Qualification;
      Fact_PostGraduation?: Qualification;
      Fact_Other?: Qualification;
  }[];
  fact_cls: ClassSubject[];
  fact_status: "Active" | "Inactive";
}
