import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import BookingCalendar from '../components/BookingCalendar'
import { supabase } from '../supabaseClient'
import { formatZAR, formatZARHourly } from '../utils/currency'

/**
 * PayFast Configuration
 * 
 * SANDBOX MODE (current): Uses sandbox credentials for development
 * PRODUCTION MODE: Update merchant_id and merchant_key with live credentials
 * 
 * Environment variables (set in Vercel):
 * - VITE_PAYFAST_MERCHANT_ID
 * - VITE_PAYFAST_MERCHANT_KEY
 * 
 * TODO: verify payment via PayFast ITN/webhook
 */
const PAYFAST_CONFIG = {
  // Sandbox URL - change to https://www.payfast.co.za/eng/process for production
  actionUrl: 'https://sandbox.payfast.co.za/eng/process',
  // Placeholder credentials - replace with real credentials in production
  merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
}

const Booking = () => {
  const [searchParams] = useSearchParams()
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
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success' | 'cancelled' | null
  const payfastFormRef = useRef(null)

  // Check URL params for payment status on mount
  useEffect(() => {
    const status = searchParams.get('payment')
    if (status === 'success') {
      setPaymentStatus('success')
    } else if (status === 'cancelled') {
      setPaymentStatus('cancelled')
    }
  }, [searchParams])

  const packageTypes = [
    { value: '', label: 'Select a package...', price: 0 },
    { value: 'boardroom-only', label: 'Boardroom Only (12 pax)', fullDayPrice: 4000, halfDayPrice: 3000, hourlyPrice: 800 },
    { value: 'consultation-room', label: 'One Consultation Room (6 pax)', fullDayPrice: 3000, halfDayPrice: 1500, hourlyPrice: 500 },
    { value: 'boardroom-consultation', label: 'Boardroom + One Consultation Room (18 pax)', fullDayPrice: 6000, halfDayPrice: 4000, hourlyPrice: 1000 },
    { value: 'boardroom-two-consultation', label: 'Boardroom + Two Consultation Rooms (24 pax)', fullDayPrice: 7000, halfDayPrice: 5000, hourlyPrice: 1500 }
  ]

  const durations = [
    { value: '', label: 'Select duration...' },
    { value: 'half-day', label: 'Half Day' },
    { value: 'full-day', label: 'Full Day' }
  ]

  const timeSlots = [
    { value: '', label: 'Select time...' },
    { value: '08:30', label: '08:30 AM' },
    { value: '09:00', label: '09:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '01:00 PM' },
    { value: '14:00', label: '02:00 PM' },
    { value: '15:00', label: '03:00 PM' },
    { value: '16:00', label: '04:00 PM' }
  ]

  // Calculate total amount based on package type and duration
  const calculateAmount = () => {
    const packageType = packageTypes.find(p => p.value === formData.packageType)
    const duration = formData.duration
    
    if (!packageType || !duration) {
      return 0
    }
    
    // Return price based on selected duration
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

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms of Use to proceed'
    }

    return newErrors
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
      rawDate: selectedDate,
      time: formData.time,
      packageType: packageType?.label || '',
      packageValue: formData.packageType,
      duration: duration?.label || '',
      durationValue: formData.duration,
      message: formData.message
    }
  }

  /**
   * Create booking record in Supabase with status = "reserved"
   * 
   * We use "reserved" (not "pending") because the Supabase schema CHECK constraint
   * only allows: 'available', 'reserved', 'booked'.
   * 
   * Flow:
   *   1. User clicks "Pay Now" → booking created as "reserved"
   *   2. User is redirected to PayFast to complete payment
   *   3. On successful ITN callback → status updated to "booked"
   *   4. If payment fails/is cancelled → booking should be cleaned up
   *      (TODO: implement ITN webhook + stale reservation cleanup job)
   *
   * "reserved" bookings are shown as yellow on the calendar and block
   * the date from being double-booked.
   */
  const createPendingBooking = async () => {
    const bookingDetails = getBookingDetails()
    const amount = calculateAmount()
    
    const bookingRecord = {
      booking_date: selectedDate?.toISOString().split('T')[0],
      status: 'reserved', // Will be updated to 'booked' after PayFast ITN confirms payment
      package_type: bookingDetails.packageType,
      price: amount,
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      notes: bookingDetails.message || '',
      time: bookingDetails.time,
      duration: bookingDetails.duration,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingRecord])
      .select()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data?.[0]
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
      // Check for any active bookings (booked or reserved) on this date
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('id, status')
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
      
      // Show payment confirmation screen
      setShowPayment(true)
      
    } catch (error) {
      console.error('Booking error:', error)
      alert('There was an error processing your booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle PayFast payment redirect
   * Creates a reserved booking and submits a POST form to PayFast
   */
  const handlePayFastPayment = async () => {
    // Guard against double-clicks
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // Create reserved booking in Supabase before redirecting to PayFast
      await createPendingBooking()
      
      // Submit PayFast form — this navigates away from the page
      if (payfastFormRef.current) {
        payfastFormRef.current.submit()
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('There was an error processing your booking. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Get return URLs based on current location
  const getReturnUrls = () => {
    const baseUrl = window.location.origin
    return {
      returnUrl: `${baseUrl}/booking?payment=success`,
      cancelUrl: `${baseUrl}/booking?payment=cancelled`,
      // TODO: Set up a server endpoint to handle PayFast ITN notifications
      notifyUrl: `${baseUrl}/api/payfast-notify`
    }
  }

  // Render payment success message
  if (paymentStatus === 'success') {
    return (
      <div className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your booking. You will receive a confirmation email shortly.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {/* TODO: verify payment via PayFast ITN/webhook */}
                Your booking is being processed and will be confirmed once payment is verified.
              </p>
              <button
                onClick={() => {
                  setPaymentStatus(null)
                  window.history.replaceState({}, '', '/booking')
                }}
                className="btn-primary px-8 py-3 rounded-lg"
              >
                Make Another Booking
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  // Render payment cancelled message
  if (paymentStatus === 'cancelled') {
    return (
      <div className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
              <p className="text-xl text-gray-600 mb-8">
                Your payment was cancelled. No charges have been made.
              </p>
              <button
                onClick={() => {
                  setPaymentStatus(null)
                  window.history.replaceState({}, '', '/booking')
                }}
                className="btn-primary px-8 py-3 rounded-lg"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  const urls = getReturnUrls()
  const amount = calculateAmount()
  const bookingDetails = getBookingDetails()

  return (
    <div className="pt-16">
      {/* Hidden PayFast Form */}
      <form
        ref={payfastFormRef}
        action={PAYFAST_CONFIG.actionUrl}
        method="POST"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="merchant_id" value={PAYFAST_CONFIG.merchantId} />
        <input type="hidden" name="merchant_key" value={PAYFAST_CONFIG.merchantKey} />
        <input type="hidden" name="return_url" value={urls.returnUrl} />
        <input type="hidden" name="cancel_url" value={urls.cancelUrl} />
        {/* TODO: Set up server endpoint to handle PayFast ITN notifications */}
        <input type="hidden" name="notify_url" value={urls.notifyUrl} />
        <input type="hidden" name="amount" value={amount.toFixed(2)} />
        <input type="hidden" name="item_name" value="Room Booking – Northcliff MCT" />
        <input type="hidden" name="item_description" value={`${bookingDetails.packageType} - ${bookingDetails.duration}`} />
        <input type="hidden" name="email_address" value={formData.email} />
        <input type="hidden" name="name_first" value={formData.name.split(' ')[0]} />
        <input type="hidden" name="name_last" value={formData.name.split(' ').slice(1).join(' ') || ''} />
      </form>

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

                    {/* Terms of Use Acceptance */}
                    <div className={`p-4 rounded-lg ${errors.terms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="termsAccepted"
                          checked={termsAccepted}
                          onChange={(e) => {
                            setTermsAccepted(e.target.checked)
                            if (errors.terms) {
                              setErrors(prev => ({ ...prev, terms: '' }))
                            }
                          }}
                          className="mt-1 h-4 w-4 text-primary-teal border-gray-300 rounded focus:ring-primary-teal cursor-pointer"
                        />
                        <label htmlFor="termsAccepted" className="ml-3 text-sm text-gray-700 cursor-pointer">
                          I have read and accept the{' '}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-teal hover:underline font-medium"
                          >
                            Terms of Use
                          </a>
                        </label>
                      </div>
                      {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedDate || !termsAccepted}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isSubmitting || !selectedDate || !termsAccepted
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
            /* Payment Confirmation Section */
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Secure Payment
                  </h2>
                  
                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{bookingDetails.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{bookingDetails.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{bookingDetails.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium">{bookingDetails.packageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{bookingDetails.duration}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-900 font-semibold">Total:</span>
                          <span className="text-2xl font-bold text-primary-teal">R{amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Payments are processed securely via PayFast
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayFastPayment}
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {isSubmitting ? 'Redirecting to PayFast...' : 'Pay Now'}
                  </button>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="text-primary-teal hover:text-primary-green transition-colors"
                      disabled={isSubmitting}
                    >
                      ← Back to Booking Details
                    </button>
                  </div>
                </Card>
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
              <div className="space-y-3 text-sm">
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">Boardroom Only (12 pax)</div>
                  <div className="text-gray-600">{formatZAR(3000, false)} (half) / {formatZAR(4000, false)} (full) / {formatZARHourly(800)}</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">One Consultation Room (6 pax)</div>
                  <div className="text-gray-600">{formatZAR(1500, false)} (half) / {formatZAR(3000, false)} (full) / {formatZARHourly(500)}</div>
                </div>
                <div className="border-b pb-2">
                  <div className="font-medium text-gray-900">Boardroom + One Consultation (18 pax)</div>
                  <div className="text-gray-600">{formatZAR(4000, false)} (half) / {formatZAR(6000, false)} (full) / {formatZARHourly(1000)}</div>
                </div>
                <div className="pb-2">
                  <div className="font-medium text-gray-900">Boardroom + Two Consultations (24 pax)</div>
                  <div className="text-gray-600">{formatZAR(5000, false)} (half) / {formatZAR(7000, false)} (full) / {formatZARHourly(1500)}</div>
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
                  <span>reservations@nmct.co.za</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary-teal mr-2">📞</span>
                  <span>TBA</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary-teal mr-2">🕐</span>
                  <span>Mon-Fri: 08:30-17:00</span>
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
