import { motion } from 'framer-motion'
import Card from '../components/Card'

const About = () => {
  const founders = [
    {
      name: 'Sarah Mitchell',
      role: 'Co-Founder & Managing Partner',
      description: 'With over 15 years in corporate law and mediation, Sarah brings extensive experience in conflict resolution.',
      image: 'https://via.placeholder.com/300x300/14b8a6/ffffff?text=Sarah+M'
    },
    {
      name: 'David Thompson',
      role: 'Co-Founder & Legal Consultant',
      description: 'David specializes in commercial law and has facilitated over 200 successful mediation cases.',
      image: 'https://via.placeholder.com/300x300/059669/ffffff?text=David+T'
    },
    {
      name: 'Lisa Chen',
      role: 'Co-Founder & Training Director',
      description: 'Lisa focuses on legal training and professional development with expertise in adult education.',
      image: 'https://via.placeholder.com/300x300/0d9488/ffffff?text=Lisa+C'
    }
  ]

  const values = [
    {
      title: 'Professionalism',
      description: 'We maintain the highest standards in all our facilities and services, ensuring every client receives exceptional quality.',
      icon: '🎯'
    },
    {
      title: 'Accessibility',
      description: 'Our services are designed to be easily accessible to legal professionals at all levels of their careers.',
      icon: '🌟'
    },
    {
      title: 'Affordability',
      description: 'We believe professional spaces should be affordable without compromising on quality or service.',
      icon: '💡'
    },
    {
      title: 'Simplicity',
      description: 'Our booking process and facility management are streamlined for your convenience and efficiency.',
      icon: '✨'
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
              About Northcliff MCT
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Founded by three passionate lawyers, Northcliff MCT was created to address the 
              growing need for professional, accessible, and affordable spaces for mediation, 
              consultation, and training in Johannesburg.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Northcliff MCT was born from the shared vision of three experienced lawyers 
                who recognized a gap in the market for high-quality, affordable professional spaces.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                After years of practicing law and witnessing colleagues struggle to find 
                suitable venues for mediation sessions, consultations, and training programs, 
                we decided to create the solution ourselves.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is simple: provide professional spaces that don't break the bank, 
                in a location that's convenient and accessible to legal professionals throughout Johannesburg.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <img
                src="https://via.placeholder.com/600x400/14b8a6/ffffff?text=Our+Professional+Facility"
                alt="Our facility"
                className="rounded-xl shadow-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Founders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three experienced legal professionals with a shared commitment to excellence and accessibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card key={index} delay={index * 0.2} className="text-center">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {founder.name}
                </h3>
                <p className="text-primary-teal font-medium mb-4">
                  {founder.role}
                </p>
                <p className="text-gray-600">
                  {founder.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Northcliff MCT.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} delay={index * 0.1} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
