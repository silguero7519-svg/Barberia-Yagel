import { isAdmin, json } from '../../_lib/auth.js';
export async function onRequestGet(context) { return json({ authenticated: await isAdmin(context.request, context.env.SESSION_SECRET) }); }
