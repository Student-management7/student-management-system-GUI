import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './Pages/Login/ProtectedRoute';

import './App.css';
import './index.css';

import MasterController from './components/main/MasterController';
import HeaderController from './components/main/HeaderController';
import FooterController from './components/main/FooterController';
import StudentRegistrationController from './components/studentRegistration/StudentRegistrationController';
import StudentAttendenceManagement from './components/StudentAttendence/StudentAttendenceManagement';
import SaveSubjectsToClasses from './components/saveSubjectsToClasess/saveSubjectsToClasess';
import FacultyRegistrationForm from './components/FacultyRegistration/FacultyRegistrationController';
import StudentAttendanceShow from './components/StudenAttendanceShow/StudentAttendanceShow';
import FacultyAttendanceSave from './components/facultyAttendanceSave/facultyAttendanceSave';
import FacultyAttendanceShow from './components/facultyAttendanceView/FacultyAttendanceShow';
import FacultyAttendanceEdit from './components/facultyAttendanceEdit/facultyAttendanceEdit';
import FacultyAttendanceEditSave from './components/facultyAttendanceEdit/facultyAttendanceEditSave';
import StudentAttendanceEdit from './components/StudenAttendanceShow/studentAttendanceEdit';
import StudentAttendanceEditSave from './components/StudenAttendanceShow/studentAttendanceEditSave';
import HolidayFormController from './components/Holidays/holidayFormController';
import FeesController from './components/fess/addFeesByAdmin/feesController';
import Login from './Pages/Login/Login';
import SideBarController from './components/sideBar/SideBarController';
import FacultySalaryController from './components/salary/facultySalary/facultySalaryController';
import FacultySalaryDetails from './components/salary/facultySalary/facultySalaryDetails';
import Permission from './components/permission/Permission'
// Dummy StudentDataGrid to avoid undefined error; replace with your actual implementation.
const StudentDataGrid = () => <div>Student Data Grid</div>;

const App = () => {
  return (
    <>
      <HeaderController />
      <div className="mainBody">
        <SideBarController />
        <div className="rhsBox">
          <Routes>
            {/* Public Routes */}
             
             <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/main" element={<MasterController />} />
              <Route path="/StudentAttendenceManagement" element={<StudentAttendenceManagement />} />
              <Route path="/SaveSubjectsToClasses" element={<SaveSubjectsToClasses />} />
              <Route path="/studentdashboard" element={<StudentDataGrid />} />
              <Route path="/FacultyRegistration" element={<FacultyRegistrationForm />} />
              <Route path="/StudentRegistrationController" element={<StudentRegistrationController />} />

              <Route path="/StudentAttendanceShow" element={<StudentAttendanceShow />} />
              <Route path="/facultyAttendanceSave" element={<FacultyAttendanceSave />} />
              <Route path="/FacultyAttendanceShow" element={<FacultyAttendanceShow />} />
              <Route path="/facultyAttendanceEdit" element={<FacultyAttendanceEdit />} />
              <Route path="/facultyAttendanceEditSave" element={<FacultyAttendanceEditSave />} />
              <Route path="/studentAttendanceEdit" element={<StudentAttendanceEdit />} />
              <Route path="/studentAttendanceEditSave" element={<StudentAttendanceEditSave />} />
              <Route path="/fees" element={<FeesController />} />
              <Route path="/holiday" element={<HolidayFormController />} />
              <Route path="/FacultySalary" element={<FacultySalaryController />} />
              <Route path="/FacultySalaryDetails" element={<FacultySalaryDetails />} />
              <Route path='/permission' element={<Permission/>}/>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<MasterController />} />
          </Routes>
          <FooterController />
        </div>
      </div>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
