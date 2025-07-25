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

interface ConsolidatedSubject {
  subject: string
  quarterly: { marks: number; maxMarks: number } | null
  halfYearly: { marks: number; maxMarks: number } | null
  final: { marks: number; maxMarks: number } | null
  total: number
  maxTotal: number
  percentage: number
}

interface ConsolidatedReport {
  subjects: ConsolidatedSubject[]
  totalMarks: number
  totalMaxMarks: number
  overallPercentage: number
  overallGrade: string
  examDates: {
    quarterly?: string
    halfYearly?: string
    final?: string
  }
}

function Marksheet() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [consolidatedReport, setConsolidatedReport] = useState<ConsolidatedReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
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

  // Calculate grade based on percentage
  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return "A+"
    if (percentage >= 80) return "A"
    if (percentage >= 70) return "B+"
    if (percentage >= 60) return "B"
    if (percentage >= 50) return "C"
    if (percentage >= 40) return "D"
    return "F"
  }

  // Filter unique exams (take the latest occurrence of each exam type)
  const getUniqueExams = (reports: ReportCard[]): ReportCard[] => {
    const examMap = new Map<string, ReportCard>()

    // Normalize exam type names
    const normalizeExamType = (examType: string): string => {
      const type = examType.toLowerCase().trim()
      if (type.includes("quarter") || type.includes("quaterly")) return "quarterly"
      if (type.includes("half") || type.includes("mid")) return "halfyearly"
      if (type.includes("final") || type.includes("annual")) return "final"
      if (type.includes("test")) return "test"
      return type
    }

    reports.forEach((report) => {
      const normalizedType = normalizeExamType(report.examType)

      // Only keep quarterly, halfyearly, and final exams
      if (["quarterly", "halfyearly", "final"].includes(normalizedType)) {
        // If we already have this exam type, keep the one with later date
        if (
          !examMap.has(normalizedType) ||
          new Date(report.examDate) > new Date(examMap.get(normalizedType)!.examDate)
        ) {
          examMap.set(normalizedType, { ...report, examType: normalizedType })
        }
      }
    })

    return Array.from(examMap.values())
  }

  // Create consolidated report from unique exams
  const createConsolidatedReport = (uniqueReports: ReportCard[]): ConsolidatedReport => {
    const subjectMap = new Map<string, ConsolidatedSubject>()
    const examDates: { quarterly?: string; halfYearly?: string; final?: string } = {}

    // Initialize subjects from all exams
    uniqueReports.forEach((report) => {
      const examType = report.examType as "quarterly" | "halfyearly" | "final"
      examDates[examType === "halfyearly" ? "halfYearly" : examType] = report.examDate

      report.subjects.forEach((subject) => {
        if (!subjectMap.has(subject.subject)) {
          subjectMap.set(subject.subject, {
            subject: subject.subject,
            quarterly: null,
            halfYearly: null,
            final: null,
            total: 0,
            maxTotal: 0,
            percentage: 0,
          })
        }

        const consolidatedSubject = subjectMap.get(subject.subject)!
        const examKey = examType === "halfyearly" ? "halfYearly" : (examType as keyof ConsolidatedSubject)

        if (examKey === "quarterly" || examKey === "halfYearly" || examKey === "final") {
          consolidatedSubject[examKey] = {
            marks: subject.marksObtained,
            maxMarks: subject.maxMarks,
          }
        }
      })
    })

    // Calculate totals and percentages
    const subjects: ConsolidatedSubject[] = Array.from(subjectMap.values()).map((subject) => {
      const quarterly = subject.quarterly?.marks || 0
      const halfYearly = subject.halfYearly?.marks || 0
      const final = subject.final?.marks || 0

      const quarterlyMax = subject.quarterly?.maxMarks || 0
      const halfYearlyMax = subject.halfYearly?.maxMarks || 0
      const finalMax = subject.final?.maxMarks || 0

      const total = quarterly + halfYearly + final
      const maxTotal = quarterlyMax + halfYearlyMax + finalMax
      const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0

      return {
        ...subject,
        total,
        maxTotal,
        percentage: Math.round(percentage * 100) / 100,
      }
    })

    const totalMarks = subjects.reduce((sum, subject) => sum + subject.total, 0)
    const totalMaxMarks = subjects.reduce((sum, subject) => sum + subject.maxTotal, 0)
    const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0
    const overallGrade = calculateGrade(overallPercentage)

    return {
      subjects,
      totalMarks,
      totalMaxMarks,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      overallGrade,
      examDates,
    }
  }

  // Fetch all students with token
  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("https://s-m-s-keyw.onrender.com/student/findAllStudent", {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch students: ${response.status}`)
      }

      const data = await response.json()
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

      const url = `https://s-m-s-keyw.onrender.com/report/getStudentReport?id=${studentId}`
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          setReportCards([])
          setConsolidatedReport(null)
          return
        }
        throw new Error(`Failed to fetch report: ${response.status}`)
      }

      const data = await response.json()
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

      // Create consolidated report
      const uniqueReports = getUniqueExams(validatedReports)
      if (uniqueReports.length > 0) {
        const consolidated = createConsolidatedReport(uniqueReports)
        setConsolidatedReport(consolidated)
      } else {
        setConsolidatedReport(null)
      }
    } catch (error) {
      console.error("Error fetching student report:", error)
      setError(`Error fetching student report: ${error.message}`)
      setReportCards([])
      setConsolidatedReport(null)
    } finally {
      setLoading(false)
    }
  }

  const generateConsolidatedPDF = async () => {
    if (!consolidatedReport || !selectedStudent) {
      setError("No consolidated report data available")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Transform consolidated data for PDF
      const pdfData = {
        studentName: safeValue(selectedStudent.name, "Unknown Student"),
        rollNo: safeValue(selectedStudent.studentCode, "N/A"),
        studentClass: safeValue(selectedStudent.cls, "N/A"),
        academicYear: "2024-2025",
        date: new Date().toISOString().split("T")[0],
        result: `Grade: ${consolidatedReport.overallGrade}`,
        remarks: `Overall Percentage: ${consolidatedReport.overallPercentage}% - ${consolidatedReport.overallGrade} Grade`,
        subjects: consolidatedReport.subjects.map((subject) => ({
          name: subject.subject,
          quarterly: subject.quarterly?.marks || 0,
          halfYearly: subject.halfYearly?.marks || 0,
          final: subject.final?.marks || 0,
          total: subject.total,
          grade: calculateGrade(subject.percentage),
        })),
        totalMarks: consolidatedReport.totalMarks,
        totalMaxMarks: consolidatedReport.totalMaxMarks,
        overallPercentage: consolidatedReport.overallPercentage,
        overallGrade: consolidatedReport.overallGrade,
      }

      const response = await fetch("https://s-m-s-keyw.onrender.com/marksheet/downloadConsolidated", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(pdfData),
      })

      if (!response.ok) {
        // Fallback to original endpoint if consolidated endpoint doesn't exist
        const fallbackData = {
          studentName: pdfData.studentName,
          rollNo: pdfData.rollNo,
          studentClass: pdfData.studentClass,
          academicYear: pdfData.academicYear,
          date: pdfData.date,
          result: pdfData.result,
          remarks: pdfData.remarks,
          subjects: consolidatedReport.subjects.map((subject) => ({
            name: subject.subject,
            q: subject.quarterly?.marks || 0,
            h: subject.halfYearly?.marks || 0,
            f: subject.final?.marks || 0,
            qMax: subject.quarterly?.maxMarks || 100,
            hMax: subject.halfYearly?.maxMarks || 100,
            fMax: subject.final?.maxMarks || 100,
            total: subject.total,
            maxTotal: subject.maxTotal,
            percentage: subject.percentage,
            grade: calculateGrade(subject.percentage),
          })),
          totalMarks: consolidatedReport.totalMarks,
          totalMaxMarks: consolidatedReport.totalMaxMarks,
          overallPercentage: consolidatedReport.overallPercentage,
          overallGrade: consolidatedReport.overallGrade,
        }

        const fallbackResponse = await fetch("https://s-m-s-keyw.onrender.com/marksheet/download", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(fallbackData),
        })

        if (!fallbackResponse.ok) {
          throw new Error(`Server responded with status ${fallbackResponse.status}`)
        }

        const blob = await fallbackResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${safeValue(selectedStudent.name, "Student")}_Final_Result.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${safeValue(selectedStudent.name, "Student")}_Final_Result.pdf`
      document.body.appendChild(a)
      a.click()
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

  const getGradeColorClass = (grade: string) => {
    const gradeValue = safeValue(grade).toUpperCase()
    switch (gradeValue) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800"
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      case "D":
        return "bg-orange-100 text-orange-800"
      case "F":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUniqueClasses = () => {
    const classes = students.map((student) => safeValue(student.cls))
    return [...new Set(classes)].filter((cls) => cls !== "N/A").sort()
  }

  const filteredStudents = students.filter(
    (student) =>
      (safeValue(student.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        safeValue(student.studentCode).includes(searchTerm) ||
        safeValue(student.cls).toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedClass === "" || safeValue(student.cls) === selectedClass),
  )

  useEffect(() => {
    if (token) {
      fetchStudents()
    }
  }, [token])

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Final Result System</h1>
        <p className="text-gray-600 text-lg">Consolidated academic performance across all exams</p>
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
            <p className="text-gray-600">Please login to access the final result system</p>
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
                  Students ({filteredStudents.length}
                  {selectedClass && ` - Class ${selectedClass}`}
                  {searchTerm && ` - "${searchTerm}"`})
                </h2>
                <div className="space-y-4">
                  {/* Search Input */}
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

                  {/* Class Filter */}
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">All Classes</option>
                      {getUniqueClasses().map((cls) => (
                        <option key={cls} value={cls}>
                          Class {cls}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Clear Filters Button */}
                  {(searchTerm || selectedClass) && (
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedClass("")
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
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

          {/* Student Details and Consolidated Report */}
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

                {/* Consolidated Final Result */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Final Result</h2>
                        <p className="text-gray-600">Consolidated performance across all exams</p>
                      </div>
                    </div>
                    {consolidatedReport && (
                      <div className="text-right">
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getGradeColorClass(consolidatedReport.overallGrade)}`}
                        >
                          {consolidatedReport.overallGrade}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{consolidatedReport.overallPercentage}%</p>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading final result...</p>
                    </div>
                  ) : !consolidatedReport ? (
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
                      <p className="text-gray-500 text-lg font-semibold">No Final Result Available</p>
                      <p className="text-gray-400 text-sm mt-2">This student doesn't have sufficient exam data</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Exam Dates */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">Exam Dates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {consolidatedReport.examDates.quarterly && (
                            <div>
                              <span className="font-medium">Quarterly:</span> {consolidatedReport.examDates.quarterly}
                            </div>
                          )}
                          {consolidatedReport.examDates.halfYearly && (
                            <div>
                              <span className="font-medium">Half Yearly:</span>{" "}
                              {consolidatedReport.examDates.halfYearly}
                            </div>
                          )}
                          {consolidatedReport.examDates.final && (
                            <div>
                              <span className="font-medium">Final:</span> {consolidatedReport.examDates.final}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Consolidated Marks Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Subject</th>
                              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                Quarterly (100)
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                Half-Yearly (100)
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                Final Exam (100)
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                Total (300)
                              </th>
                              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {consolidatedReport.subjects.map((subject) => (
                              <tr key={subject.subject}>
                                <td className="border border-gray-300 px-4 py-2">{subject.subject}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  {subject.quarterly?.marks || "N/A"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  {subject.halfYearly?.marks || "N/A"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  {subject.final?.marks || "N/A"}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{subject.total}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColorClass(subject.grade)}`}
                                  >
                                    {calculateGrade(subject.percentage)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 font-semibold">Total</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                              <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                              <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                                {consolidatedReport.totalMarks} / {consolidatedReport.totalMaxMarks}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColorClass(consolidatedReport.overallGrade)}`}
                                >
                                  {consolidatedReport.overallGrade}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Download Button */}
                      <div className="text-center mt-6">
                        <button
                          onClick={generateConsolidatedPDF}
                          className="btn button "
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white-600 mr-2 inline-block"></div>
                              Generating PDF..
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5 mr-2 inline-block"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-5l-4 4-4-4m8-3v9"
                                />
                              </svg>
                              Download Final Result
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Student</h3>
                  <p className="text-gray-600">Choose a student from the list to view their final result</p>
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
