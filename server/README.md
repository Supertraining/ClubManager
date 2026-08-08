# Backend refactor — Supabase edition

Esta carpeta contiene todos los archivos del server Express que cambian al migrar a Supabase.

## Archivos modificados / nuevos

| Archivo | Cambio | Acción |
|---|---|---|
| `package.json` | Saca `mongoose`, `jose`, `bcrypt`. Agrega `@supabase/supabase-js` | Reemplazar |
| `src/config/supabaseClient.js` | **Nuevo**. Cliente admin (service_role) + `verifyAccessToken()` | Copiar |
| `src/middlewares/isAuthenticated.js` | Ahora delega a `verifyAccessToken()`. Incluye `requireAdmin` | Reemplazar |
| `src/app.js` | Sin cambios estructurales, mantiene helmet/CORS/rate limit | Reemplazar |
| `src/modules/users/DAO/users.js` | Reescrito para Supabase. `register()` usa `auth.admin.createUser` | Reemplazar |
| `src/modules/users/services/users.js` | Más simple: sin bcrypt ni JWT. `login()` queda como no-op (login via Supabase Auth) | Reemplazar |
| `src/modules/courts/DAO/courts.js` | Reescrito. `unavailableDates.lunes/...` → tabla `reservations` con EXCLUDE | Reemplazar |
| `src/modules/courts/services/courts.js` | Wrapper delgado, traduce errores 23P01 a 400 | Reemplazar |
| `src/modules/activities/DAO/activities.js` | Reescrito. `category: [Object]` → tabla `activity_categories` | Reemplazar |
| `src/modules/activities/services/activities.js` | Wrapper delgado | Reemplazar |
| `src/modules/clubEvents/DAO/events.js` | Reescrito con `toRow()` para mapear el shape legacy al nuevo | Reemplazar |
| `src/modules/clubEvents/services/events.js` | Wrapper delgado | Reemplazar |

## Archivos que podés borrar (cuando todo funcione)

| Archivo | Por qué |
|---|---|
| `src/db/mongoConnection.js` | Reemplazado por Supabase |
| `src/db/models/user.js` | Reemplazado por tabla `profiles` |
| `src/db/models/court.js` | Reemplazado por tabla `courts` |
| `src/db/models/activity.js` | Reemplazado por tabla `activities` |
| `src/db/models/events.js` | Reemplazado por tabla `events` |
| `src/utils/tokenHandler.Utils.js` | Reemplazado por Supabase Auth |
| `src/config/config.js` | La mitad de las variables (MONGO_URL, JWT_SEED) ya no se usan |
| `src/dependencies/index.js` | El factory de DAOs ya no necesita Mongoose |
| `src/core/dao/mongoDb.dao.js` | Base DAO vieja, sin uso |

## Cambios en `server/.env`

Agregá:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Settings → API
SUPABASE_ANON_KEY=eyJ...          # Settings → API
```

Y podés sacar (cuando todo valide OK):
```
MONGO_URL=
MONGO_PASS=
JWT_SECRET=        # ya no se usa, lo maneja Supabase
GMAILPASS=         # opcional, las notificaciones se pueden mover a Edge Function
```

## Lo que NO cambia

- Las rutas (`/users/login`, `/courts/reserve`, etc.) — el frontend sigue pegando a los mismos endpoints
- Los controllers — la API que consumen los controllers es la misma
- La estructura del proyecto — solo cambia la implementación interna de los DAOs y services

## Verificación

```bash
# Instalar las nuevas deps
npm install @supabase/supabase-js

# Correr el server
node index.js
```

El server tiene que arrancar sin errores de import. Los requests van a fallar hasta que tengas Supabase configurado con las variables correctas en `.env`.

## Si algo no funciona

1. **Server arranca pero requests fallan con error 500**
   - Revisá que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` estén en `.env`
   - Mirá `src/log/error.log` para ver el error real
2. **"permission denied for table profiles"**
   - Las políticas RLS están bloqueando. El admin client bypass RLS, pero algún `auth.uid()` no se está seteando
   - Verificá que `verifyAccessToken` se llama con el token correcto
3. **"duplicate key value violates unique constraint"**
   - La EXCLUDE constraint está haciendo su trabajo — el slot ya está reservado
   - Eso es lo que queremos, devolve 400 al cliente
