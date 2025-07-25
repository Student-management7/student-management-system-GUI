"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Hotel, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, UserPlus, Send } from "lucide-react"

interface LoginFormData {
  email: string
  password: string
}

interface ForgotPasswordData {
  email: string
}

const HotelLogin: React.FC = () => {
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>({
    email: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  // Email validation function
  const isValidEmail = (email: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  }

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle forgot password form input changes
  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Function to handle forgot password request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    const { email } = forgotPasswordData

    if (!email.trim()) {
      toast.error("Please enter your email address.")
      return
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://s-m-s-keyw.onrender.com/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.status === 200) {
        toast.success("Password reset instructions have been sent to your email.")
        setShowForgotPassword(false)
        setForgotPasswordData({ email: "" })
      } else {
        const responseBody = await response.json()
        const errorMessage = responseBody.message || "Failed to send password reset email."
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
      console.error("Forgot password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch and store hotel data
//   const fetchAndStoreHotelData = async (token: string) => {
//     try {
//       const response = await fetch("https://s-m-s-keyw.onrender.com/hotel/profile", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.status === 200) {
//         const data = await response.json()

//         // Store hotel data in localStorage
//         localStorage.setItem("hotelData", JSON.stringify(data))
//         localStorage.setItem("hotelName", data.hotelName || "Unknown Hotel")
//         localStorage.setItem("ownerName", data.ownerName || "Unknown Owner")
//         localStorage.setItem("role", "hotel")
//       }
//       navigate("/home")
//     } catch (error) {
//       console.error("Failed to load hotel data:", error)
//     }
//   }

  // Function to handle hotel login request
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { email, password } = loginData

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.")
      return
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://s-m-s-keyw.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Hotel login response status:", response.status)
      const responseData = await response.json()
      console.log("Hotel login response body:", responseData)

      if (response.status === 200) {
        const { token } = responseData

        // Store authentication data in localStorage
        localStorage.setItem("token", token)
        // localStorage.setItem("email", email)
        // localStorage.setItem("userType", "hotel")

        // Fetch and store hotel data
        // await fetchAndStoreHotelData(token)

        toast.success("Login Successful!")

        // Navigate to hotel home screen after a short delay
       
          navigate("/hotel-home")
       
      } else {
        const errorMessage = responseData.message || "Invalid email or password."
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
      console.error("Hotel login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background with Logo */}
      <div className="hidden lg:flex w-1/2 bg-[#126666] items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-white bg-opacity-20 rounded-full p-6 inline-block mb-6">
            <Hotel className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Hotel Management</h1>
          <p className="text-xl text-white opacity-80">Welcome back to your dashboard</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Login/Forgot Password Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {showForgotPassword ? "Forgot Password" : "Hotel Login"}
              </h2>
            </div>

            {!showForgotPassword ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#126666] rounded-lg focus:border-[#126666] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full pl-12 pr-12 py-3 border-2 border-[#126666] rounded-lg focus:border-[#126666] focus:outline-none transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#126666] hover:bg-[#0f5555] disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Login</span>}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#126666] hover:text-[#0f5555] font-medium underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#126666] rounded-lg focus:border-[#126666] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#126666] hover:bg-[#0f5555] disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setForgotPasswordData({ email: "" })
                    }}
                    className="flex items-center justify-center space-x-2 text-[#126666] hover:text-[#0f5555] font-medium underline transition-colors mx-auto"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Register New Hotel Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/register")}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-[#E74C3C] hover:bg-[#c0392b] text-white font-semibold rounded-lg shadow-md transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register New Hotel</span>
            </button>
            <button  onClick={() => navigate("/hotel-home")}>temp dashbord</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelLogin