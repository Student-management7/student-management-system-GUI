import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Pages/StudentRegistrationForm'
import Login from './Pages/Login'
import FacultyRegistrationForm from './Pages/FacultyRegistrationForm';
import StudentDataGrid from './Pages/StusentDashboard';
import StudentManagement  from './Pages/StudentManagement';
import SAMS from './experiments/SAMS'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/studentRegistrationController" element={<StudentRegistrationController />} />
        <Route path="/facultyregister" element={<FacultyRegistrationForm />} />
         <Route path="/studentdashboard" element={<StudentDataGrid />} />
         <Route path="/studentmanagement" element={<StudentManagement />} />
         <Route path="/sams" element={<SAMS />} />
        
      </Routes>
    </Router>
    
    </>
  )
}

export default App
