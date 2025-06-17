export interface Syllabus {
  id: string;
  tittle: string;
  description?: string;
  cls: string;
  subject: string;
  publish: boolean;
  name: string; // file name
}

export interface SyllabusPayload {
  title: string;
  description?: string;
  class: string;
  subject: string;
  publish: boolean;
  file: File;
}
