import { motion } from 'framer-motion'

const Terms = () => {
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
              Terms of Use
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            {/* Definitions Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Definitions</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>The following terms shall have the meanings assigned to them hereunder:</p>
                
                <p>
                  <strong>Client</strong> means any natural or juristic person who rents the Space from NMCT in accordance with the terms of use set out herein.
                </p>
                
                <p>
                  <strong>Confirmation</strong> means written confirmation by NMCT, whether generated electronically or otherwise by email, confirming that payment has been received in respect of the Space which the Client wishes to reserve and that access will be granted for the specified date, time, and duration of the Reservation and "Confirm" shall have a corresponding meaning.
                </p>
                
                <p>
                  <strong>NMCT</strong> means Northcliff MCT (Pty) Ltd, the lawful occupier of the Space situated at Second Floor, Impala Chambers, Impala Centre, 177 Beyers Naude Drive, Johannesburg, South Africa.
                </p>
                
                <p>
                  <strong>Reservation</strong> means the booking by a Client of a specific Space at a specific date, time, and duration for the use of the Space or any identified portion thereof, which reservation has been Confirmed via email by NMCT.
                </p>
                
                <p>
                  <strong>Space</strong> means the premises situated at Second Floor, Impala Chambers, Impala Centre, 177 Beyers Naude Drive, Johannesburg, South Africa, comprising a conference room and two consultation rooms, or any of the aforesaid rooms alone or in combination as reserved.
                </p>
              </div>
            </div>

            {/* Clause 1 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Reservation</h2>
              <p className="text-gray-700 leading-relaxed">
                All Reservations for the use of the Space are subject to availability and are considered provisional until Confirmed as set out below. Reservations can be made either on NMCT's website or via email to <a href="mailto:reservations@nmct.co.za" className="text-primary-teal hover:underline">reservations@nmct.co.za</a>.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                Confirmation of a Reservation shall be sent by or on behalf of NMCT only upon receipt of proof of payment of the full amount payable for the Reservation no later than 48 hours prior to the commencement of the Reservation.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Venue Selection</h2>
              <p className="text-gray-700 leading-relaxed">
                Each Confirmation will contain the approved Space(s) and manner of access thereto. Access shall be limited strictly to the Space(s) at the times Confirmed.
              </p>
            </div>

            {/* Clause 4 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Changes</h2>
              <p className="text-gray-700 leading-relaxed">
                Any requests to change the configuration, duration, or date of a Reservation must be submitted in writing and are subject to availability and approval. Additional charges may apply. Changes are not guaranteed until Confirmed in writing.
              </p>
            </div>

            {/* Clause 5 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cancellation</h2>
              <p className="text-gray-700 leading-relaxed">
                Confirmed reservations may be cancelled on NMCT's website or in writing by emailing <a href="mailto:reservations@nmct.co.za" className="text-primary-teal hover:underline">reservations@nmct.co.za</a>. Cancellations made less than 48 hours prior to the commencement of a reservation will not be eligible for a refund. All other cancellations will be refunded, less a R500.00 administration fee.
              </p>
            </div>

            {/* Clause 6 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Use of Space</h2>
              <p className="text-gray-700 leading-relaxed">
                The Space(s) shall be used solely for its intended professional purpose for mediation, consultation or training, unless otherwise agreed to in writing by NMCT. The Client shall at all times accept full responsibility for any damage to the premises or loss of or damage to any of its contents, whether caused by the Client or any guests or attendees which enter the premises pursuant to the Client's rental of the Space from NMCT. The Client shall further ensure that all guests and / or attendees comply with these terms and conduct themselves in a orderly, quiet and respectful manner, befitting professional offices. NMCT reserves its right to have persons removed from the Space, should these terms not be adhered to.
              </p>
            </div>

            {/* Clause 7 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By proceeding with the Reservation, the Client confirms that s/he / it has read and understood these terms and accepts same. Any person acting for and on behalf of a juristic person by reserving a Space confirms that s/he is duly authorised by the juristic person to do so.
              </p>
            </div>

            {/* Clause 8 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Jurisdiction and Applicable Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms and Conditions are to be interpreted and are subject to the law of the Republic of South Africa and the Client hereby submits to the jurisdiction of the High Court of South Africa, South Gauteng Division, Johannesburg.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="text-gray-700 space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:reservations@nmct.co.za" className="text-primary-teal hover:underline">
                    reservations@nmct.co.za
                  </a>
                </p>
                <p>
                  <strong>Address:</strong> Second Floor, Impala Chambers, Impala Centre, 177 Beyers Naude Drive, Johannesburg, South Africa
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Terms
