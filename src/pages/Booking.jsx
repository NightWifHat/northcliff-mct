import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import BookingCalendar from '../components/BookingCalendar'
import PayPalCheckout from '../components/PayPalCheckout'
import { supabase } from '../supabaseClient'

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    time: '',
    packageType: '',
    duration: '',
    message: ''
  })

  const [showPayment, setShowPayment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const packageTypes = [
    { value: '', label: 'Select a package...', price: 0 },
    { value: 'full-day-entire', label: 'Full Day – Entire Facility', fullDayPrice: 4000, halfDayPrice: null },
    { value: 'half-day-entire', label: 'Half Day – Entire Facility', fullDayPrice: null, halfDayPrice: 2000 },
    { value: 'big-room-only', label: 'Big Room Only', fullDayPrice: 2000, halfDayPrice: 1500 }
  ]

  const durations = [
    { value: '', label: 'Select duration...' },
    { value: 'half-day', label: 'Half Day' },
    { value: 'full-day', label: 'Full Day' }
  ]

  const timeSlots = [
    { value: '', label: 'Select time...' },
    { value: '08:00', label: '08:00 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' },
    { value: '17:00', label: '05:00 PM' }
  ]

  // Calculate total amount based on package type and duration
  const calculateAmount = () => {
    const packageType = packageTypes.find(p => p.value === formData.packageType)
    const duration = formData.duration
    
    if (!packageType || !duration) {
      return 0
    }
    
    if (duration === 'full-day' && packageType.fullDayPrice) {
      return packageType.fullDayPrice
    } else if (duration === 'half-day' && packageType.halfDayPrice) {
      return packageType.halfDayPrice
    }
    
    return 0
  }

  // Check if selected package supports selected duration
  const isDurationValid = () => {
    const packageType = packageTypes.find(p => p.value === formData.packageType)
    const duration = formData.duration
    
    if (!packageType || !duration) return true
    
    if (duration === 'full-day') {
      return packageType.fullDayPrice !== null
    } else if (duration === 'half-day') {
      return packageType.halfDayPrice !== null
    }
    
    return false
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!selectedDate) {
      newErrors.date = 'Date is required'
    }

    if (!formData.time) {
      newErrors.time = 'Time is required'
    }

    if (!formData.packageType) {
      newErrors.packageType = 'Package type is required'
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required'
    }

    if (formData.packageType && formData.duration && !isDurationValid()) {
      newErrors.duration = 'Selected duration is not available for this package'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    try {
      // Check if date is already booked
      const selectedDateString = selectedDate?.toISOString().split('T')[0]
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', selectedDateString)
        .in('status', ['booked', 'reserved'])

      if (checkError) {
        console.error('Error checking existing bookings:', checkError)
        throw new Error('Failed to check availability')
      }

      if (existingBookings && existingBookings.length > 0) {
        alert('This date is no longer available. Please select another date.')
        setIsSubmitting(false)
        return
      }
      
      // Show payment form
      setShowPayment(true)
      
    } catch (error) {
      console.error('Booking error:', error)
      alert('There was an error processing your booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      // Save booking to Supabase after successful payment
      const packageType = packageTypes.find(p => p.value === formData.packageType)
      const bookingData = {
        booking_date: selectedDate?.toISOString().split('T')[0],
        status: 'booked',
        package_type: packageType?.label || formData.packageType,
        price: calculateAmount(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.message,
        time: formData.time,
        duration: formData.duration,
        payment_id: paymentDetails.id,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])

      if (error) {
        console.error('Error saving booking:', error)
        alert('Payment successful but there was an error saving your booking. Please contact us with your payment ID: ' + paymentDetails.id)
        return
      }

      console.log('Booking saved successfully:', data)
      alert('Booking confirmed! You will receive a confirmation email shortly.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        time: '',
        packageType: '',
        duration: '',
        message: ''
      })
      setSelectedDate(null)
      setShowPayment(false)
      
    } catch (error) {
      console.error('Error processing booking:', error)
      alert('Payment successful but there was an error saving your booking. Please contact us with your payment ID: ' + paymentDetails.id)
    }
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    alert('Payment failed. Please try again or contact us for assistance.')
    setShowPayment(false)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getBookingDetails = () => {
    const packageType = packageTypes.find(p => p.value === formData.packageType)
    const duration = durations.find(d => d.value === formData.duration)
    
    return {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formatDate(selectedDate),
      time: formData.time,
      packageType: packageType?.label || '',
      duration: duration?.label || '',
      message: formData.message
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Book Your Space
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Reserve your professional space at Northcliff MCT. Fill out the form below 
              and we'll confirm your booking within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showPayment ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Calendar */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                <BookingCalendar 
                  onDateSelect={handleDateSelect} 
                  selectedDate={selectedDate}
                />
              </motion.div>

              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Booking Details
                  </h2>
                  
                  {selectedDate && (
                    <div className="mb-6 p-4 bg-primary-teal bg-opacity-10 rounded-lg">
                      <p className="text-primary-teal font-semibold">
                        Selected Date: {formatDate(selectedDate)}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <select
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                            errors.time ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          {timeSlots.map(slot => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                      </div>

                      <div>
                        <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-2">
                          Package Type *
                        </label>
                        <select
                          id="packageType"
                          name="packageType"
                          value={formData.packageType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                            errors.packageType ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          {packageTypes.map(packageType => (
                            <option key={packageType.value} value={packageType.value}>
                              {packageType.label}
                            </option>
                          ))}
                        </select>
                        {errors.packageType && <p className="text-red-500 text-sm mt-1">{errors.packageType}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                          errors.duration ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={!formData.packageType}
                      >
                        {durations.map(duration => {
                          const packageType = packageTypes.find(p => p.value === formData.packageType)
                          const isAvailable = !packageType || 
                            (duration.value === 'full-day' && packageType.fullDayPrice !== null) ||
                            (duration.value === 'half-day' && packageType.halfDayPrice !== null) ||
                            duration.value === ''
                          
                          return (
                            <option key={duration.value} value={duration.value} disabled={!isAvailable}>
                              {duration.label} {!isAvailable ? '(Not Available)' : ''}
                            </option>
                          )
                        })}
                      </select>
                      {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                      {!formData.packageType && (
                        <p className="text-sm text-gray-500 mt-1">Please select a package type first</p>
                      )}
                    </div>

                    {calculateAmount() > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Estimated Total:</span>
                          <span className="text-2xl font-bold text-primary-teal">R{calculateAmount().toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors"
                        placeholder="Any additional information or special requirements..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDate}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isSubmitting || !selectedDate
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>

                    {!selectedDate && (
                      <p className="text-sm text-gray-500 text-center">
                        Please select a date from the calendar to continue
                      </p>
                    )}
                  </form>
                </Card>
              </motion.div>
            </div>
          ) : (
            /* Payment Section */
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <PayPalCheckout 
                  amount={calculateAmount()}
                  bookingDetails={getBookingDetails()}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
                
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-primary-teal hover:text-primary-green transition-colors"
                  >
                    ← Back to Booking Details
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar Information */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Package Pricing
              </h3>
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">Full Day – Entire Facility</div>
                  <div className="text-sm text-gray-600">R4,000/day</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">Half Day – Entire Facility</div>
                  <div className="text-sm text-gray-600">R2,000/half day</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">Big Room Only</div>
                  <div className="text-sm text-gray-600">R2,000/day or R1,500/half day</div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <span className="text-primary-teal mr-2">📧</span>
                  <span>info@northcliffmct.co.za</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary-teal mr-2">📞</span>
                  <span>+27 11 123 4567</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary-teal mr-2">🕐</span>
                  <span>Mon-Fri: 8AM-6PM</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Policy
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Confirmation within 24 hours</li>
                <li>• Cancellation 48hrs prior</li>
                <li>• Secure online payments</li>
                <li>• Refreshments included</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Booking
