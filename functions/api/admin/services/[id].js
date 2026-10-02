import { json, requireAdmin } from '../../../_lib/auth.js';

export async function onRequestPatch(context) {
  const denied = await requireAdmin(context); if (denied) return denied;
  let body; try { body = await context.request.json(); } catch { return json({ error: 'Solicitud inválida' }, 400); }
  const active = body.active === false ? 0 : 1;
  const result = await context.env.DB.prepare('UPDATE services SET active = ? WHERE id = ?').bind(active, Number(context.params.id)).run();
  if (!result.meta.changes) return json({ error: 'Servicio no encontrado' }, 404);
  return json({ ok: true });
}
