"use client"

import { useState, useEffect } from "react"

interface FamilyDetails {
  stdo_FatherName: string
  stdo_MotherName: string
  stdo_primaryContact: string
  stdo_secondaryContact: string
  stdo_address: string
  stdo_city: string
  stdo_state: string
  stdo_email: string
}

interface Student {
  id: string
  name: string
  address: string
  city: string
  state: string
  familyDetails: FamilyDetails
  contact: string
  gender: string
  dob: string
  email: string
  cls: string
  department: string
  category: string
  studentCode: string
  status: string
}

interface TCPayload {
  tcNo: string
  admissionNo: string
  studentName: string
  fatherName: string
  motherName: string
  caste: string
  dobFigures: string
  dobWords: string
  nationality: string
  lastClass: string
  promotedTo: string
  admissionDate: string
  leavingDate: string
  reason: string
  conduct: string
  remarks: string
  date: string
  principalName: string
}

function TransferCertificate() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Filter states
  const [classFilter, setClassFilter] = useState("All Classes")
  const [nameFilter, setNameFilter] = useState("")

  // Form data for missing fields
  const [formData, setFormData] = useState<Partial<TCPayload>>({
    tcNo: "",
    admissionNo: "",
    dobWords: "",
    nationality: "Indian",
    promotedTo: "",
    admissionDate: "",
    leavingDate: "",
    reason: "",
    conduct: "Good",
    remarks: "",
    date: new Date().toLocaleDateString("en-GB"),
    principalName: "",
  })

  // API Token - You can replace this with your actual token
  const API_TOKEN = localStorage.getItem("token")

  if (!API_TOKEN) {
    console.log("token not found")
  }

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students when filters change
  useEffect(() => {
    let filtered = students

    if (classFilter !== "All Classes") {
      filtered = filtered.filter((student) => student.cls.toLowerCase().includes(classFilter.toLowerCase()))
    }

    if (nameFilter) {
      filtered = filtered.filter((student) => student.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }

    setFilteredStudents(filtered)
  }, [students, classFilter, nameFilter])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://s-m-s-keyw.onrender.com/student/findAllStudent", {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch students")

      const data = await response.json()
      setStudents(data)
      setFilteredStudents(data)
    } catch (error) {
      alert("Failed to fetch students data")
    } finally {
      setLoading(false)
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  const selectStudent = (student: Student) => {
    setSelectedStudent(student)
    // Pre-fill form with available data
    setFormData((prev) => ({
      ...prev,
      studentName: student.name,
      fatherName: student.familyDetails.stdo_FatherName,
      motherName: student.familyDetails.stdo_MotherName,
      caste: student.category,
      dobFigures: formatDateForDisplay(student.dob),
      lastClass: student.cls,
      admissionNo: student.studentCode,
    }))
  }

  const handleInputChange = (field: keyof TCPayload, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateTCPayload = (): TCPayload => {
    if (!selectedStudent) throw new Error("No student selected")

    return {
      tcNo: formData.tcNo || "",
      admissionNo: formData.admissionNo || selectedStudent.studentCode,
      studentName: selectedStudent.name,
      fatherName: selectedStudent.familyDetails.stdo_FatherName,
      motherName: selectedStudent.familyDetails.stdo_MotherName,
      caste: selectedStudent.category,
      dobFigures: formatDateForDisplay(selectedStudent.dob),
      dobWords: formData.dobWords || "",
      nationality: formData.nationality || "Indian",
      lastClass: selectedStudent.cls,
      promotedTo: formData.promotedTo || "",
      admissionDate: formData.admissionDate || "",
      leavingDate: formData.leavingDate || "",
      reason: formData.reason || "",
      conduct: formData.conduct || "Good",
      remarks: formData.remarks || "",
      date: formData.date || new Date().toLocaleDateString("en-GB"),
      principalName: formData.principalName || "",
    }
  }

  const downloadTC = async () => {
    if (!selectedStudent) {
      alert("Please select a student first")
      return
    }

    setDownloading(true)
    try {
      const payload = generateTCPayload()

      const response = await fetch("https://s-m-s-keyw.onrender.com/student/download-tc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to generate TC")

      // Handle PDF download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `TC_${selectedStudent.name}_${formData.tcNo || "TC"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert("Transfer Certificate downloaded successfully")
    } catch (error) {
      alert("Failed to download Transfer Certificate")
    } finally {
      setDownloading(false)
    }
  }

  const getUniqueClasses = () => {
    const classes = [...new Set(students.map((student) => student.cls))]
    return classes.sort()
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Transfer Certificate Generator</h1>
        <p className="text-gray-600 mt-2">Generate and download student transfer certificates</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">🔍 Search & Filter Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Class</label>
            <select
              className="w-1/2 form-control"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All Classes">All Classes</option>
              {getUniqueClasses().map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              className="w-2/3 form-control"
              placeholder="Enter student name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="w-full btn button text-white p-2 rounded-md  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Students ({filteredStudents.length})</h2>
        <p className="text-gray-600 mb-4">Click on a student to generate their TC</p>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#126666]"></div>
          </div>
        ) : (
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedStudent?.id === student.id ? "bg-[#126666] text-white" : "hover:bg-[3a8686] border-gray-200"
                }`}
                onClick={() => selectStudent(student)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm opacity-70">
                      Class: {student.cls} | Code: {student.studentCode} | Category: {student.category}
                    </p>
                  </div>
                  <div className="text-sm opacity-70">{student.contact}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TC Form */}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Generate TC for {selectedStudent.name}</h2>
          <p className="text-gray-600 mb-6">Fill in the missing information to generate the transfer certificate</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auto-filled fields (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Name (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedStudent.name}
                  disabled
                //   className="w-full  p-2 border border-gray-300 rounded-md bg-gray-100"
                className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father Name (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedStudent.familyDetails.stdo_FatherName}
                  disabled
                  className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother Name (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedStudent.familyDetails.stdo_MotherName}
                  disabled
                  className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caste/Category (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedStudent.category}
                  disabled
                  className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth (Auto-filled)</label>
                <input
                  type="text"
                  value={formatDateForDisplay(selectedStudent.dob)}
                  disabled
                  className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Class (Auto-filled)</label>
                <input
                  type="text"
                  value={selectedStudent.cls}
                  disabled
                  className="w-1/2 form-control"
                />
              </div>

              {/* Manual input fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TC Number</label>
                <input
                  type="text"
                  placeholder="e.g., 2024/001"
                  value={formData.tcNo}
                  onChange={(e) => handleInputChange("tcNo", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Number</label>
                <input
                  type="text"
                  placeholder="Admission number"
                  value={formData.admissionNo}
                  onChange={(e) => handleInputChange("admissionNo", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth (in words)</label>
                <input
                  type="text"
                  placeholder="e.g., Fifteenth August Two Thousand Ten"
                  value={formData.dobWords}
                  onChange={(e) => handleInputChange("dobWords", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Promoted To</label>
                <input
                  type="text"
                  placeholder="e.g., IX"
                  value={formData.promotedTo}
                  onChange={(e) => handleInputChange("promotedTo", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleInputChange("admissionDate", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leaving Date</label>
                <input
                  type="date"
                  value={formData.leavingDate}
                  onChange={(e) => handleInputChange("leavingDate", e.target.value)}
                  className="form-control w-1/2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leaving</label>
                <input
                  type="text"
                  placeholder="e.g., Parent Transfer"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="w-1/2 form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conduct</label>
                <select
                  value={formData.conduct}
                  onChange={(e) => handleInputChange("conduct", e.target.value)}
                  className="w-1/2 form-control"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Principal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Mr. A. Sharma"
                  value={formData.principalName}
                  onChange={(e) => handleInputChange("principalName", e.target.value)}
                  className="w-1/2 form-control"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                placeholder="Additional remarks..."
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                rows={3}
                
                className="form-control w-1/2"
              />
            </div>

            <button
              onClick={downloadTC}
              disabled={downloading}
              className=" btn button  text-white p-2 rounded-md text-lg font-medium  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating TC...
                </>
              ) : (
                <>📄 Download Transfer Certificate</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransferCertificate
