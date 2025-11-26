import { motion } from 'framer-motion'
import Card from '../components/Card'

const About = () => {
  const team = [
    {
      name: 'Victor de Bruyn',
      practice: 'Lindsay Keller',
      link: 'https://www.lindsaykeller.com'
    },
    {
      name: 'Lize-Marié Joubert',
      practice: 'JW Law',
      link: 'https://www.jw-law.co.za'
    },
    {
      name: 'Kay Schroder',
      practice: 'Werth Schroeder',
      link: 'https://www.werthschroeder.com'
    }
  ]

  const values = [
    {
      title: 'Professionalism',
      description: 'We maintain the highest standards in all our facilities and services, ensuring every client receives exceptional quality.',
      icon: '🎯'
    },
    {
      title: 'Accessibility and Flexibility',
      description: 'Our facilities are accessible and flexible by design, offering a welcoming, neutral space to meet clients or conduct proceedings when additional room or privacy is needed.',
      icon: '🌟'
    },
    {
      title: 'Affordability',
      description: 'We believe professional spaces should be affordable without compromising on quality or service.',
      icon: '💡'
    },
    {
      title: 'Simplicity',
      description: 'Our booking process and facility management are streamlined for convenience and efficiency.',
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
              Northcliff MCT was born from the shared vision of three experienced attorneys who recognized the need for high-quality, affordable professional spaces.
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
                Northcliff MCT was born from the shared vision of three experienced attorneys who recognized the need for high-quality, affordable professional spaces.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                After years of practicing law and witnessing colleagues struggle to find suitable venues for alternative dispute resolution, consultation, and training they decided to create the solution themselves.
              </p>
              <p className="text-lg text-gray-600">
                The mission is simple: provide professional spaces that are affordable and centrally located for legal and business professionals throughout Johannesburg.
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

      {/* Our Team Section */}
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three experienced attorneys with a shared commitment to excellence and accessibility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} delay={index * 0.2} className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {member.name}
                </h3>
                <a 
                  href={member.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-teal hover:text-primary-green font-medium text-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  {member.practice}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
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
