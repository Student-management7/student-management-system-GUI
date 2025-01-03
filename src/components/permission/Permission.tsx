import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Utils/apiUtils";

export default function Permission() {
  const [facultyData, setFacultyData] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [permissions, setPermissions] = useState({
    Student: {
      studentAttendance: false,
      StudentAttendanceEdit: false,
      StudentAttendenceManagement:false,
      StudentFees: false,
      StudentAttendanceEditSave: false,
      StudentRegistrationController:false,
      StudentAttendanceShow:false
    },
    faculty: {
     
      FacultySalaryDetails:false,
      FacultySalaryController:false,
      FacultyAttendanceEditSave:false,
      FacultyAttendanceEdit :false,
      FacultyAttendanceShow:false,
      FacultyAttendanceSave:false,
      FacultyRegistrationForm:false,
      
    },
    finance: {
      adminFees: false 
    },
    Notification:{
      CreateNotification:false,
      NotificationList:false,
      HolidayFormController:false,
    },
    Subject:{
      SaveSubjectsToClasses:false,
    }
  });

  // Fetch faculty data from the API
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
      }
    };

    fetchFaculty();
  }, []);

  // Handle email selection
  const handleEmailChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = event.target.value;
    const faculty = facultyData.find((f) => f.email === selectedEmail);
    if (faculty) {
      setSelectedFaculty(faculty);
    } else {
      setSelectedFaculty(null);
    }
  };

  // Handle permission change
  const handlePermissionChange = (section: string, key: string) => {
    setPermissions((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: !prevState[section][key],
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty member.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        facultyId: selectedFaculty.id,
        email: selectedFaculty.email,
        permissions,
      };
      console.log("Submitting permissions:", payload);
      await axiosInstance.post("/permissions/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">Manage Faculty Permissions</h2>

      {/* Scrollable Form Container */}
      <div
        style={{
          height: "600px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {/* Email Selection */}
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

        {/* Display Selected Faculty Name */}
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

        {/* Permissions Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-secondary text-white">
            <h5>Student Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.Student).map((key) => (
              <div className="form-check mb-2" key={key}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(permissions.Student as any)[key]}
                  onChange={() => handlePermissionChange("Student", key)}
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
          <div className="card-header bg-secondary text-white">
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
          <div className="card-header bg-secondary text-white">
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
          <div className="card-header bg-secondary text-white">
            <h5>Notification Permissions</h5>
          </div>
          <div className="card-body">
            {Object.keys(permissions.Notification).map((key) => (
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
          <div className="card-header bg-secondary text-white">
            <h5>Subject  Permissions</h5  >
          </div>
          <div className="card-body">
            {Object.keys(permissions.Subject).map((key) => (
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="btn btn-success btn-lg"
          disabled={!selectedFaculty}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
}
