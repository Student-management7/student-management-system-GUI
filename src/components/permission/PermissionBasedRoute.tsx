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
import axiosInstance from "../../services/Utils/apiUtils";
import NotificationController from "../Notification/notificationController";
import ClassSubjectShow from "../saveSubjectsToClasess/ClassSubjectsShow";
import StudentReportForm from "../studentReport/studentReportForm";
import StudentReport from '../studentReport/studentReportView';
import StudentFeesController from "../fess/studentFees/studentFeesController";
import Permission from "./Permission";
import AccessDenied from "./AccessDenied";
import StudentDetails from "../studentDetails/StudentDetails";
import Facultydetails from "../facultyDetails/Facultydetails";
import path from "path";
import StudentFeesDetails from "../fess/studentFees/studentFeesDetails";
import Admindeshboard from '../../components/SuperAdmin/AdminDeshboard'

import UserPassword from "../../Pages/setting/UserPassord";
import Profile from "../../Pages/profile/Profile";
// import Landing from "../../Pages/lan/Landing";
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
    const fetchPermissions = async () => {
      try {

        const response = await axiosInstance.get("/self");
        const data = response.data;
        console.log("Fetched Permissions:", data);

        if (!data.permission || !data.permission.permissions) {
          console.error("Permissions data is missing.");
          setPermissions(null);
          setLoading(false);
          return;
        }


        const role = data.role;


        const permissions = data.permission.permissions;


        setPermissions(permissions);
        setRole(role); 
      } catch (error) {
        console.error("Error fetching permissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!permissions) return <div>Access Denied: Permissions missing.</div>;
  console.log(permissions);

 
const allRoutes = [
  { path: "/main", element: <MasterController />, visible:role === "user" || (role === "sub-user") }, 
  { path: "/studentAttendenceManagement", element: <StudentAttendenceManagement />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentAttendenceManagement) },
  { path: "/studentAttendanceShow", element: <StudentAttendanceShow />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentAttendanceShow) },
  { path: "/studentAttendanceEdit", element: <StudentAttendanceEdit />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentAttendanceEdit) },
  { path: "/studentAttendanceEditSave", element: <StudentAttendanceEditSave />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentAttendanceEditSave) },
  { path: "/studentRegistrationController", element: <StudentRegistrationController />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentRegistrationController) },
  { path: "/fees", element: <FeesController />, visible: role === "user" || (role === "sub-user" && permissions?.finance?.adminFees) },
  { path: "/facultySalary", element: <FacultySalaryController />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultySalaryController) },
  { path: "/facultyAttendanceEditSave", element: <FacultyAttendanceEditSave />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyAttendanceEditSave) },
  { path: "/facultyRegistration", element: <FacultyRegistrationForm />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyRegistrationForm) },
  { path: "/facultyAttendanceEdit", element: <FacultyAttendanceEdit />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyAttendanceEdit) },
  { path: "/facultyAttendanceShow", element: <FacultyAttendanceShow />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyAttendanceShow) },
  { path: "/facultyAttendanceSave", element: <FacultyAttendanceSave />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyAttendanceSave) },
  { path: "/facultySalaryDetails", element: <FacultySalaryDetails />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultySalaryDetails) },
  { path: "/saveSubjectsToClasses", element: <SaveSubjectsToClasses />, visible: role === "user" || (role === "sub-user" && permissions?.subject?.saveSubjectsToClasses) },
  { path: "/viewNotification", element: <NotificationList />, visible: role === "user" || (role === "sub-user" && permissions?.notification?.notificationList) },
  { path: "/createNotification", element: <CreateNotification />, visible: role === "user" || (role === "sub-user" && permissions?.notification?.createNotification) },
  { path: "/holiday", element: <HolidayFormController />, visible: role === "user" || (role === "sub-user" && permissions?.notification?.holidayFormController) },
  {path : "/studentReport/:id", element: <StudentReport />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentReport) },
  { path: "/studentDetails/:id", element: <StudentDetails />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentDetails) },
  {path : "/facultyDetails/:id", element: <Facultydetails />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultyDetails) },
  
  
  {path : "/studentFeesDetails/:id", element: <StudentFeesDetails />, visible: role === "user" || (role === "sub-user" && permissions?.student?.studentFeesDetails) },
  {path : "/FacultySalaryDetails/:id", element: <FacultySalaryDetails />, visible: role === "user" || (role === "sub-user" && permissions?.faculty?.facultySalaryDetails) },

  { 
    path: "/ClassSubjectShow", 
    element: <ClassSubjectShow />, 
    visible: role === "user" || (role === "sub-user" && permissions?.subject?.classSubjectShow) 
  },
  { 
    path: "/notification", 
    element: <NotificationController />, 
    visible: role === "user" || (role === "sub-user" && permissions?.notification?.notificationController) 
  },
  { 
    path: "/studentReportForm", 
    element: <StudentReportForm />, 
    visible: role === "user" || (role === "sub-user" && permissions?.student?.studentReportForm) 
  },
  { 
    path: "/studentFeesController", 
    element: <StudentFeesController />, 
    visible: role === "user" || (role === "sub-user" && permissions?.student?.studentFeesController) 
  },
 
  // Only visible for admin
  { path: "/permission", element: <Permission />, visible: role === "user" }, // Only visible for admin
  { path: "/superAdminController", element: <SuperAdminController />, visible: role === "admin" }, // Only visible for admin
  { path: "/schoolsDetails/:id", element: <SchoolsDetails />, visible: role === "admin" }, // Only visible for admin
  { path: "/setting", element: <UserPassword />, visible: true }, 
  { path: "/profile", element: <Profile />, visible: true }, 
  { path: "/admindeshboard", element: <Admindeshboard showRevenueChart={false} showExpiringPlansChart={false} showUpcomingExpirations={false} updateDashboardLayout={function (layout: Partial<{ showRevenueChart: boolean; showExpiringPlansChart: boolean; showUpcomingExpirations: boolean; }>): void {
    throw new Error("Function not implemented.");
  } } />, visible: true }, 

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