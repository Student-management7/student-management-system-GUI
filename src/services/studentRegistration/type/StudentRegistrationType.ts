import { string } from "yup";

export interface StudentFormData {
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
  }

  
  

//   {
//     "name": "John Doe",
//     "address": "123 Main St",
//     "city": "Springfield",
//     "state": "IL",
//     "familyDetails": {
//         "stdo_FatherName": "John Sr.",
//         "stdo_MotherName": "Jane Doe",
//         "stdo_primaryContact": "+1-234-567-8901",
//         "stdo_secondaryContact": "+1-234-567-8902",
//         "stdo_address": "456 Oak St",
//         "stdo_city": "Springfield",
//         "stdo_state": "IL",
//         "stdo_email": "family@example.com"
//     },
//     "contact": "+1-234-567-8901",
//     "gender": "Male",
//     "dob": "2000-01-01",  // Date format: YYYY-MM-DD
//     "email": "johndoe@example.com",
//     "cls": "10",
//     "department": "Science",
//     "category": "General"
// }