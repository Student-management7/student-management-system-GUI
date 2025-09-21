"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Hotel, UserPlus, Users, Bed, Calendar, BarChart3, X, Eye, UserCheck } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import UnifiedNavbar from "./navbar/HotelNavbar"

interface HotelDetails {
  hotelName: string
  ownerName: string
  totalRooms: number
  email: string
}

interface Customer {
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
  fingerprint_data: string
}

interface Guest {
  id: string
  arrivalDate: string
  guestNames: string
  address: string | null
  contact: string | null
  company: string | null
  idDetails: string | null
  nationality: string | null
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
  customersEntity: Customer[]
}

const HotelHome: React.FC = () => {
  const navigate = useNavigate()
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showGuestTable, setShowGuestTable] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  useEffect(() => {
    const fetchHotelData = () => {
      const hotelDataString = localStorage.getItem("userDetails")
      if (hotelDataString) {
        try {
          const parsedHotelData = JSON.parse(hotelDataString)
          if (parsedHotelData.hotelCreationEntity) {
            setHotelDetails(parsedHotelData.hotelCreationEntity)
          }
        } catch (error) {
          console.error("Failed to parse hotel data from localStorage", error)
        }
      }
    }

    const token = localStorage.getItem("token")
    const fetchGuests = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://s-m-s-keyw.onrender.com/hotelCheckInn/get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setGuests(data)
        } else {
          toast.error("Failed to fetch guest data")
        }
      } catch (error) {
        console.error("Error fetching guests:", error)
        toast.error("Error fetching guest data")
      } finally {
        setLoading(false)
      }
    }

    fetchHotelData()
    fetchGuests()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("email")
    localStorage.removeItem("userType")
    localStorage.removeItem("hotelData")
    localStorage.removeItem("hotelName")
    localStorage.removeItem("ownerName")
    localStorage.removeItem("role")
    navigate("/")
  }

  const currentGuests = guests.filter((guest) => !guest.departureDate || guest.departureDate.trim() === "")

  const todayBookings = currentGuests.filter((guest) => {
    const arrivalDate = new Date(guest.arrivalDate)
    const today = new Date()
    return arrivalDate.toDateString() === today.toDateString()
  }).length

  const getLocalISODateTime = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset() // in minutes
    const localDate = new Date(now.getTime() - offset * 60000) // Adjust to local time
    return localDate.toISOString().slice(0, 19) // Remove 'Z' at the end
  }

  const handleCheckout = async (guestId: string) => {
    try {
      const departureDate = getLocalISODateTime()

      const userDetails = localStorage.getItem("userDetails")
      let email = ""
      if (userDetails) {
        try {
          const parsedUserDetails = JSON.parse(userDetails)
          email = parsedUserDetails.hotelCreationEntity?.email || ""
        } catch (error) {
          console.error("Failed to parse user details", error)
        }
      }

      const payload = {
        id: guestId,
        departureDate: departureDate,
      }

      const token = localStorage.getItem("token")
      const response = await fetch("https://s-m-s-keyw.onrender.com/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Guest checked out successfully")
        const updatedResponse = await fetch("https://s-m-s-keyw.onrender.com/hotelCheckInn/get", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        if (updatedResponse.ok) {
          const data = await updatedResponse.json()
          setGuests(data)
        }
      } else {
        toast.error("Failed to checkout guest")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast.error("Error during checkout")
    }
  }

  const hotelName = hotelDetails?.hotelName || localStorage.getItem("hotelName") || "Hotel Management"
  const ownerName = hotelDetails?.ownerName || localStorage.getItem("ownerName") || "Hotel Owner"
  const totalRooms = hotelDetails?.totalRooms || 0
  const availableRooms = totalRooms - currentGuests.length

  const todayRevenue = guests
    .filter((guest) => {
      const arrivalDate = new Date(guest.arrivalDate)
      const today = new Date()
      return arrivalDate.toDateString() === today.toDateString()
    })
    .reduce((total, guest) => total + (Number.parseFloat(guest.amount) || 0), 0)

  const dashboardCards = [
    {
      title: "Register New Guest",
      description: "Add new customer to the system",
      icon: UserPlus,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      onClick: () => navigate("/hotel-customer", { state: { hotelDetailsForNewGuest: hotelDetails } }),
    },
    {
      title: "Manage Guests",
      description: "View and manage existing guests",
      icon: Users,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => setShowGuestTable(true),
    },
    {
      title: "Guest History & Reports",
      description: "View past guests and generate reports",
      icon: BarChart3,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      // onClick: () => navigate("/hotel-table"),
      onClick: () => navigate("/hotel-tabel"),
    },
    // {
    //   title: "Room Management",
    //   description: "Manage hotel rooms and availability",
    //   icon: Bed,
    //   color: "bg-[#1e7878] hover:bg-teal-600",
    //   textColor: "text-purple-600",
    //   bgColor: "bg-purple-50",
    //   onClick: () => toast.info("Room Management coming soon!"),
    // },
    // {
    //   title: "Bookings",
    //   description: "View and manage reservations",
    //   icon: Calendar,
    //   color: "bg-[#1e7878] hover:bg-teal-600",
    //   textColor: "text-green-600",
    //   bgColor: "bg-green-50",
    //   onClick: () => toast.info("Bookings feature coming soon!"),
    // },

    // {
    //   title: "Settings",
    //   description: "Hotel settings and configuration",
    //   icon: Settings,
    //   color: "bg-[#1e7878] hover:bg-teal-600",
    //   textColor: "text-gray-600",
    //   bgColor: "bg-gray-50",
    //   onClick: () => toast.info("Settings feature coming soon!"),
    // },
  ]

  const GuestDetailsModal = ({ guest, onClose }: { guest: Guest; onClose: () => void }) => {
    const customers = Array.isArray(guest.customersEntity)
      ? guest.customersEntity
      : guest.customersEntity
        ? [guest.customersEntity]
        : []

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
              <p className="text-gray-600">Booking ID: {guest.id}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            {/* Booking Information */}
            <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-bold text-gray-600">Arrival Date:</span>
                  <p className="text-gray-900">{new Date(guest.arrivalDate).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Guest Count:</span>
                  <p className="text-gray-900">
                    {customers.length} registered guest(s) | Male: {guest.maleCount}, Female: {guest.femaleCount},
                    Children: {guest.childCount}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Purpose:</span>
                  <p className="text-gray-900">{guest.purpose || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Coming From:</span>
                  <p className="text-gray-900">{guest.comingFrom || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Deposit:</span>
                  <p className="text-gray-900">₹{guest.deposit}</p>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Total Amount:</span>
                  <p className="text-gray-900">₹{guest.amount}</p>
                </div>
              </div>
              {guest.remarks && (
                <div className="mt-4">
                  <span className="text-sm font-bold text-gray-600">Remarks:</span>
                  <p className="text-gray-900 bg-white p-3 rounded-lg border">{guest.remarks}</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Registered Customers ({customers.length})
              </h3>

              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p>No customer details available</p>
                </div>
              ) : (
                customers.map((customer, index) => (
                  <div key={customer.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                        Customer {index + 1}
                      </h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Registered
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-bold text-gray-600">Full Name:</span>
                        <p className="text-gray-900 font-medium">{customer.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-600">Contact:</span>
                        <p className="text-gray-900">{customer.contact}</p>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-600">Aadhar Number:</span>
                        <p className="text-gray-900 font-mono">{customer.adharNo}</p>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-600">Nationality:</span>
                        <p className="text-gray-900">{customer.nationality}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-bold text-gray-600">Address:</span>
                        <p className="text-gray-900">
                          {[customer.address, customer.city, customer.state].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm font-bold text-gray-600">Registration Date:</span>
                      <p className="text-gray-900 text-sm">{new Date(customer.creationDateTime).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Customers: {customers.length} | Total Amount: ₹{guest.amount} | Balance: ₹
              {(Number.parseFloat(guest.amount) - Number.parseFloat(guest.deposit)).toFixed(2)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleCheckout(guest.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Checkout Group
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#1e7878] hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const GuestTable = () => {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredGuests = currentGuests.filter((guest) => {
      // Search in guest names and customer data
      const guestNamesMatch = guest.guestNames?.toLowerCase().includes(searchTerm.toLowerCase()) || false

      // Search in customer entities
      const customers = Array.isArray(guest.customersEntity)
        ? guest.customersEntity
        : guest.customersEntity
          ? [guest.customersEntity]
          : []
      const customerMatch = customers.some(
        (customer) =>
          customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contact?.includes(searchTerm) ||
          customer.adharNo?.includes(searchTerm),
      )

      return guestNamesMatch || customerMatch
    })

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Current Guests</h2>
            <button
              onClick={() => setShowGuestTable(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-2 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, contact, or Aadhar number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 placeholder-gray-400 w-1/2 form-control"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <span className="ml-3">Loading guest data...</span>
                </div>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p>{searchTerm ? "No guests match your search." : "No guests currently checked in."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Guest Names
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Registered Customers
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Primary Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Guest Count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Deposit (₹)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total (₹)
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Balance (₹)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGuests.map((guest, index) => {
                      // Handle both array and single customer entity
                      const customers = Array.isArray(guest.customersEntity)
                        ? guest.customersEntity
                        : guest.customersEntity
                          ? [guest.customersEntity]
                          : []
                      const primaryCustomer = customers[0] || {}
                      const deposit = Number.parseFloat(guest.deposit) || 0
                      const total = Number.parseFloat(guest.amount) || 0
                      const balance = total - deposit
                      const totalGuestCount =
                        Number.parseInt(guest.maleCount) +
                        Number.parseInt(guest.femaleCount) +
                        Number.parseInt(guest.childCount)

                      return (
                        <tr key={guest.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{guest.guestNames || "N/A"}</div>
                            <div className="text-xs text-gray-500">
                              Arrival: {new Date(guest.arrivalDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {customers.length > 0 ? (
                                <div>
                                  <span className="font-medium">{customers.length} registered</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {customers
                                      .slice(0, 2)
                                      .map((c) => c.name)
                                      .join(", ")}
                                    {customers.length > 2 && ` +${customers.length - 2} more`}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400">No registered customers</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {primaryCustomer.contact || guest.contact || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">{totalGuestCount}</span>
                              <div className="text-xs text-gray-500">
                                M:{guest.maleCount} F:{guest.femaleCount} C:{guest.childCount}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{deposit.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{total.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                              {balance.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedGuest(guest)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              <button
                                onClick={() => handleCheckout(guest.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                              >
                                Checkout
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredGuests.length} of {currentGuests.length} bookings
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
            <button
              onClick={() => setShowGuestTable(false)}
              className="px-4 py-2 bg-[#1e7878] hover:bg-teal-600 text-white rounded-lg transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-50">
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <UnifiedNavbar onLogout={handleLogout} />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-full mb-6">
            <Hotel className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {hotelName}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your hotel operations efficiently with our comprehensive management system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200"
              >
                <div className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${card.bgColor} rounded-lg mb-4`}>
                    <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <button className={`px-4 py-2 ${card.color} text-white rounded-lg transition-colors font-medium`}>
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentGuests.length}</p>
              <p className="text-sm text-gray-600">Current Bookings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{availableRooms}</p>
              <p className="text-sm text-gray-600">Available Rooms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{todayBookings}</p>
              <p className="text-sm text-gray-600">Today's Bookings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{todayRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {hotelName}. All rights reserved.</p>
            <p className="text-sm mt-1">Powered by EasyWaySolution Hotel Management System</p>
          </div>
        </div>
      </footer>

      {showGuestTable && <GuestTable />}
      {selectedGuest && <GuestDetailsModal guest={selectedGuest} onClose={() => setSelectedGuest(null)} />}
    </div>
  )
}

export default HotelHome
