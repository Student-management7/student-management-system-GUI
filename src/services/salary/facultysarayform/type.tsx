export interface FacultyDeduction {
  name: string;
  amount: number;
}

export interface FacultySalaryFormValues {
  id: string;
  facultyID: string;
  facultySalary: number;
  facultyTax: number;
  facultyTransport: number;
  facultyDeduction: FacultyDeduction[];
}

export interface FacultySalaryFormProps {
  initialData: any;
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}