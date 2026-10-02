# YAGEL BARBER — publicación con reservas compartidas

La web usa Cloudflare Pages Functions y D1. No publiques solo `index.html`: las funciones API y la base D1 son necesarias para guardar turnos compartidos y proteger el panel.

## Configuración inicial

1. Sube `index.html`, `functions/`, `migrations/` y `wrangler.toml` a un repositorio de GitHub.
2. En Cloudflare, crea un proyecto **Workers & Pages → Pages → Connect to Git** y conecta ese repositorio. Usa `.` como directorio de salida y sin comando de build. La integración Git es necesaria para desplegar las Pages Functions.
3. Desde el directorio del proyecto, crea la base y deja que Wrangler actualice su `database_id` en `wrangler.toml`:

   ```sh
   npx wrangler d1 create yagel-barber --update-config
   ```

4. Aplica las migraciones pendientes en orden:

   ```sh
   npx wrangler d1 migrations apply yagel-barber --remote
   ```

5. En la configuración del proyecto Pages, agrega el binding D1 `DB` y asígnalo a la base `yagel-barber`.
6. En **Settings → Variables and Secrets**, crea estos secretos para producción:
   - `ADMIN_PASSWORD`: una contraseña nueva, larga y exclusiva para el barbero.
   - `SESSION_SECRET`: una cadena aleatoria larga (32 caracteres o más).
   - `BARBER_WHATSAPP`: número internacional solo con dígitos (por ejemplo, `54911...`).
7. Vuelve a desplegar el proyecto. El panel del barbero se abre en `https://TU-SITIO.pages.dev/?admin=1`.

## Comportamiento

- La reserva queda `Pendiente` en D1 y bloquea ese día y horario para todos los visitantes.
- Una solicitud pendiente libera el horario automáticamente al pasar 30 minutos; confirmar en el panel conserva el turno.
- El cliente continúa a WhatsApp con su código, servicio e importe de seña; envía el comprobante en el chat.
- El barbero verifica el comprobante y marca el turno como confirmado desde el panel.
- Los importes se calculan en el servidor a partir del servicio en D1; no se confía en el precio enviado por el navegador.

## Antes de abrir reservas al público

- Cargar el cuarto servicio real y revisar nombres, precios y duraciones desde el panel.
- Confirmar que el número de WhatsApp configurado en `index.html` corresponde al barbero.
- Probar reserva, bloqueo de horario, cancelación y confirmación desde dos navegadores distintos.
- Configurar en Cloudflare los secretos propios; no subir contraseñas ni claves privadas al repositorio.

La web anterior basada solo en `localStorage` no sincronizaba reservas. Esta estructura requiere completar la configuración de Cloudflare y D1 antes de que el sitio pueda aceptar turnos compartidos.
