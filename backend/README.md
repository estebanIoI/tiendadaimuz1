# Backend sencillo para DevContend

Instrucciones rápidas:

- Instalar dependencias:

```bash
cd backend
pnpm install
```

- Variables de entorno: ajusta `.env` en la carpeta `backend` (ya existe). Importante: `DB_*`, `JWT_SECRET`, y opcionalmente `SMTP_*`.

- Iniciar servidor:

```bash
pnpm start
```

Rutas principales:

- `GET /api/productos` — listar productos
- `POST /api/productos` — crear producto (requiere `Authorization: Bearer <token>`)
- `PUT /api/productos/:id` — actualizar producto (requiere token)
- `DELETE /api/productos/:id` — eliminar producto (requiere token)
- `POST /api/upload` — subir imágenes (campo `imagenes`, devuelve `urls`)
- `GET /api/pedidos` — listar pedidos (requiere token)
- `POST /api/pedidos` — crear pedido
- `POST /api/login` — autenticación admin (envía `{ usuario, password }`, devuelve `token`)
- `POST /api/enviar-correo` — enviar correo (si config SMTP) o simula envio
