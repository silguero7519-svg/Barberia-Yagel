PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  duration INTEGER NOT NULL CHECK (duration > 0),
  active INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO services (id, name, price, duration) VALUES
  (1, 'Corte Fade / Urbano', 18000, 30),
  (2, 'Corte + Barba VIP', 25000, 45),
  (3, 'Diseño Freestyle', 20000, 40);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id),
  service_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Confirmado', 'Cancelado')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_booking_per_slot
  ON bookings (booking_date, booking_time)
  WHERE status IN ('Pendiente', 'Confirmado');

CREATE INDEX IF NOT EXISTS bookings_by_date ON bookings (booking_date, booking_time);
