

import { User, Fingerprint, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface Props {
  onNewCustomer: () => void
  onExistingCustomer: () => void
}


const CustomerSelection = ({ onNewCustomer, onExistingCustomer }: Props) => {
  const [isScanning, setIsScanning] = useState(false)
  const [hasScanner, setHasScanner] = useState(false)
  const [scannerInitialized, setScannerInitialized] = useState(false)

  // Check for fingerprint scanner on component mount
  useEffect(() => {
    checkScanner()
  }, [])

  // Fingerprint scanner detection logic
  const checkFingerprintScanner = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        // Check if DigitalPersona Web SDK is available
        if (typeof window !== "undefined" && (window as any).DPWebSDK) {
          const sdk = (window as any).DPWebSDK
          
          // Check if scanner is connected
          sdk.getDevices()
            .then((devices: any[]) => {
              const scannerConnected = devices.some(device => device.type === 'fingerprint')
              resolve(scannerConnected)
            })
            .catch(() => resolve(false))
        } else {
          // Alternative check for other scanner types
          if (navigator.usb || navigator.hid) {
            // For WebUSB or WebHID compatible scanners
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

  // Initialize scanner check
  const checkScanner = async () => {
    try {
      const scannerAvailable = await checkFingerprintScanner()
      setHasScanner(scannerAvailable)
      setScannerInitialized(true)
      
      if (!scannerAvailable) {
        toast.warning("Fingerprint scanner not detected", {
          autoClose: 3000
        })
      }
    } catch (error) {
      console.error("Scanner initialization failed:", error)
      setHasScanner(false)
      setScannerInitialized(true)
    }
  }

  // Fingerprint verification logic
  const verifyFingerprint = async (): Promise<boolean> => {
    setIsScanning(true)
    
    return new Promise((resolve, reject) => {
      try {
        if (typeof window !== "undefined" && (window as any).DPWebSDK) {
          const sdk = (window as any).DPWebSDK
          
          sdk.scanFingerprint()
            .then((result: any) => {
              if (result?.data) {
                // Here you would typically verify with your backend
                resolve(true)
              } else {
                reject(new Error("No fingerprint data received"))
              }
            })
            .catch((error: any) => {
              reject(error)
            })
        } else {
          reject(new Error("Scanner not available"))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // Handle existing customer flow
  const handleExistingCustomer = async () => {
    setIsScanning(true)
    try {
      const verified = await verifyFingerprint()
      if (verified) {
        onExistingCustomer()
      } else {
        toast.error("Fingerprint verification failed")
      }
    } catch (error: any) {
      console.error("Fingerprint error:", error)
      toast.error(error.message || "Fingerprint scan failed")
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[#126666] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-[#126666]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Customer Registration</h2>
        <p className="text-gray-600 mt-2">Select an option to continue</p>
      </div>

      {scannerInitialized && !hasScanner && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-700 font-medium">Scanner Not Available</p>
            <p className="text-yellow-600 text-sm mt-1">
              To check existing customers, please connect a fingerprint scanner and refresh the page.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={onNewCustomer}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#126666] hover:bg-[#0f5555] text-white rounded-lg transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Register New Customer</span>
        </button>

        <button
          onClick={handleExistingCustomer}
          disabled={!hasScanner || isScanning}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1e7878] hover:bg-[#165a5a] disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Fingerprint className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isScanning ? "Scanning..." : "Check Existing Customer"}
          </span>
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-blue-700 font-medium mb-2">Scanner Requirements</h3>
        <ul className="text-blue-600 text-sm space-y-1">
          <li>• Supported scanners: DigitalPersona U.are.U 4500/5160</li>
          <li>• Requires Chrome/Firefox with WebUSB/WebHID enabled</li>
          <li>• May need to install manufacturer drivers</li>
        </ul>
      </div>
    </div>
  )
}

export default CustomerSelection