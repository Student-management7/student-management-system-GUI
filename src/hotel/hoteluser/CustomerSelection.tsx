"use client"

import { User, Fingerprint, Loader2, AlertCircle, CreditCard, X } from "lucide-react"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import UnifiedNavbar from "../navbar/HotelNavbar"

interface Props {
  onNewCustomer: () => void
}

interface CustomerData {
  id: string
  name: string
  adharNo: string
  address: string
  city: string
  state: string
  contact: string
  nationality: string
}

const CustomerSelection = ({ onNewCustomer }: Props) => {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanner, setHasScanner] = useState(false)
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<"fingerprint" | "aadhar">("fingerprint")
  const [aadharNumber, setAadharNumber] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<CustomerData[]>([])
  const [showGroupSelection, setShowGroupSelection] = useState(false)

  // Check for fingerprint scanner on component mount
  useEffect(() => {
    checkScanner()
  }, [])

  const checkFingerprintScanner = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        if (typeof window !== "undefined" && (window as any).DPWebSDK) {
          const sdk = (window as any).DPWebSDK
          sdk
            .getDevices()
            .then((devices: any[]) => {
              const scannerConnected = devices.some((device) => device.type === "fingerprint")
              resolve(scannerConnected)
            })
            .catch(() => resolve(false))
        } else {
          if (navigator.usb || navigator.hid) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      } catch (error) {
        console.error("Scanner check error:", error)
        resolve(false)
      }
    })
  }

  const checkScanner = async () => {
    try {
      const scannerAvailable = await checkFingerprintScanner()
      setHasScanner(scannerAvailable)
      setScannerInitialized(true)

      if (!scannerAvailable) {
        toast.warning("Fingerprint scanner not detected", { autoClose: 3000 })
      }
    } catch (error) {
      console.error("Scanner initialization failed:", error)
      setHasScanner(false)
      setScannerInitialized(true)
    }
  }

  const verifyFingerprint = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        if (typeof window !== "undefined" && (window as any).DPWebSDK) {
          const sdk = (window as any).DPWebSDK
          sdk
            .scanFingerprint()
            .then((result: any) => {
              if (result?.data) {
                resolve(result.data)
              } else {
                reject(new Error("No fingerprint data received"))
              }
            })
            .catch(reject)
        } else {
          reject(new Error("Scanner not available"))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

const fetchCustomerByAadhar = async (aadharNo: string) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication token not found")

  const response = await fetch(`https://s-m-s-keyw.onrender.com/hotel/customer/get?aadhar=${aadharNo}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = await response.json()

  // ✅ API returns an array, so take the first object
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("NOT_FOUND")
  }

  const customer = data[0]   // 👈 first customer object

  // 👇 Normalize according to your interface
  const customerData: CustomerData = {
    id: customer.id,          // ✅ now ID is correct
    name: customer.name,
    adharNo: customer.adharNo,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    contact: customer.contact,
    nationality: customer.nationality || "",
  }

  return customerData
}


  const handleExistingCustomer = async () => {
    setIsScanning(true)
    try {
      let customerData

      if (verificationMethod === "fingerprint") {
        // Fingerprint verification
        try {
          const fingerprintData = await verifyFingerprint()
          toast.info("Fingerprint captured. Backend integration pending.")
          return
        } catch (error) {
          throw new Error("Fingerprint scan failed")
        }
      } else {
        // Aadhar verification
        if (!aadharNumber ) {
          throw new Error("Please enter a valid 12-digit Aadhar number")
        }

        // Single API call
        customerData = await fetchCustomerByAadhar(aadharNumber)
      }

      if (!customerData) {
        throw new Error("Customer data not found")
      }

      // Add to selected customers list
      const existingIndex = selectedCustomers.findIndex((c) => c.id === customerData.id)
      if (existingIndex === -1) {
        setSelectedCustomers([...selectedCustomers, customerData])
        toast.success(`${customerData.name} added to group`)
        setAadharNumber("") // Clear input for next customer
      } else {
        toast.warning("Customer already added to group")
      }
    } catch (error: any) {
      console.error("Verification error:", error)

      // Handle specific error types
      if (error.message === "CORRUPTED_DATA") {
        toast.error("Customer found but data is corrupted!")
        toast.info("Please register again to update your information", {
          autoClose: 5000,
        })
      } else if (error.message === "NOT_FOUND") {
        toast.error("Customer not found , Please check Aadhar number or register as new customer")
      } else if (error.message.includes("encodeBase64") || error.message.includes("NullPointerException")) {
        toast.error("Customer data is corrupted in database!")
        toast.info("Please register again with fresh information", {
          autoClose: 5000,
        })
      } else {
        toast.error(error.message || "Verification failed")
      }
    } finally {
      setIsScanning(false)
    }
  }

  const removeCustomer = (customerId: string) => {
    setSelectedCustomers(selectedCustomers.filter((c) => c.id !== customerId))
  }

  const proceedWithGroup = () => {
    if (selectedCustomers.length === 0) {
      toast.error("Please add at least one customer to proceed")
      return
    }

    // Extract customer IDs from selected customers
    const customerId = selectedCustomers.map(customer => customer.id)
    
    // Navigate to check-in with all selected customer IDs
    navigate("/customer-checkin", {
      state: {
        customerId: customerId,
        customerData: selectedCustomers,
        isExisting: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <UnifiedNavbar showBackButton={true} onBackClick={() => navigate(-1)} customTitle="Customer Registration" />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div >
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#126666] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-[#126666]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Customer Registration</h2>
              <p className="text-gray-600 mt-2">Select customers for group check-in or register new customer</p>
            </div>

            {selectedCustomers.length > 0 && (
              <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-800">Selected Customers ({selectedCustomers.length})</h3>
                  <button
                    onClick={proceedWithGroup}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Proceed with Group Check-in
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedCustomers.map((customer, index) => (
                    <div key={customer.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">Aadhar: {customer.adharNo}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Method Toggle */}
            <div className="flex gap-4 mb-6 justify-center p-2">
              <button
                onClick={() => setVerificationMethod("fingerprint")}
                className={`w-[250px] p-2 rounded-lg transition-colors ${
                  verificationMethod === "fingerprint" ? "bg-[#126666] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Fingerprint
              </button>
              <button
                onClick={() => setVerificationMethod("aadhar")}
                className={`w-[250px] p-2 rounded-lg transition-colors ${
                  verificationMethod === "aadhar" ? "bg-[#126666] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Aadhar Number
              </button>
              <button
                onClick={onNewCustomer}
                className="w-[250px] p-2 flex items-center justify-center gap-3 bg-[#126666] hover:bg-[#0f5555] text-white rounded-lg transition-colors"
              >
                <span className="font-medium">Register New Customer</span>
              </button>
            </div>

            {verificationMethod === "fingerprint" ? (
              scannerInitialized && !hasScanner ? (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-700 font-medium">Scanner Not Available</p>
                    <p className="text-yellow-600 text-sm mt-1">
                      To check existing customers, please connect a fingerprint scanner and refresh the page.
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleExistingCustomer}
                  disabled={!hasScanner || isScanning}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1e7878] hover:bg-[#165a5a] disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed mb-6"
                >
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
                  <span className="font-medium">{isScanning ? "Scanning..." : "Add Customer with Fingerprint"}</span>
                </button>
              )
            ) : (
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ""))}
                    maxLength={12}
                    placeholder="Enter 12-digit Aadhar number"
                    className="w-full pl-10 pr-4 py-3 form-control"
                  />
                </div>
                <button
                  onClick={handleExistingCustomer}
                  disabled={isScanning || !aadharNumber }
                  className="w-full flex items-center justify-center gap-3 py-3 bg-[#1e7878] hover:bg-[#165a5a] disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Add Customer with Aadhar</span>}
                </button>
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Group Check-in Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Add multiple customers by entering their Aadhar numbers one by one</li>
                <li>• Each customer will be added to the group selection</li>
                <li>• Click "Proceed with Group Check-in" when all customers are added</li>
                <li>• All customers will be checked in together with shared booking details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSelection