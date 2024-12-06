import React from 'react';
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/studentRegistration/StudentRegistrationForm'
import Login from './Pages/Login/Login'
import FacultyRegistrationForm from './components/studentRegistration/FacultyRegistrationForm';
import StudentDataGrid from './Pages/StusentDashboard';
import MasterController from './components/main/MasterController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    
    </>
  )
}

export default App;
