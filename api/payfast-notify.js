import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

/**
 * PayFast ITN (Instant Transaction Notification) Handler
 * 
 * This is a Vercel serverless function that PayFast POSTs to after a payment.
 * It verifies the payment and updates the booking status from 'reserved' → 'booked'.
 * 
 * PayFast docs: https://developers.payfast.co.za/docs#step_4_confirm_payment
 * 
 * Required env vars (set in Vercel, NOT prefixed with VITE_):
 *   SUPABASE_URL            - your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - your Supabase service role key (server-side only)
 *   PAYFAST_PASSPHRASE       - your PayFast passphrase (if set in PayFast dashboard)
 */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// PayFast valid server IPs (sandbox + production)
// https://developers.payfast.co.za/docs#step_4_confirm_payment
const PAYFAST_IPS = [
  '197.97.145.144',
  '197.97.145.145',
  '197.97.145.146',
  '197.97.145.147',
  '197.97.145.148',
  '41.74.179.194',
  '41.74.179.195',
  '41.74.179.196',
  '41.74.179.197',
  // Sandbox IPs
  '197.97.145.144',
]

/**
 * Generate MD5 signature from PayFast data for validation
 */
function generateSignature(data, passphrase = null) {
  const params = []
  for (const [key, value] of Object.entries(data)) {
    if (key === 'signature') continue
    if (value !== undefined && value !== '') {
      params.push(`${key}=${encodeURIComponent(String(value).trim()).replace(/%20/g, '+')}`)
    }
  }

  let paramString = params.join('&')
  if (passphrase) {
    paramString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }

  return crypto.createHash('md5').update(paramString).digest('hex')
}

/**
 * Validate the PayFast ITN signature
 */
function validateSignature(pfData, passphrase) {
  const expectedSignature = generateSignature(pfData, passphrase)
  return pfData.signature === expectedSignature
}

/**
 * Confirm payment with PayFast server
 */
async function confirmWithPayFast(pfData, sandbox = false) {
  const pfHost = sandbox ? 'https://sandbox.payfast.co.za' : 'https://www.payfast.co.za'
  
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(pfData)) {
    if (key === 'signature') continue
    params.append(key, value)
  }

  try {
    const response = await fetch(`${pfHost}/eng/query/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
    const result = await response.text()
    return result.trim() === 'VALID'
  } catch (error) {
    console.error('PayFast validation request failed:', error)
    return false
  }
}

export default async function handler(req, res) {
  // PayFast only sends POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const pfData = req.body

    console.log('PayFast ITN received:', {
      m_payment_id: pfData.m_payment_id,
      pf_payment_id: pfData.pf_payment_id,
      payment_status: pfData.payment_status,
      amount_gross: pfData.amount_gross,
    })

    // 1. Verify the signature (if passphrase is configured)
    const passphrase = process.env.PAYFAST_PASSPHRASE || null
    if (passphrase) {
      const signatureValid = await validateSignature(pfData, passphrase)
      if (!signatureValid) {
        console.error('PayFast ITN: Invalid signature')
        return res.status(400).json({ error: 'Invalid signature' })
      }
    }

    // 2. Confirm with PayFast servers
    const isSandbox = process.env.VITE_PAYFAST_MODE === 'sandbox' || !process.env.VITE_PAYFAST_MODE
    const paymentValid = await confirmWithPayFast(pfData, isSandbox)
    if (!paymentValid) {
      console.error('PayFast ITN: Payment validation failed')
      return res.status(400).json({ error: 'Payment validation failed' })
    }

    // 3. Get the booking ID from m_payment_id
    const bookingId = pfData.m_payment_id
    if (!bookingId) {
      console.error('PayFast ITN: No m_payment_id in payload')
      return res.status(400).json({ error: 'Missing booking reference' })
    }

    // 4. Update booking based on payment status
    if (pfData.payment_status === 'COMPLETE') {
      // Payment successful — update booking to 'booked'
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'booked',
          payment_status: 'completed',
          payment_id: pfData.pf_payment_id,
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Failed to update booking:', updateError)
        return res.status(500).json({ error: 'Database update failed' })
      }

      console.log(`Booking ${bookingId} confirmed — status updated to 'booked'`)
    } else if (pfData.payment_status === 'CANCELLED') {
      // Payment cancelled — clean up the reservation
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)
        .eq('status', 'reserved') // only delete if still reserved

      if (deleteError) {
        console.error('Failed to delete cancelled booking:', deleteError)
      }

      console.log(`Booking ${bookingId} cancelled — reservation removed`)
    } else {
      // Other statuses: FAILED, PENDING, etc.
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: pfData.payment_status.toLowerCase(),
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Failed to update payment status:', updateError)
      }

      console.log(`Booking ${bookingId} — payment status: ${pfData.payment_status}`)
    }

    // PayFast expects a 200 OK response with no body
    return res.status(200).send('')
  } catch (error) {
    console.error('PayFast ITN handler error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
