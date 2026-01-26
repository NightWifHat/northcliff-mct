# Northcliff MCT Website

A responsive, professional website for Northcliff MCT (Mediation Consultation Training) built with React and TailwindCSS.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Styling**: Clean design with teal/green accents and modern typography
- **Multi-page Navigation**: Home, About, Services, Gallery, Booking, and Contact pages
- **Interactive Elements**: Modal lightbox gallery, form validation, animations
- **Real-time Booking System**: Supabase integration for live availability and bookings
- **Package Selection**: Dynamic pricing based on facility package selection
- **PayPal Integration**: Sandbox payment processing for booking confirmation
- **Framer Motion Animations**: Smooth fade-in and slide-up effects
- **React Router**: Client-side routing for seamless navigation

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Supabase Account** - [Sign up at supabase.com](https://supabase.com/)

## Installation

1. **Install Node.js** (if not already installed):
   - Visit [nodejs.org](https://nodejs.org/)
   - Download and install the LTS version
   - Verify installation: `node --version` and `npm --version`

2. **Set up Supabase**:
   - Create a new project in [Supabase](https://supabase.com/)
   - Copy the project URL and anon key from Settings > API
   - Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Supabase credentials

4. **Install project dependencies**:
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
│   ├── BookingCalendar.jsx # Interactive calendar with Supabase integration
│   ├── Card.jsx          # Reusable card component
│   ├── Footer.jsx        # Site footer with placeholder logo
│   ├── Hero.jsx          # Homepage hero section
│   ├── Modal.jsx         # Modal/lightbox component
│   ├── Navbar.jsx        # Navigation bar with placeholder logo
│   └── PayPalCheckout.jsx # PayPal payment integration
├── pages/
│   ├── About.jsx         # About us page
│   ├── Booking.jsx       # Real booking system with Supabase
│   ├── Contact.jsx       # Contact page with team details
│   ├── Gallery.jsx       # Image gallery with lightbox
│   ├── Home.jsx          # Homepage
│   └── Services.jsx      # Real service packages and pricing
├── App.jsx               # Main app component with routing
├── main.jsx             # Application entry point
├── supabaseClient.js    # Supabase configuration
└── index.css            # Global styles with Tailwind
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router Dom** - Client-side routing
- **Framer Motion** - Animation library
- **Supabase** - Backend as a Service (database and auth)
- **PayPal SDK** - Payment processing integration
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
- **Real service packages**: Full Day Entire Facility, Half Day Entire Facility, Big Room Only
- **Accurate pricing**: R4,000 full day entire facility, R2,000 half day entire facility, R2,000/R1,500 big room only
- Detailed feature lists and descriptions
- Professional package presentation

### Gallery Page
- Grid layout of facility images (placeholder images)
- Modal lightbox for image preview with navigation
- Facility features overview

### Booking Page
- **Real-time booking system with Supabase integration**
- **Interactive booking calendar with live availability**
  - Red: Booked
  - Yellow: Reserved  
  - Green: Available
- **Dynamic package selection** with conditional duration options
- **Automatic pricing calculation** based on package and duration
- **PayPal sandbox integration** for payment processing
- **Double-booking prevention** with real-time availability checks
- **Complete booking data storage** in Supabase database
- Form validation and error handling

### Contact Page
- Contact form with validation
- **Three professional contacts with placeholder logos**
  - Victor de Bruyn (Marketing Manager) - Lindsay Keller
  - Lize-Marié Joubert (Operations Manager) - JW Law  
  - Kay Schröder (Partner) - Werth Schröder
- **Complete address**: Impala Chambers, 177 Beyers Naudé Drive, Northcliff, Johannesburg, 2195
- **Embedded Google Maps integration** showing Northcliff, Johannesburg
- Contact information display in styled card layout

## Customization

### Colors
The website uses a professional color scheme defined in `tailwind.config.js`:
- **Primary Teal**: `#14b8a6`
- **Primary Green**: `#059669`
- **Light Gray**: `#f8fafc`

### Images
Most images are currently placeholders from `via.placeholder.com`. Replace these with actual facility photos:
- Hero background image
- Gallery images
- Service package images
- Founder photos

**✅ Founder company logos** are now real images stored in `/media/`:
- `kayschroder.png` - Kay Schroder's company logo
- `lizamarie.png` - Lize-Marié Joubert's company logo  
- `victordebruyn.jpg` - Victor de Bruyn's company logo

**Note**: Founder logos should be placed in the `/media` directory. The system includes fallback gracefully to text placeholders if logo files are missing.

### Content
Content has been updated with real information:
- **Actual service packages and pricing**
- **Real contact information and address**
- **Professional team details**
- **Accurate facility descriptions**

### Production Deployment
Before deploying to production:
1. **Replace PayPal sandbox client ID** with production client ID in PayPalCheckout component
2. **Replace placeholder facility images** with actual photos (founder logos already implemented)
3. **Update remaining facility images** with real photos
4. **Configure production Supabase** environment
5. **Set up SSL certificate** for secure payments

## Database Schema

The application uses Supabase with the following table structure:

```sql
-- bookings table
id (SERIAL PRIMARY KEY)
booking_date (DATE) - The date of the booking
status (VARCHAR) - 'available', 'reserved', or 'booked'
package_type (TEXT) - e.g., "Full Day – Entire Facility"
price (NUMERIC) - The total price for the booking
name (VARCHAR) - Client name
email (VARCHAR) - Client email
phone (VARCHAR) - Client phone number
notes (TEXT) - Additional booking notes
time (VARCHAR) - Preferred time slot
duration (VARCHAR) - 'full-day' or 'half-day'
payment_id (VARCHAR) - PayPal payment ID
created_at (TIMESTAMP) - Record creation time
updated_at (TIMESTAMP) - Last update time
```

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

The website can be deployed to any static hosting service:

1. Set up production Supabase project
2. Configure production environment variables
3. Build the project: `npm run build`
4. Deploy the `dist` folder to your hosting service
5. Configure your hosting for single-page application routing
6. Update PayPal configuration for production payments

## Support

For questions about this website implementation, refer to:
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## License

This project is created for Northcliff MCT. All rights reserved.
"Trigger redeploy on $(date)" 
