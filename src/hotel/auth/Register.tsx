"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
    Building2,
    User,
    MapPin,
    Phone,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Plus,
    RotateCcw,
    Loader2,
    CreditCard,
    ArrowLeft,
} from "lucide-react"

interface HotelFormData {
    hotelName: string
    ownerName: string
    contactNumber: string
    email: string
    password: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    totalRooms: string
    subscription: string
    gstNumber: string
    referrel?: string
    type?: string
}

const HotelForm: React.FC = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<HotelFormData>({
        hotelName: "",
        ownerName: "",
        contactNumber: "",
        email: "",
        password: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        totalRooms: "",
        subscription: "Basic",
        gstNumber: "",
        referrel: "",
        type: "hotel",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const subscriptionOptions = ["Basic", "Premium", "Enterprise"]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSubmitting(true)
        console.log("Form data before submission:")
        try {
            const payload = {
                hotelName: formData.hotelName.trim(),
                ownerName: formData.ownerName.trim(),
                contactNumber: formData.contactNumber.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                country: formData.country.trim(),
                totalRooms: formData.totalRooms.trim(),
                subscription: formData.subscription,
                gstNumber: formData.gstNumber.trim(),
                referrel: formData.referrel ? formData.referrel.trim() : undefined,
                type: formData.type,
            }

            console.log("Sending hotel creation payload:", JSON.stringify(payload))

            const response = await fetch("https://s-m-s-keyw.onrender.com/hotelCreation/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            })

            console.log("Hotel creation response status:", response.status)
            const responseData = await response.json()
            console.log("Hotel creation response body:", responseData)

            if (response.status === 200 || response.status === 201) {
                toast.success("Hotel created successfully!")
                resetForm()
                // Navigate to login after successful registration
                setTimeout(() => {
                    navigate("/hotel/login")
                }, 2000)
            } else {
                toast.error(`Hotel creation failed: ${responseData.message || "Unknown error"}`)
            }
        } catch (error) {
            console.error("Hotel creation error:", error)
            toast.error(`Network error: ${error}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            hotelName: "",
            ownerName: "",
            contactNumber: "",
            email: "",
            password: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
            totalRooms: "",
            subscription: "Basic",
            gstNumber: "",
            referrel: "",
            type: "hotel",
        })
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-[#126666] shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-3">
                            <Building2 className="w-6 h-6 text-white" />
                            <h1 className="text-lg font-semibold text-white">Hotel Registration</h1>
                        </div>
                        <button
                            onClick={() => navigate("/hotel/login")}
                            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Login</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={handleSubmit}>
                    {/* Hotel Business Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-[#126666] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                                <Building2 className="w-4 h-4 text-[#126666]" />
                            </div>
                             <h2 className="text-lg font-semibold text-[#126666]">Hotel Business Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                                <input
                                    type="text"
                                    name="hotelName"
                                    value={formData.hotelName}
                                    onChange={handleInputChange}
                                    placeholder="Enter hotel name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                                <input
                                    type="text"
                                    name="referrel"
                                    value={formData.referrel}
                                    onChange={handleInputChange}
                                    placeholder="Optional referral code"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                />
                            </div>
                           

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                                <input
                                    type="number"
                                    name="totalRooms"
                                    value={formData.totalRooms}
                                    onChange={handleInputChange}
                                    placeholder="Number of rooms"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                                <div className="relative">
                                    <select
                                        name="subscription"
                                        value={formData.subscription}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm appearance-none"
                                    >
                                        {subscriptionOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleInputChange}
                                    placeholder="15-digit GST number"
                                    maxLength={15}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hotel Owner Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-[#126666] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-[#126666]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#126666]">Owner Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Business email"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Min 8 characters"
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hotel Location Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-[#126666] bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                                <MapPin className="w-4 h-4 text-[#126666]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#126666]">Location Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Complete hotel address"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        placeholder="6-digit pincode"
                                        maxLength={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="Country"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            onSubmit={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#126666] hover:bg-[#0f5555] disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm transition-all disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Creating Hotel...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Create Hotel</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-[#E74C3C] font-medium rounded-md shadow-sm border border-[#E74C3C] transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HotelForm
