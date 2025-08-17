interface FamilyDetails {
    stdo_FatherName: string;
    stdo_MotherName: string;
    stdo_primaryContact: string;
    stdo_secondaryContact: string;
    stdo_address: string;
    stdo_city: string;
    stdo_state: string;
    stdo_email: string;
  }
  
  interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string;
  }
  interface ErrorData {
    [key: string]: string | undefined;  // Can store any string or undefined for fields that have no error
  }

  export type {FamilyDetails, InputFieldProps, ErrorData};