import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary-teal mb-4">
              Northcliff MCT
            </h3>
            <p className="text-gray-300 mb-4">
              Professional, accessible, and affordable space for mediation, consultation, and training in Northcliff.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-300 hover:text-primary-teal transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 reservations@nmct.co.za</p>
              <p>📞 TBA</p>
              <p>📍 Impala Chambers<br/>177 Beyers Naude Drive, Northcliff<br/>Johannesburg, 2195</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} Northcliff MCT. All rights reserved.</p>
          <p className="mt-2">
            <Link
              to="/terms"
              className="text-gray-400 hover:text-primary-teal transition-colors duration-200"
            >
              Terms of Use
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
