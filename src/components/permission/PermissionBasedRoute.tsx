import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import FacultySalaryController from "../salary/facultySalary/facultySalaryController";
import FeesController from "../fess/addFeesByAdmin/feesController";
import StudentAttendanceEdit from "../StudenAttendanceShow/studentAttendanceEdit";
import MasterController from "../main/MasterController";
import FacultySalaryDetails from "../salary/facultySalary/facultySalaryDetails";
import StudentAttendenceManagement from "../StudentAttendence/StudentAttendenceManagement";
import StudentAttendanceEditSave from "../StudenAttendanceShow/studentAttendanceEditSave";
import StudentRegistrationController from "../studentRegistration/StudentRegistrationController";
import NotificationList from "../Notification/notificationList";
import FacultyRegistrationForm from "../FacultyRegistration/FacultyRegistrationController";
import FacultyAttendanceSave from "../facultyAttendanceSave/facultyAttendanceSave";
import StudentAttendanceShow from "../StudenAttendanceShow/StudentAttendanceShow";
import CreateNotification from "../Notification/CreateNotification";
import HolidayFormController from "../Holidays/holidayFormController";
import FacultyAttendanceEditSave from "../facultyAttendanceEdit/facultyAttendanceEditSave";
import FacultyAttendanceEdit from "../facultyAttendanceEdit/facultyAttendanceEdit";
import FacultyAttendanceShow from "../facultyAttendanceView/FacultyAttendanceShow";
import SaveSubjectsToClasses from "../saveSubjectsToClasess/saveSubjectsToClasess";
import SuperAdminController from "../SuperAdmin/SuperAdminController";
import SchoolsDetails from "../SuperAdmin/SchoolsDetails";
import NotificationController from "../Notification/notificationController";
import ClassSubjectShow from "../saveSubjectsToClasess/ClassSubjectsShow";
import StudentReportForm from "../studentReport/studentReportForm";
import StudentReport from '../studentReport/studentReportView';
import StudentFeesController from "../fess/studentFees/studentFeesController";
import Permission from "./Permission";
import AccessDenied from "./AccessDenied";
import StudentDetails from "../studentDetails/StudentDetails";
import Facultydetails from "../facultyDetails/Facultydetails";
import StudentFeesDetails from "../fess/studentFees/studentFeesDetails";
import Admindeshboard from '../../components/SuperAdmin/AdminDeshboard'
import BulkUpload from '../studentRegistration/BulkUplod'

import UserPassword from "../../Pages/setting/UserPassord";
import Profile from "../../Pages/profile/Profile";
import Loader from "../loader/loader";
import SchoolPermission from "../SuperAdmin/SchoolPermission";
import  SyllabusList  from "../syllabus/SyllabusList";
import UploadSyllabus from "../syllabus/UploadSyllabus";
import EditSyllabus from "../syllabus/EditSyllabus";
import TransferCertificate from "../tc/TransferCertificate";
import FeesManagement from "../fess/studentFees/FeesManagement";
import Marksheet from "../tc/Marksheet";


interface Permission {
  [module: string]: {
    [route: string]: boolean;
  };
}

const PermissionBasedRoute: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [role, setRole] = useState<string>(""); // State to store the role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");

    if (userDetails) {
      const user = JSON.parse(userDetails);

      const role = user.role;
      const permissions = user.permission.permissions;

      setPermissions(permissions);
      setRole(role);
    } else {
      console.error("User details not found in local storage.");
    }

    setLoading(false);
  }, []);

  if (loading) return <div><Loader /></div>;
  if (!permissions) return <div>Access Denied: Permissions missing.</div>;

  const allRoutes = [
    { 
      path: "/main", 
      element: <MasterController />, 
      visible: (role === "user" || role === "sub-user") 
    }, 
    { 
      path: "/studentAttendenceManagement", 
      element: <StudentAttendenceManagement />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentAttendenceManagement 
    },
    { 
      path: "/studentAttendanceShow", 
      element: <StudentAttendanceShow />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentAttendanceShow 
    },
    { 
      path: "/studentAttendanceEdit", 
      element: <StudentAttendanceEdit />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentAttendanceEdit 
    },
    { 
      path: "/studentAttendanceEditSave", 
      element: <StudentAttendanceEditSave />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentAttendanceEditSave 
    },
    { 
      path: "/studentRegistrationController", 
      element: <StudentRegistrationController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentRegistrationController 
    },
    { 
      path: "/fees", 
      element: <FeesController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.finance?.adminFees 
    },
    { 
      path: "/facultySalary", 
      element: <FacultySalaryController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultySalaryController 
    },
    { 
      path: "/facultyAttendanceEditSave", 
      element: <FacultyAttendanceEditSave />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyAttendanceEditSave 
    },
    { 
      path: "/facultyRegistration", 
      element: <FacultyRegistrationForm />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyRegistrationForm 
    },
    { 
      path: "/facultyAttendanceEdit", 
      element: <FacultyAttendanceEdit />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyAttendanceEdit 
    },
    { 
      path: "/facultyAttendanceShow", 
      element: <FacultyAttendanceShow />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyAttendanceShow 
    },
    { 
      path: "/facultyAttendanceSave", 
      element: <FacultyAttendanceSave />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyAttendanceSave 
    },
    { 
      path: "/facultySalaryDetails", 
      element: <FacultySalaryDetails />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultySalaryDetails 
    },
    { 
      path: "/saveSubjectsToClasses", 
      element: <SaveSubjectsToClasses />, 
      visible: (role === "user" || role === "sub-user") && permissions?.subject?.saveSubjectsToClasses 
    },
    { 
      path: "/viewNotification", 
      element: <NotificationList />, 
      visible: (role === "user" || role === "sub-user") && permissions?.notification?.notificationList 
    },
    { 
      path: "/createNotification", 
      element: <CreateNotification />, 
      visible: (role === "user" || role === "sub-user") && permissions?.notification?.createNotification 
    },
    { 
      path: "/holiday", 
      element: <HolidayFormController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.notification?.holidayFormController 
    },
    { 
      path: "/studentReport/:id", 
      element: <StudentReport />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentReport 
    },
    { 
      path: "/studentDetails/:id", 
      element: <StudentDetails />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentDetails 
    },
    { 
      path: "/facultyDetails/:id", 
      element: <Facultydetails />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultyDetails 
    },
    { 
      path: "/studentFeesDetails/:id", 
      element: <StudentFeesDetails />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentFeesDetails 
    },
    { 
      path: "/FacultySalaryDetails/:id", 
      element: <FacultySalaryDetails />, 
      visible: (role === "user" || role === "sub-user") && permissions?.faculty?.facultySalaryDetails 
    },
    { 
      path: "/bulkUpload", 
      element: <BulkUpload />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.bulkUpload 
    },
    { 
      path: "/ClassSubjectShow", 
      element: <ClassSubjectShow />, 
      visible: (role === "user" || role === "sub-user") && permissions?.subject?.classSubjectShow 
    },
    { 
      path: "/notification", 
      element: <NotificationController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.notification?.notificationController 
    },
    { 
      path: "/studentReportForm", 
      element: <StudentReportForm />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentReportForm 
    },
    { 
      path: "/studentFeesController", 
      element: <StudentFeesController />, 
      visible: (role === "user" || role === "sub-user") && permissions?.student?.studentFeesController 
    },
    // Admin-only routes
    { 
      path: "/permission", 
      element: <Permission />, 
      visible:  (role === "user" || role === "sub-user") && permissions?.finance?.permission
    }, 
    { 
      path: "/superAdminController", 
      element: <SuperAdminController />, 
      visible: role === "admin" 
    },
    { 
      path: "/schoolpermission", 
      element: <SchoolPermission />, 
      visible: role === "admin" 
    },
    { 
      path: "/schoolsDetails/:id", 
      element: <SchoolsDetails />, 
      visible: role === "admin" 
    },
    // Always visible routes
    { 
      path: "/setting", 
      element: <UserPassword />, 
      visible: true 
    }, 
    { 
      path: "/profile", 
      element: <Profile />, 
      visible: true 
    }, 
    { 
      path: "/admindeshboard", 
      element: <Admindeshboard />, 
      visible: true 
    },
    { 
      path: "/syllabus", 
      element: <SyllabusList />, 
      visible: true 
    },
    { 
      path: "/UploadSyllabus", 
      element: <UploadSyllabus />, 
      visible: true 
    },
    
    { 
      path: "/syllabus/edit/:id", 
      element: <EditSyllabus />, 
      visible: true 
    },
    { 
      path: "/tc", 
      element: <TransferCertificate />, 
      visible: true 
    },
    {
      path: "/FeesManagement", 
      element: <FeesManagement />, 
      visible: true 
    },
    {
      path: "/marksheet", 
      element: <Marksheet />, 
      visible: true 
    },

    

  ];

  const finalRoutes = allRoutes.filter(({ visible }) => visible);

  return (
    <Routes>
      {finalRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      
      <Route path="*" element={<Navigate to="/AccessDenied" />} />
      <Route path="/AccessDenied" element={<AccessDenied />} />
    </Routes>
  );
};

export default PermissionBasedRoute;
