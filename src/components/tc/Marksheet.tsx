"use client"

import { useState, useEffect } from "react"

interface Student {
  id: string
  name: string
  cls: string
  studentCode: string
  contact: string
  email: string
  gender: string
  dob: string
  city: string
  state: string
  familyDetails: {
    stdo_FatherName: string
    stdo_MotherName: string
    stdo_primaryContact: string
  }
}

interface Subject {
  subject: string
  marksObtained: number
  maxMarks: number
  remarks: string
}

interface ReportCard {
  id: string
  reportId: string
  examType: string
  examDate: string
  subjects: Subject[]
  totalMarks: number
  average: number
  grade: string
  studentInfo: Student
}

function Marksheet() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token")

  // Helper function to safely get value or return N/A
  const safeValue = (value: any, fallback = "N/A"): string => {
    if (value === null || value === undefined || value === "") {
      return fallback
    }
    return String(value)
  }

  // API headers with token
  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
      headers["token"] = token
    }
    return headers
  }

  // Fetch all students with token
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching students with token:", token ? "Token present" : "No token")

      const response = await fetch("https://s-m-s-keyw.onrender.com/student/findAllStudent", {
        method: "GET",
        headers: getHeaders(),
      })

      console.log("Students API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Students API error response:", errorText)
        throw new Error(`Failed to fetch students: ${response.status}`)
      }

      const data = await response.json()

      // Validate and clean student data
      const validatedStudents = Array.isArray(data)
        ? data.map((student) => ({
            ...student,
            name: safeValue(student?.name),
            cls: safeValue(student?.cls),
            studentCode: safeValue(student?.studentCode),
            contact: safeValue(student?.contact),
            email: safeValue(student?.email),
            gender: safeValue(student?.gender),
            dob: safeValue(student?.dob),
            city: safeValue(student?.city),
            state: safeValue(student?.state),
            familyDetails: {
              stdo_FatherName: safeValue(student?.familyDetails?.stdo_FatherName),
              stdo_MotherName: safeValue(student?.familyDetails?.stdo_MotherName),
              stdo_primaryContact: safeValue(student?.familyDetails?.stdo_primaryContact),
            },
          }))
        : []

      console.log("Students data received:", validatedStudents.length, "students")
      setStudents(validatedStudents)
    } catch (error) {
      console.error("Error fetching students:", error)
      setError(`Error fetching students: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentReport = async (studentId: string) => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching report for student ID:", studentId)

      const url = `https://s-m-s-keyw.onrender.com/report/getStudentReport?id=${studentId}`
      console.log("Request URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)

        // If it's a 404 or similar, it might just mean no reports exist
        if (response.status === 404) {
          setReportCards([])
          return
        }

        throw new Error(`Failed to fetch report: ${response.status}`)
      }

      const data = await response.json()
      console.log("Report data received:", data)

      // Validate report data
      const validatedReports = Array.isArray(data)
        ? data.map((report) => ({
            ...report,
            examType: safeValue(report?.examType, "Unknown Exam"),
            examDate: safeValue(report?.examDate, new Date().toISOString().split("T")[0]),
            grade: safeValue(report?.grade, "N/A"),
            average: typeof report?.average === "number" ? report.average : 0,
            totalMarks: typeof report?.totalMarks === "number" ? report.totalMarks : 0,
            subjects: Array.isArray(report?.subjects)
              ? report.subjects.map((subject) => ({
                  subject: safeValue(subject?.subject, "Unknown Subject"),
                  marksObtained: typeof subject?.marksObtained === "number" ? subject.marksObtained : 0,
                  maxMarks: typeof subject?.maxMarks === "number" ? subject.maxMarks : 100,
                  remarks: safeValue(subject?.remarks, "No remarks"),
                }))
              : [],
          }))
        : []

      setReportCards(validatedReports)
    } catch (error) {
      console.error("Error fetching student report:", error)
      setError(`Error fetching student report: ${error.message}`)
      setReportCards([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async (reportCard: ReportCard) => {
    try {
      setLoading(true)
      setError(null)

      // Validate report card data
      if (!reportCard) {
        throw new Error("No report card data available")
      }

      // Safely extract student info with fallbacks
      const studentInfo = reportCard.studentInfo || selectedStudent || {}
      const subjects = Array.isArray(reportCard.subjects) ? reportCard.subjects : []

      // Transform data to match the expected format
      const pdfData = {
        studentName: safeValue(studentInfo.name, "Unknown Student"),
        rollNo: safeValue(studentInfo.studentCode, "N/A"),
        studentClass: safeValue(studentInfo.cls, "N/A"),
        academicYear: "2024-2025",
        date: safeValue(reportCard.examDate, new Date().toISOString().split("T")[0]),
        result: `Grade: ${safeValue(reportCard.grade, "N/A")}`,
        remarks: `Average: ${reportCard.average || 0}% - ${safeValue(reportCard.grade, "N/A")} Grade`,
        subjects: subjects.map((subject) => ({
          name: safeValue(subject.subject, "Unknown Subject"),
          q: typeof subject.marksObtained === "number" ? subject.marksObtained : 0,
          h: typeof subject.maxMarks === "number" ? subject.maxMarks : 100,
          f: typeof subject.marksObtained === "number" ? subject.marksObtained : 0,
        })),
      }

      console.log("PDF Data being sent:", pdfData)

      const response = await fetch("https://s-m-s-keyw.onrender.com/marksheet/download", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(pdfData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server responded with status ${response.status}: ${errorText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${safeValue(studentInfo.name, "Marksheet")}_${safeValue(reportCard.examType, "Report")}_Marksheet.pdf`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError(`Error generating PDF: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student)
    setError(null)
    fetchStudentReport(student.id)
  }

  const filteredStudents = students.filter(
    (student) =>
      safeValue(student.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeValue(student.studentCode).includes(searchTerm) ||
      safeValue(student.cls).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getGradeColorClass = (grade: string) => {
    const gradeValue = safeValue(grade).toUpperCase()
    switch (gradeValue) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      case "D":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fetch students when token is available
  useEffect(() => {
    if (token) {
      fetchStudents()
    }
  }, [token])

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Marksheet System</h1>
        <p className="text-gray-600 text-lg">Manage student reports and generate marksheets</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {!token ? (
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please login to access the marksheet system</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Students ({filteredStudents.length})
                </h2>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loading && !selectedStudent ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Loading students...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <p>No students found</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedStudent?.id === student.id
                            ? "bg-blue-50 border-blue-300 shadow-md"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="font-semibold text-gray-900">{safeValue(student.name)}</div>
                        <div className="text-sm text-gray-600">
                          Class: {safeValue(student.cls)} | Roll: {safeValue(student.studentCode)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {safeValue(student.city)}, {safeValue(student.state)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Details and Report Cards */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <>
                {/* Student Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{safeValue(selectedStudent.name)}</h2>
                      <p className="text-gray-600">Student Information</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Roll Number:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.studentCode)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Class:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.cls)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Gender:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.gender)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">DOB:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.dob)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Contact:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.contact)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Email:</span>
                        <span className="text-gray-900">{safeValue(selectedStudent.email)}</span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Father:</span>
                        <span className="text-gray-900">
                          {safeValue(selectedStudent.familyDetails?.stdo_FatherName)}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-semibold text-gray-700 w-32">Mother:</span>
                        <span className="text-gray-900">
                          {safeValue(selectedStudent.familyDetails?.stdo_MotherName)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Cards */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Report Cards</h2>
                      <p className="text-gray-600">Academic performance across different exams</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading report cards...</p>
                    </div>
                  ) : reportCards.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 text-lg font-semibold">No Report Card Available</p>
                      <p className="text-gray-400 text-sm mt-2">This student doesn't have any report cards yet</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reportCards.map((report) => (
                        <div
                          key={report.reportId}
                          className="border border-gray-200 rounded-lg overflow-hidden border-l-4 border-l-blue-500"
                        >
                          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4"
                                  />
                                </svg>
                                {safeValue(report.examType, "Unknown Exam")}
                              </h3>
                              <p className="text-gray-600">Date: {safeValue(report.examDate)}</p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColorClass(report.grade)}`}
                              >
                                Grade {safeValue(report.grade)}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">Average: {report.average || 0}%</p>
                            </div>
                          </div>

                          <div className="p-6">
                            {report.subjects && report.subjects.length > 0 ? (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                  {report.subjects.map((subject, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                      <div className="font-semibold text-gray-900 mb-1">
                                        {safeValue(subject.subject, "Unknown Subject")}
                                      </div>
                                      <div className="text-lg font-bold text-blue-600 mb-1">
                                        {subject.marksObtained || 0}/{subject.maxMarks || 100}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {safeValue(subject.remarks, "No remarks")}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span className="font-semibold text-gray-900">
                                        Total: {report.totalMarks || 0}
                                      </span>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                      {report.subjects.length > 0
                                        ? (((report.totalMarks || 0) / (report.subjects.length * 100)) * 100).toFixed(1)
                                        : 0}
                                      %
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => generatePDF(report)}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    {loading ? "Generating..." : "Download PDF"}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-gray-500">No subjects data available for this report</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Student</h3>
                  <p className="text-gray-600">Choose a student from the list to view their report cards</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Marksheet
