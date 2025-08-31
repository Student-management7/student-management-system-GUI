"use client"

import { User, Fingerprint, Loader2, AlertCircle, CreditCard } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import UnifiedNavbar from "../navbar/HotelNavbar"

interface Props {
  onNewCustomer: () => void
}

const CustomerSelection = ({ onNewCustomer }: Props) => {
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanner, setHasScanner] = useState(false)
  const [scannerInitialized, setScannerInitialized] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<"fingerprint" | "aadhar">("fingerprint")
  const [aadharNumber, setAadharNumber] = useState("")

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

  // Single API call - no multiple attempts
  const fetchCustomerByAadhar = async (aadharNo: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Authentication token not found")
    }

    console.log(`Making single API call for Aadhar: ${aadharNo}`)

    try {
      const response = await fetch(`https://s-m-s-keyw.onrender.com/hotel/customer/get?aadhar=${aadharNo}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)

        // Parse error details
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson.detail && errorJson.detail.includes("encodeBase64")) {
            throw new Error("CORRUPTED_DATA")
          } else if (errorJson.detail && errorJson.detail.includes("not found")) {
            throw new Error("NOT_FOUND")
          } else {
            throw new Error(errorJson.detail || `API Error: ${response.status}`)
          }
        } catch (parseError) {
          if (errorText.includes("encodeBase64") || errorText.includes("NullPointerException")) {
            throw new Error("CORRUPTED_DATA")
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }
      }

      const customerData = await response.json()
      console.log("Customer data received successfully")
      return customerData
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
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

        // Single API call
        customerData = await fetchCustomerByAadhar(aadharNumber)
      }

      if (!customerData) {
        throw new Error("Customer not found")
      }

      // Success - navigate to check-in
      navigate("/customer-checkin", {
        state: {
          customerData,
          isExisting: true,
        },
      })
    } catch (error: any) {
      console.error("Verification error:", error)

      // Handle specific error types
      if (error.message === "CORRUPTED_DATA") {
        toast.error("Customer found but data is corrupted!")
        toast.info("Please register again to update your information", {
          autoClose: 5000,
        })
      } else if (error.message === "NOT_FOUND") {
        toast.error("Customer not found")
        toast.info("Please check Aadhar number or register as new customer")
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} onBackClick={() => navigate(-1)} customTitle="Customer Registration" />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-[#126666] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-[#126666]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Customer Registration</h2>
              <p className="text-gray-600 mt-2">Select an option to continue</p>
            </div>

            {/* Verification Method Toggle */}
            <div className="flex gap-4 mb-6 justify-center p-2">
              <button
                onClick={() => setVerificationMethod("fingerprint")}
                className={`w-[325px] p-2 rounded-lg transition-colors ${
                  verificationMethod === "fingerprint" ? "bg-[#126666] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Fingerprint
              </button>
              <button
                onClick={() => setVerificationMethod("aadhar")}
                className={`w-[325px] p-2 rounded-lg transition-colors ${
                  verificationMethod === "aadhar" ? "bg-[#126666] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Aadhar Number
              </button>
              <button
                onClick={onNewCustomer}
                className="w-[325px] p-2 flex items-center justify-center gap-3 bg-[#126666] hover:bg-[#0f5555] text-white rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
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
                  <span className="font-medium">{isScanning ? "Scanning..." : "Verify with Fingerprint"}</span>
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
                  disabled={isScanning || !aadharNumber}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-[#1e7878] hover:bg-[#165a5a] disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify with Aadhar</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSelection
