"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "../../../services/Utils/apiUtils"
import Loader from "../../loader/loader"
import BackButton from "../../Navigation/backButton"
import ReusableTable from "../../StudenAttendanceShow/Table/Table"
import { toast, ToastContainer } from "react-toastify"
import { formatToDDMMYYYY1 } from "../../Utils/dateUtils"
import { convertToWords } from "../../Utils/recipt"

const formatToDDMMYYYY = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`
}

interface FeeInfo {
  id: string
  creationDateTime: string
  fee: number
  paymentMode: string
}

interface StudentData {
  id: string
  name: string
  email: string
  feeInfo: FeeInfo[]
  remainingFees?: number
  [key: string]: any
}

const StudentFeesDetails = () => {
  const { id } = useParams()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [feeInfo, setFeeInfo] = useState<FeeInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [editFeeId, setEditFeeId] = useState<string | null>(null)
  const [editFeeAmount, setEditFeeAmount] = useState<number | null>(null)
  const [remainingFees, setRemainingFees] = useState<number>(0)

  const columnDefs = [
    {
      headerName: "Fees Submitted Date",
      field: "creationDateTime",
      valueFormatter: (params: { value: string }) => formatToDDMMYYYY1(params.value),
    },
    { headerName: "Fee", field: "fee" },
    { headerName: "Payment Mode", field: "paymentMode" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditFee(params.data.id, params.data.fee)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
          <button onClick={() => handleDownloadPDF(params.data.id)} className="text-green-600 hover:text-green-800">
            <i className="pl-4 bi bi-download"></i> Receipt
          </button>
          <button onClick={() => handleSendReceiptEmail(params.data.id)} className="text-blue-600 hover:text-blue-800">
            <i className=" pl-4 bi bi-envelope"></i> Send Receipt to Email
          </button>
        </div>
      ),
    },
  ]

  // New function to generate and download new receipt
  const handleGenerateNewReceipt = async () => {
    if (!studentData) {
      toast.error("Student Data Not Available")
      return
    }

    try {
      setLoading(true)

      // Calculate total fees from feeInfo
      const totalTuitionFee = feeInfo.reduce((sum, fee) => sum + (fee.fee || 0), 0)

      // Get the latest payment mode from feeInfo
      const latestPaymentMode = feeInfo.length > 0 ? feeInfo[feeInfo.length - 1].paymentMode : "Cash"

      // Prepare payload with correct field mappings
      const payload = {
        receiptNo: `RCP${Date.now()}`, // Generate unique receipt number
        date: new Date()
          .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        studentName: studentData.name || "",
        studentClass: studentData.cls || "", // Using 'cls' field
        rollNo: studentData.studentCode || "", // Using 'studentCode' as rollNo
        section: studentData.section || "A", // Default section as 'A' since not available
        fatherName: studentData.familyDetails?.stdo_FatherName || "", // Correct father name path
        tuitionFee: totalTuitionFee || 0,
        libraryFee: 0, 
        sportsFee: 0,
        paymentMode: latestPaymentMode || "Cash", 
        amountInWords: convertToWords(totalTuitionFee), 
      }

      console.log("Sending payload:", payload)

      // Send to your API endpoint
      const response = await axiosInstance.post("https://s-m-s-keyw.onrender.com/student/download-receipt", payload, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (response.status === 200) {
        // Handle PDF download
        const blob = new Blob([response.data], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.style.display = "none"
        link.href = url
        link.download = `receipt_${payload.receiptNo}.pdf`
        document.body.appendChild(link)
        link.click()

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }, 100)

        toast.success("New receipt generated and downloaded successfully!")
      }
    } catch (error: any) {
      console.error("Error generating new receipt:", error)

      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Receipt generation service not found")
            break
          case 500:
            toast.error("Server error while generating receipt")
            break
          default:
            toast.error(`Error: ${error.response.statusText}`)
        }
      } else if (error.message.includes("Network Error")) {
        toast.error("Network error - check your connection")
      } else {
        toast.error("Failed to generate receipt")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendReceiptEmail = async (feeId: string) => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`https://s-m-s-keyw.onrender.com/pdf/api/receipt/email?id=${feeId}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (response.status === 200) {
        toast.success("Receipt sent to email successfully!")
      } else {
        toast.error("Failed to send receipt to email.")
      }
    } catch (error) {
      setLoading(false)
      console.error("Error sending receipt to email:", error)

      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Receipt not found - payment record might be missing.")
            break
          case 500:
            toast.error("Server error while sending receipt email.")
            break
          default:
            toast.error(`Error: ${error.response.statusText}`)
        }
      } else if (error.message.includes("Network Error")) {
        toast.error("Network error - check your connection")
      } else {
        toast.error("Failed to send receipt to email.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(`/student/findAllStudent?id=${id}`)
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data[0]
          const formattedFeeInfo =
            data.feeInfo?.map((fee: FeeInfo) => ({
              ...fee,
              creationDateTime: formatToDDMMYYYY(fee.creationDateTime),
            })) || []
          setStudentData(data)
          setFeeInfo(formattedFeeInfo)
          if (data.remainingFees !== undefined) {
            setRemainingFees(data.remainingFees)
          }
        } else {
          toast.error("Unexpected API response format or empty data.")
        }
      } catch (error) {
        toast.error("Error fetching student data")
        console.error("Error fetching student data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [id])

  const handleEditFee = (feeId: string, feeAmount: number) => {
    setEditFeeId(feeId)
    setEditFeeAmount(feeAmount)
  }

  const validateFeeAmount = (amount: number): boolean => {
    if (amount <= 0) {
      toast.error("Fee amount must be greater than zero")
      return false
    }
    if (amount > remainingFees) {
      toast.error(`Fee amount cannot exceed remaining fees (${remainingFees})`)
      return false
    }
    return true
  }

  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (e.target.value === "" || value > 0) {
      setEditFeeAmount(value || null)
    }
  }

  const handleSaveFee = async () => {
    if (editFeeAmount === null) {
      toast.error("Please enter a valid fee amount")
      return
    }
    if (!validateFeeAmount(editFeeAmount)) {
      return
    }
    try {
      const response = await axiosInstance.post(`/student/editFees`, {
        id: editFeeId,
        fee: editFeeAmount,
      })
      if (response.status === 200) {
        toast.success("Fee updated successfully!")
        const updatedFeeInfo = feeInfo.map((fee) => (fee.id === editFeeId ? { ...fee, fee: editFeeAmount } : fee))
        setFeeInfo(updatedFeeInfo)
        setEditFeeId(null)
        setEditFeeAmount(null)

        if (studentData) {
          const newRemainingFees =
            studentData.remainingFees !== undefined
              ? studentData.remainingFees - (editFeeAmount - (feeInfo.find((f) => f.id === editFeeId)?.fee || 0))
              : remainingFees
          setRemainingFees(newRemainingFees)
        }
      } else {
        toast.error("Failed to update fee. Please try again.")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Error updating fee:", error)
    }
  }

  const handleDownloadPDF = async (feeId: string) => {
    try {
      setLoading(true)
      const response = await axiosInstance.post(
        `/pdf/receipt?id=${feeId}`,
        {},
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      )

      console.log("Response status:", response.status)
      console.log("Content-Type:", response.headers["content-type"])
      console.log("Data size:", response.data.size)

      if (response.data.size === 0) {
        throw new Error("Server returned empty PDF")
      }

      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.style.display = "none"
      link.href = url
      link.download = `receipt_${feeId}.pdf`
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        setLoading(false)
      }, 100)
    } catch (error: any) {
      setLoading(false)
      console.error("Download error:", error)

      if (error.response) {
        switch (error.response.status) {
          case 404:
            toast.error("Receipt not found - payment record might be missing")
            break
          case 500:
            toast.error("Server error while generating receipt")
            break
          default:
            toast.error(`Error: ${error.response.statusText}`)
        }
      } else if (error.message.includes("Network Error")) {
        toast.error("Network error - check your connection")
      } else {
        toast.error("Failed to download receipt")
      }
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <Loader />
      ) : (
        <div className="box">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span>
                <BackButton />
              </span>
              <h1 className="text-xl items-center font-bold text-[#27727A]">Student Fees Details</h1>
            </div>
            {/* New Receipt Generation Button */}
            <button
              onClick={handleGenerateNewReceipt}
              className="btn button px-4 py-2 bg-[#27727A] text-white hover:bg-[#1d5459] rounded-md flex items-center gap-2"
              disabled={loading}
            >
              <i className="bi bi-receipt"></i>
              Generate New Receipt
            </button>
          </div>

          {studentData ? (
            <>
              <p className="mb-3">
                <span className="text-xl font-semibold">Name:</span>
                <span className="ml-2 text-xl"> {studentData.name}</span>
              </p>
              <p className="mb-3">
                <span className="text-xl font-semibold">Email:</span>
                <span className="ml-2 text-xl"> {studentData.email}</span>
              </p>
              {remainingFees !== undefined && (
                <p className="mb-4">
                  <span className="text-xl font-semibold">Remaining Fees:</span>
                  <span className="ml-2 text-xl"> {remainingFees}</span>
                </p>
              )}
            </>
          ) : (
            <p>No student data found.</p>
          )}

          {/* Edit Fee Section */}
          {editFeeId && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-red-500">Edit Fee Amount</label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  value={editFeeAmount || ""}
                  onChange={handleFeeInputChange}
                  min="1"
                  max={remainingFees}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter amount"
                />
                <button onClick={handleSaveFee} className="btn button px-4 py-2">
                  Update Fees
                </button>
                <button
                  onClick={() => {
                    setEditFeeId(null)
                    setEditFeeAmount(null)
                  }}
                  className="btn buttonred px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Fees Table */}
          {feeInfo.length > 0 ? (
            <ReusableTable rows={feeInfo} columns={columnDefs} />
          ) : (
            <p>No fee information available for this student.</p>
          )}
        </div>
      )}
    </>
  )
}

export default StudentFeesDetails
