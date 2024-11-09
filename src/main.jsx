import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'
import StudentDataGrid from './Pages/StusentDashboard';
import MasterController from './components/main/MasterController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import StudentRegistrationController from './components/studentRegistration/StudentRegistrationController';
import StudentAttendenceManagementSystem from './components/StudentAttendence/StudentAttendenceManagementSystem'
import SaveSubjectsToClasses from './components/saveSubjectsToClasess/saveSubjectsToClasess'
import FacultyRegistrationForm from './components/FacultyRegistration/FacultyRegistrationController';
import './index.css'




const App = () =>{

  return(
    <>
      <HeaderController />
     {/* <Router> */}
      <Routes>
        <Route path="/main" element={<MasterController />} />
        <Route path='/StudentRegistrationController' element={<StudentRegistrationController />} />
        <Route path="/StudentAttendenceManagementSystem" element={<StudentAttendenceManagementSystem />} />
        <Route path="/SaveSubjectsToClasses" element={<SaveSubjectsToClasses />} />
        <Route path="/studentdashboard" element={<StudentDataGrid />} /> 
        <Route path="/FacultyRegistration" element={<FacultyRegistrationForm />} /> 

        <Route path="*" element={<MasterController />} />
      </Routes>
    {/* </Router> */}
    <FooterController />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
    
  </StrictMode>,
)
