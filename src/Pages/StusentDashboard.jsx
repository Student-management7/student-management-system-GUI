import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';

const studentFields = [
  { field: 'student_id', headerName: 'STUDENT ID', width: 150 },
  { field: 'student_name', headerName: 'STUDENT NAME', width: 200 },
  { field: 'student_address', headerName: 'STUDENT ADDRESS', width: 200 },
  { field: 'student_city', headerName: 'STUDENT CITY', width: 150 },
  { field: 'student_state', headerName: 'STUDENT STATE', width: 150 },
  { field: 'student_contact', headerName: 'STUDENT CONTACT', width: 180 },
  { field: 'student_gender', headerName: 'STUDENT GENDER', width: 120 },
  { field: 'student_dob', headerName: 'STUDENT DOB', width: 150 },
  { field: 'student_email', headerName: 'STUDENT EMAIL', width: 220 },
  { field: 'student_cls', headerName: 'STUDENT CLASS', width: 120 },
  { field: 'student_department', headerName: 'STUDENT DEPARTMENT', width: 180 },
  { field: 'student_category', headerName: 'STUDENT CATEGORY', width: 150 },
  { field: 'family_father_name', headerName: 'FATHER NAME', width: 180 },
  { field: 'family_mother_name', headerName: 'MOTHER NAME', width: 180 },
  { field: 'family_primary_contact', headerName: 'PRIMARY CONTACT', width: 180 },
  { field: 'family_secondary_contact', headerName: 'SECONDARY CONTACT', width: 180 },
  { field: 'family_address', headerName: 'FAMILY ADDRESS', width: 200 },
  { field: 'family_city', headerName: 'FAMILY CITY', width: 150 },
  { field: 'family_state', headerName: 'FAMILY STATE', width: 150 },
  { field: 'family_email', headerName: 'FAMILY EMAIL', width: 220 },
];

const rows = [
  {
    id: 1, 
    student_id: 'S001', 
    student_name: 'monesh sahu', 
    student_address: ' 123, Sector 1, Aligarh', 
    student_city: ' gwalior', 
    student_state: 'M .P.', 
    student_contact: '9876543210', 
    student_gender: 'Male', 
    student_dob: '01/01/2000',
    student_email: 'ashish@example.com',
    student_cls: '10th',
    student_department: 'Science',
    student_category: 'General',
    family_father_name: 'Rajesh Sahu',

    family_mother_name: 'Rajni Sahu',

    family_primary_contact: '1234567890',
    family_secondary_contact: '0987654321',
    family_address: '123 Family St',
    family_city: 'Familyville',
    family_state: 'Stateville',
    family_email: 'family@example.com'
  }
  // Add more rows here as needed
];

export default function StudentDashboard() {
  const apiRef = useGridApiRef();

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={studentFields}
        disableRowSelectionOnClick
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
}
