import { json, requireAdmin } from '../../_lib/auth.js';

export async function onRequestGet(context) {
  const denied = await requireAdmin(context); if (denied) return denied;
  const result = await context.env.DB.prepare('SELECT id, service_name AS service, price, deposit, customer_name AS clientName, customer_phone AS clientPhone, booking_date AS date, booking_time AS time, status, created_at AS createdAt FROM bookings WHERE status != ? ORDER BY booking_date, booking_time').bind('Cancelado').all();
  return json({ bookings: result.results || [] });
}
