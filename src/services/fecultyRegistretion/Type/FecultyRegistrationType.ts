
export interface FormData {
    fact_id: string;
    fact_Name: string;
    fact_email: string;
    fact_contact: string;
    fact_gender: string;
    fact_address: string;
    fact_city: string;
    fact_state: string;
    fact_joiningDate: string;
    fact_leavingDate?: string; // Optional field
  
    qualifications: {
      type: string;
      subject: string;
      branch: string;
      grade: string;
      university: string;
      yearOfPassing: string;
    }[];
  
    fact_cls: {
      cls_name: string;
      cls_sub: string;
    };
  
    fact_status: string;
  }