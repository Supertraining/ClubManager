# ETL: MongoDB → Supabase

Script de migración one-off. Convierte los datos del MongoDB actual al shape de Postgres/Supabase.

## Antes de empezar

1. Haber corrido los 5 SQL de `migracion/01_database/` en el proyecto Supabase
2. Tener las credenciales de MongoDB (`MONGO_URL`) y Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
3. Hacer un **backup completo** de MongoDB antes de empezar

## Configuración

Crear `migracion/02_etl/.env`:

```bash
MONGO_URL=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/clubmanager
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ El `SUPABASE_SERVICE_ROLE_KEY` bypassa RLS. No lo expongas en el frontend. Solo se usa acá para hacer bulk inserts.

## Pasos

```bash
cd migracion/02_etl
npm install --legacy-peer-deps

# 1. Extraer de Mongo → dump.json
npm run extract

# 2. Transformar dump.json → transformed.json
npm run transform

# 3. Cargar transformed.json → Supabase
npm run load

# O los 3 de una:
npm run etl
```

## Qué hace cada paso

### 01_extract_mongo.js
Lee las 4 colecciones de MongoDB:
- `users` → dump.users
- `courts` → dump.courts
- `activities` → dump.activities (incluye categories embebidas)
- `events` → dump.events (incluye calendarData)

Vuelca todo a `dump.json` para inspección.

### 02_transform.js
Toma `dump.json` y lo transforma al shape de Postgres:

- `users.reserves[]` → expande a filas en `reservations` (vinculadas por username)
- `courts.unavailableDates.lunes/martes/...` → expande a filas en `reservations` (vinculadas por court name)
- **Deduplica**: si una reserva aparece en ambos lugares, se queda con una sola
- `activities.category[]` → se separa para inserts en `activity_categories`
- `events.calendarData[]` → se queda como JSONB en el campo `calendar_data`
- Normaliza emails a lowercase

Genera `transformed.json` con las tablas listas para insertar.

### 03_load_postgres.js
Toma `transformed.json` y hace bulk insert en Supabase en este orden:

1. `auth.users` (vía `auth.admin.createUser` por cada user)
2. `profiles` (vía el trigger automático, solo verifica)
3. `courts` (4 canchas)
4. `activities` + `activity_categories`
5. `reservations` (con FKs ya resueltas)
6. `events` (con calendar_data)

Reporta conteos para que valides.

## Validación post-ETL

Después de correr, en el SQL Editor de Supabase:

```sql
-- Conteos
select
  (select count(*) from profiles) as profiles,
  (select count(*) from courts) as courts,
  (select count(*) from activities) as activities,
  (select count(*) from activity_categories) as activity_categories,
  (select count(*) from reservations) as reservations,
  (select count(*) from events) as events;

-- Verificar que no haya reservas duplicadas (el EXCLUDE las rechaza, pero por las dudas)
select court_id, start_time, count(*)
from reservations
group by court_id, start_time
having count(*) > 1;
```

Los conteos tienen que ser consistentes con tu base Mongo. El segundo query tiene que devolver 0 filas.

## Si algo sale mal

- **Duplicate key error durante el insert**: probablemente hay un user con email duplicado o un reservation con timestamps que se pisan. Mirá `transformed.json` para encontrar el conflicto.
- **Permisos denegados en Supabase**: el `service_role_key` no es el correcto, o las tablas no existen.
- **Datos faltantes**: el script loggea qué está cargando. Revisá los `count` que imprime al final.

## Después de validar

1. Desactivá el cluster de MongoDB en Atlas (no lo borres, dejá el backup por 1 mes)
2. Apuntá el server Express a Supabase
3. Cuando todo esté en producción por 1-2 semanas sin issues, recién ahí borrá el cluster
