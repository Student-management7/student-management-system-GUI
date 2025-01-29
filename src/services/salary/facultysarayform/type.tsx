// FacultySalaryForm.types.ts
export interface DeductionItem {
    name: string;
    amount: number;
  }
  
  export interface FacultySalaryFormValues {
    facultyID: string;
    facultySalary: number;
    facultyTax: number;
    facultyTransport: number;
    facultyDeduction: DeductionItem[];
    total?: number;
  }
  
  export interface FacultySalaryFormProps {
    initialData?: FacultySalaryFormValues;
    onSave: (payload: FacultySalaryFormValues) => Promise<void>;
    onCancel: () => void;
  }
  