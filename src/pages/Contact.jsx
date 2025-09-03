import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Contact information with placeholder logos
  // TODO: Replace placeholder logos with actual company logos
  const contacts = [
    {
      name: 'Victor de Bruyn',
      title: 'Marketing Manager',
      phone: '+27 82 886 7289',
      email: 'vdebruyn@lindsaykeller.com',
      logo: 'https://via.placeholder.com/120x60/14b8a6/ffffff?text=Lindsay+Keller'
    },
    {
      name: 'Lize-Marié Joubert',
      title: 'Operations Manager',
      phone: '+27 82 560 9251',
      email: 'lmj@jw-law.co.za',
      logo: 'https://via.placeholder.com/120x60/059669/ffffff?text=JW+Law'
    },
    {
      name: 'Kippie Schroeder',
      title: 'Partner',
      phone: '+27 82 451 2314',
      email: 'kschroeder@werthschroeder.com',
      logo: 'https://via.placeholder.com/120x60/0d9488/ffffff?text=Werth+Schroeder'
    }
  ]

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

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For now, just log the form data
    console.log('Contact form submission:', formData)
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    })
    
    setIsSubmitting(false)
    alert('Thank you for your message! We will get back to you within 24 hours.')
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
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team for booking inquiries, facility information, or general questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Address Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Our Location</h2>
              </div>
              <p className="text-lg text-gray-700">
                2nd Floor, Impala Center, 177 Beyers Naudé Drive, Northcliff
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600">Get in touch with our professional team members</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contacts.map((contact, index) => (
              <Card key={index} delay={index * 0.1} className="text-center">
                {/* TODO: Replace placeholder logo with actual company logo */}
                <div className="mb-6">
                  <img 
                    src={contact.logo} 
                    alt={`${contact.name} Company Logo`}
                    className="mx-auto h-16 w-auto object-contain rounded-lg"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.name}</h3>
                <p className="text-primary-teal font-semibold mb-4">{contact.title}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contact.phone}`} className="text-gray-700 hover:text-primary-teal transition-colors font-medium">
                      {contact.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contact.email}`} className="text-gray-700 hover:text-primary-teal transition-colors break-all text-sm">
                      {contact.email}
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal outline-none transition-colors ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Visit Us
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center text-white text-xl">
                      📧
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">General Inquiries</h4>
                      <p className="text-gray-600">info@northcliffmct.co.za</p>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-teal rounded-lg flex items-center justify-center text-white text-xl">
                      
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">Business Hours</h4>
                      <div className="text-gray-600">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 2:00 PM</p>
                        <p>Sunday: By appointment only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href="/booking"
                    className="flex items-center p-3 bg-primary-teal text-white rounded-lg hover:bg-primary-green transition-colors"
                  >
                    <span className="mr-3">📅</span>
                    <span className="font-medium">Book a Room</span>
                  </a>
                  <a
                    href="/services"
                    className="flex items-center p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span className="mr-3">🏢</span>
                    <span className="font-medium">View Services</span>
                  </a>
                  <a
                    href="/gallery"
                    className="flex items-center p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span className="mr-3">🖼️</span>
                    <span className="font-medium">Tour Our Facilities</span>
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Find Us on the Map
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're conveniently located in Northcliff, Johannesburg with easy access and secure parking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-96 w-full">
              {/* Google Maps Embed for Northcliff, Johannesburg */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57298.263703282444!2d27.947863099999996!3d-26.141934449999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0b6903b%3A0x6b1b2b2b2b2b2b2b!2sNorthcliff%2C%20Randburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1693737600000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Northcliff MCT Location - Northcliff, Johannesburg"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
