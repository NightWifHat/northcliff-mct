import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'

/**
 * PayPal Client ID Configuration
 * 
 * SANDBOX MODE (current): Uses test credentials for development
 * PRODUCTION MODE: Set VITE_PAYPAL_CLIENT_ID environment variable with live client ID
 * 
 * Environment variable: VITE_PAYPAL_CLIENT_ID
 * - For sandbox: Use sandbox client ID from PayPal Developer Dashboard
 * - For production: Use live client ID from PayPal Developer Dashboard
 * 
 * When going live:
 * 1. Create a PayPal Business account at https://www.paypal.com/business
 * 2. Go to PayPal Developer Dashboard: https://developer.paypal.com/
 * 3. Create a Live App and get the Client ID
 * 4. Set VITE_PAYPAL_CLIENT_ID in your Vercel environment variables
 */
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb' // 'sb' = PayPal sandbox test mode

// Payment status constants
const PAYMENT_STATUS = {
  IDLE: 'idle',
  LOADING_SDK: 'loading_sdk',
  READY: 'ready',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled',
  SLOT_UNAVAILABLE: 'slot_unavailable'
}

const PayPalCheckout = ({ 
  amount, 
  bookingDetails, 
  onPaymentSuccess, 
  onPaymentError,
  onBookingCreated 
}) => {
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.IDLE)
  const [errorMessage, setErrorMessage] = useState('')
  const [successData, setSuccessData] = useState(null)
  const [showPayPal, setShowPayPal] = useState(false)
  
  // Refs to prevent duplicate renders and track cleanup
  const paypalScriptRef = useRef(null)
  const isMountedRef = useRef(true)
  const buttonsRenderedRef = useRef(false)

  // Validate amount is a positive number derived from booking details
  const validatedAmount = typeof amount === 'number' && amount > 0 ? amount : 0

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Load PayPal SDK
  useEffect(() => {
    if (!showPayPal || validatedAmount <= 0) return

    const loadPayPalScript = () => {
      // Check if already loaded
      if (window.paypal) {
        setPaymentStatus(PAYMENT_STATUS.READY)
        return
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="paypal.com/sdk"]')
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMountedRef.current) {
            setPaymentStatus(PAYMENT_STATUS.READY)
          }
        })
        return
      }

      setPaymentStatus(PAYMENT_STATUS.LOADING_SDK)

      /**
       * PayPal SDK URL Configuration
       * Currency: ZAR (South African Rand)
       * Intent: capture (immediate payment capture)
       * 
       * The SDK automatically uses sandbox or live mode based on the client ID provided.
       */
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=ZAR&intent=capture`
      script.async = true
      script.id = 'paypal-sdk'
      
      script.onload = () => {
        if (isMountedRef.current) {
          setPaymentStatus(PAYMENT_STATUS.READY)
        }
      }
      
      script.onerror = () => {
        if (isMountedRef.current) {
          setPaymentStatus(PAYMENT_STATUS.ERROR)
          setErrorMessage('Failed to load PayPal. Please refresh and try again.')
        }
      }
      
      paypalScriptRef.current = script
      document.head.appendChild(script)
    }

    loadPayPalScript()
  }, [showPayPal, validatedAmount])

  /**
   * Check if the booking slot is still available before creating booking
   * Prevents double-booking race conditions
   */
  const checkSlotAvailability = async () => {
    if (!bookingDetails?.rawDate) return { available: true }

    try {
      const dateString = bookingDetails.rawDate.toISOString().split('T')[0]
      
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', dateString)
        .eq('time', bookingDetails.time)
        .in('status', ['booked', 'reserved'])

      if (error) {
        console.error('Error checking slot availability:', error)
        return { available: false, error: 'Failed to verify availability' }
      }

      return { 
        available: !existingBookings || existingBookings.length === 0 
      }
    } catch (err) {
      console.error('Slot check error:', err)
      return { available: false, error: 'Failed to verify availability' }
    }
  }

  /**
   * Create booking record in Supabase ONLY AFTER successful payment
   * Includes PayPal transaction ID for reconciliation
   */
  const createBookingRecord = async (paymentData) => {
    const bookingRecord = {
      booking_date: bookingDetails.rawDate?.toISOString().split('T')[0],
      status: 'booked',
      package_type: bookingDetails.packageType,
      price: validatedAmount, // Use the same validated amount sent to PayPal
      name: bookingDetails.name,
      email: bookingDetails.email,
      phone: bookingDetails.phone,
      notes: bookingDetails.message || '',
      time: bookingDetails.time,
      duration: bookingDetails.duration,
      paypal_order_id: paymentData.orderId,
      paypal_transaction_id: paymentData.transactionId,
      payment_status: 'completed',
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

  // Render PayPal buttons
  const renderPayPalButtons = useCallback(() => {
    const container = document.getElementById('paypal-button-container')
    if (!container || !window.paypal || buttonsRenderedRef.current) return

    // Mark as rendered to prevent duplicates
    buttonsRenderedRef.current = true

    // Clear any existing content
    container.innerHTML = ''

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 45
      },

      // Create the PayPal order with validated amount from booking selection
      createOrder: (data, actions) => {
        // Generate unique booking reference
        const bookingRef = `NMCT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: validatedAmount.toFixed(2),
              currency_code: 'ZAR'
            },
            description: `Northcliff MCT - ${bookingDetails?.packageType || 'Room Booking'} (${bookingDetails?.duration || ''})`,
            custom_id: bookingRef,
            reference_id: bookingRef
          }],
          application_context: {
            brand_name: 'Northcliff MCT',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW'
          }
        })
      },

      // Handle successful payment approval - BOOKING CREATED ONLY HERE
      onApprove: async (data, actions) => {
        if (!isMountedRef.current) return

        setPaymentStatus(PAYMENT_STATUS.PROCESSING)
        setErrorMessage('')

        try {
          // Step 1: Capture the payment
          const orderDetails = await actions.order.capture()
          
          if (orderDetails.status !== 'COMPLETED') {
            throw new Error('Payment was not completed')
          }

          const paymentData = {
            orderId: orderDetails.id,
            transactionId: orderDetails.purchase_units[0]?.payments?.captures?.[0]?.id,
            amount: orderDetails.purchase_units[0]?.amount?.value,
            currency: orderDetails.purchase_units[0]?.amount?.currency_code,
            status: orderDetails.status,
            payerEmail: orderDetails.payer?.email_address,
            payerName: orderDetails.payer?.name?.given_name
          }

          // Step 2: Verify slot is still available (prevent race condition double-booking)
          const slotCheck = await checkSlotAvailability()
          
          if (!slotCheck.available) {
            setPaymentStatus(PAYMENT_STATUS.SLOT_UNAVAILABLE)
            setErrorMessage(
              'Unfortunately, this time slot was just booked by someone else. ' +
              'Your payment will be refunded. Please contact us or select a different time.'
            )
            onPaymentError?.({ 
              type: 'SLOT_UNAVAILABLE', 
              paymentData,
              message: 'Slot no longer available - refund required' 
            })
            return
          }

          // Step 3: Create booking record ONLY after successful payment
          const bookingRecord = await createBookingRecord(paymentData)

          // Step 4: Update UI and notify parent
          setPaymentStatus(PAYMENT_STATUS.SUCCESS)
          setSuccessData({
            bookingRef: bookingRecord?.id || paymentData.orderId,
            transactionId: paymentData.transactionId,
            amount: paymentData.amount
          })

          onPaymentSuccess?.(paymentData)
          onBookingCreated?.(bookingRecord)

        } catch (error) {
          console.error('Payment processing error:', error)
          
          if (isMountedRef.current) {
            setPaymentStatus(PAYMENT_STATUS.ERROR)
            setErrorMessage(
              error.message || 'Payment was successful but booking creation failed. ' +
              'Please contact us with your PayPal transaction details.'
            )
            onPaymentError?.(error)
          }
        }
      },

      // Handle payment errors - NO booking created
      onError: (error) => {
        console.error('PayPal error:', error)
        if (isMountedRef.current) {
          setPaymentStatus(PAYMENT_STATUS.ERROR)
          setErrorMessage('Payment failed. Please try again or use a different payment method.')
          onPaymentError?.(error)
        }
      },

      // Handle user cancellation - NO booking created
      onCancel: () => {
        if (isMountedRef.current) {
          setPaymentStatus(PAYMENT_STATUS.CANCELLED)
          setErrorMessage('Payment was cancelled. You can try again when ready.')
        }
      }
    }).render('#paypal-button-container').catch(err => {
      console.error('Failed to render PayPal buttons:', err)
      if (isMountedRef.current) {
        setPaymentStatus(PAYMENT_STATUS.ERROR)
        setErrorMessage('Failed to initialize PayPal. Please refresh and try again.')
      }
    })
  }, [validatedAmount, bookingDetails, onPaymentSuccess, onPaymentError, onBookingCreated])

  // Render buttons when SDK is ready
  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.READY && showPayPal) {
      // Small delay to ensure container is in DOM
      const timer = setTimeout(() => {
        renderPayPalButtons()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [paymentStatus, showPayPal, renderPayPalButtons])

  // Reset button rendered state when hiding PayPal
  useEffect(() => {
    if (!showPayPal) {
      buttonsRenderedRef.current = false
    }
  }, [showPayPal])

  const handleProceedToPayment = () => {
    setPaymentStatus(PAYMENT_STATUS.IDLE)
    setErrorMessage('')
    setShowPayPal(true)
  }

  const handleBackToSummary = () => {
    setShowPayPal(false)
    setPaymentStatus(PAYMENT_STATUS.IDLE)
    setErrorMessage('')
    buttonsRenderedRef.current = false
  }

  const handleTryAgain = () => {
    setPaymentStatus(PAYMENT_STATUS.READY)
    setErrorMessage('')
    buttonsRenderedRef.current = false
    setTimeout(() => renderPayPalButtons(), 100)
  }

  // Check if form is complete enough for payment
  const isReadyForPayment = 
    bookingDetails?.rawDate && 
    bookingDetails?.packageType && 
    bookingDetails?.time &&
    validatedAmount > 0

  // Render success state
  if (paymentStatus === PAYMENT_STATUS.SUCCESS && successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your payment was successful and your booking has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left max-w-sm mx-auto">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold">R{successData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{successData.transactionId}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            A confirmation email will be sent to {bookingDetails?.email}
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment</h3>
      
      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{bookingDetails?.packageType || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{bookingDetails?.duration || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{bookingDetails?.date || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{bookingDetails?.time || 'Not selected'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-primary-teal">
              R{validatedAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* PayPal Business Account Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">Payment Notice</p>
            <p className="text-blue-700">
              Payments will be enabled once the PayPal business account is activated.
            </p>
          </div>
        </div>
      </div>

      {/* Sandbox Notice - Only shown when using sandbox mode */}
      {PAYPAL_CLIENT_ID === 'sb' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="text-yellow-800 font-medium mb-1">Demo Mode: PayPal Sandbox</p>
              <p className="text-yellow-700">
                No real payments will be processed. Use PayPal sandbox test accounts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-red-800">{errorMessage}</p>
              {(paymentStatus === PAYMENT_STATUS.ERROR || paymentStatus === PAYMENT_STATUS.CANCELLED) && (
                <button
                  onClick={handleTryAgain}
                  className="mt-2 text-red-700 underline hover:text-red-900"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Actions */}
      {!showPayPal ? (
        <div className="space-y-4">
          <button
            onClick={handleProceedToPayment}
            disabled={!isReadyForPayment}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              !isReadyForPayment
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-teal hover:bg-primary-green transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
            }`}
          >
            Proceed to Payment
          </button>
          
          {!isReadyForPayment && (
            <p className="text-sm text-gray-500 text-center">
              Please complete all booking details before proceeding to payment.
            </p>
          )}
        </div>
      ) : (
        <div>
          {/* Processing State */}
          {paymentStatus === PAYMENT_STATUS.PROCESSING && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-blue-800 font-medium">Processing payment and creating booking...</span>
              </div>
              <p className="text-blue-700 text-sm text-center mt-2">
                Please do not close this window.
              </p>
            </div>
          )}
          
          {/* Loading SDK State */}
          {paymentStatus === PAYMENT_STATUS.LOADING_SDK && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal"></div>
              <span className="ml-3 text-gray-600">Loading PayPal...</span>
            </div>
          )}

          {/* PayPal Buttons Container */}
          {(paymentStatus === PAYMENT_STATUS.READY || 
            paymentStatus === PAYMENT_STATUS.ERROR || 
            paymentStatus === PAYMENT_STATUS.CANCELLED) && (
            <div>
              <div id="paypal-button-container" className="min-h-[150px]"></div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Pay securely with PayPal or any credit/debit card
              </p>
            </div>
          )}

          {/* Back Button - only show when not processing */}
          {paymentStatus !== PAYMENT_STATUS.PROCESSING && (
            <button
              onClick={handleBackToSummary}
              className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back to Summary
            </button>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Payments processed securely by PayPal</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PayPalCheckout
