import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../supabaseClient"

const BookingCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState({})

  // Fetch bookings from Supabase on mount
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase.from("bookings").select("*")
      if (error) {
        console.error("Error fetching bookings:", error)
      } else {
        const mapped = {}
        data.forEach((b) => {
          // Using booking_date column as specified in the requirements
          mapped[b.booking_date] = b.status
        })
        setBookings(mapped)
      }
    }

    fetchBookings()
  }, [])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDate = (date) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getDateStatus = (date) => {
    if (!date) return "empty"
    const today = new Date()
    const dateKey = formatDate(date)

    // Block past dates
    if (date < today.setHours(0, 0, 0, 0)) {
      return "past"
    }

    // Check Supabase bookings
    return bookings[dateKey] || "available"
  }

  const getStatusColor = (status, isSelected) => {
    if (isSelected) {
      return "bg-primary-teal text-white ring-2 ring-primary-teal ring-offset-2"
    }

    switch (status) {
      case "booked":
        return "bg-red-500 text-white cursor-not-allowed"
      case "reserved":
        return "bg-yellow-500 text-white cursor-not-allowed"
      case "available":
        return "bg-green-500 text-white hover:bg-green-600 cursor-pointer transform hover:scale-105"
      case "past":
        return "bg-gray-200 text-gray-400 cursor-not-allowed"
      default:
        return "cursor-default"
    }
  }

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false
    return formatDate(date) === formatDate(selectedDate)
  }

  const handleDateClick = (date) => {
    if (!date) return
    const status = getDateStatus(date)
    if (status === "available") {
      onDateSelect(date)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    )
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Date
        </h2>
        <p className="text-gray-600">Choose an available date for your booking</p>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const status = getDateStatus(date)
          const isSelected = isDateSelected(date)
          const statusColor = getStatusColor(status, isSelected)

          return (
            <div key={index} className="aspect-square">
              {date ? (
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={
                    status === "booked" || status === "reserved" || status === "past"
                  }
                  className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${statusColor}`}
                  title={`${formatDate(date)} - ${status}`}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend:</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-700">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span className="text-gray-700">Past</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BookingCalendar
