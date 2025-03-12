import React, { useState, useEffect } from "react";
import "./StudentDetails.css";
import axiosInstance from "../../services/Utils/apiUtils";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../Navigation/backButton";
import Loader from "../loader/loader";

interface FamilyDetails {
  stdo_FatherName: string;
  stdo_MotherName: string;
  stdo_primaryContact: string;
  stdo_secondaryContact: string;
  stdo_address: string | null;
  stdo_city: string;
  stdo_state: string;
  stdo_email: string;
}

interface Student {
  id: string;
  creationDateTime: string;
  name: string;
  address: string;
  city: string;
  state: string;
  familyDetails: FamilyDetails;
  contact: string;
  gender: string;
  dob: string;
  email: string;
  cls: string;
  department: string;
  category: string;
}

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "family">("personal");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        if (!id) {
          setError("No student ID provided");
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/student/findAllStudent?id=${id}`);
        if (response.data.length > 0) {
          setStudent(response.data[0]);
        } else {
          setError("No student data found for the given ID");
        }
      } catch (err: any) {
        // Check if it's an axios error with response
        if (err.response) {
          // Handle specific error response from server
          const status = err.response.status;
          const errorDetail = err.response.data?.detail || err.response.data?.message;
          
          if (status === 400) {
            setError(`Invalid student ID: ${errorDetail || "Please check the ID and try again"}`);
          } else if (status === 404) {
            setError("Student not found");
          } else {
            setError(`Error (${status}): ${errorDetail || "Failed to fetch student details"}`);
          }
        } else if (err.request) {
          // Request was made but no response received
          setError("Server did not respond. Please check your connection and try again.");
        } else {
          // Other errors
          setError(`An unexpected error occurred: ${err.message || "Please try again later"}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  // Function to handle navigation back
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="error-container p-6 max-w-md mx-auto my-10 bg-white rounded-lg shadow-md text-center">
        <div className="error-icon mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Student Data Not Available</h2>
        <p className="text-gray-600 mb-6">{error || "No student found with the provided ID"}</p>
        <button 
          onClick={handleGoBack}
          className="bg-[#126666] text-white py-2 px-6 rounded-md hover:bg-[#0d5252] transition duration-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  const renderPersonalInfo = () => (
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Admission Date</span>
        <span className="detail-value">{student.creationDateTime}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Date of Birth</span>
        <span className="detail-value">{student.dob}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Gender</span>
        <span className="detail-value">{student.gender}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Email</span>
        <span className="detail-value">{student.email}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Contact</span>
        <span className="detail-value">{student.contact}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Address</span>
        <span className="detail-value">{student.address}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">City</span>
        <span className="detail-value">{student.city}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">State</span>
        <span className="detail-value">{student.state}</span>
      </div>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Class</span>
        <span className="detail-value">{student.cls}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Department</span>
        <span className="detail-value">{student.department}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Category</span>
        <span className="detail-value">{student.category}</span>
      </div>
    </div>
  );

  const renderFamilyInfo = () => (
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Father's Name</span>
        <span className="detail-value">{student.familyDetails.stdo_FatherName}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Mother's Name</span>
        <span className="detail-value">{student.familyDetails.stdo_MotherName}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Primary Contact</span>
        <span className="detail-value">{student.familyDetails.stdo_primaryContact}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Secondary Contact</span>
        <span className="detail-value">{student.familyDetails.stdo_secondaryContact}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Email</span>
        <span className="detail-value">{student.familyDetails.stdo_email}</span>
      </div>
    </div>
  );

  return (
    <div className="box">
      <div className="profile-container">
        <nav className="items flex items-center">
          <span><BackButton /></span>
          <span className="head1 mt-2 ml-2">Student Profile</span>
        </nav>

        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-icon-container">
              <img src="/images/student-icon.png" alt="img" />
            </div>
            <div className="profile-basic-info">
              <h1>{student.name}</h1>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{student.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Class:</span>
                  <span className="value">{student.cls}</span>
                </div>
                <div className="info-item">
                  <span className="label">Roll Number:</span>
                  <span className="value">{student.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-section p-4 bg-white shadow-md rounded-lg">
            <div className="flex space-x-4 border-b pb-2">
              <button
                className={`py-2 px-4 rounded-md transition ${activeTab === "personal" ? "bg-[#126666] text-white" : "bg-gray-200"
                  }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>
              <button
                className={`py-2 px-4 rounded-md transition ${activeTab === "academic" ? "bg-[#126666] text-white" : "bg-gray-200"
                  }`}
                onClick={() => setActiveTab("academic")}
              >
                Academic Details
              </button>
              <button
                className={`py-2 px-4 rounded-md transition ${activeTab === "family" ? "bg-[#126666] text-white" : "bg-gray-200"
                  }`}
                onClick={() => setActiveTab("family")}
              >
                Family Details
              </button>
            </div>
            <div className="mt-4">
              {activeTab === "personal" && renderPersonalInfo()}
              {activeTab === "academic" && renderAcademicInfo()}
              {activeTab === "family" && renderFamilyInfo()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;