"use client"

import { useState } from "react"

// Utility function to convert number to words (Indian Rupee format)
function convertToWords(amount: number): string {
  if (amount === 0) return "Zero Rupees Only"

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const numToWord = (num: number): string => {
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    if (num < 1000)
      return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numToWord(num % 100) : "")
    if (num < 100000)
      return numToWord(Math.floor(num / 1000)) + " Thousand" + (num % 1000 !== 0 ? " " + numToWord(num % 1000) : "")
    if (num < 10000000)
      return numToWord(Math.floor(num / 100000)) + " Lakh" + (num % 100000 !== 0 ? " " + numToWord(num % 100000) : "")
    return (
      numToWord(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 !== 0 ? " " + numToWord(num % 10000000) : "")
    )
  }

  return numToWord(amount) + " Rupees Only"
}

interface ReceiptData {
  receiptNo: string
  date: string
  studentName: string
  studentClass: string
  rollNo: string
  section: string
  fatherName: string
  tuitionFee: number
  libraryFee: number
  sportsFee: number
  paymentMode: string
  amountInWords?: string
}

export default function ReceiptDownloader({ studentId }: { studentId?: string }) {
  const [loading, setLoading] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [message, setMessage] = useState("")

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg)
    setTimeout(() => setMessage(""), 3000)
  }

  const downloadReceipt = async () => {
    setLoading(true)

    try {
      // Calculate total amount
      const totalAmount =
        (receiptData?.tuitionFee || 0) + (receiptData?.libraryFee || 0) + (receiptData?.sportsFee || 0)

      // Prepare payload with amount in words
      const payload = {
        receiptNo: receiptData?.receiptNo || "",
        date:
          receiptData?.date ||
          new Date()
            .toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
            .replace(/\//g, "-"),
        studentName: receiptData?.studentName || "",
        studentClass: receiptData?.studentClass || "",
        rollNo: receiptData?.rollNo || "",
        section: receiptData?.section || "",
        fatherName: receiptData?.fatherName || "",
        tuitionFee: receiptData?.tuitionFee || 0,
        libraryFee: receiptData?.libraryFee || 0,
        sportsFee: receiptData?.sportsFee || 0,
        paymentMode: receiptData?.paymentMode || "Cash",
        amountInWords: convertToWords(totalAmount),
      }

      // Make API call to download receipt
      const response = await fetch("http://localhost:8080/student/download-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Handle PDF download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `receipt_${payload.receiptNo || "new"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Fetch the receipt data to display
      fetchReceiptData()

      showMessage("Receipt downloaded successfully!")
    } catch (error) {
      console.error("Error downloading receipt:", error)
      showMessage("Failed to download receipt", true)
    } finally {
      setLoading(false)
    }
  }

  const fetchReceiptData = async () => {
    setLoading(true)
    try {
      // If studentId is provided, fetch data for that student
      const endpoint = studentId
        ? `http://localhost:8080/student/receipt-data?id=${studentId}`
        : "http://localhost:8080/student/receipt-data"

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Calculate total and generate amount in words
      const totalAmount = (data.tuitionFee || 0) + (data.libraryFee || 0) + (data.sportsFee || 0)
      data.amountInWords = convertToWords(totalAmount)

      setReceiptData(data)
    } catch (error) {
      console.error("Error fetching receipt data:", error)
      showMessage("Failed to fetch receipt data", true)
    } finally {
      setLoading(false)
    }
  }

  // Initialize receipt data
  const initializeReceiptData = () => {
    setReceiptData({
      receiptNo: "",
      date: new Date()
        .toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
        .replace(/\//g, "-"),
      studentName: "",
      studentClass: "",
      rollNo: "",
      section: "",
      fatherName: "",
      tuitionFee: 0,
      libraryFee: 0,
      sportsFee: 0,
      paymentMode: "Cash",
      amountInWords: "Zero Rupees Only",
    })
  }

  // Initialize on first render if no data
  if (!receiptData && !loading) {
    initializeReceiptData()
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md border">
      {/* Message Display */}
      {message && (
        <div
          className={`p-3 mb-4 rounded ${message.includes("Failed") || message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#27727A]">Fee Receipt</h2>
          <button
            onClick={downloadReceipt}
            disabled={loading}
            className="bg-[#27727A] hover:bg-[#1d5459] text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            Download Receipt
          </button>
        </div>

        {receiptData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-700">Receipt No:</p>
                <p className="text-gray-900">{receiptData.receiptNo || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Date:</p>
                <p className="text-gray-900">{receiptData.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-700">Student Name:</p>
                <p className="text-gray-900">{receiptData.studentName || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Father's Name:</p>
                <p className="text-gray-900">{receiptData.fatherName || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-gray-700">Class:</p>
                <p className="text-gray-900">{receiptData.studentClass || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Roll No:</p>
                <p className="text-gray-900">{receiptData.rollNo || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Section:</p>
                <p className="text-gray-900">{receiptData.section || "N/A"}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold mb-2 text-gray-800">Fee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700">Tuition Fee:</p>
                  <p className="text-gray-900">₹{receiptData.tuitionFee || 0}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Library Fee:</p>
                  <p className="text-gray-900">₹{receiptData.libraryFee || 0}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-gray-700">Sports Fee:</p>
                <p className="text-gray-900">₹{receiptData.sportsFee || 0}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700">Payment Mode:</p>
                  <p className="text-gray-900">{receiptData.paymentMode || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Total Amount:</p>
                  <p className="font-bold text-gray-900">
                    ₹{(receiptData.tuitionFee || 0) + (receiptData.libraryFee || 0) + (receiptData.sportsFee || 0)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-semibold text-gray-700">Amount in Words:</p>
                <p className="italic text-gray-900">{receiptData.amountInWords}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
