# Resumen de cambios — MongoDB → Supabase

Documento de alto nivel de todo lo que cambia en el proyecto. Para los detalles
de cada archivo, mirá los README de cada sub-carpeta.

## Visión general

```
ANTES (MongoDB)                    DESPUÉS (Supabase)
─────────────────────              ──────────────────────
mongoose.Schema                    SQL CHECK constraints + citext
users.reserves[] embebido         tabla reservations con FK
courts.unavailableDates.{day}      tabla reservations con weekday
activities.category[] embebido     tabla activity_categories con FK
events.calendarData[] embebido     events.calendar_data jsonb
admin: Boolean                     profiles.role user_role
mongoose.Types.ObjectId            UUIDs nativos
bcrypt + jose                      Supabase Auth
requireAdmin middleware            is_admin(uid) + RLS
mongoose.find()                    supabase.from('table').select()
mongoose.findByIdAndUpdate()       supabase.from('table').update().eq()
$push con arrayFilters             INSERT + UPDATE + ON CONFLICT
EXCLUDE no existe                  EXCLUDE evita double-booking
cron en Node                       pg_cron + RPC

~300 líneas de Mongoose/DAO         ~150 líneas de Supabase/DAOs
+ 150 líneas de auth custom        + 0 (Supabase Auth lo maneja)
```

## Archivos por sub-carpeta

| Carpeta | Qué hay | Líneas de código aproximadas |
|---|---|---|
| `01_database/` | 5 archivos SQL + README | ~700 líneas SQL |
| `02_etl/` | 3 scripts + package + README | ~400 líneas JS |
| `03_backend/` | supabaseClient + 4 DAOs + 4 services + middlewares + app + package | ~700 líneas JS |
| `04_frontend_client/` | supabaseClient + userStore + 3 hooks + README | ~350 líneas JS |
| `05_frontend_admin/` | supabaseClient + userStore + 1 hook + README | ~250 líneas JS |

Total migrado: ~2400 líneas en archivos nuevos.
Archivos a borrar del server: ~500 líneas (mongoose, models, customError que ya no se usa, tokenHandler).
Total neto: **+2000 líneas** pero con una DB mejor y menos código custom que mantener.

## Compatibilidad de API

Lo que el frontend pide al backend sigue igual:

| Endpoint | Antes | Después |
|---|---|---|
| `POST /users/register` | Crea user en Mongo + JWT | Crea user en Supabase Auth + profile por trigger |
| `POST /users/login` | Devuelve JWT custom | Sigue devolviendo token (proxy al Supabase) |
| `GET /users/getAll` | Lee Mongo | Lee Supabase con RLS |
| `GET /courts` | Lee Mongo | Lee Supabase con RLS |
| `PUT /courts/reserve` | $push a unavailableDates.lunes | RPC `create_reservation` con EXCLUDE |
| `GET /courts/:name` | unavailableDates shape | reservations planas (con weekday) |
| `GET /activities/getAll` | Lee Mongo | Lee Supabase con RLS |
| `PUT /users/reserves/:username` | $push a user.reserves | INSERT a reservations |

Los controllers Express no cambian. Solo cambia lo que está adentro de los DAOs y services.

## Comportamiento que mejora (sin que cambies el frontend)

1. **Doble reserva imposible a nivel DB** — la EXCLUDE constraint rechaza el INSERT antes de que pase. Antes dependía de que las dos escrituras (users + courts) quedaran en sync.
2. **Auth sin bugs** — Supabase Auth maneja JWT, refresh, password reset, MFA si querés.
3. **Realtime disponible** — el board del admin se puede actualizar con `supabase.channel().on('postgres_changes', ...)` cuando alguien reserva, sin polling.
4. **Dashboard visual built-in** — Supabase Studio te deja ver/editar los datos sin escribir SQL.
5. **RLS = seguridad por defecto** — si abrís un endpoint nuevo y olvidás chequear ownership, la DB rechaza igual.

## Riesgos de la migración

1. **Datos duplicados en `users.reserves` y `courts.unavailableDates`** — el script ETL deduplica por (court, start_time) pero pueden quedar inconsistencias. Validá con queries después.
2. **Passwords no se migran** — los hashes de bcrypt de MongoDB no se pueden pasar a Supabase Auth. Los usuarios van a tener que resetear su password con "olvidé mi contraseña".
3. **El frontend NO cambia en la superficie** — los componentes siguen leyendo de `userStore` igual. Si hay un bug oculto en la API expuesta, va a aparecer en producción.
4. **`unidecode` en el código de Mongo** — el ETL lo usa para normalizar weekdays, pero si tu data original tiene tildes, revisar.

## Plan de aplicación recomendado

1. **Crear proyecto Supabase gratis** (10 min)
2. **Correr los 5 SQL** (5 min)
3. **Hacer backup de Mongo** (5 min)
4. **Correr el ETL** (15-30 min según tamaño de la DB)
5. **Validar conteos en Supabase Studio** (5 min)
6. **Crear proyecto Supabase de staging primero**, validar todo, después promover a producción
7. **Solo cuando todo funcione**: aplicar los cambios del backend y frontend
8. **Mantener Mongo corriendo 1-2 semanas** como fallback

## Lo que NO está en esta migración

- **Migrar imágenes**: las fotos de canchas/actividades siguen en `client/src/assets/` y `admin/src/assets/`. Considerar Supabase Storage después.
- **Email notifications**: el `emailNewUserNotification` con nodemailer sigue en el backend. Considerar Edge Function después.
- **Tests automatizados**: no hay tests nuevos. Recomendable agregar `chai-http` tests sobre las rutas.
- **CI/CD**: no tocado. Las variables de Supabase tienen que estar en el env del hosting (Netlify env vars, etc).

## Si te trabás

| Problema | Solución |
|---|---|
| "permission denied" en queries | Las políticas RLS están bloqueando. Mirá `migracion/01_database/02_rls.sql`. El admin client (service_role) bypass RLS. |
| EXCLUDE violation en ETL | Hay reservas duplicadas en el dump. Editá `transformed.json` y remové las duplicadas. |
| Login queda cargando | El `initAuth` no se está llamando. Asegurate de llamarlo en `App.jsx` o `main.jsx`. |
| Server arranca pero requests fallan | Las variables de Supabase no están en `.env`. Mirá `migracion/03_backend/README.md`. |
| Imágenes rotas en la app | Las imágenes siguen en `assets/`, no las toques. No movimos nada a Supabase Storage. |
