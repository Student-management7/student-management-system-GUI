"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Hotel, UserPlus, Users, Bed, Calendar, Settings, BarChart3, Bell, LogOut, User } from "lucide-react"

const HotelHome: React.FC = () => {
  const navigate = useNavigate()

  // Get hotel data from localStorage
  const hotelName = localStorage.getItem("hotelName") || "Hotel Management"
  const ownerName = localStorage.getItem("ownerName") || "Hotel Owner"
  
  const handleLogout = () => {
    // Clear all hotel-related data from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("email")
    localStorage.removeItem("userType")
    localStorage.removeItem("hotelData")
    localStorage.removeItem("hotelName")
    localStorage.removeItem("ownerName")
    localStorage.removeItem("role")

    // Navigate to hotel login
    navigate("/")
  }

  const dashboardCards = [
    { 
      title: "Register New Guest",
      description: "Add new customer to the system",
      icon: UserPlus,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      onClick: () => navigate("/hotel-customer"),
    },
    {
      title: "Manage Guests",
      description: "View and manage existing guests",
      icon: Users,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      onClick: () => navigate("/hotel/guests"),
    },
    {
      title: "Room Management",
      description: "Manage hotel rooms and availability",
      icon: Bed,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      onClick: () => navigate("/hotel/rooms"),
    },
    {
      title: "Bookings",
      description: "View and manage reservations",
      icon: Calendar,
     color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      onClick: () => navigate("/hotel/bookings"),
    },
    {
      title: "Reports",
      description: "View analytics and reports",
      icon: BarChart3,
      color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      onClick: () => navigate("/hotel/reports"),
    },
    {
      title: "Settings",
      description: "Hotel settings and configuration",
      icon: Settings,
     color: "bg-[#1e7878] hover:bg-teal-600",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
      onClick: () => navigate("/hotel/settings"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/AppBar */}
      <header className="bg-[#126666] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Hotel className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{hotelName}</h1>
                <p className="text-teal-100 text-sm">Management Dashboard</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 text-white">
                <div className="text-right">
                  <p className="text-sm font-medium">{ownerName}</p>
                  <p className="text-xs text-teal-100">Hotel Owner</p>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-full mb-6">
            <Hotel className="w-12 h-12 text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {hotelName}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your hotel operations efficiently with our comprehensive management system. Get started by selecting
            an option below.
          </p>
        </div>

        {/* Dashboard Cards Grid */}
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
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

        {/* Quick Stats Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Total Guests</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bed className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Available Rooms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Today's Bookings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {hotelName}. All rights reserved.</p>
            <p className="text-sm mt-1">Powered by EasyWaySolution Hotel Management System</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HotelHome
