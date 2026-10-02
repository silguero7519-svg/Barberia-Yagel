import { createSession, json } from '../../_lib/auth.js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida' }, 400); }
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: 'Falta configurar el acceso del administrador en Cloudflare.' }, 503);
  if (String(body.password || '') !== env.ADMIN_PASSWORD) return json({ error: 'Clave incorrecta' }, 401);
  const token = await createSession(env.SESSION_SECRET);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'set-cookie': `yagel_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=28800` } });
}
