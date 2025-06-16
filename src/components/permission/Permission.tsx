import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/Utils/apiUtils";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../loader/loader";

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
    bulkupload:boolean
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
      bulkupload:false
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
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    const fetchFaculty = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        console.log("token",token);
        const response = await axiosInstance.get("/faculty/findAllFaculty", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((faculty: any) => ({
          id: faculty.fact_id,
          name: faculty.fact_Name,
          email: faculty.email,
        }));
        setFacultyData(data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("Failed to fetch faculty data");
      }
      setIsLoading(false);
    };

    fetchFaculty();
  }, []);

  const handleEmailChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = event.target.value;
    const faculty = facultyData.find((f) => f.email === selectedEmail);

    if (faculty) {
      setSelectedFaculty(faculty);
      setIsLoading(true);

      try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get("/permissions/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const selectedFacultyPermissions = response.data.find(
          (item: any) => item.email === faculty.email || item.permission.facultyId === faculty.id
        );

        if (selectedFacultyPermissions) {
          setPermissions(selectedFacultyPermissions.permission.permissions);
        } else {
          setPermissions({
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
              bulkupload:false
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
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast.error("Failed to fetch permissions");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSelectedFaculty(null);
      setPermissions({
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
          bulkupload:false
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
      setIsLoading(false);
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

  try {
    const token = localStorage.getItem("authToken");

    // Get role from localStorage
    const userDetailsStr = localStorage.getItem("userDetails");
    const userDetails = userDetailsStr ? JSON.parse(userDetailsStr) : null;
    const role = userDetails?.role;
    console.log("Role:", role);


    // Determine user type for query param
    let userType = "";
    if (role === "admin") {
      userType = "school";
    } else if (role === "user") {
      userType = "faculty";
    }

    const payload = {
      facultyId: selectedFaculty.id,
      email: selectedFaculty.email,
      permissions,
    };

    await axiosInstance.post(`/permissions/save?user=${userType}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Permissions updated successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Error updating permissions");
  }
};


  return (
    <div className="container mt-5">
      {isLoading ? (
        <div><Loader/></div>
      ) : (
        <div>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="head1">Manage Faculty Permission</h1>
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

            {isLoading ? (
              <div className="text-center">
                <div role="status">
                  <span><Loader /></span>
                </div>
              </div>
            ) : (
              selectedFaculty && (
                <>
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

                  {Object.entries(permissions).map(([section, permissionsObj]) => (
                    <div className="card shadow-sm mb-4" key={section}>
                      <div className="card-header bg-[#3a8686] text-white">
                        <h5>{section.charAt(0).toUpperCase() + section.slice(1)} Permissions</h5>
                      </div>
                      <div className="card-body">
                        {Object.entries(permissionsObj).map(([key, value]) => (
                          <div className="form-check mb-2" key={key}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={value}
                              onChange={() => handlePermissionChange(section, key)}
                              id={`${section}-${key}`}
                            />
                            <label className="form-check-label" htmlFor={`${section}-${key}`}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleSubmit}
                    className="btn button btn-lg"
                    disabled={!selectedFaculty}
                  >
                    Save Permissions
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}