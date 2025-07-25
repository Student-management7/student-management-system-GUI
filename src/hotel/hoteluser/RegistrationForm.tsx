"use client"

import { useState, useRef, useEffect } from "react"
import { toast } from "react-toastify"
import { 
  Phone, 
  CreditCard, 
  Globe, 
  Camera, 
  Fingerprint, 
  Upload, 
  Check, 
  Loader2,
  Save, 
  RotateCcw,
  AlertCircle
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
  face_image?: string
  adharImgF?: string
  adharImgB?: string
}

const RegistrationForm = ({ isExistingCustomer, onBack }: Props) => {
  // Form state - all fields optional
  const [formData, setFormData] = useState<FormData>({
    nationality: "Indian" // Default value
  })

  // Image preview states
  const [imagePreview, setImagePreview] = useState({
    face: "",
    adharFront: "",
    adharBack: "",
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState("Not scanned")
  const [fingerprintDevice, setFingerprintDevice] = useState<any>(null)

  // Refs for file inputs
  const fileInputRefs = {
    face: useRef<HTMLInputElement>(null),
    adharFront: useRef<HTMLInputElement>(null),
    adharBack: useRef<HTMLInputElement>(null),
  }

  // Initialize fingerprint scanner
useEffect(() => {
  const waitForSDK = () =>
    new Promise<void>((resolve, reject) => {
      let tries = 0;
      const interval = setInterval(() => {
        if (typeof window !== "undefined" && (window as any).Mantra) {
          clearInterval(interval);
          resolve();
        } else if (tries++ > 20) {
          clearInterval(interval);
          reject(new Error("MFS110 SDK not loaded"));
        }
      }, 300);
    });

  const initializeScanner = async () => {
    try {
      await waitForSDK();

      const MFS = (window as any).Mantra.MFS110;
      const mfs110 = new MFS();

      await mfs110.Init(); // Driver & RD Service connect होनी चाहिए
      console.log(" Mantra MFS110 initialized");
      setFingerprintDevice(mfs110);
    } catch (error) {
      console.error(" MFS110 initialization failed:", error);
      toast.error("Failed to initialize fingerprint scanner. Check driver & SDK");
    }
  };

  initializeScanner();

  return () => {
    if (fingerprintDevice) {
      fingerprintDevice.CloseDevice().catch(console.error);
    }
  };
}, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Optimize image before converting to base64
  const optimizeImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        
        img.onload = async () => {
          // Reduce image dimensions
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

          // Create canvas and compress
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to JPEG with 70% quality
          const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
          resolve(base64)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle image uploads with optimization
  const handleImageUpload = async (type: "face" | "adharFront" | "adharBack", file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        toast.error("Image size should be less than 2MB")
        return
      }

      const optimizedBase64 = await optimizeImage(file)
      const previewUrl = URL.createObjectURL(file)

      setImagePreview(prev => ({
        ...prev,
        [type]: previewUrl
      }))

      setFormData(prev => ({
        ...prev,
        [type === "face" ? "face_image" : 
         type === "adharFront" ? "adharImgF" : "adharImgB"]: optimizedBase64
      }))

      toast.success(`${type.replace(/([A-Z])/g, ' $1')} image uploaded successfully`)
    } catch (error) {
      toast.error(`Error uploading ${type} image`)
      console.error("Image upload error:", error)
    }
  }

  // Trigger file input click
  const handleFileSelect = (type: "face" | "adharFront" | "adharBack") => {
    const input = fileInputRefs[type].current
    if (input) input.click()
  }

  // Handle file selection
  const handleFileChange = (type: "face" | "adharFront" | "adharBack") => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleImageUpload(type, file)
    }

  // Scan fingerprint
//  const scanFingerprint = async () => {
//   if (!fingerprintDevice) {
//     toast.error("Mantra MFS110 scanner not connected");
//     return;
//   }

//   setIsScanning(true);
//   setFingerprintStatus("Scanning...");

//   try {
//     // फिंगरप्रिंट कैप्चर करें
//     const result = await new Promise((resolve, reject) => {
//       fingerprintDevice.Capture((status: number, data: any) => {
//         if (status === 0) resolve(data);
//         else reject(new Error(`Scan failed with status: ${status}`));
//       });
//     });

//     // ISO टेम्प्लेट को base64 में कन्वर्ट करें
//     const base64Data = btoa(
//       String.fromCharCode(...new Uint8Array(result.ISOTemplate))
//     );

//     setFormData(prev => ({
//       ...prev,
//       fingerprint_data: base64Data // base64 फॉर्मेट में सेव करें
//     }));

//     setFingerprintStatus(`Scanned at ${new Date().toLocaleTimeString()}`);
//     toast.success("Fingerprint captured successfully");
//   } catch (error) {
//     setFingerprintStatus("Scan failed");
//     toast.error(error instanceof Error ? error.message : "Scan failed");
//     console.error("Scan error:", error);
//   } finally {
//     setIsScanning(false);
//   }
// };
const scanFingerprint = async () => {
  if (!fingerprintDevice) {
    toast.error("Fingerprint scanner not initialized");
    return;
  }

  setIsScanning(true);
  setFingerprintStatus("Scanning...");

  try {
    const result: any = await new Promise((resolve, reject) => {
      fingerprintDevice.Capture((status: number, data: any) => {
        if (status === 0) resolve(data);
        else reject(new Error(`Scan failed with status: ${status}`));
      });
    });

    console.log("Raw Scan Result:", result);

    // Some SDKs already return Base64
    const isoTemplate =
      typeof result.ISOTemplate === "string"
        ? result.ISOTemplate
        : btoa(String.fromCharCode(...new Uint8Array(result.ISOTemplate)));

    setFormData((prev) => ({
      ...prev,
      fingerprint_data: isoTemplate,
    }));

    setFingerprintStatus(`✅ Scanned at ${new Date().toLocaleTimeString()}`);
    toast.success("Fingerprint captured successfully");
  } catch (error: any) {
    setFingerprintStatus(" Scan failed");
    toast.error(error.message || "Scan failed");
    console.error("Scan error:", error);
  } finally {
    setIsScanning(false);
  }
};

  // Submit form to API
 const submitToApi = async (data: FormData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Authentication token not found");

  // सभी फील्ड्स को फिल्टर करें और base64 फिंगरप्रिंट डेटा शामिल करें
  const payload = {
    ...Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
    ),
    fingerprint_data: data.fingerprint_data // पहले से ही base64 में है
  };

  const response = await fetch('https://s-m-s-keyw.onrender.com/hotel/customer/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return await response.json();
};

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to API
      const result = await submitToApi(formData)
      
      toast.success(
        isExistingCustomer 
          ? "Customer updated successfully!" 
          : "Customer registered successfully!"
      )
      
      // Reset form
      setFormData({ nationality: "Indian" })
      setImagePreview({
        face: "",
        adharFront: "",
        adharBack: "",
      })
      
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
        {isExistingCustomer && (
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <Check className="w-4 h-4 mr-1" />
            Existing customer data loaded
          </p>
        )}
      </div>

      {/* Main Form */}
      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              1. Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              5. Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="contact"
                value={formData.contact || ''}
                onChange={handleInputChange}
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">
            2. Address
          </label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors resize-none"
            placeholder="Enter complete address"
          />
        </div>

        {/* City, State, Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              3. City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              4. State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              7. Nationality
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nationality"
                value={formData.nationality || ''}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#126666] focus:outline-none bg-gray-50 transition-colors"
                placeholder="Enter nationality"
              />
            </div>
          </div>
        </div>

        {/* Aadhar Number */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">
            6. Aadhar Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="adharNo"
              value={formData.adharNo || ''}
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
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              8. Aadhar Front
            </label>
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
                  src={imagePreview.adharFront}
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
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              9. Aadhar Back
            </label>
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
                  src={imagePreview.adharBack}
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
            <label className="block text-sm font-semibold text-[#126666] mb-2">
              11. Face Photo
            </label>
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
                  src={imagePreview.face}
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

        {/* Fingerprint Section */}
        <div>
          <label className="block text-sm font-semibold text-[#126666] mb-2">
            10. Fingerprint Scan
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
            {isScanning ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Fingerprint className="w-5 h-5" />
            )}
            <span>
              {!fingerprintDevice
                ? "Fingerprint Scanner Not Available"
                : formData.fingerprint_data
                  ? "Fingerprint Captured ✓"
                  : "Scan Fingerprint"}
            </span>
          </button>
          <p className="text-gray-600 text-sm mt-2">
            Status: {fingerprintStatus}
            {!fingerprintDevice && (
              <span className="text-red-500 ml-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                Scanner not detected
              </span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-[#E74C3C] hover:bg-[#c0392b] disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
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