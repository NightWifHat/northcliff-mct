import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PayPalCheckout = ({ amount, bookingDetails, onPaymentSuccess, onPaymentError }) => {
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [showPayPal, setShowPayPal] = useState(false)

  // TODO: Replace with actual PayPal client ID from PayPal Developer Dashboard
  const PAYPAL_CLIENT_ID = "YOUR_SANDBOX_CLIENT_ID_HERE"

  useEffect(() => {
    // Load PayPal SDK (sandbox mode for development)
    const loadPayPalScript = () => {
      if (window.paypal) {
        setIsPayPalLoaded(true)
        return
      }

      // TODO: Replace sandbox client ID with production client ID when going live
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=ZAR&intent=capture`
      script.async = true
      script.onload = () => {
        setIsPayPalLoaded(true)
        console.log('PayPal SDK loaded successfully')
      }
      script.onerror = () => {
        console.error('Failed to load PayPal SDK')
        onPaymentError && onPaymentError({ message: 'Failed to load PayPal SDK' })
      }
      document.head.appendChild(script)
    }

    if (amount > 0) {
      loadPayPalScript()
    }

    return () => {
      // Cleanup: Remove PayPal script when component unmounts
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [amount, PAYPAL_CLIENT_ID, onPaymentError])

  useEffect(() => {
    if (isPayPalLoaded && showPayPal && amount > 0) {
      renderPayPalButtons()
    }
  }, [isPayPalLoaded, showPayPal, amount])

  const renderPayPalButtons = () => {
    const paypalButtonContainer = document.getElementById('paypal-button-container')
    if (!paypalButtonContainer || !window.paypal) return

    // Clear existing buttons
    paypalButtonContainer.innerHTML = ''

    // TODO: Configure PayPal payment flow with actual business logic
    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: 'ZAR'
            },
            description: `Northcliff MCT - ${bookingDetails?.serviceType || 'Room Booking'}`,
            custom_id: `MCT-${Date.now()}`, // TODO: Generate proper booking reference
          }],
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        })
      },
      onApprove: async (data, actions) => {
        setPaymentProcessing(true)
        try {
          const details = await actions.order.capture()
          console.log('Payment successful:', details)
          
          // TODO: Send payment confirmation to backend API
          const paymentData = {
            orderId: details.id,
            paymentId: details.purchase_units[0].payments.captures[0].id,
            amount: details.purchase_units[0].amount.value,
            currency: details.purchase_units[0].amount.currency_code,
            status: details.status,
            bookingDetails: bookingDetails
          }
          
          onPaymentSuccess && onPaymentSuccess(paymentData)
        } catch (error) {
          console.error('Payment processing error:', error)
          onPaymentError && onPaymentError(error)
        } finally {
          setPaymentProcessing(false)
        }
      },
      onError: (error) => {
        console.error('PayPal error:', error)
        setPaymentProcessing(false)
        onPaymentError && onPaymentError(error)
      },
      onCancel: (data) => {
        console.log('Payment cancelled by user:', data)
        setPaymentProcessing(false)
      }
    }).render('#paypal-button-container')
  }

  const handleProceedToPayment = () => {
    setShowPayPal(true)
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
            <span className="font-medium">{bookingDetails?.serviceType || 'Room Booking'}</span>
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
            <span className="text-2xl font-bold text-primary-teal">R{amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* PayPal Sandbox Notice */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="text-sm">
            <p className="text-yellow-800 font-medium mb-1">
              Demo Mode: PayPal Sandbox Integration
            </p>
            <p className="text-yellow-700">
              This is a demonstration of PayPal integration in sandbox mode. No real payments will be processed.
            </p>
            {/* TODO: Remove this notice when moving to production */}
            <p className="text-yellow-700 mt-1">
              <strong>Note:</strong> Replace sandbox client ID with production client ID for live payments.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Actions */}
      {!showPayPal ? (
        <div className="space-y-4">
          <button
            onClick={handleProceedToPayment}
            disabled={!bookingDetails?.date || !bookingDetails?.serviceType || amount <= 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              !bookingDetails?.date || !bookingDetails?.serviceType || amount <= 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-teal hover:bg-primary-green transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
            }`}
          >
            Proceed to Payment
          </button>
          
          {(!bookingDetails?.date || !bookingDetails?.serviceType) && (
            <p className="text-sm text-gray-500 text-center">
              Please complete your booking details before proceeding to payment.
            </p>
          )}
        </div>
      ) : (
        <div>
          {paymentProcessing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-800">Processing payment...</span>
              </div>
            </div>
          )}
          
          {/* PayPal Buttons Container */}
          {isPayPalLoaded ? (
            <div>
              <div id="paypal-button-container"></div>
              <button
                onClick={() => setShowPayPal(false)}
                className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back to Summary
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal"></div>
              <span className="ml-3 text-gray-600">Loading PayPal...</span>
            </div>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </motion.div>
  )
}

export default PayPalCheckout
