import { json } from '../_lib/auth.js';

export async function onRequestGet({ env }) {
  const result = await env.DB.prepare('SELECT id, name, price, duration, description, icon FROM services WHERE active = 1 ORDER BY id').all();
  return json({ services: result.results || [] });
}
