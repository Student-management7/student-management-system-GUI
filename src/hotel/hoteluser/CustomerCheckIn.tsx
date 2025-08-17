"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  Camera,
  BadgeIcon as IdCard,
  Phone,
  Home,
  Globe,
  Clock,
  Users,
  Building,
  Plane,
  DollarSign,
  MessageSquare,
} from "lucide-react"

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
  face_image: string // Now expects URL instead of base64
  adharImgF: string // Now expects URL instead of base64
  adharImgB: string // Now expects URL instead of base64
}

interface CheckInFormData {
  customerId: string
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
}

const CustomerCheckInForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [formData, setFormData] = useState<CheckInFormData>({
    customerId: "",
    arrivalDate: new Date().toISOString().split("T")[0],
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
    departureDate: "",
    transport: "",
    deposit: "",
    billNo: "",
    amount: "",
    remarks: "",
  })
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    console.log("useEffect triggered, location.state:", location.state)

    if (location.state?.customerData) {
      // This block handles existing customer data (e.g., from a "Manage Guests" link)
      let customer: CustomerData | undefined
      if (Array.isArray(location.state.customerData)) {
        customer = location.state.customerData[0] as CustomerData
        console.log("Customer data received as array:", location.state.customerData)
        console.log("Using first customer:", customer)
      } else {
        customer = location.state.customerData as CustomerData
        console.log("Customer data received as object:", customer)
      }

      if (customer) {
        console.log("Image data in customer:", {
          face_image: {
            exists: !!customer.face_image,
            length: customer.face_image?.length || 0,
            preview: customer.face_image?.substring(0, 50) || "none",
          },
          adharImgF: {
            exists: !!customer.adharImgF,
            length: customer.adharImgF?.length || 0,
            preview: customer.adharImgF?.substring(0, 50) || "none",
          },
          adharImgB: {
            exists: !!customer.adharImgB,
            length: customer.adharImgB?.length || 0,
            preview: customer.adharImgB?.substring(0, 50) || "none",
          },
        })

        setCustomerData(customer) // Set customerData to display existing profile
        const fullAddress = [customer.address, customer.city, customer.state].filter((part) => part).join(", ")
        setFormData((prev) => ({
          ...prev,
          customerId: customer.id || "",
          guestNames: customer.name || "",
          address: fullAddress || "",
          contact: customer.contact || "",
          nationality: customer.nationality || "Indian",
          idDetails: customer.adharNo ? `Aadhar: ${customer.adharNo}` : "",
        }))
      } else {
        console.log("Customer data found in state but is empty or invalid.")
        setCustomerData(null) // Clear customerData if invalid
      }
    } else if (location.state?.hotelDetailsForNewGuest) {
      // This block handles new guest registration with hotel details pre-filled
      const hotelDetails = location.state.hotelDetailsForNewGuest
      console.log("Hotel details for new guest:", hotelDetails)
      setCustomerData(null) // Ensure no customer data is set for new registrations
      setFormData((prev) => ({
        ...prev,
        address: hotelDetails.address || "",
        contact: hotelDetails.contactNumber || "",
        company: hotelDetails.hotelName || "",
      }))
    } else {
      console.log("No customer data or hotel details found in location state.")
      setCustomerData(null) // Clear customerData if no relevant state
    }
  }, [location.state]) // Depend on location.state to re-run when navigation state changes

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
        customerId: formData.customerId,
        arrivalDate: formData.arrivalDate,
        guestNames: formData.guestNames,
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
        remarks: formData.remarks,
      }

      const response = await fetch("https://s-m-s-keyw.onrender.com/hotelCheckInn/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkInPayload),
      })

      if (!response.ok) {
        throw new Error("Check-in failed")
      }

      toast.success("Check-in completed successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Check-in error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save check-in data")
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
    console.log("getImageSrc called with data:", {
      hasData: !!imageData,
      length: imageData?.length || 0,
      firstChars: imageData?.substring(0, 20) || "none",
      startsWithHttp: imageData?.startsWith("http://") || false,
      startsWithHttps: imageData?.startsWith("https://") || false,
      startsWithSlash: imageData?.startsWith("/") || false,
      startsWithData: imageData?.startsWith("data:image/") || false,
    })

    if (!imageData) {
      console.log("No image data provided, using placeholder")
      return "/placeholder.svg?height=120&width=120&text=No+Image"
    }

    // Check if it's already a URL
    if (imageData.startsWith("http://") || imageData.startsWith("https://") || imageData.startsWith("/")) {
      console.log("Using URL format:", imageData.substring(0, 50) + "...")
      return imageData
    }

    // Check if it's base64 data
    if (imageData.length > 100) {
      // Base64 strings are typically very long
      console.log("Converting base64 to data URL, length:", imageData.length)
      // Add data URL prefix if not present
      if (!imageData.startsWith("data:image/")) {
        const dataUrl = `data:image/jpeg;base64,${imageData}`
        console.log("Created data URL:", dataUrl.substring(0, 100) + "...")
        return dataUrl
      }
      console.log("Data already has data:image prefix")
      return imageData
    }

    console.log("Invalid image data (too short), using placeholder:", imageData.substring(0, 50))
    return "/placeholder.svg?height=120&width=120&text=Invalid+Image"
  }

  const handleImageError = (imageKey: string, fallbackText: string) => {
    if (!imageErrors[imageKey]) {
      console.log(`${imageKey} image failed to load, showing fallback`)
      setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
    }
  }

  const getImageWithFallback = (imageData: string, imageKey: string, fallbackText: string): string => {
    if (imageErrors[imageKey]) {
      // Return a data URL for a simple colored rectangle instead of network request
      return `data:image/svg+xml;base64,${btoa(`<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" textAnchor="middle" dy=".3em" fontFamily="Arial" fontSize="12" fill="#6b7280">${fallbackText}</text></svg>`)}`
    }
    return getImageSrc(imageData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#126666] via-[#0f5555] to-[#0d4444] rounded-t-2xl shadow-xl">
          <div className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Customer Check-In
                </h1>
                <p className="text-blue-100 text-base">Complete the check-in process for your guest</p>
              </div>
              {location.state?.isExisting && (
                <div className="flex items-center bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-300/30">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span className="font-semibold text-green-100 text-sm">Verified Customer</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-xl border border-white/20">
          <div className="p-6">
            {/* Manual Load Button - for testing */}
            {!customerData && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-blue-900">No Customer Data Found</h3>
                </div>
                <p className="text-blue-700 mb-4 text-base">For testing purposes, you can load sample customer data:</p>
                <button
                  type="button"
                  onClick={() => {
                    const testCustomer: CustomerData = {
                      id: "a08e12d9-74a0-4159-9709-3b81d3beb1cd",
                      creationDateTime: "2025-08-11T08:54:11.273549",
                      hotelCode: null,
                      name: "Shivank Sahu",
                      address: "Gram senthri district datia",
                      city: "Gram senthri",
                      state: "Madhya Pradesh",
                      contact: "6267492331",
                      adharNo: "123412345",
                      // IMPORTANT: These URLs are placeholders and are NOT valid images.
                      // Replace them with actual URLs from your backend.
                      face_image: "LzlqLzRBQVFTa1pKUmdBQkFRQUFBUUFCQUFELzRnSFlTVU5EW", // Your actual base64 data
                      adharImgF: "LzlqLzRBQVFTa1pKUmdBQkFRQUFBUUFCQUFELzRnSFlTVU5EW", // Your actual base64 data
                      adharImgB: "LzlqLzRBQVFTa1pKUmdBQkFRQUFBUUFCQUFELzRnSFlTVU5EW", // Your actual base64 data
                    }

                    setCustomerData(testCustomer)

                    const fullAddress = [testCustomer.address, testCustomer.city, testCustomer.state]
                      .filter(Boolean)
                      .join(", ")

                    setFormData((prev) => ({
                      ...prev,
                      customerId: testCustomer.id,
                      guestNames: testCustomer.name,
                      address: fullAddress,
                      contact: testCustomer.contact,
                      nationality: testCustomer.nationality,
                      idDetails: testCustomer.adharNo ? `Aadhar: ${testCustomer.adharNo}` : "",
                    }))
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base"
                >
                  Load Test Customer Data
                </button>
              </div>
            )}

            {/* Complete Customer Data Display - ONLY SHOWS IF customerData IS PRESENT */}
            {customerData && (
              <div className="mb-10">
                <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-gray-200/50 shadow-xl">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-[#126666] to-[#0f5555] p-3 rounded-xl shadow-md">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
                      <p className="text-gray-600 text-base">Complete profile and document details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Basic Information */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-800">Basic Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer ID</span>
                          <p className="text-sm text-gray-900 font-mono mt-1 bg-gray-100 p-2 rounded border">
                            {customerData.id}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</span>
                          <p className="text-base font-semibold text-gray-900 mt-1">{customerData.name}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</span>
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 text-green-600 mr-2" />
                            <p className="text-sm font-semibold text-gray-900">{customerData.contact}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nationality</span>
                          <div className="flex items-center mt-1">
                            <Globe className="w-4 h-4 text-blue-600 mr-2" />
                            <p className="text-sm font-semibold text-gray-900">{customerData.nationality}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Aadhar Number
                          </span>
                          <div className="flex items-center mt-1">
                            <IdCard className="w-4 h-4 text-purple-600 mr-2" />
                            <p className="text-sm font-semibold text-gray-900 font-mono">
                              {customerData.adharNo || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-800">Address Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customerData.address}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customerData.city}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customerData.state}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Complete Address
                          </span>
                          <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-lg border">
                            {[customerData.address, customerData.city, customerData.state].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-800">System Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Registration Date
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatDateTime(customerData.creationDateTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hotel Code</span>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{customerData.hotelCode || "N/A"}</p>
                        </div>
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Document Status
                          </span>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <span className="text-xs font-medium text-gray-700">Face Photo</span>
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${customerData.face_image ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <span className="text-xs font-medium text-gray-700">Aadhar Front</span>
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${customerData.adharImgF ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                              <span className="text-xs font-medium text-gray-700">Aadhar Back</span>
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${customerData.adharImgB ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Images */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-800">Document Images</h3>
                      </div>
                      <div className="space-y-4">
                        {customerData.face_image && (
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                              Face Photo
                            </span>
                            <div className="relative group">
                              <img
                                src={
                                  getImageWithFallback(customerData.face_image, "face", "Face Photo") ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt="Customer Face"
                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105"
                                onError={() => handleImageError("face", "Face Photo")}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-300"></div>
                            </div>
                          </div>
                        )}

                        {customerData.adharImgF && (
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                              Aadhar Front
                            </span>
                            <div className="relative group">
                              <img
                                src={
                                  getImageWithFallback(customerData.adharImgF, "adharFront", "Aadhar Front") ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt="Aadhar Front"
                                className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105"
                                onError={() => handleImageError("adharFront", "Aadhar Front")}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-300"></div>
                            </div>
                          </div>
                        )}

                        {customerData.adharImgB && (
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                              Aadhar Back
                            </span>
                            <div className="relative group">
                              <img
                                src={
                                  getImageWithFallback(customerData.adharImgB, "adharBack", "Aadhar Back") ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt="Aadhar Back"
                                className="w-full h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105"
                                onError={() => handleImageError("adharBack", "Aadhar Back")}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-300"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Check-In Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pre-filled Customer Information */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Customer Information</h3>
                    <p className="text-gray-600 text-base">Pre-filled from customer database</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="guestNames"
                      value={formData.guestNames}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nationality</label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ID Details</label>
                    <input
                      type="text"
                      name="idDetails"
                      value={formData.idDetails}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Check-In Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-md">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Check-In Details</h3>
                    <p className="text-gray-600 text-base">Arrival and stay information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Arrival Date</label>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure Date</label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      Male Guests
                    </label>
                    <input
                      type="number"
                      name="maleCount"
                      value={formData.maleCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-pink-600" />
                      Female Guests
                    </label>
                    <input
                      type="number"
                      name="femaleCount"
                      value={formData.femaleCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-orange-600" />
                      Children
                    </label>
                    <input
                      type="number"
                      name="childCount"
                      value={formData.childCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-purple-600" />
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Purpose of Visit</label>
                    <input
                      type="text"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-3 rounded-xl shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Travel Details</h3>
                    <p className="text-gray-600 text-base">Journey and transportation information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Coming From</label>
                    <input
                      type="text"
                      name="comingFrom"
                      value={formData.comingFrom}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Going To</label>
                    <input
                      type="text"
                      name="goingTo"
                      value={formData.goingTo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <Plane className="w-4 h-4 mr-2 text-blue-600" />
                    Transport
                  </label>
                  <input
                    type="text"
                    name="transport"
                    value={formData.transport}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-base font-semibold"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl shadow-md">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                    <p className="text-gray-600 text-base">Billing and payment information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      Deposit Amount
                    </label>
                    <input
                      type="text"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bill Number</label>
                    <input
                      type="text"
                      name="billNo"
                      value={formData.billNo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      Amount
                    </label>
                    <input
                      type="text"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-base font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-3 rounded-xl shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Additional Information</h3>
                    <p className="text-gray-600 text-base">Notes and special requirements</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all duration-200 resize-none text-base"
                    placeholder="Any additional notes, special requirements, or important information..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-3 px-6 py-3 text-[#126666] border-2 border-[#126666] rounded-xl hover:bg-[#126666] hover:text-white transition-all duration-300 font-bold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#126666] via-[#0f5555] to-[#0d4444] text-white rounded-xl hover:from-[#0f5555] hover:via-[#0d4444] hover:to-[#0b3333] disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 transition-all duration-300 font-bold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin w-6 h-6" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Complete Check-In
                    </>
                  )}
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
