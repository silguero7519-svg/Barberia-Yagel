import { json } from '../_lib/auth.js';

export async function onRequestGet({ env }) {
  return json({ barberWhatsApp: env.BARBER_WHATSAPP || '' });
}
