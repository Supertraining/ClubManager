# Checklist de migración MongoDB → Supabase

Marcá cada item cuando lo completes. Antes de marcar, validá que funcione.

## Fase 0 — Preparación

- [ ] Crear cuenta en [supabase.com](https://supabase.com) y un proyecto nuevo
- [ ] Anotar `SUPABASE_URL` y `SUPABASE_ANON_KEY` del proyecto (en Settings → API)
- [ ] Anotar `SUPABASE_SERVICE_ROLE_KEY` (Settings → API, con cuidado)
- [ ] Backup de la base MongoDB actual (`mongodump`)
- [ ] Crear branch de git para todo el trabajo de migración

## Fase 1 — Base de datos

- [ ] Abrir SQL Editor en el dashboard de Supabase
- [ ] Correr `01_database/01_schema.sql` (tablas, constraints)
- [ ] Correr `01_database/02_rls.sql` (políticas de seguridad)
- [ ] Correr `01_database/03_rpc.sql` (funciones RPC)
- [ ] Correr `01_database/04_triggers.sql` (triggers)
- [ ] Correr `01_database/05_seed.sql` (4 canchas iniciales)
- [ ] En Authentication → Providers, habilitar Email/Password
- [ ] Crear tu primer usuario admin (Sign up desde la app o el dashboard)
- [ ] En SQL Editor, correr:
  ```sql
  select public.promote_to_admin('tu-email@dominio.com');
  ```
- [ ] Verificar que `select * from public.courts;` devuelve las 4 canchas
- [ ] Verificar que `select * from public.profiles;` incluye al admin con `role = 'admin'`

## Fase 2 — ETL (migrar datos de MongoDB a Postgres)

- [ ] Editar `02_etl/scripts/01_extract_mongo.js` con tu `MONGO_URL`
- [ ] Editar `02_etl/scripts/03_load_postgres.js` con `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Correr `npm install` en `02_etl/`
- [ ] Correr `node scripts/01_extract_mongo.js` → genera `dump.json`
- [ ] Correr `node scripts/02_transform.js` → genera `transformed.json`
- [ ] Correr `node scripts/03_load_postgres.js` → inserta en Supabase
- [ ] Verificar manualmente con queries en SQL Editor:
  - [ ] `select count(*) from profiles;` ≈ cantidad de usuarios en Mongo
  - [ ] `select count(*) from reservations;` ≈ cantidad de reservas totales
  - [ ] `select count(*) from activities;` ≈ cantidad de actividades
  - [ ] `select count(*) from events;` ≈ cantidad de eventos

## Fase 3 — Backend

- [ ] Agregar a `server/.env`:
  ```
  SUPABASE_URL=https://xxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```
- [ ] Copiar `03_backend/src/config/supabaseClient.js` a `server/src/config/`
- [ ] Reemplazar `03_backend/src/middlewares/isAuthenticated.js` en `server/src/middlewares/`
- [ ] Reemplazar los DAOs:
  - [ ] `server/src/modules/users/DAO/users.js` (reemplazar con la versión de `03_backend/`)
  - [ ] `server/src/modules/courts/DAO/courts.js`
  - [ ] `server/src/modules/activities/DAO/activities.js` (si existe, sino crearlo)
  - [ ] `server/src/modules/clubEvents/DAO/events.js` (si existe, sino crearlo)
- [ ] Reemplazar los services:
  - [ ] `server/src/modules/users/services/users.js`
  - [ ] `server/src/modules/courts/services/courts.js`
  - [ ] `server/src/modules/activities/services/activities.js`
  - [ ] `server/src/modules/clubEvents/services/events.js`
- [ ] Reemplazar `server/src/app.js` con la versión simplificada
- [ ] Borrar (opcional, si ya no se usan):
  - [ ] `server/src/db/mongoConnection.js`
  - [ ] `server/src/db/models/*.js`
  - [ ] `server/src/utils/tokenHandler.Utils.js`
  - [ ] `server/src/utils/customError.Utils.js` (puede quedar)
- [ ] `npm install @supabase/supabase-js` en `server/`
- [ ] `npm uninstall mongoose jose bcrypt` (cuando todo funcione)
- [ ] `npm run build` no aplica (es Node), pero `node index.js` tiene que arrancar sin errores

## Fase 4 — Frontend client

- [ ] Agregar a `client/.env`:
  ```
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  VITE_BACKEND_URL=http://localhost:8080  # (o donde corra tu server)
  ```
- [ ] Copiar `04_frontend_client/src/lib/supabaseClient.js` a `client/src/lib/`
- [ ] Reemplazar `client/src/stores/user/User.Store.js` con la versión de `04_frontend_client/`
- [ ] Reemplazar los hooks:
  - [ ] `client/src/hooks/useUserAPI.js`
  - [ ] `client/src/hooks/useCourtAPI.js`
  - [ ] `client/src/hooks/useReservesAPI.js`
  - [ ] `client/src/hooks/useAxiosInstance.js` (puede quedar, ya no se usa)
- [ ] Actualizar `client/src/pages/auth/login/Login.jsx` y `Register.jsx` (si necesitan ajustes)
- [ ] `npm install @supabase/supabase-js` en `client/`
- [ ] `npm run build` y validar

## Fase 5 — Frontend admin

- [ ] Repetir lo mismo que Fase 4 pero con los archivos de `05_frontend_admin/`
- [ ] `npm run build` y validar

## Fase 6 — Validación end-to-end

- [ ] Login como socio: registrar nuevo usuario → ver perfil → ver canchas
- [ ] Login como admin: ver lista de usuarios, ver canchas, ver reservas
- [ ] Crear una reserva de prueba: la court queda ocupada en la grilla
- [ ] Intentar crear una reserva en el mismo horario: la DB rechaza (EXCLUDE constraint)
- [ ] Eliminar la reserva: la court queda libre
- [ ] Verificar realtime (opcional): el board se actualiza sin refresh cuando otro usuario reserva

## Fase 7 — Deploy

- [ ] Subir las variables de Supabase al hosting del server (Netlify env vars, etc.)
- [ ] Subir las variables de Supabase al hosting del client y admin
- [ ] Deploy del server → verificar `/health`
- [ ] Deploy del client y admin
- [ ] Smoke test en producción

## Fase 8 — Apagar MongoDB

- [ ] Una vez validado en producción por 1-2 semanas:
  - [ ] `npm uninstall mongoose` en `server/`
  - [ ] Borrar `server/src/db/`
  - [ ] Cancelar el cluster de MongoDB Atlas
  - [ ] Borrar las credenciales de MongoDB del `.env` y `.env.example`
  - [ ] Commit final celebratorio 🎉
