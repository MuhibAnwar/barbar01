-- TABLE: barbers
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  barber_code text UNIQUE NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- TABLE: services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_mins int NOT NULL,
  price numeric(8,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- TABLE: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES barbers(id),
  service_id uuid NOT NULL REFERENCES services(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  appointment_time timestamptz NOT NULL,
  comment text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- TABLE: availability_slots
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES barbers(id),
  slot_time timestamptz NOT NULL,
  is_booked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- RLS: bookings
CREATE POLICY customer_insert ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY barber_select_own ON bookings FOR SELECT USING (true);
CREATE POLICY barber_update_own ON bookings FOR UPDATE USING (true);

-- RLS: barbers (public read for customer booking)
CREATE POLICY public_read_barbers ON barbers FOR SELECT USING (true);

-- RLS: services (public read)
CREATE POLICY public_read_services ON services FOR SELECT USING (true);

-- RLS: availability_slots (public read, barber update)
CREATE POLICY public_read_slots ON availability_slots FOR SELECT USING (true);
CREATE POLICY barber_update_slots ON availability_slots FOR UPDATE USING (true);

-- SEED DATA
INSERT INTO barbers (name, specialty, barber_code) VALUES
  ('Ahmed Khan', 'Fades & Tapers', 'BARBER001'),
  ('Zain Ali', 'Classic Cuts & Beard Work', 'BARBER002')
ON CONFLICT (barber_code) DO NOTHING;

INSERT INTO services (name, duration_mins, price) VALUES
  ('Haircut', 30, 500),
  ('Shave', 20, 300),
  ('Beard Trim', 15, 200),
  ('Hair Color', 60, 1200)
ON CONFLICT DO NOTHING;
