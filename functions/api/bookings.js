import { json } from '../_lib/auth.js';

const allowedTimes = new Set(['08:00','09:00','10:00','11:00','12:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']);
const todayBuenosAires = () => new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida' }, 400); }
  const name = String(body.clientName || '').trim().slice(0, 100);
  const phone = String(body.clientPhone || '').trim().slice(0, 40);
  const date = String(body.date || '');
  const time = String(body.time || '');
  const serviceId = Number(body.serviceId);
  if (name.length < 2 || phone.length < 6 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayBuenosAires() || !allowedTimes.has(time) || !Number.isInteger(serviceId)) {
    return json({ error: 'Completa tus datos y elige un horario válido.' }, 400);
  }
  const service = await env.DB.prepare('SELECT id, name, price, duration FROM services WHERE id = ? AND active = 1').bind(serviceId).first();
  if (!service) return json({ error: 'Ese servicio ya no está disponible.' }, 400);
  await env.DB.prepare("UPDATE bookings SET status = 'Cancelado' WHERE status = 'Pendiente' AND created_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 minutes')").run();
  const id = `YAG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  try {
    await env.DB.prepare('INSERT INTO bookings (id, service_id, service_name, price, deposit, customer_name, customer_phone, booking_date, booking_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, service.id, service.name, service.price, Math.ceil(service.price / 2), name, phone, date, time).run();
  } catch (error) {
    if (String(error).includes('UNIQUE')) return json({ error: 'Ese horario acaba de reservarse. Elige otro.' }, 409);
    throw error;
  }
  return json({ id, code: id, service: service.name, price: service.price, deposit: Math.ceil(service.price / 2), date, time, status: 'Pendiente' }, 201);
}
