import { json, requireAdmin } from '../../../_lib/auth.js';

const allowedTimes = new Set(['08:00','09:00','10:00','11:00','12:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']);

export async function onRequestPatch(context) {
  const denied = await requireAdmin(context); if (denied) return denied;
  let body; try { body = await context.request.json(); } catch { return json({ error: 'Solicitud inválida' }, 400); }
  const status = String(body.status || '');
  let result;
  if (body.date || body.time) {
    const date = String(body.date || '');
    const time = String(body.time || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !allowedTimes.has(time)) return json({ error: 'Fecha u horario inválido' }, 400);
    try {
      result = await context.env.DB.prepare("UPDATE bookings SET booking_date = ?, booking_time = ? WHERE id = ? AND status != 'Cancelado'").bind(date, time, context.params.id).run();
    } catch (error) {
      if (String(error).includes('UNIQUE')) return json({ error: 'Ese horario ya está ocupado.' }, 409);
      throw error;
    }
  } else {
    if (!['Pendiente', 'Confirmado', 'Cancelado'].includes(status)) return json({ error: 'Estado inválido' }, 400);
    result = await context.env.DB.prepare('UPDATE bookings SET status = ? WHERE id = ?').bind(status, context.params.id).run();
  }
  if (!result.meta.changes) return json({ error: 'Reserva no encontrada' }, 404);
  return json({ ok: true });
}
