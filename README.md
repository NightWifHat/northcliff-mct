# Northcliff MCT Website

A responsive, professional website for Northcliff MCT (Mediation Consultation Training) built with React and TailwindCSS.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Styling**: Clean design with teal/green accents and modern typography
- **Multi-page Navigation**: Home, About, Services, Gallery, Booking, and Contact pages
- **Interactive Elements**: Modal lightbox gallery, form validation, animations
- **Framer Motion Animations**: Smooth fade-in and slide-up effects
- **React Router**: Client-side routing for seamless navigation

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager

## Installation

1. **Install Node.js** (if not already installed):
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Install project dependencies**:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Card.jsx          # Reusable card component
│   ├── Footer.jsx        # Site footer
│   ├── Hero.jsx          # Homepage hero section
│   ├── Modal.jsx         # Modal/lightbox component
│   └── Navbar.jsx        # Navigation bar
├── pages/
│   ├── About.jsx         # About us page
│   ├── Booking.jsx       # Booking form page
│   ├── Contact.jsx       # Contact page with form
│   ├── Gallery.jsx       # Image gallery with lightbox
│   ├── Home.jsx          # Homepage
│   └── Services.jsx      # Services and pricing
├── App.jsx               # Main app component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles with Tailwind
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **Framer Motion** - Animation library
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Features Overview

### Homepage
- Hero section with call-to-action buttons
- Introduction to Northcliff MCT
- Feature highlights

### About Page
- Founder profiles with placeholder images
- Company story and mission
- Core values section

### Services Page
- Three main services: Mediation Rooms, Training Facilities, Consultation Support
- Pricing tables for each service
- Feature lists and descriptions

### Gallery Page
- Grid layout of facility images (placeholder images)
- Modal lightbox for image preview
- Facility features overview

### Booking Page
- Comprehensive booking form with validation
- **Interactive booking calendar with color-coded availability**
  - Red: Booked
  - Yellow: Reserved  
  - Green: Available
- Service selection and time slots with pricing calculation
- **PayPal sandbox integration for payments**
- Contact information sidebar

### Contact Page
- Contact form with validation
- **Three professional contacts with placeholder logos**
  - Victor de Bruyn (Marketing Manager) - Lindsay Keller
  - Lize-Marié Joubert (Operations Manager) - JW Law  
  - Kippie Schroeder (Partner) - Werth Schroeder
- **Complete address**: 2nd Floor, Impala Center, 177 Beyers Naudé Drive, Northcliff
- **Embedded Google Maps integration** showing Northcliff, Johannesburg
- Contact information display in styled card layout

## Customization

### Colors
The website uses a professional color scheme defined in `tailwind.config.js`:
- **Primary Teal**: `#14b8a6`
- **Primary Green**: `#059669`
- **Light Gray**: `#f8fafc`

### Images
All images are currently placeholders from `via.placeholder.com`. Replace these with actual facility photos:
- Hero background image
- Gallery images
- Service images
- Founder photos

### Content
Update the content in each page component to reflect actual:
- Company information
- Pricing details
- Contact information
- Service descriptions

## Deployment

The website can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure your hosting for single-page application routing

## Support

For questions about this website implementation, refer to:
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## License

This project is created for Northcliff MCT. All rights reserved.
