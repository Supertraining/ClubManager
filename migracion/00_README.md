# Migración MongoDB → Supabase

Esta carpeta contiene **todo el código y la documentación necesaria** para migrar el Club Manager de MongoDB a Supabase (Postgres + Auth + Realtime + RLS).

## Estructura

```
migracion/
├── 00_README.md                 ← este archivo
├── 00_CHECKLIST.md              ← pasos numerados para aplicar la migración
├── 01_database/                  ← SQL del schema, RLS, RPCs, triggers, seed
│   ├── 01_schema.sql
│   ├── 02_rls.sql
│   ├── 03_rpc.sql
│   ├── 04_triggers.sql
│   ├── 05_seed.sql
│   └── README.md
├── 02_etl/                      ← script para migrar los datos de MongoDB a Postgres
│   ├── package.json
│   ├── README.md
│   └── scripts/
│       ├── 01_extract_mongo.js
│       ├── 02_transform.js
│       └── 03_load_postgres.js
├── 03_backend/                   ← cambios en el server (Express)
│   ├── README.md
│   ├── changes_summary.md
│   ├── package.json
│   └── src/
│       ├── config/supabaseClient.js
│       ├── middlewares/isAuthenticated.js
│       ├── app.js
│       └── modules/
│           ├── users/ (services + DAO refactor)
│           ├── courts/ (services + DAO refactor)
│           ├── activities/ (services + DAO refactor)
│           └── clubEvents/ (services + DAO refactor)
├── 04_frontend_client/           ← cambios en client/
│   ├── README.md
│   ├── changes_summary.md
│   └── src/
│       ├── lib/supabaseClient.js
│       ├── hooks/
│       │   ├── useUserAPI.js
│       │   ├── useCourtAPI.js
│       │   └── useReservesAPI.js
│       └── stores/user/User.Store.js
└── 05_frontend_admin/            ← cambios en admin/
    └── (espejo de 04 con adjustes de admin)
```

## Orden de aplicación

Seguí el checklist en `00_CHECKLIST.md`. Resumen:

1. **Crear proyecto Supabase** y correr los 5 SQL de `01_database/`
2. **Ejecutar el ETL** (`02_etl/`) para migrar los datos de MongoDB
3. **Actualizar el backend** copiando los archivos de `03_backend/` al server
4. **Actualizar el cliente público** copiando los archivos de `04_frontend_client/`
5. **Actualizar el panel admin** copiando los archivos de `05_frontend_admin/`
6. **Validar** que todo funcione con `npm run build` en cada app

## Reglas de oro

- **No borres Mongo todavía.** Mantenelo corriendo hasta validar que Supabase funciona 100%.
- **Probá primero con un proyecto Supabase de staging** (free tier) antes de tocar producción.
- **El `.env` real con credenciales** tiene que estar rotado y migrado a variables de Supabase antes del deploy.
- **Las rutas del backend Express no cambian**, solo la implementación interna. El frontend sigue pegándole a los mismos endpoints.

## Diferencias con el código actual

| Antes | Después |
|---|---|
| `mongoose.Schema` validation | SQL `CHECK` constraints + `citext` |
| `users.reserves[]` embebido | tabla `reservations` con FK |
| `courts.unavailableDates.lunes/martes/...` | eliminado, todo en `reservations.weekday` |
| `activities.category[]` | tabla `activity_categories` con FK |
| `mongoose.model.find()` | `supabase.from('table').select()` |
| `mongoose.model.findByIdAndUpdate()` | `supabase.from('table').update().eq('id', x)` |
| `mongoose.Types.ObjectId.isValid()` | `isUuid()` o confiar en RLS |
| Sanitización manual `String(value)` | `EXCLUDE` constraint previene double-booking |
| Custom JWT auth | `auth.users` de Supabase + `auth.uid()` |
| `bcrypt` + `jose` | manejado por Supabase Auth |
| Middleware `requireAdmin` | `is_admin(uid)` SECURITY DEFINER + RLS |
| Cron job en Node | `pg_cron` + RPC `delete_old_reservations()` |

## Si te trabás

Cada sub-carpeta tiene su propio `README.md` con instrucciones específicas.
Empezá por `00_CHECKLIST.md` que es el flujo de aplicación completo.
