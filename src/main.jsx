
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDataGrid from './Pages/StusentDashboard';
import MasterController from './components/main/MasterController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import StudentRegistrationController from './components/studentRegistration/StudentRegistrationController';
import StudentAttendenceManagement from './components/StudentAttendence/StudentAttendenceManagement'
import SaveSubjectsToClasses from './components/saveSubjectsToClasess/saveSubjectsToClasess'
import FacultyRegistrationForm from './components/FacultyRegistration/FacultyRegistrationController';
import StudentAttendanceShow from './components/StudenAttendanceShow/StudentAttendanceShow';
import FacultyAttendanceSave from './components/facultyAttendanceSave/facultyAttendanceSave';
 import FacultyAttendanceShow from './components/facultyAttendanceView/FacultyAttendanceShow';
 import FacultyAttendanceEdit from './components/facultyAttendanceEdit/facultyAttendanceEdit';
 import FacultyAttendanceEditSave from './components/facultyAttendanceEdit/facultyAttendanceEditSave';
 import StudentAttendanceEdit from './components/StudenAttendanceShow/studentAttendanceEdit';
 import StudentAttendanceEditSave from './components/StudenAttendanceShow/studentAttendanceEditSave';
import HolidayFormController from './components/Holidays/holidayFormController';

import './index.css'
import SideBarController from './components/sideBar/SideBarController';




const App = () =>{

  return(
    <>
      <div className='mainBody'>
        <SideBarController />
        <div className='rhsBox'>
          <HeaderController />
          {/* <Router> */}
            <Routes>
              <Route path="/main" element={<MasterController />} />
              <Route path='/StudentRegistrationController' element={<StudentRegistrationController />} />
              <Route path="/StudentAttendenceManagement" element={<StudentAttendenceManagement />} />
              <Route path="/SaveSubjectsToClasses" element={<SaveSubjectsToClasses />} />
              <Route path="/studentdashboard" element={<StudentDataGrid />} /> 
              <Route path="/FacultyRegistration" element={<FacultyRegistrationForm />} />
              <Route path="/StudentAttendanceShow" element={<StudentAttendanceShow />} />
              <Route path="/facultyAttendanceSave" element={<FacultyAttendanceSave />} />
              <Route path="/FacultyAttendanceShow" element={<FacultyAttendanceShow />} />
              <Route path="/facultyAttendanceEdit" element={<FacultyAttendanceEdit />} />
              <Route path="/facultyAttendanceEditSave" element={<FacultyAttendanceEditSave />} />
              <Route path="/studentAttendanceEdit" element={<StudentAttendanceEdit />} />
              <Route path="/studentAttendanceEditSave" element={<StudentAttendanceEditSave />} />
              <Route path="/holiday" element={<HolidayFormController />} />
              


              <Route path="*" element={<MasterController />} />
            </Routes>
          {/* </Router> */}
          <FooterController />
        </div>
      </div>
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
