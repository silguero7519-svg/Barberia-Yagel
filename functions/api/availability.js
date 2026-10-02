import { json } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const date = new URL(request.url).searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'Fecha inválida' }, 400);
  await env.DB.prepare("UPDATE bookings SET status = 'Cancelado' WHERE status = 'Pendiente' AND created_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 minutes')").run();
  const result = await env.DB.prepare("SELECT booking_time FROM bookings WHERE booking_date = ? AND status IN ('Pendiente','Confirmado')").bind(date).all();
  return json({ occupied: (result.results || []).map(row => row.booking_time) });
}
