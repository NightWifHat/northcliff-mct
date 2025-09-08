import { motion } from 'framer-motion'
import Card from '../components/Card'

const Services = () => {
  const services = [
    {
      title: 'Full Day – Entire Facility',
      description: 'Complete access to all our facilities for a full day. Includes one big room (12 people) plus two break-away rooms (8 people each). Flexible timing by arrangement.',
      image: 'https://via.placeholder.com/600x400/14b8a6/ffffff?text=Entire+Facility',
      features: ['One big room (12 people capacity)', 'Two break-away rooms (8 people each)', '08h30–16h30 (flexible by arrangement)', 'Complete facility access', 'All amenities included'],
      pricing: {
        fullDay: 'R4,000'
      }
    },
    {
      title: 'Half Day – Entire Facility',
      description: 'Access to all our facilities for half a day. Perfect for shorter events while still having access to all rooms and amenities.',
      image: 'https://via.placeholder.com/600x400/059669/ffffff?text=Half+Day+Facility',
      features: ['One big room (12 people capacity)', 'Two break-away rooms (8 people each)', 'Half day duration', 'Complete facility access', 'All amenities included'],
      pricing: {
        halfDay: 'R2,000'
      }
    },
    {
      title: 'Big Room Only',
      description: 'Access to our main conference room only. Ideal for focused meetings and presentations with a single group.',
      image: 'https://via.placeholder.com/600x400/0d9488/ffffff?text=Big+Room+Only',
      features: ['Main room (12 people capacity)', 'Professional setting', 'Audio/visual equipment', 'Natural lighting', 'Climate controlled'],
      pricing: {
        fullDay: 'R2,000',
        halfDay: 'R1,500'
      }
    }
  ]

  const PricingTable = ({ pricing }) => (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
      <div className="flex flex-wrap gap-4 text-center">
        {pricing.fullDay && (
          <div className="flex-1 min-w-[120px]">
            <p className="text-sm text-gray-600">Full Day</p>
            <p className="font-semibold text-primary-teal text-lg">{pricing.fullDay}</p>
          </div>
        )}
        {pricing.halfDay && (
          <div className="flex-1 min-w-[120px]">
            <p className="text-sm text-gray-600">Half Day</p>
            <p className="font-semibold text-primary-teal text-lg">{pricing.halfDay}</p>
          </div>
        )}
      </div>
    </div>
  )

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
              Choose from our flexible facility packages designed to meet your specific needs. 
              All packages include professional amenities and flexible timing arrangements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Features:</h3>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-primary-teal mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PricingTable pricing={service.pricing} />
                  
                  <div className="mt-6">
                    <a
                      href="/booking"
                      className="btn-primary inline-block"
                    >
                      Book This Service
                    </a>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="text-4xl mb-4">☕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Catering Services
              </h3>
              <p className="text-gray-600">
                Coffee, tea, light refreshments, and full meal options available upon request.
              </p>
            </Card>

            <Card delay={0.1} className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Administrative Support
              </h3>
              <p className="text-gray-600">
                Reception services, document printing, and basic administrative assistance.
              </p>
            </Card>

            <Card delay={0.2} className="text-center">
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
              <a
                href="/booking"
                className="bg-white text-primary-teal font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book Now
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-teal transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
