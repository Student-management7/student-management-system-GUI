"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { User, LogOut, ChevronDown, Hotel, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"

interface UserDetails {
  email: string
  role: string
  hotelCreationEntity?: {
    hotelName: string
    ownerName: string
    email: string
  }
  adminCreationEntity?: {
    name: string
    email: string
    role: string
  }
}

interface UnifiedNavbarProps {
  onLogout?: () => void
  showBackButton?: boolean
  onBackClick?: () => void
  customTitle?: string
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({
  onLogout,
  showBackButton = false,
  onBackClick,
  customTitle,
}) => {
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails")
    if (userDetailsString) {
      try {
        const parsedUserDetails = JSON.parse(userDetailsString)
        setUserDetails(parsedUserDetails)
      } catch (error) {
        console.error("Failed to parse user details from localStorage", error)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("token")
    localStorage.removeItem("userDetails")
    localStorage.removeItem("authToken")
    localStorage.removeItem("email")
    localStorage.removeItem("userType")
    localStorage.removeItem("hotelData")
    localStorage.removeItem("hotelName")
    localStorage.removeItem("ownerName")
    localStorage.removeItem("role")

    toast.success("Logged out successfully")

    if (onLogout) {
      onLogout()
    } else {
      navigate("/")
    }
  }

  const getDisplayName = () => {
    if (customTitle) return customTitle

    if (!userDetails) return "Dashboard"

    if (userDetails.role === "Hotel" && userDetails.hotelCreationEntity) {
      return userDetails.hotelCreationEntity.hotelName
    } else if (userDetails.role === "admin" && userDetails.adminCreationEntity) {
      return "Hotel Admin Dashboard"
    }

    return "Dashboard"
  }

  const getUserName = () => {
    if (!userDetails) return "User"

    if (userDetails.role === "Hotel" && userDetails.hotelCreationEntity) {
      return userDetails.hotelCreationEntity.ownerName
    } else if (userDetails.role === "admin" && userDetails.adminCreationEntity) {
      return userDetails.adminCreationEntity.name
    }

    return "User"
  }

  const getUserEmail = () => {
    if (!userDetails) return ""

    if (userDetails.role === "Hotel" && userDetails.hotelCreationEntity) {
      return userDetails.hotelCreationEntity.email
    } else if (userDetails.role === "admin" && userDetails.adminCreationEntity) {
      return userDetails.adminCreationEntity.email
    }

    return userDetails.email || ""
  }

  const getUserRole = () => {
    if (!userDetails) return ""

    if (userDetails.role === "Hotel") {
      return "Hotel Owner"
    } else if (userDetails.role === "admin") {
      return userDetails.adminCreationEntity?.role || "Admin"
    }

    return userDetails.role || ""
  }

  return (
    <header className="bg-[#126666] shadow-lg">
        
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title/Name */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={onBackClick || (() => navigate(-1))}
                className="text-white hover:text-teal-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Hotel className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">{getDisplayName()}</h1>
                {userDetails?.role === "Hotel" && <p className="text-teal-100 text-sm">Management Dashboard</p>}
              </div>
            </div>
          </div>

          {/* Right side - User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center hover:!bg-[#003b3b] space-x-3 text-white hover:!text-teal-200 transition-colors focus:outline-none focus:ring-2 focus:!ring-teal-300 focus:!ring-offset-2 focus:!ring-offset-[#126666] rounded-lg px-3 py-2"
            >
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{getUserName()}</p>
                  <p className="text-xs text-teal-100">{getUserRole()}</p>
                </div>
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#126666]" />
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                  <p className="text-sm text-gray-500">{getUserEmail()}</p>
                  <p className="text-xs text-gray-400 mt-1">{getUserRole()}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      toast.info("Settings feature coming soon!")
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default UnifiedNavbar
