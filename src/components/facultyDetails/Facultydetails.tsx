

import type React from "react"
import { useState, useEffect } from "react"
import "./FacultyDetails.css"
import axiosInstance from "../../services/Utils/apiUtils"
import { useParams } from "react-router-dom"


interface FacultySalary {
  id: string
  creationDateTime: string
  schoolCode: string
  facultySalary: number
  facultyTax: number
  facultyTransport: number
  facultyDeduction: string
  total: number
}

interface Faculty {
  fact_id: string
  fact_Name: string
  fact_email: string
  fact_contact: string
  fact_gender: string
  fact_address: string
  fact_city: string
  fact_state: string
  fact_joiningDate: string
  fact_leavingDate: string
  fact_qualification: string | null
  fact_salary: FacultySalary[]
  email: string | null
  password: string | null
  Fact_Status: string | null
  Fact_Cls: string | null
}



const FacultyProfile:  React.FC = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "professional" | "salary">("personal")
  const [faculty, setFaculty] = useState<Faculty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
      const { id } = useParams<{ id: string }>();  
  

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axiosInstance.get(`/faculty/findAllFaculty?id=${id}`)
        // Check if the response data is an array and take the first item
        const facultyData = Array.isArray(response.data) ? response.data[0] : response.data
        setFaculty(facultyData)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch faculty details")
        setLoading(false)
      }
    }

    fetchFacultyData()
  }, [id])

  if (loading) {
    return <div className="loading-state">Loading...</div>
  }

  if (error || !faculty) {
    return <div className="error-state">{error || "No faculty data found"}</div>
  }

  const renderPersonalInfo = () => (
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Name</span>
        <span className="detail-value">{faculty.fact_Name}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Email</span>
        <span className="detail-value">{faculty.fact_email}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Contact</span>
        <span className="detail-value">{faculty.fact_contact}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Gender</span>
        <span className="detail-value">{faculty.fact_gender === "M" ? "Male" : "Female"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Address</span>
        <span className="detail-value">{faculty.fact_address}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">City</span>
        <span className="detail-value">{faculty.fact_city}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">State</span>
        <span className="detail-value">{faculty.fact_state}</span>
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Joining Date</span>
        <span className="detail-value">{faculty.fact_joiningDate}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Leaving Date</span>
        <span className="detail-value">{faculty.fact_leavingDate || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Qualification</span>
        <span className="detail-value">{faculty.fact_qualification || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Status</span>
        <span className="detail-value">{faculty.Fact_Status || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Class</span>
        <span className="detail-value">{faculty.Fact_Cls || "N/A"}</span>
      </div>
    </div>
  )

  const renderSalaryInfo = () => (
    <div className="details-grid">
      {faculty.fact_salary.map((salary, index) => (
        <div key={salary.id} className="salary-info">
          <h3>Salary Information {index + 1}</h3>
          <div className="detail-row">
            <span className="detail-label">School Code</span>
            <span className="detail-value">{salary.schoolCode}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Salary</span>
            <span className="detail-value">₹{salary.facultySalary}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Tax</span>
            <span className="detail-value">{salary.facultyTax}%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Transport</span>
            <span className="detail-value">₹{salary.facultyTransport}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Deduction</span>
            <span className="detail-value">{salary.facultyDeduction}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total</span>
            <span className="detail-value">₹{salary.total}</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (

    <div className="box">
    <div className="profile-container">
      <nav className="top-nav">
        <div className="nav-brand">Faculty Profile</div>
        <div className="nav-links">
          <button>Update</button>
          <button>Delete</button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-image-container">
           <img src="/images/student-icon.png" alt="img" />
          </div>
          <div className="profile-basic-info">
            <h1>{faculty.fact_Name}</h1>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{faculty.fact_email}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{faculty.fact_contact}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className="value">{faculty.Fact_Status}</span>
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
              className={`tab-button ${activeTab === "professional" ? "active" : ""}`}
              onClick={() => setActiveTab("professional")}
            >
              Professional Details
            </button>
            <button
              className={`tab-button ${activeTab === "salary" ? "active" : ""}`}
              onClick={() => setActiveTab("salary")}
            >
              Salary Information
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "personal" && renderPersonalInfo()}
            {activeTab === "professional" && renderProfessionalInfo()}
            {activeTab === "salary" && renderSalaryInfo()}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default FacultyProfile

