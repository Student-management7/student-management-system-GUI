
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { LogOut, Loader2 } from "lucide-react"
import CustomerSelection from "./CustomerSelection"
import RegistrationForm from "./RegistrationForm"

const HotelRegistrationForm = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<"selection" | "form">("selection")
  const [isExisting, setIsExisting] = useState(false)
  // const [token] = useState(localStorage.getItem("authToken"))

  const token = localStorage.getItem("token") 
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login-hotel")
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Session Expired</h2>
          <p className="mb-4">Please login again to continue</p>
          <button
            onClick={() => navigate("/login-hotel")}
            className="px-4 py-2 bg-[#126666] text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#126666] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Hotel Registration</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {view === "selection" ? (
          <CustomerSelection 
            onNewCustomer={() => {
              setIsExisting(false)
              setView("form")
            }}
            onExistingCustomer={() => {
              setIsExisting(true)
              setView("form")
            }}
          />
        ) : (
          <RegistrationForm 
            isExistingCustomer={isExisting}
            onBack={() => setView("selection")}
          />
        )}
      </main>
    </div>
  )
}

export default HotelRegistrationForm