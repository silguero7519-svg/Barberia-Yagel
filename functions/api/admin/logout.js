export async function onRequestPost() {
  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json', 'set-cookie': 'yagel_admin=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0' } });
}
