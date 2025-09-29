import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import HotelNavbar from "../navbar/HotelNavbar"
import { X } from "lucide-react"

interface Customer {
  name: string
  contact: string
  address: string
  adharNo: string
}

interface Guest {
  id: string
  arrivalDate: string
  departureDate: string
  deposit: string
  amount: string
  customersEntity: Customer
}

export default function HotelTable() {
  const navigate = useNavigate()
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  const fetchGuests = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("https://s-m-s-keyw.onrender.com/hotelCheckInn/get", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      // ✅ state update
      setGuests(data)
      setFilteredGuests(data)

      // ✅ localStorage update
      localStorage.setItem("guestsData", JSON.stringify(data))
    } catch (error) {
      console.error("Error fetching data", error)
    } finally {
      setLoading(false)
    }
  }

  fetchGuests()
}, [])


  const handleFilter = () => {
    const from = fromDate ? new Date(fromDate) : null
    const to = toDate ? new Date(toDate) : null

    const filtered = guests.filter((guest) => {
      const departure = guest.departureDate ? new Date(guest.departureDate) : null
      if (!departure) return false // only history

      if (from && departure < from) return false
      if (to && departure > to) return false

      return true
    })

    setFilteredGuests(filtered)
  }

  const clearFilters = () => {
    setFromDate("")
    setToDate("")
    setFilteredGuests(guests.filter((g) => g.departureDate))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HotelNavbar showBackButton={true} onBackClick={() => navigate(-1)} />

      <div className=" p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest History Report</h2>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />
          </div>

          <button
            onClick={handleFilter}
            className="bg-[#1e7878] hover:bg-teal-700 text-white px-4 py-2 rounded-md mt-6"
          >
            Apply Filter
          </button>

          {(fromDate || toDate) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 mt-6 underline hover:text-red-800"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : filteredGuests.length === 0 ? (
            <p className="text-center text-gray-600">No guests found for selected filters.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Aadhar</th>
                  <th className="px-4 py-2">Arrival</th>
                  <th className="px-4 py-2">Departure</th>
                  <th className="px-4 py-2">Deposit (₹)</th>
                  <th className="px-4 py-2">Total (₹)</th>
                  <th className="px-4 py-2">Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.map((guest, idx) => {
                  const deposit = parseFloat(guest.deposit) || 0
                  const total = parseFloat(guest.amount) || 0
                  const balance = total - deposit

                  return (
                    <tr key={idx}>
                      <td className="px-4 py-2">{guest.customersEntity.name}</td>
                      <td className="px-4 py-2">{guest.customersEntity.contact}</td>
                      <td className="px-4 py-2">{guest.customersEntity.adharNo}</td>
                      <td className="px-4 py-2">{guest.arrivalDate?.split("T")[0]}</td>
                      <td className="px-4 py-2">{guest.departureDate?.split("T")[0]}</td>
                      <td className="px-4 py-2">₹{deposit.toFixed(2)}</td>
                      <td className="px-4 py-2">₹{total.toFixed(2)}</td>
                      <td className={`px-4 py-2 ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        ₹{balance.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
