"use client"

import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import UnifiedNavbar from "../navbar/HotelNavbar"
import { User, Loader2 } from "lucide-react"

interface CustomerData {
  id: string
  creationDateTime: string
  hotelCode: string | null
  name: string
  address: string
  city: string
  state: string
  contact: string
  adharNo: string
  nationality: string
  face_image: string
  adharImgF: string
  adharImgB: string
}

interface CheckInFormData {
  customerId: string[]
  arrivalDate: string
  guestNames: string
  address: string
  contact: string
  company: string
  idDetails: string
  nationality: string
  maleCount: string
  femaleCount: string
  childCount: string
  purpose: string
  comingFrom: string
  goingTo: string
  departureDate: string
  transport: string
  deposit: string
  billNo: string
  amount: string
  remarks: string
   roomNumber: string  
}

const CustomerCheckInForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customersData, setCustomersData] = useState<CustomerData[]>([])
  const [formData, setFormData] = useState<CheckInFormData>({
    customerId: [],
    guestNames: "",
    address: "",
    contact: "",
    company: "",
    idDetails: "",
    nationality: "Indian",
    maleCount: "1",
    femaleCount: "0",
    childCount: "0",
    purpose: "",
    comingFrom: "",
    goingTo: "",
    arrivalDate: new Date().toISOString().slice(0, 16),
    departureDate: "",
    transport: "",
    deposit: "",
    billNo: "",
    amount: "",
    roomNumber: "",
    remarks: "",
  })
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [additionalCustomers, setAdditionalCustomers] = useState<CustomerData[]>([])

  // Fetch customer details by IDs
  const fetchCustomerDetails = async (customerId: string[]) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication token not found")
    }

    setIsLoading(true)
    try {
      const customers: CustomerData[] = []
      
      for (const id of customerId) {
        const response = await fetch(`https://s-m-s-keyw.onrender.com/hotel/customer/getById?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const customerData = await response.json()
          customers.push(customerData)
        } else {
          console.error(`Failed to fetch customer with ID: ${id}`)
        }
      }
      
      return customers
    } catch (error) {
      console.error("Error fetching customer details:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

useEffect(() => {
  if (location.state) {
    const { customerId, customerData, isExisting } = location.state

    setFormData((prev) => ({
      ...prev,
      customerId: customerId || [],   // ✅ IDs inject karo
      guestNames: customerData ? customerData.map((c: any) => c.name).join(", ") : "",
      address: customerData?.[0]?.address || "",
      contact: customerData?.[0]?.contact || "",
      company: customerData?.[0]?.company || "",
      idDetails: customerData?.[0]?.adharNo ? `Aadhar: ${customerData[0].adharNo}` : "",
      nationality: customerData?.[0]?.nationality || "",
    }))
  }
}, [location.state])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  const token = localStorage.getItem("token")
  if (!token) {
    toast.error("Authentication token not found")
    setIsSubmitting(false)
    return
  }

  try {
    const checkInPayload = {
      customerId: formData.customerId, // directly formData se lo
      arrivalDate: formData.arrivalDate,
      guestNames: formData.guestNames,   // yaha bhi formData se lo
      address: formData.address,
      contact: formData.contact,
      company: formData.company,
      idDetails: formData.idDetails,
      nationality: formData.nationality,
      maleCount: formData.maleCount,
      femaleCount: formData.femaleCount,
      childCount: formData.childCount,
      purpose: formData.purpose,
      comingFrom: formData.comingFrom,
      goingTo: formData.goingTo,
      departureDate: formData.departureDate,
      transport: formData.transport,
      deposit: formData.deposit,
      billNo: formData.billNo,
      amount: formData.amount,
      roomNumber: formData.roomNumber,
      remarks: formData.remarks,
    }

    console.log("✅ Final Payload:", checkInPayload) // Debugging ke liye

    const response = await fetch("https://s-m-s-keyw.onrender.com/hotelCheckInn/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(checkInPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Check-in failed")
    }

    toast.success(`Check-in completed successfully!`)
    navigate("/hotel-home", {
      state: { message: `Check-in completed successfully!` },
    })
  } catch (error: any) {
    console.error("Check-in error:", error)
    toast.error(error.message || "Failed to save check-in data")
  } finally {
    setIsSubmitting(false)
  }
}


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "N/A"
    try {
      return new Date(dateTime).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateTime
    }
  }

  const getImageSrc = (imageData: string): string => {
    if (!imageData) {
      return "/placeholder.svg?height=120&width=120&text=No+Image"
    }

    if (imageData.startsWith("http://") || imageData.startsWith("https://") || imageData.startsWith("/")) {
      return imageData
    }

    if (imageData.length > 100) {
      if (!imageData.startsWith("data:image/")) {
        return `data:image/jpeg;base64,${imageData}`
      }
      return imageData
    }

    return "/placeholder.svg?height=120&width=120&text=Invalid+Image"
  }

  const handleImageError = (imageKey: string) => {
    if (!imageErrors[imageKey]) {
      setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
    }
  }

  const getImageWithFallback = (imageData: string, imageKey: string, fallbackText: string): string => {
    if (imageErrors[imageKey]) {
      const svg = `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="#6b7280">${fallbackText}</text></svg>`
      return `data:image/svg+xml;base64,${btoa(svg)}`
    }
    return getImageSrc(imageData)
  }

  const addAdditionalCustomer = () => {
    const testCustomer: CustomerData = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      creationDateTime: new Date().toISOString(),
      hotelCode: null,
      name: "",
      address: "",
      city: "",
      state: "",
      contact: "",
      adharNo: "",
      nationality: "Indian",
      face_image: "",
      adharImgF: "",
      adharImgB: "",
    }
    setAdditionalCustomers((prev) => [...prev, testCustomer])
  }

  const removeAdditionalCustomer = (index: number) => {
    setAdditionalCustomers((prev) => prev.filter((_, i) => i !== index))
  }

  const updateAdditionalCustomer = (index: number, field: keyof CustomerData, value: string) => {
    setAdditionalCustomers((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })

    const allCustomers = [...customersData, ...additionalCustomers.filter((c) => c.name.trim())]
    const allGuestNames = allCustomers.map((c) => c.name).filter(Boolean).join(", ")
    const allCustomerId = allCustomers.map((c) => c.id)

    setFormData((prev) => ({
      ...prev,
      guestNames: allGuestNames,
      customerId: allCustomerId,
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton onBackClick={() => navigate(-1)} customTitle="Customer Check-in" />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Check-in Form</h2>

            {customersData.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Selected Customers ({customersData.length}):</h3>
                <div className="space-y-2">
                  {customersData.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">Aadhar: {customer.adharNo}</p>
                          <p className="text-xs text-gray-500">ID: {customer.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  First customer's details are auto-filled. Other customers will be included in the check-in.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Names *</label>
                  <input
                    type="text"
                    name="guestNames"
                    value={formData.guestNames}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                  <p className="text-xs text-gray-500 mt-1">All guest names separated by commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company/Hotel Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Details</label>
                  <input
                    type="text"
                    name="idDetails"
                    value={formData.idDetails}
                    onChange={handleChange}
                    className="w-full form-control"
                    placeholder="Aadhar numbers of all guests"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full form-control"
                    required
                  >
                    <option value="Indian">Indian</option>
                    <option value="Foreigner">Foreigner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Male Count *</label>
                  <input
                    type="number"
                    name="maleCount"
                    value={formData.maleCount}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Female Count *</label>
                  <input
                    type="number"
                    name="femaleCount"
                    value={formData.femaleCount}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full form-control"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                  <input
                    
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Child Count *</label>
                  <input
                    type="number"
                    name="childCount"
                    value={formData.childCount}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coming From *</label>
                  <input
                    type="text"
                    name="comingFrom"
                    value={formData.comingFrom}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Going To *</label>
                  <input
                    type="text"
                    name="goingTo"
                    value={formData.goingTo}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode *</label>
                  <input
                    type="text"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    required
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleChange}
                    min="0"
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                  <input
                    type="text"
                    name="billNo"
                    value={formData.billNo}
                    onChange={handleChange}
                    className="w-full form-control"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    className="w-full form-control"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="w-full form-control"
                  placeholder="Any additional information or special requests"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isSubmitting ? "Processing..." : "Complete Check-in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerCheckInForm