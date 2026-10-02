const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

export async function createSession(secret) {
  const expires = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const payload = String(expires);
  return `${payload}.${await sign(payload, secret)}`;
}

export async function isAdmin(request, secret) {
  if (!secret) return false;
  const cookie = request.headers.get('Cookie') || '';
  const token = cookie.split(';').map(x => x.trim()).find(x => x.startsWith('yagel_admin='))?.slice('yagel_admin='.length);
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return signature === await sign(expires, secret);
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function requireAdmin(context) {
  if (!(await isAdmin(context.request, context.env.SESSION_SECRET))) return json({ error: 'No autorizado' }, 401);
  return null;
}
