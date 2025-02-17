import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { useAuth } from './context/authContext';
import { AuthProvider } from './context/authContext';

import './App.css';
import './index.css';
import ProtectedRoute from './Pages/Login/ProtectedRoute';
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
import StudentFeesController from './components/fess/studentFees/studentFeesController';
import StudentFeesForm from './components/fess/studentFees/studentFeesForm';
import StudentFeesDetails from './components/fess/studentFees/studentFeesDetails';
import StudenAttendance from './components/StudentAttendence/studentAttendance';
import NotificationController from './components/Notification/notificationController';
import ClassSubjectShow from './components/saveSubjectsToClasess/ClassSubjectsShow';
import Permission from './components/permission/Permission';
import TableComponent from './components/StudentAttendence/studentAttendance';
import StudentReportForm from './components/studentReport/studentReportForm';
import StudentReport from './components/studentReport/studentReportView';
import Loader from './components/loader/loader';
import StudentDetails from './components/studentDeytails/StudentDetails';
import FacultyDetails from './components/facultyDetails/Facultydetails'
import SchoolsDetails from './components/SuperAdmin/SchoolsDetails';

import SuperAdminController from './components/SuperAdmin/SuperAdminController';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className="mainBody">
          <SideBarController />
          <div className="rhsBox">
            <HeaderController />
            <Routes>
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/main" element={<MasterController />} />
                <Route path="/StudentAttendenceManagement" element={<StudentAttendenceManagement />} />
                <Route path="/SaveSubjectsToClasses" element={<SaveSubjectsToClasses />} />
                <Route path="/FacultyRegistration" element={<FacultyRegistrationForm />} />
                <Route path="/StudentRegistrationController" element={<StudentRegistrationController />} />
                <Route path="/SuperAdminController" element={<SuperAdminController />} />
                <Route path="/StudentAttendanceShow" element={<StudentAttendanceShow />} />
                <Route path="/facultyAttendanceSave" element={<FacultyAttendanceSave />} />
                <Route path="/FacultyAttendanceShow" element={<FacultyAttendanceShow />} />
                <Route path="/facultyAttendanceEdit" element={<FacultyAttendanceEdit />} />
                <Route path="/facultyAttendanceEditSave" element={<FacultyAttendanceEditSave />} />
                <Route path="/studentAttendanceEdit" element={<StudentAttendanceEdit />} />
                <Route path="/FacultySalary" element={<FacultySalaryController />} />
                <Route path="/studentAttendanceEditSave" element={<StudentAttendanceEditSave />} />
                <Route path="/fees" element={<FeesController />} />
                <Route path="/holiday" element={<HolidayFormController />} />
                <Route path="/FacultySalaryDetails/:id" element={<FacultySalaryDetails />} />
                <Route path="/StudentFeesController" element={<StudentFeesController />} />
                <Route path="/StudentFeesForm" element={<StudentFeesForm />} />
                <Route path="/StudentFeesDetails/:id" element={<StudentFeesDetails />} />
                <Route path="/StudenAttendance" element={<StudenAttendance />} />
                <Route path="/Notification" element={<NotificationController />} />
                <Route path="/ClassSubjectShow" element={<ClassSubjectShow />} />
                <Route path="/Permission" element={<Permission />} />
                <Route path="/attendance" element={<TableComponent />} />
                <Route path="/StudentReportForm" element={<StudentReportForm />} />
                <Route path="/StudentReport/:id" element={<StudentReport />} />
                <Route path="/StudentDetails/:id" element={<StudentDetails />} />
                <Route path="/FacultyDetails/:id" element={<FacultyDetails />} />
                <Route path="/SchoolsDetails/:id" element={<SchoolsDetails />} />
                
                <Route path="/loader" element={<Loader />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<MasterController />} />
            </Routes>
            <FooterController />
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

// Rendering App
createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);