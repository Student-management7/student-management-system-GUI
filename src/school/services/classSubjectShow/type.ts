// services/classSubjectShow/type.ts
export interface ClassData {
  
  
  className: string;
  subject: string[]; // Array of subjects
}

export interface ClassDataWithId extends ClassData {
  id: string | number;
}