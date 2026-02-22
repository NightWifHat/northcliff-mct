-- ============================================
-- Northcliff MCT — Bookings table setup
-- Run this in Supabase SQL Editor (one shot)
-- ============================================

-- 1. Drop existing table (removes old policies too)
DROP TABLE IF EXISTS bookings CASCADE;

-- 2. Create the bookings table
CREATE TABLE bookings (
  id            bigint generated always as identity primary key,
  booking_date  date not null,
  status        varchar(20) not null default 'reserved'
                  check (status in ('available', 'reserved', 'booked')),
  package_type  varchar(100),
  price         numeric(10, 2),
  name          varchar(200),
  email         varchar(200),
  phone         varchar(50),
  notes         text default '',
  time          varchar(50),
  duration      varchar(50),
  payment_id    varchar(255),       -- PayFast payment ID (set after ITN confirmation)
  payment_status varchar(20),       -- 'pending', 'completed', 'cancelled' (set after ITN)
  created_at    timestamptz default now()
);

-- 3. Index for fast date lookups (calendar fetches all bookings)
CREATE INDEX idx_bookings_date ON bookings (booking_date);

-- 4. Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 5. Allow anyone to insert (booking form is public)
CREATE POLICY "Allow public inserts"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 6. Allow anyone to read (calendar needs to fetch statuses)
CREATE POLICY "Allow public selects"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- 7. Allow updates (for future ITN webhook: reserved → booked)
CREATE POLICY "Allow public updates"
  ON bookings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
