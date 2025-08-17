"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { toast } from "react-toastify"
import {
  Phone,
  CreditCard,
  Globe,
  Camera,
  Fingerprint,
  Upload,
  Loader2,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

interface Props {
  isExistingCustomer: boolean
  onBack: () => void
}

interface FormData {
  name?: string
  address?: string
  city?: string
  state?: string
  contact?: string
  adharNo?: string
  nationality?: string
  fingerprint_data?: string
  face_image?: File
  adharImgF?: File
  adharImgB?: File
}

const RegistrationForm = ({ isExistingCustomer, onBack }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    nationality: "Indian",
  })

  // ✅ OFFICIAL MFS110.js loading function
  const loadOfficialMFS110 = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).Mantra) {
        console.log("✅ Official MFS110 SDK already loaded")
        return resolve()
      }

      const script = document.createElement("script")

      // ✅ OFFICIAL FILE PATH - आपको यहाँ सही path देना है
      script.src = "/MFS110-official.js" // Official file का नाम
      script.type = "text/javascript"
      script.async = false // Sync loading for official SDK

      script.onload = () => {
        console.log("📦 Official MFS110 script loaded")

        // Check for Mantra object
        if ((window as any).Mantra) {
          console.log("✅ Official Mantra SDK detected")
          console.log("Available methods:", Object.keys((window as any).Mantra))
          resolve()
        } else {
          console.error("❌ Official SDK loaded but Mantra object not found")
          reject(new Error("Official MFS110 SDK loaded but Mantra object not found"))
        }
      }

      script.onerror = (error) => {
        console.error("❌ Failed to load official MFS110 SDK:", error)
        reject(new Error("Failed to load official MFS110 SDK - Check if file exists at /MFS110-official.js"))
      }

      document.head.appendChild(script)
    })
  }

  const [imagePreview, setImagePreview] = useState({
    face: "",
    adharFront: "",
    adharBack: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState("Initializing...")
  const [fingerprintDevice, setFingerprintDevice] = useState<any>(null)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [initSteps, setInitSteps] = useState<string[]>([])

  const fileInputRefs = {
    face: useRef<HTMLInputElement>(null),
    adharFront: useRef<HTMLInputElement>(null),
    adharBack: useRef<HTMLInputElement>(null),
  }

  useEffect(() => {
    const initializeOfficialDevice = async () => {
      const steps: string[] = []

      try {
        // Step 1: Load Official SDK
        steps.push("🔄 Loading official Mantra MFS110 SDK...")
        setInitSteps([...steps])
        setFingerprintStatus("Loading official SDK...")

        await loadOfficialMFS110()
        steps.push("✅ Official SDK loaded successfully")
        setInitSteps([...steps])

        // Step 2: Create device instance
        steps.push("🔄 Creating MFS110 device instance...")
        setInitSteps([...steps])
        setFingerprintStatus("Creating device instance...")

        const mfs110 = new (window as any).Mantra.MFS110()
        console.log("📱 Official MFS110 instance created")

        // Step 3: Initialize device with proper error handling
        steps.push("🔄 Initializing device (may take 10-15 seconds)...")
        setInitSteps([...steps])
        setFingerprintStatus("Connecting to hardware...")

        // Official device initialization with extended timeout
        const initResult = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Device initialization timeout (15s) - Check USB connection"))
          }, 15000)

          mfs110
            .Init()
            .then((result: any) => {
              clearTimeout(timeout)
              console.log("🎉 Official device initialized:", result)
              resolve(result)
            })
            .catch((error: any) => {
              clearTimeout(timeout)
              console.error("❌ Official init failed:", error)
              reject(error)
            })
        })

        steps.push("✅ Device initialized successfully")
        setInitSteps([...steps])
        setFingerprintDevice(mfs110)

        // Step 4: Get device information
        try {
          steps.push("🔄 Retrieving device information...")
          setInitSteps([...steps])

          const info = await mfs110.GetDeviceInfo()
          setDeviceInfo(info)
          console.log("📋 Official device info:", info)

          steps.push("✅ Device information retrieved")
          setInitSteps([...steps])

          setFingerprintStatus("✅ Official device ready for scanning!")
          toast.success("Official Mantra MFS110 device connected successfully!", { autoClose: 3000 })
        } catch (infoError) {
          console.warn("⚠️ Could not get device info (device may still work):", infoError)
          steps.push("⚠️ Device info unavailable (device functional)")
          setInitSteps([...steps])
          setFingerprintStatus("✅ Device ready (limited info)")
        }
      } catch (error: any) {
        console.error("❌ Official device initialization failed:", error)
        steps.push(`❌ Failed: ${error.message}`)
        setInitSteps([...steps])

        // Detailed error messages
        if (error.message.includes("timeout")) {
          setFingerprintStatus("❌ Device timeout - Check connections")
          toast.error(
            "Device connection timeout. Please check:\n• USB cable\n• Device power\n• Driver installation\n• RD Service running",
          )
        } else if (error.message.includes("not found") || error.message.includes("file")) {
          setFingerprintStatus("❌ Official SDK file not found")
          toast.error(
            "Official MFS110.js file not found. Please:\n• Download from Mantra website\n• Place in /public/ folder\n• Rename to MFS110-official.js",
          )
        } else {
          setFingerprintStatus(`❌ Error: ${error.message}`)
          toast.error(`Device initialization error: ${error.message}`)
        }
      }
    }

    initializeOfficialDevice()

    return () => {
      if (fingerprintDevice) {
        fingerprintDevice.CloseDevice?.().catch(console.error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string

        img.onload = () => {
          const MAX_DIMENSION = 800
          let width = img.width
          let height = img.height

          if (width > height && width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width
            width = MAX_DIMENSION
          } else if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height
            height = MAX_DIMENSION
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")!
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                reject(new Error("Failed to compress image"))
              }
            },
            "image/jpeg",
            0.7,
          )
        }

        img.onerror = () => reject(new Error("Failed to load image"))
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (type: "face" | "adharFront" | "adharBack", file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      toast.info("Processing image...")
      const compressedFile = await compressImage(file)
      const previewUrl = URL.createObjectURL(compressedFile)

      setImagePreview((prev) => ({
        ...prev,
        [type]: previewUrl,
      }))

      setFormData((prev) => ({
        ...prev,
        [type === "face" ? "face_image" : type === "adharFront" ? "adharImgF" : "adharImgB"]: compressedFile,
      }))

      toast.success(`${type.replace(/([A-Z])/g, " $1")} image uploaded successfully`)
    } catch (error) {
      toast.error(`Error processing ${type} image`)
      console.error("Image upload error:", error)
    }
  }

  const handleFileSelect = (type: "face" | "adharFront" | "adharBack") => {
    const input = fileInputRefs[type].current
    if (input) input.click()
  }

  const handleFileChange = (type: "face" | "adharFront" | "adharBack") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(type, file)
  }

  // Official device fingerprint scanning
  const scanFingerprint = async () => {
    if (!fingerprintDevice) {
      toast.error("Official device not initialized")
      return
    }

    setIsScanning(true)
    setFingerprintStatus("👆 Place finger firmly on scanner...")

    try {
      toast.info("Place your finger firmly on the scanner and hold still", { autoClose: 3000 })

      const result: any = await new Promise((resolve, reject) => {
        // Official device capture with extended timeout
        const timeout = setTimeout(() => {
          reject(new Error("Scan timeout (20s) - Please try again"))
        }, 20000) // 20 second timeout for real device

        fingerprintDevice.Capture((status: number, data: any) => {
          clearTimeout(timeout)
          console.log("🔍 Official scan result:", { status, data })

          if (status === 0) {
            resolve(data)
          } else {
            // Handle official SDK error codes
            let errorMsg = `Scan failed with status: ${status}`
            switch (status) {
              case 1001:
                errorMsg = "Device not found - Check USB connection"
                break
              case 1002:
                errorMsg = "Device not connected - Reconnect device"
                break
              case 1003:
                errorMsg = "Capture timeout - Try again"
                break
              case 1004:
                errorMsg = "Poor quality - Clean finger and try again"
                break
              case 1005:
                errorMsg = "Device busy - Wait and try again"
                break
              case 1006:
                errorMsg = "Finger not detected - Place finger properly"
                break
              default:
                errorMsg = `Unknown error (${status}) - Check device`
            }
            reject(new Error(errorMsg))
          }
        })
      })

      // Process official device result
      let isoTemplate = ""

      if (result.ISOTemplate) {
        if (typeof result.ISOTemplate === "string") {
          isoTemplate = result.ISOTemplate
        } else if (result.ISOTemplate instanceof ArrayBuffer) {
          isoTemplate = btoa(String.fromCharCode(...new Uint8Array(result.ISOTemplate)))
        } else if (Array.isArray(result.ISOTemplate)) {
          isoTemplate = btoa(String.fromCharCode(...result.ISOTemplate))
        } else {
          console.warn("Unknown ISOTemplate format:", typeof result.ISOTemplate)
          isoTemplate = String(result.ISOTemplate)
        }
      }

      setFormData((prev) => ({
        ...prev,
        fingerprint_data: isoTemplate,
      }))

      const timestamp = new Date().toLocaleTimeString()
      const quality = result.Quality || "N/A"
      const nfiq = result.NFIQ || "N/A"

      setFingerprintStatus(`✅ Official scan completed at ${timestamp} (Quality: ${quality})`)
      toast.success(`Official fingerprint captured successfully! Quality: ${quality}`, { autoClose: 3000 })
    } catch (error: any) {
      setFingerprintStatus("❌ Scan failed")
      toast.error(error.message || "Official device scan failed")
      console.error("Official scan error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const submitToApi = async (data: FormData) => {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Authentication token not found")

    const formData = new FormData()

    // Add text fields
    formData.append("name", data.name || "")
    formData.append("address", data.address || "")
    formData.append("city", data.city || "")
    formData.append("state", data.state || "")
    formData.append("contact", data.contact || "")
    formData.append("adharNo", data.adharNo || "")
    formData.append("nationality", data.nationality || "Indian")

    // Add image files
    if (data.face_image) {
      formData.append("face_image", data.face_image, "face_image.jpg")
    } else {
      const emptyFile = new File([""], "face_image.jpg", { type: "image/jpeg" })
      formData.append("face_image", emptyFile)
    }

    if (data.adharImgF) {
      formData.append("adharImgF", data.adharImgF, "adhar_front.jpg")
    } else {
      const emptyFile = new File([""], "adhar_front.jpg", { type: "image/jpeg" })
      formData.append("adharImgF", emptyFile)
    }

    if (data.adharImgB) {
      formData.append("adharImgB", data.adharImgB, "adhar_back.jpg")
    } else {
      const emptyFile = new File([""], "adhar_back.jpg", { type: "image/jpeg" })
      formData.append("adharImgB", emptyFile)
    }

    // Add official fingerprint data
    if (data.fingerprint_data) {
      try {
        const byteCharacters = atob(data.fingerprint_data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const fingerprintBlob = new Blob([byteArray], { type: "application/octet-stream" })
        formData.append("fingerprint_data", fingerprintBlob, "fingerprint.iso")
      } catch (error) {
        console.error("Error processing official fingerprint data:", error)
        // Fallback: send as text
        formData.append(
          "fingerprint_data",
          new Blob([data.fingerprint_data], { type: "text/plain" }),
          "fingerprint.txt",
        )
      }
    } else {
      const emptyBlob = new Blob([""], { type: "application/octet-stream" })
      formData.append("fingerprint_data", emptyBlob, "fingerprint.iso")
    }

    try {
      const response = await fetch("https://s-m-s-keyw.onrender.com/hotel/customer/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage =
            errorJson.detail || errorJson.message || errorJson.error || `Request failed with status ${response.status}`
        } catch {
          errorMessage = `Request failed with status ${response.status}: ${errorText}`
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error("API submission error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name?.trim()) {
        toast.error("Name is required")
        return
      }
      if (!formData.contact?.trim()) {
        toast.error("Contact number is required")
        return
      }

      const result = await submitToApi(formData)
      toast.success(isExistingCustomer ? "Customer updated successfully!" : "Customer registered successfully!")

      setFormData({ nationality: "Indian" })
      setImagePreview({ face: "", adharFront: "", adharBack: "" })
      setFingerprintStatus("✅ Official device ready!")

      onBack()
    } catch (error) {
      console.error("Submission error:", error)
      toast.error(error instanceof Error ? error.message : "Submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">
          {isExistingCustomer ? "Update Existing Customer" : "Register New Customer"}
        </h2>

        {/* Official Device Status */}
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Fingerprint className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Official Mantra MFS110 Device</span>
          </div>

          {/* Initialization Steps */}
          <div className="space-y-1">
            {initSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {step.includes("✅") ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : step.includes("❌") ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : step.includes("⚠️") ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                <span className={step.includes("❌") ? "text-red-700" : "text-gray-700"}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 text-sm font-medium text-green-700">Status: {fingerprintStatus}</div>

          {deviceInfo && (
            <div className="mt-2 text-xs text-green-600">
              Device: {deviceInfo.DeviceInfo} | Serial: {deviceInfo.SerialNumber}
            </div>
          )}
        </div>
      </div>

      {/* Main Form */}
      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">1. Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">5. Contact Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="contact"
                value={formData.contact || ""}
                onChange={handleInputChange}
                maxLength={10}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">2. Address</label>
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors resize-none"
            placeholder="Enter complete address"
          />
        </div>

        {/* City, State, Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">3. City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">4. State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">7. Nationality</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
                placeholder="Enter nationality"
              />
            </div>
          </div>
        </div>

        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">6. Aadhar Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="adharNo"
              value={formData.adharNo || ""}
              onChange={handleInputChange}
              maxLength={12}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter Aadhar number"
            />
          </div>
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aadhar Front */}
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">8. Aadhar Front</label>
            <input
              type="file"
              ref={fileInputRefs.adharFront}
              onChange={handleFileChange("adharFront")}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => handleFileSelect("adharFront")}
              className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                formData.adharImgF
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#126666] hover:bg-blue-50"
              }`}
            >
              {imagePreview.adharFront ? (
                <img
                  src={imagePreview.adharFront || "/placeholder.svg"}
                  alt="Aadhar Front Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Aadhar Front</span>
                </>
              )}
            </button>
          </div>

          {/* Aadhar Back */}
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">9. Aadhar Back</label>
            <input
              type="file"
              ref={fileInputRefs.adharBack}
              onChange={handleFileChange("adharBack")}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => handleFileSelect("adharBack")}
              className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                formData.adharImgB
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#126666] hover:bg-blue-50"
              }`}
            >
              {imagePreview.adharBack ? (
                <img
                  src={imagePreview.adharBack || "/placeholder.svg"}
                  alt="Aadhar Back Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Aadhar Back</span>
                </>
              )}
            </button>
          </div>

          {/* Face Photo */}
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">11. Face Photo</label>
            <input
              type="file"
              ref={fileInputRefs.face}
              onChange={handleFileChange("face")}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => handleFileSelect("face")}
              className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                formData.face_image
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#126666] hover:bg-blue-50"
              }`}
            >
              {imagePreview.face ? (
                <img
                  src={imagePreview.face || "/placeholder.svg"}
                  alt="Face Photo Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Upload Face Photo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Official Device Fingerprint Section */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">
            10. Fingerprint Scan (Official Device)
          </label>

          <button
            type="button"
            onClick={scanFingerprint}
            disabled={!fingerprintDevice || isScanning}
            className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-medium transition-colors ${
              formData.fingerprint_data
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-[#1e7878] hover:bg-[#165a5a] disabled:bg-gray-400 text-white"
            }`}
          >
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
            <span>
              {!fingerprintDevice
                ? "Official Device Not Ready"
                : formData.fingerprint_data
                  ? "Official Fingerprint Captured ✓"
                  : "Scan with Official Device"}
            </span>
          </button>

          <p className="text-gray-600 text-sm mt-2">Status: {fingerprintStatus}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-[#E74C3C] hover:bg-[#c0392b] disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{isExistingCustomer ? "Update Customer" : "Register Customer"}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-4 bg-white hover:bg-gray-50 text-[#E74C3C] font-semibold rounded-lg shadow-md border-2 border-[#E74C3C] transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Back to Selection</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm
