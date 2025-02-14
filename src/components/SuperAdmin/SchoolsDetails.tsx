"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../../services/Utils/apiUtils"
import Loader from "../loader/loader"

interface School {
  id: string
  schoolCode: string
  schoolName: string
  schoolAddress: string
  adminContact: string
  serviceStartDate: string
  currentPlan: string
  email: string
  renewalDate: string
  status: string
  city: string
  state: string
  schoolLandlineNo: string
  ownerName: string
  gst: string
  boardType: string
  subscriptionType: string
}

const SchoolsDetails: React.FC = () => {
  const [schoolData, setSchoolData] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    fetchSchools()
  }, []) // Removed unnecessary dependency 'id'

  const fetchSchools = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/school/get?id=${id}`)
      setSchoolData(response.data)
    } catch (error) {
      console.error("Error fetching school details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <Loader />
  if (!schoolData) return <div className="text-center text-gray-600">No school data found.</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{schoolData.schoolName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <InfoItem label="School Code" value={schoolData.schoolCode} />
        <InfoItem label="Address" value={`${schoolData.schoolAddress}, ${schoolData.city}, ${schoolData.state}`} />
        <InfoItem label="Admin Contact" value={schoolData.adminContact} />
        <InfoItem label="Landline" value={schoolData.schoolLandlineNo} />
        <InfoItem label="Email" value={schoolData.email} />
        <InfoItem label="Owner" value={schoolData.ownerName} />
        <InfoItem label="GST" value={schoolData.gst} />
        <InfoItem label="Board Type" value={schoolData.boardType} />
        <InfoItem label="Subscription" value={schoolData.subscriptionType} />
        <InfoItem label="Current Plan" value={schoolData.currentPlan} />
        <InfoItem label="Service Start Date" value={formatDate(schoolData.serviceStartDate)} />
        <InfoItem label="Renewal Date" value={formatDate(schoolData.renewalDate)} />
        <InfoItem
          label="Status"
          value={schoolData.status}
          className={schoolData.status.toLowerCase() === "active" ? "text-green-500" : "text-red-500"}
        />
      </div>
    </div>
  )
}

const InfoItem: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className = "" }) => (
  <p className="flex flex-col sm:flex-row sm:justify-between">
    <strong className="mr-2">{label}:</strong>
    <span className={className}>{value}</span>
  </p>
)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

export default SchoolsDetails

