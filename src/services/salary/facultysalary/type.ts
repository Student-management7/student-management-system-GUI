export interface Deduction {
    name: string;
    amount: number;
  }
  
  export interface FacultySalary {
    facultyID: string;
    facultySalary: number;
    facultyTax: number;
    facultyTransport: number;
    facultyDeduction: Deduction[];
  }
  
  export interface FacultySalaryFormProps {
    initialData?: FacultySalary; // For Edit functionality
    onCancel: () => void;
    onSave: (data: FacultySalary) => void;
  }
  
  // Represents a single faculty salary record
export interface FacultySalaryDetails {
    fact_id: string;
    id: string;
    facultyID: string;
    salary: number;
    tax: number;
    transportAllowance: number;
    deductions: Array<{
      name: string;
      amount: number;
    }>;
  }
  
  // Represents the form values used to create or update a faculty salary
  export interface FacultySalaryFormValues {
    facultyID: string;
    salary: number;
    tax: number;
    transportAllowance: number;
    deductions: Array<{
      name: string;
      amount: number;
    }>;
  }
  export interface FacultySalaryResponse {
    fact_id: string;
    fact_Name: string;
    fact_salary: {
      id: string;
      creationDateTime: string;
      facultySalary: number;
      facultyTax: number;
      facultyTransport: number;
      facultyDeduction: string; // JSON string of deductions
      total: number;
    }[];
  }