export interface Faculty {
  id: string;
  fact_id: string;
  fact_Name: string;
  fact_email: string;
  fact_contact: string;
  fact_gender: string;
  fact_address: string;
  fact_city: string;
  fact_state: string;
  attendance?: string;
}

export interface FacultyTableProps {
  facultyList: Faculty[];
  onAttendanceSelect: (value: string, name: string) => void;
}

export interface AttendancePayload {
  date: string;
  id: string; // ID from the fetched attendance response
  factList: {
      factId: string;
      attendance: string;
      name: string;
  }[];
}