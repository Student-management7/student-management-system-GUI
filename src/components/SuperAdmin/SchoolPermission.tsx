import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/Utils/apiUtils';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../loader/loader';

interface School {
  id: string;
  schoolName: string;
  email: string;
  schoolCode: string;
  status: string;
}

interface Permissions {
  student: {
    studentAttendanceEdit: boolean;
    studentAttendenceManagement: boolean;
    studentAttendanceEditSave: boolean;
    studentRegistrationController: boolean;
    studentAttendanceShow: boolean;
    studentFeesController: boolean;
    studentFeesDetails: boolean;
    studentReportForm: boolean;
    studentReport: boolean;
    studentDetails: boolean;
    bulkupload:boolean;
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
  }, 
  syllabus: {
    SyllabusList: false,
    UploadSyllabus: false,
    EditSyllabus: false,
  },
}

export default function SchoolUserPermission() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    student: {
      studentAttendanceEdit: false,
      studentAttendenceManagement: false,
      studentAttendanceEditSave: false,
      studentRegistrationController: false,
      studentAttendanceShow: false,
      studentFeesController: false,
      studentFeesDetails: false,
      studentReportForm: false,
      studentReport: false,
      studentDetails: false,
      bulkupload:false,
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
     syllabus: {
    SyllabusList: false,
    UploadSyllabus: false,
    EditSyllabus: false,
  },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch school data
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/school/get');
        setSchools(response.data);
      } catch (error) {
        toast.error('Failed to fetch school data');
        console.error('Error fetching schools:', error);
      }
      setIsLoading(false);
    };

    fetchSchools();
  }, []);

  // Load permissions when school is selected
  useEffect(() => {
    const loadPermissions = async () => {
      if (!selectedSchool) return;
      
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/permissions?email=${selectedSchool.email}`);
        if (response.data.permissions) {
          setPermissions(response.data.permissions);
        }
      } catch (error) {
        toast.error('Failed to load permissions');
        console.error('Error loading permissions:', error);
      }
      setIsLoading(false);
    };

    loadPermissions();
  }, [selectedSchool]);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const school = schools.find(s => s.id === selectedId);
    setSelectedSchool(school || null);
  };

  const handlePermissionChange = (category: keyof Permissions, permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission]
      }
    }));
  };

  const toggleAllSectionPermissions = (section: keyof Permissions, value: boolean) => {
    setPermissions(prev => {
      const newSection = Object.keys(prev[section]).reduce((acc, key) => {
        return { ...acc, [key]: value };
      }, {} as any);
      
      return {
        ...prev,
        [section]: newSection
      };
    });
  };

  const savePermissions = async () => {
    if (!selectedSchool) return;

    setIsSaving(true);
    try {
      await axiosInstance.post('/permissions/save?user=school', {
        email: selectedSchool.email,
        schoolId: selectedSchool.id,
        permissions
      });
      toast.success('Permissions saved successfully!');
    } catch (error) {
      toast.error('Failed to save permissions');
      console.error('Error saving permissions:', error);
    }
    setIsSaving(false);
  };

  const isAllChecked = (section: keyof Permissions) => {
    return Object.values(permissions[section]).every(val => val);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="head1">School User Permission Management</h1>
          
          {/* School Selection */}
          <div className="mb-6">
            <label htmlFor="schoolSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select School/User:
            </label>
            <select
              id="schoolSelect"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={handleSchoolChange}
              value={selectedSchool?.id || ''}
            >
              <option value="">-- Select School --</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.schoolName} ({school.email})
                </option>
              ))}
            </select>
          </div>

          {selectedSchool && (
            <>
              {/* School Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-3">{selectedSchool.schoolName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="font-medium">{selectedSchool.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">School Code:</p>
                    <p className="font-medium">{selectedSchool.schoolCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status:</p>
                    <p className={`font-medium ${
                      selectedSchool.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedSchool.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permission Management */}
              <div className="mb-6">
                <h3 className="head1">User Permissions</h3>
                
                {/* Student Permissions */}
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Student Management</h4>
                    <button
                      onClick={() => toggleAllSectionPermissions('student', !isAllChecked('student'))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isAllChecked('student') ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.student).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePermissionChange('student', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Faculty Permissions */}
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Faculty Management</h4>
                    <button
                      onClick={() => toggleAllSectionPermissions('faculty', !isAllChecked('faculty'))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isAllChecked('faculty') ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.faculty).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePermissionChange('faculty', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Finance Permissions */}
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Finance Management</h4>
                    <button
                      onClick={() => toggleAllSectionPermissions('finance', !isAllChecked('finance'))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isAllChecked('finance') ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.finance).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePermissionChange('finance', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notification Permissions */}
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Notification Management</h4>
                    <button
                      onClick={() => toggleAllSectionPermissions('notification', !isAllChecked('notification'))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isAllChecked('notification') ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.notification).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePermissionChange('notification', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subject Permissions */}
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Subject Management</h4>
                    <button
                      onClick={() => toggleAllSectionPermissions('subject', !isAllChecked('subject'))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {isAllChecked('subject') ? 'Uncheck All' : 'Check All'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(permissions.subject).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePermissionChange('subject', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={savePermissions}
                disabled={isSaving}
                className="btn button text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Permissions'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}