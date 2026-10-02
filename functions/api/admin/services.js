import { json, requireAdmin } from '../../_lib/auth.js';

export async function onRequestGet(context) {
  const denied = await requireAdmin(context); if (denied) return denied;
  const result = await context.env.DB.prepare('SELECT id, name, price, duration, description, icon, active FROM services ORDER BY id').all();
  return json({ services: result.results || [] });
}

export async function onRequestPost(context) {
  const denied = await requireAdmin(context); if (denied) return denied;
  let body; try { body = await context.request.json(); } catch { return json({ error: 'Solicitud inválida' }, 400); }
  const name = String(body.name || '').trim().slice(0, 80);
  const description = String(body.description || '').trim().slice(0, 300);
  const price = Number(body.price), duration = Number(body.duration);
  const allowedIcons = new Set(['fa-scissors','fa-user-ninja','fa-wand-magic-sparkles','fa-razor','fa-sparkles']);
  const icon = allowedIcons.has(body.icon) ? body.icon : 'fa-scissors';
  if (name.length < 2 || !description || !Number.isInteger(price) || price < 1 || !Number.isInteger(duration) || duration < 15 || duration > 60) return json({ error: 'Revisa nombre, precio y duración (15 a 60 minutos).' }, 400);
  const result = await context.env.DB.prepare('INSERT INTO services (name, price, duration, description, icon) VALUES (?, ?, ?, ?, ?)').bind(name, price, duration, description, icon).run();
  return json({ id: result.meta.last_row_id }, 201);
}
