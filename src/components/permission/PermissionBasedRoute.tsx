import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import FacultySalaryController from "../salary/facultySalary/facultySalaryController";
import FeesController from "../fess/addFeesByAdmin/feesController";
import StudentAttendanceEdit from "../StudenAttendanceShow/studentAttendanceEdit";
import MasterController from "../main/MasterController";
import FacultySalaryDetails from "../salary/facultySalary/facultySalaryDetails";
import StudentAttendenceManagement from '../StudentAttendence/StudentAttendenceManagement'
import StudentAttendanceEditSave from "../StudenAttendanceShow/studentAttendanceEditSave";
import SaveSubjectsToClasses from "../saveSubjectsToClasess/saveSubjectsToClasess";
import StudentRegistrationController from "../studentRegistration/StudentRegistrationController";
import NotificationList from "../Notification/notificationList";
import FacultyRegistrationForm from "../FacultyRegistration/FacultyRegistrationController";
import FacultyAttendanceSave from "../facultyAttendanceSave/facultyAttendanceSave";
import StudentAttendanceShow from "../StudenAttendanceShow/StudentAttendanceShow";


import CreateNotification from '../Notification/CreateNotification'
import HolidayFormController from '../Holidays/holidayFormController'
import FacultyAttendanceEditSave from '../facultyAttendanceEdit/facultyAttendanceEditSave'
import FacultyAttendanceEdit from '../facultyAttendanceEdit/facultyAttendanceEdit'
import FacultyAttendanceShow from '../facultyAttendanceView/FacultyAttendanceShow'
interface Permission {
  [module: string]: {
    [route: string]: boolean;
  };
}

interface PermissionPayload {
  facultyId: string;
  email: string;
  permissions: Permission;
}

const PermissionBasedRoute: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call to fetch permissions
    const fetchPermissions = async () => {
      try {
        const response = await fetch(""); // Replace with your actual API endpoint
        const data: PermissionPayload = await response.json();
        setPermissions(data.permissions);
      } catch (error) {
        console.error("Error fetching permissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!permissions) return <Navigate to="/Access_denied" />; // Redirect if no permissions

  // Define route visibility based on permissions
  const accessibleRoutes = [
    { path: "/main", element: <MasterController />, visible: true },
    {
      path: "/StudentAttendenceManagement",
      element: < StudentAttendenceManagement/>,
      visible: permissions.Student?.studentAttendance || false,
    },
    {
      path: "/StudentAttendanceShow",
      element: < StudentAttendanceShow/>,
      visible: permissions.Student?.StudentAttendanceShow || false,
    },
    {
      path: "/StudentAttendanceEdit",
      element: <StudentAttendanceEdit />,
      visible: permissions.Student?.StudentAttendanceEdit || false,
    },
    {
      path: "/StudentAttendanceEditSave",
      element: <StudentAttendanceEditSave />,
      visible: permissions.Student?.StudentAttendanceEditSave || false,
    },
    {
      path: "/StudentRegistrationController",
      element: <StudentRegistrationController />,
      visible: permissions.Student?.StudentRegistrationController || false,
    },
    {
      path: "/fees",
      element: <FeesController />,
      visible: permissions.Student?.StudentFees || false,
    },
    {
      path: "/FacultySalary",
      element: <FacultySalaryController />,
      visible: permissions.faculty?.FacultySalaryController || false,
    },
    {
      path: "/facultyAttendanceEditSave",
      element: <FacultyAttendanceEditSave />,
      visible: permissions.faculty?.FacultyAttendanceEditSave || false,
    },
    {
      path: "/FacultyRegistration",
      element: <FacultyRegistrationForm />,
      visible: permissions.faculty?.FacultyRegistrationForm || false,
    },
    {
      path: "/facultyAttendanceEdit",
      element: <FacultyAttendanceEdit />,
      visible: permissions.faculty?.FacultyAttendanceEdit || false,
    },
    {
      path: "/FacultyAttendanceShow",
      element: <FacultyAttendanceShow />,
      visible: permissions.faculty?.FacultyAttendanceShow || false,
    },
    {
      path: "/FacultyAttendanceSave",
      element: <FacultyAttendanceSave />,
      visible: permissions.faculty?.FacultyAttendanceSave|| false,
    },
    {
      path: "/FacultySalaryDetails",
      element: <FacultySalaryDetails />,
      visible: permissions.faculty?.FacultySalaryDetails|| false,
    },
 
  
    {
      path: "/SaveSubjectsToClasses",
      element: <SaveSubjectsToClasses />,
      visible: permissions.Subject?.SaveSubjectsToClasses || false,
    },
    {
      path: "/ViewNotification",
      element: <NotificationList />,
      visible: permissions.Notification?.NotificationList || false,
    },
    {
      path: "/CreateNotification",
      element: <CreateNotification/>,
      visible: permissions.Notification?.CreateNotification || false,
    },
    {
      path: "/holiday",
      element: < HolidayFormController/>,
      visible: permissions.Notification?.HolidayFormController || false,
    },
    // Add more routes here based on the permissions
  ];

  const filteredRoutes = accessibleRoutes.filter((route) => route.visible);

  return (
    <Routes>
      {filteredRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/unauthorized" />} />
    </Routes>
  );
};

export default PermissionBasedRoute;
