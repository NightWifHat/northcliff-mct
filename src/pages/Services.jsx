import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import { formatZAR, formatZARHourly } from '../utils/currency'

const Services = () => {
  const services = [
    {
      title: 'Half Day Sessions',
      description: 'Flexible half-day booking with two convenient time slots to choose from.',
      image: 'https://via.placeholder.com/600x400/14b8a6/ffffff?text=Half+Day',
      sessions: [
        { name: 'Session 1', time: '08:00 to 13:00' },
        { name: 'Session 2', time: '13:00 to 18:00' }
      ],
      price: 2250
    },
    {
      title: 'Full Day',
      description: 'Complete day access from morning to evening for extended meetings and events.',
      image: 'https://via.placeholder.com/600x400/059669/ffffff?text=Full+Day',
      time: '08:00 to 18:00',
      price: 4500
    },
    {
      title: 'After Hours',
      description: 'Flexible booking for evenings and Saturdays when you need space outside regular hours.',
      image: 'https://via.placeholder.com/600x400/0d9488/ffffff?text=After+Hours',
      note: 'Including Saturdays',
      hourlyPrice: 500
    }
  ]

  const spaceOptions = [
    {
      title: 'Boardroom Only (12 pax)',
      halfDayPrice: 1500,
      fullDayPrice: 3000,
      hourlyPrice: 500
    },
    {
      title: 'One Consultation Room (6 pax)',
      halfDayPrice: 1200,
      fullDayPrice: 2400,
      hourlyPrice: 500
    },
    {
      title: 'Boardroom + One Consultation Room (18 pax)',
      halfDayPrice: 1600,
      fullDayPrice: 3200,
      hourlyPrice: 500
    }
  ]

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
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our flexible booking options designed to meet your needs. All options include uncapped Wi-Fi, uninterrupted power supply, complimentary coffee, tea, and water, secure on-site parking.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mt-4">
              Document printing and basic administrative assistance available upon request. 
              Refreshments and catering can be arranged with Olivia's Coffee Bake.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Options Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Booking Options</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} delay={index * 0.1} className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                {service.sessions && (
                  <div className="mb-6 space-y-2">
                    {service.sessions.map((session, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">{session.name}</p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {service.time && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-gray-900">{service.time}</p>
                    </div>
                  </div>
                )}

                {service.note && (
                  <p className="text-sm text-gray-600 italic mb-4">{service.note}</p>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <p className="text-3xl font-bold text-primary-teal">
                    {service.price ? formatZAR(service.price) : formatZARHourly(service.hourlyPrice)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Space Options Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Space Options</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Space Type</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Half Day</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Full Day</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Hourly</th>
                  </tr>
                </thead>
                <tbody>
                  {spaceOptions.map((option, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{option.title}</td>
                      <td className="py-4 px-4 text-center text-primary-teal font-semibold">{formatZAR(option.halfDayPrice)}</td>
                      <td className="py-4 px-4 text-center text-primary-teal font-semibold">{formatZAR(option.fullDayPrice)}</td>
                      <td className="py-4 px-4 text-center text-primary-teal font-semibold">{formatZARHourly(option.hourlyPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer additional services to make your experience seamless and professional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Catering Services
              </h3>
              <p className="text-gray-600">
                Coffee, tea, light refreshments, and full meal options available upon request through Olivia's Coffee Bake.
              </p>
            </Card>

            <Card delay={0.1} className="text-center">
              <div className="text-4xl mb-4">🅿️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Parking Available
              </h3>
              <p className="text-gray-600">
                Secure on-site parking available for all clients and participants.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Book Your Space?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your requirements and book the perfect space for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-white text-primary-teal font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book Now
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-teal transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
