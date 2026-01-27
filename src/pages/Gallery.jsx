import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import Modal from '../components/Modal'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  
  // Gallery images - placeholder images pending actual facility photographs
  const images = [
    {
      id: 1,
      src: 'https://via.placeholder.com/600x400/134e4a/ffffff?text=Main+Boardroom',
      title: 'Main Boardroom',
      description: 'Executive boardroom with modern presentation facilities, seating up to 12 people'
    },
    {
      id: 2,
      src: 'https://via.placeholder.com/600x400/14b8a6/ffffff?text=Consultation+Room+1',
      title: 'Consultation Room 1',
      description: 'Private consultation space for confidential meetings, seating up to 6 people'
    },
    {
      id: 3,
      src: 'https://via.placeholder.com/600x400/0d9488/ffffff?text=Consultation+Room+2',
      title: 'Consultation Room 2',
      description: 'Second consultation room for breakout sessions, seating up to 6 people'
    },
    {
      id: 4,
      src: 'https://via.placeholder.com/600x400/059669/ffffff?text=Our+Team',
      title: 'Our Team',
      description: 'The Northcliff MCT team dedicated to providing professional meeting spaces'
    },
    {
      id: 5,
      src: 'https://via.placeholder.com/600x400/0f766e/ffffff?text=Facility+Overview',
      title: 'Facility Overview',
      description: 'Located at Impala Chambers, 177 Beyers Naude Drive, Northcliff, Johannesburg'
    }
  ]

  const facilities = [
    {
      title: 'Modern Technology',
      description: 'All rooms equipped with the latest audio-visual technology',
      icon: '💻'
    },
    {
      title: 'Comfortable Environment',
      description: 'Climate-controlled spaces with ergonomic furniture',
      icon: '🪑'
    },
    {
      title: 'Professional Setting',
      description: 'Designed to create the perfect atmosphere for productive meetings',
      icon: '🏢'
    },
    {
      title: 'Refreshment Services',
      description: 'Coffee, tea, and light refreshments available',
      icon: '☕'
    }
  ]

  const openModal = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

  const prevImage = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setSelectedImage(images[prevIndex])
  }

  // Handle keyboard navigation in modal
  const handleKeyDown = (e) => {
    if (!selectedImage) return
    
    switch (e.key) {
      case 'ArrowLeft':
        prevImage()
        break
      case 'ArrowRight':
        nextImage()
        break
      case 'Escape':
        closeModal()
        break
      default:
        break
    }
  }

  // Add keyboard listener when modal is open
  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

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
              Our Facilities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Take a virtual tour of our professional spaces. Click on any image to view it in full size.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => openModal(image)}
              >
                <div className="card overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="h-12 w-12 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {image.title}
                    </h3>
                    <p className="text-gray-600">
                      {image.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Facility Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every space is designed with your comfort and professional needs in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🌞', title: 'Natural Light', description: 'Large windows provide excellent natural lighting' },
              { icon: '❄️', title: 'Climate Control', description: 'Individually controlled air conditioning' },
              { icon: '📶', title: 'High-Speed WiFi', description: 'Complimentary high-speed internet access' },
              { icon: '📺', title: 'AV Equipment', description: 'Modern presentation and audio equipment' },
              { icon: '☕', title: 'Refreshments', description: 'Coffee, tea, and catering services available' },
              { icon: '🔒', title: 'Secure Access', description: 'Controlled access and security systems' },
              { icon: '🅿️', title: 'Free Parking', description: 'On-site parking for all visitors' },
              { icon: '⚡', title: 'Backup Power', description: 'Uninterrupted power supply for all facilities' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
              Ready to Experience Our Facilities?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Book a tour or reserve your space today to see our professional facilities in person.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="bg-white text-primary-teal font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book a Space
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-teal transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Schedule a Tour
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal for Image Preview */}
      <Modal 
        isOpen={selectedImage !== null} 
        onClose={closeModal}
        ariaLabel={selectedImage ? `Image preview: ${selectedImage.title}` : 'Image preview'}
      >
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full max-h-96 object-contain rounded-lg mb-4"
            />
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-gray-600">
                {selectedImage.description}
              </p>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={prevImage}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <span className="text-sm text-gray-500">
                {images.findIndex(img => img.id === selectedImage.id) + 1} of {images.length}
              </span>
              
              <button
                onClick={nextImage}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Gallery
