import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/studentRegistration/StudentRegistrationForm'
import Login from './Pages/Login'
import FacultyRegistrationForm from './components/studentRegistration/FacultyRegistrationForm';
import StudentDataGrid from './Pages/StusentDashboard';
import MasterController from './components/main/MasterController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import StudentRegistrationController from './components/studentRegistration/StudentRegistrationController';

//import App from './App'
import './index.css'

const App = () =>{

  return(
    <>
      <HeaderController />
     <Router>
      <Routes>
        <Route path="/main" element={<MasterController />} />
        <Route path='/StudentRegistrationController' element={<StudentRegistrationController />} />
        <Route path="/register" element={<Register />} />
        {/* 
        <Route path="/facultyregister" element={<FacultyRegistrationForm />} />
        <Route path="/studentdashboard" element={<StudentDataGrid />} /> */}
        <Route path="*" element={<MasterController />} />
        
      </Routes>
    </Router>
    <FooterController />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
