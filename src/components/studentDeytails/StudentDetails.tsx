
import type React from "react"
import { useState, useEffect } from "react"
import "./StudentDetails.css"
import axiosInstance from "../../services/Utils/apiUtils"
import { useParams } from "react-router-dom"

// import Image from "../studentDeytails/"

interface FamilyDetails {
    stdo_FatherName: string
    stdo_MotherName: string
    stdo_primaryContact: string
    stdo_secondaryContact: string
    stdo_address: string | null
    stdo_city: string
    stdo_state: string
    stdo_email: string
  }
  
  interface Student {
    id: string
    creationDateTime: string
    name: string
    address: string
    city: string
    state: string
    familyDetails: FamilyDetails
    contact: string
    gender: string
    dob: string
    email: string
    cls: string
    department: string
    category: string
  }
  
  
  const StudentProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();  
    const [activeTab, setActiveTab] = useState<"personal" | "academic" | "family">("personal");
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
   
console.log("studentdetails id ",id)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axiosInstance.get(`/student/findAllStudent?id=${id}`);        setStudent(response.data[0])
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch student details")
        setLoading(false)
      }
    }

    fetchStudentDetails()
  }, [id])

  if (loading) {
    return <div className="loading-state">Loading...</div>
  }

  if (error || !student) {
    return <div className="error-state">{error || "No student data found"}</div>
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
  )

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
  )

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
  )

  return (
    <div className="box">
    <div className="profile-container">
      <nav className="top-nav">
        <div className="nav-brand">Student Profile</div>
        <div className="nav-links">
          <button>Reports</button>
          <button>Delete</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-image-container">
            {/* <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Student Profile"
              width={150}
              height={150}
              className="profile-image"
            /> */}
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
                <span className="label"> Roll Number  :</span>
                <span className="value">{student.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-section">
          <div className="corner-ribbon">Details</div>
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Information
            </button>
            <button
              className={`tab-button ${activeTab === "academic" ? "active" : ""}`}
              onClick={() => setActiveTab("academic")}
            >
              Academic Details
            </button>
            <button
              className={`tab-button ${activeTab === "family" ? "active" : ""}`}
              onClick={() => setActiveTab("family")}
            >
              Family Details
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "personal" && renderPersonalInfo()}
            {activeTab === "academic" && renderAcademicInfo()}
            {activeTab === "family" && renderFamilyInfo()}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default StudentProfile

