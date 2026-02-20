-- Supabase SQL setup for Northcliff MCT booking system
-- Run this in your Supabase SQL editor to create the bookings table

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'reserved', 'booked')),
  package_type TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  notes TEXT,
  time VARCHAR(10),
  duration VARCHAR(20),
  payment_id VARCHAR(255),        -- PayFast payment ID (set after ITN confirmation)
  payment_status VARCHAR(20),     -- 'pending', 'completed', 'cancelled' (set after ITN confirmation),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster date queries
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to booking dates and status
CREATE POLICY "Allow read access to booking availability" ON bookings
  FOR SELECT USING (true);

-- Create policy to allow insert for new bookings
CREATE POLICY "Allow insert for new bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Insert some sample data for testing (optional)
INSERT INTO bookings (booking_date, status, package_type, price, name, email, phone, notes)
VALUES 
  ('2025-09-10', 'booked', 'Full Day – Entire Facility', 4000.00, 'John Doe', 'john@example.com', '+27123456789', 'Sample booking'),
  ('2025-09-15', 'reserved', 'Half Day – Entire Facility', 2000.00, 'Jane Smith', 'jane@example.com', '+27987654321', 'Sample reservation'),
  ('2025-09-20', 'booked', 'Big Room Only', 1500.00, 'Bob Johnson', 'bob@example.com', '+27555666777', 'Half day booking');
