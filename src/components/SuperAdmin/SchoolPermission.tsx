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
    bulkupload: boolean;
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
    // feesmanagement: boolean;
    feesManagement:false,
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
  syllabus: {
    syllabusList: boolean;
    uploadSyllabus: boolean;
    editSyllabus: boolean;
  };
  tc: {
    transferCertificate: boolean;
    marksheet: boolean;
  };
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
      bulkupload: false,
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
      // feesmanagement: false,
    
     feesManagement:false,
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
      syllabusList: false,
      uploadSyllabus: false,
      editSyllabus: false,
    },
    tc: {
      transferCertificate: false,
      marksheet: false,
    }
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
          // Merge with initial state to ensure all sections exist
          const mergedPermissions = {
            ...permissions,
            ...response.data.permissions
          };
          setPermissions(mergedPermissions);
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

  const isAllChecked = (section: keyof Permissions) => {
    return Object.values(permissions[section]).every(val => val);
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

  const renderPermissionSection = (section: keyof Permissions, title: string) => {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium">{title}</h4>
          <button
            onClick={() => toggleAllSectionPermissions(section, !isAllChecked(section))}
            className="text-sm text-[#126666] hover:text-[#7debeb]"
          >
            {isAllChecked(section) ? 'Uncheck All' : 'Check All'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(permissions[section]).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={() => handlePermissionChange(section, key)}
                className="h-4 w-4 text-[#126666] focus:ring-[#126666] border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {key.split(/(?=[A-Z])/).join(' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">School User Permission Management</h1>
          
          {/* School Selection */}
          <div className="mb-6">
            <label htmlFor="schoolSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select School/User:
            </label>
            <select
              id="schoolSelect"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#126666] focus:border-[#126666]"
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
                <h3 className="text-xl font-semibold mb-4">User Permissions</h3>
                
                {renderPermissionSection('student', 'Student Management')}
                {renderPermissionSection('faculty', 'Faculty Management')}
                {renderPermissionSection('finance', 'Finance Management')}
                {renderPermissionSection('notification', 'Notification Management')}
                {renderPermissionSection('subject', 'Subject Management')}
                {renderPermissionSection('syllabus', 'Syllabus Management')}
                {renderPermissionSection('tc', 'Transfer Certificate & Marksheet')}

                {/* Save Button */}
                <div className="mt-6">
                  <button
                    onClick={savePermissions}
                    disabled={isSaving}
                    className="btn button text-white font-medium py-2 px-6  disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Permissions'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}