import { string } from "yup";

export interface StudentFormData {
  id?: string,
  name?: string;
  address?: string;
    city?: string;
    state?: string;
    familyDetails: FamilyDetails;
    contact?: string;
    gender?: string;
    dob?: string;
    email?: string;
    cls?: string;
    department?: string;
    category?: string;
    
    
  }

  export interface FamilyDetails {
    stdo_FatherName?: string;
    stdo_MotherName?: string;
    stdo_primaryContact?: string;
    stdo_secondaryContact?: string;
    stdo_city?: string;
    stdo_state?: string;
    stdo_email?: string;
    stdo_address?: string;
  }

  
  