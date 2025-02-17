import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";

interface Faculty {
  id: string;
  name: string;
  email: string;
}

interface Permissions {
  student: {
    studentAttendanceEdit: boolean;
    studentAttendenceManagement: boolean;
    studentFees: boolean;
    studentAttendanceEditSave: boolean;
    studentRegistrationController: boolean;
    studentAttendanceShow: boolean;
    studentFeesController: boolean;
    studentFeesForm: boolean;
    studentFeesDetails: boolean;
    studentReportForm: boolean;
    studentReport: boolean;
    studentDetails: boolean;
  };
  faculty: {
    facultySalaryDetails: boolean;
    facultySalaryController: boolean;
    facultyAttendanceEditSave: boolean;
    facultyAttendanceEdit: boolean;
    facultyAttendanceShow: boolean;
    facultyAttendanceSave: boolean;
    facultyRegistrationForm: boolean;
    facultyDetails: boolean;
  };
  finance: {
    adminFees: boolean;
    feesController: boolean;
    permission: boolean;
  };
  notification: {
    createNotification: boolean;
    notificationList: boolean;
    holidayFormController: boolean;
    notificationController: boolean;
  };
  subject: {
    saveSubjectsToClasses: boolean;
    classSubjectShow: boolean;
  };
}

export default function Permission() {
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    student: {
      studentAttendanceEdit: false,
      studentAttendenceManagement: false,
      studentFees: false,
      studentAttendanceEditSave: false,
      studentRegistrationController: false,
      studentAttendanceShow: false,
      studentFeesController: false,
      studentFeesForm: false,
      studentFeesDetails: false,
      studentReportForm: false,
      studentReport: false,
      studentDetails: false,
    },
    faculty: {
      facultySalaryDetails: false,
      facultySalaryController: false,
      facultyAttendanceEditSave: false,
      facultyAttendanceEdit: false,
      facultyAttendanceShow: false,
      facultyAttendanceSave: false,
      facultyRegistrationForm: false,
      facultyDetails: false,
    },
    finance: {
      adminFees: false,
      feesController: false,
      permission: false,
    },
    notification: {
      createNotification: false,
      notificationList: false,
      holidayFormController: false,
      notificationController: false,
    },
    subject: {
      saveSubjectsToClasses: false,
      classSubjectShow: false,
    },
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get("/faculty/findAllFaculty", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((faculty: any) => ({
          id: faculty.fact_id,
          name: faculty.fact_Name,
          email: faculty.fact_email,
        }));
        setFacultyData(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("Failed to fetch faculty data");
      }
    };

    fetchFaculty();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = event.target.value;
    const faculty = facultyData.find((f) => f.email === selectedEmail);
    if (faculty) {
      setSelectedFaculty(faculty);
    } else {
      setSelectedFaculty(null);
    }
  };

  const handlePermissionChange = (section: string, key: string) => {
    setPermissions((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section as keyof Permissions],
        [key]: !prevState[section as keyof Permissions][key],
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFaculty) {
      toast.warning("Please select a faculty member.");
      return;
    }

    const isAnyPermissionSelected = Object.values(permissions).some((section) =>
      Object.values(section).some((value) => value === true)
    );

    if (!isAnyPermissionSelected) {
      toast.warning("Please select at least one permission.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        facultyId: selectedFaculty.id,
        email: selectedFaculty.email,
        permissions,
      };
      await axiosInstance.post("/permissions/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Permissions updated successfully!");
    } catch (error) {
      toast.error("Error updating permissions");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center space-x-4 mb-4">
        <h1 className="text-xl items-center font-bold text-[#27727A]">Manage Faculty Permission</h1>
      </div>

      <div
        style={{
          height: "600px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <div className="mb-4">
          <label htmlFor="emailDropdown" className="form-label">
            <strong>Select Faculty Email:</strong>
          </label>
          <select
            id="emailDropdown"
            className="form-select"
            value={selectedFaculty?.email || ""}
            onChange={handleEmailChange}
          >
            <option value="" disabled>
              -- Select Email --
            </option>
            {facultyData.map((faculty, index) => (
              <option key={index} value={faculty.email}>
                {faculty.email}
              </option>
            ))}
          </select>
        </div>

        {selectedFaculty && (
          <div className="mb-4">
            <label htmlFor="facultyName" className="form-label">
              <strong>Selected Faculty Name:</strong>
            </label>
            <input
              id="facultyName"
              className="form-control"
              type="text"
              value={selectedFaculty.name}
              disabled
            />
          </div>
        )}

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-[#3a8686] text-white">
            <h5>Student Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.student).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.student as any)[key]}
                  onChange={() => handlePermissionChange("student", key)}
                  id={`student-${key}`}
                />
                <label className="form-check-label" htmlFor={`student-${key}`}>
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header text-white bg-[#3a8686]">
            <h5>Faculty Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.faculty).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.faculty as any)[key]}
                  onChange={() => handlePermissionChange("faculty", key)}
                  id={`faculty-${key}`}
                />
                <label className="form-check-label" htmlFor={`faculty-${key}`}>
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-[#3a8686] text-white">
            <h5>Finance Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.finance).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.finance as any)[key]}
                  onChange={() => handlePermissionChange("finance", key)}
                  id={`finance-${key}`}
                />
                <label className="form-check-label" htmlFor={`finance-${key}`}>
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-[#3a8686] text-white">
            <h5>Notification Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.notification).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.notification as any)[key]}
                  onChange={() => handlePermissionChange("notification", key)}
                  id={`notification-${key}`}
                />
                <label className="form-check-label" htmlFor={`notification-${key}`}>
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-[#3a8686] text-white">
            <h5>Subject Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.subject).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.subject as any)[key]}
                  onChange={() => handlePermissionChange("subject", key)}
                  id={`subject-${key}`}
                />
                <label className="form-check-label" htmlFor={`subject-${key}`}>
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="btn button btn-lg"
          disabled={!selectedFaculty}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
}