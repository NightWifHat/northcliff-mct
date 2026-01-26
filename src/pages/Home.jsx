import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Card from '../components/Card'

const Home = () => {
  const features = [
    {
      title: 'Professional Environment',
      description: 'Modern, well-equipped spaces designed to cater to a full range of professional functions including conciliation, mediation, arbitration, disciplinary hearings, board meetings, training, workshops, and seminars.',
      icon: '🏢'
    },
    {
      title: 'Experienced Founded',
      description: 'Designed by practising attorneys who understand the requirements of legal and business professionals.',
      icon: '👩‍💼'
    },
    {
      title: 'Affordable Rates',
      description: 'Affordably priced spaces make professionalism within reach.',
      icon: '💰'
    },
    {
      title: 'Accommodative Booking',
      description: 'Hourly, half-day, and full-day options to suit your specific requirements.',
      icon: '📅'
    },
    {
      title: 'Flexible Spaces',
      description: 'A boardroom seating 12 to 18 and two consultation rooms seating up to 8. Space can convert into a training facility for up to 24 attendees.',
      icon: '🪑'
    },
    {
      title: 'Refreshments and Amenities',
      description: 'Uninterrupted Wi-Fi, backup power, and complimentary coffee, tea, and water.',
      icon: '☕'
    }
  ]

  return (
    <div>
      <Hero />
      
      {/* Introduction Section */}
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
              Welcome to Northcliff MCT
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Be it resolution, growth, or connection, Northcliff MCT adapts to meet your purpose.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} delay={index * 0.1} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
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
              Experience our professional facilities and excellent service. 
              Book your mediation room or training facility today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-white text-primary-teal font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book Now
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-teal transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
