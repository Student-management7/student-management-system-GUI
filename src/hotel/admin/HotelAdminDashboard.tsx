"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Hotel,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Search,
  Filter,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import UnifiedNavbar from "../navbar/HotelNavbar"

interface HotelData {
  id: string
  creationDateTime: string
  hotelCode: string | null
  hotelName: string
  ownerName: string
  contactNumber: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  totalRooms: string
  subscription: string
  gstNumber: string
  role: string | null
  active: boolean
}

const Button: React.FC<{
  onClick?: () => void
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm"
  disabled?: boolean
  className?: string
  children: React.ReactNode
}> = ({ onClick, variant = "default", size = "default", disabled = false, className = "", children }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-[#126666] text-white hover:bg-[#0f5555]",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm bg-white ${className}`}>{children}</div>
)

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
)

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Badge: React.FC<{
  children: React.ReactNode
  variant?: "default" | "secondary"
  className?: string
}> = ({ children, variant = "default", className = "" }) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-800",
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>
}

const HotelAdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [loading, setLoading] = useState(true)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token) {
      navigate("/hotel-login")
      return
    }

    if (role !== "admin") {
      toast.error("Access denied. Admin role required.")
      navigate("/")
      return
    }

    setUserRole(role)
    fetchHotels()
  }, [navigate])

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://s-m-s-keyw.onrender.com/hotelCreation/get", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch hotels")
      }

      const data = await response.json()
      setHotels(data)
    } catch (error) {
      console.error("Error fetching hotels:", error)
      toast.error("Failed to load hotel data")
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = useMemo(() => {
    let filtered = hotels

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (hotel) =>
          hotel.hotelName.toLowerCase().includes(query) ||
          hotel.ownerName.toLowerCase().includes(query) ||
          hotel.city.toLowerCase().includes(query) ||
          hotel.state.toLowerCase().includes(query) ||
          `${hotel.city}, ${hotel.state}`.toLowerCase().includes(query),
      )
    }

    // Apply active filter
    if (activeFilter === "active") {
      filtered = filtered.filter((hotel) => hotel.active)
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((hotel) => !hotel.active)
    }

    return filtered
  }, [hotels, searchQuery, activeFilter])

  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredHotels.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredHotels, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilter])

  const toggleActiveStatus = async (hotelId: string, hotelEmail: string, currentActive: boolean) => {
    setToggleLoading(hotelId)

    try {
      const token = localStorage.getItem("token")
      const newStatus = !currentActive

      const response = await fetch(`https://s-m-s-keyw.onrender.com/auth/editActiveUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: hotelEmail,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle active status")
      }

      // Update local state
      setHotels((prev) => prev.map((hotel) => (hotel.id === hotelId ? { ...hotel, active: newStatus } : hotel)))

      toast.success(`User ${newStatus ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      console.error("Error toggling active status:", error)
      toast.error("Failed to update user status")
    } finally {
      setToggleLoading(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("userDetails")
    localStorage.removeItem("email")
    toast.success("Logged out successfully")
    navigate("/hotel-login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#126666]" />
          <span className="text-lg text-gray-600">Loading hotel data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <UnifiedNavbar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Hotel Management</h2>
          <p className="text-gray-600 mt-1">Manage hotel subscriptions and view details</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.filter((h) => h.active).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Hotels</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.filter((h) => h.subscription === "Premium").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Basic Hotels</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.filter((h) => h.subscription === "Basic").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by hotel name, owner name, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#126666] focus:border-transparent outline-none"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex rounded-md border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeFilter === "all" ? "bg-[#126666] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All ({hotels.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("active")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                      activeFilter === "active" ? "bg-[#126666] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Active ({hotels.filter((h) => h.active).length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("inactive")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                      activeFilter === "inactive"
                        ? "bg-[#126666] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Inactive ({hotels.filter((h) => !h.active).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {paginatedHotels.length} of {filteredHotels.length} hotels
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </CardContent>
        </Card>

        {/* Hotels Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hotels List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Hotel Details</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Owner Info</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subscription</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHotels.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        {searchQuery || activeFilter !== "all"
                          ? "No hotels found matching your criteria"
                          : "No hotels available"}
                      </td>
                    </tr>
                  ) : (
                    paginatedHotels.map((hotel) => (
                      <tr key={hotel.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{hotel.hotelName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Hotel className="w-3 h-3 mr-1" />
                              {hotel.hotelCode || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {hotel.totalRooms} rooms
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{hotel.ownerName}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {hotel.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {hotel.contactNumber}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {hotel.city}, {hotel.state}
                            </div>
                            <div className="text-sm text-gray-500">{hotel.pincode}</div>
                            <div className="text-xs text-gray-400">{hotel.country}</div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant={hotel.subscription === "Premium" ? "default" : "secondary"}
                            className={
                              hotel.subscription === "Premium" ? "!bg-[#126666] hover:!bg-[#0f5555] text-white" : ""
                            }
                          >
                            {hotel.subscription}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant={hotel.active ? "default" : "secondary"}
                            className={
                              hotel.active
                                ? "!bg-green-600 hover:!bg-green-700 text-white"
                                : "!bg-red-100 !text-red-800"
                            }
                          >
                            {hotel.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(hotel.creationDateTime)}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <Button
                            onClick={() => toggleActiveStatus(hotel.id, hotel.email, hotel.active)}
                            disabled={toggleLoading === hotel.id}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                          >
                            {toggleLoading === hotel.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : hotel.active ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HotelAdminDashboard
