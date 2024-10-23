import React from 'react';
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/registration/StudentRegistrationForm'
import Login from './Pages/Login'
import FacultyRegistrationForm from './components/registration/FacultyRegistrationForm';
import StudentDataGrid from './Pages/StusentDashboard';
import MasterController from './components/main/MasterController';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path="/main" element={<MasterController />} />
        <Route path="/register" element={<Register />} />
        <Route path="/facultyregister" element={<FacultyRegistrationForm />} />
         <Route path="/studentdashboard" element={<StudentDataGrid />} />
        
      </Routes>
    </Router>
    
    </>
  )
}

export default App;
