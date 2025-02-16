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
    const fetchPermissions = async () => {
      try {
        const response = await fetch("https://s-m-s-keyw.onrender.com/self");
        const data: PermissionPayload = await response.json();
        console.log("Fetched Permissions:", data.permissions);

        if (!data.permissions) {
          console.error("Permissions data is missing.");
          setPermissions(null);
          setLoading(false);
          return;
        }

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
  if (!permissions) return <Navigate to="/Access_denied" />;

  // Define routes with permission-based visibility
  const accessibleRoutes = [
    { path: "/main", element: <MasterController />, visible: true },
    { path: "/studentAttendenceManagement", element: <StudentAttendenceManagement />, visible: permissions?.Student?.StudentAttendenceManagement || false },
    { path: "/studentAttendanceShow", element: <StudentAttendanceShow />, visible: permissions?.Student?.StudentAttendanceShow || false },
    { path: "/studentAttendanceEdit", element: <StudentAttendanceEdit />, visible: permissions?.Student?.StudentAttendanceEdit || false },
    { path: "/studentAttendanceEditSave", element: <StudentAttendanceEditSave />, visible: permissions?.Student?.StudentAttendanceEditSave || false },
    { path: "/studentRegistrationController", element: <StudentRegistrationController />, visible: permissions?.Student?.StudentRegistrationController || false },
    { path: "/fees", element: <FeesController />, visible: permissions?.finance?.adminFees || false },
    { path: "/facultySalary", element: <FacultySalaryController />, visible: permissions?.faculty?.FacultySalaryController || false },
    { path: "/facultyAttendanceEditSave", element: <FacultyAttendanceEditSave />, visible: permissions?.faculty?.FacultyAttendanceEditSave || false },
    { path: "/facultyRegistration", element: <FacultyRegistrationForm />, visible: permissions?.faculty?.FacultyRegistrationForm || false },
    { path: "/facultyAttendanceEdit", element: <FacultyAttendanceEdit />, visible: permissions?.faculty?.FacultyAttendanceEdit || false },
    { path: "/facultyAttendanceShow", element: <FacultyAttendanceShow />, visible: permissions?.faculty?.FacultyAttendanceShow || false },
    { path: "/facultyAttendanceSave", element: <FacultyAttendanceSave />, visible: permissions?.faculty?.FacultyAttendanceSave || false },
    { path: "/facultySalaryDetails", element: <FacultySalaryDetails />, visible: permissions?.faculty?.FacultySalaryDetails || false },
    { path: "/saveSubjectsToClasses", element: <SaveSubjectsToClasses />, visible: permissions?.subject?.SaveSubjectsToClasses || false },
    { path: "/viewNotification", element: <NotificationList />, visible: permissions?.notification?.NotificationList || false },
    { path: "/createNotification", element: <CreateNotification />, visible: permissions?.notification?.CreateNotification || false },
    { path: "/holiday", element: <HolidayFormController />, visible: permissions?.notification?.HolidayFormController || false },
  ];

  // Debugging visible values
  accessibleRoutes.forEach(({ path, visible }) => {
    console.log(`Route: ${path}, Visible: ${visible}`);
  });

  // Filter only accessible routes
  const finalRoutes = accessibleRoutes.filter(({ visible }) => visible);
  console.log("Final Filtered Routes:", finalRoutes);

  return (
    <Routes>
      {finalRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/unauthorized" />} />
    </Routes>
  );
};

export default PermissionBasedRoute;
