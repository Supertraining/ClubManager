# AGENTS.md — Club Manager

Contrato operativo del repo. Leer antes de tocar código. Si algo de acá contradice al código, **el código gana**: actualizá este archivo en el mismo PR.

## Qué es

Monolito de tres partes de autogestión para clubes, con registro de socios, actividades y reservas. Cada club tiene una URL, una ficha y un padrón propios. El **Club Ranelagh** (Ranelagh, Gran Buenos Aires) conserva sus enlaces originales como primer club.

Datos reales del club (no inventar nada nuevo): Av. Dr. A. Sabin 1751, B1886 GBA. WhatsApp +54 9 11 3838-6877. Instagram `@ranelagh.club`. Facebook perfil 100064211970969.

## Mapa del repo

| Ruta | Qué es | Stack |
|---|---|---|
| `client/` | App del socio (reservas, actividades, cuenta) | React **19**, Vite 4, zustand 5, React Router 6, Supabase auth |
| `admin/` | Panel de administración del club | React **18**, Vite 4, zustand 5, React Router 6, Supabase auth |
| `server/` | API REST + integración Supabase (service role) | Node, Express 4, express-validator, winston, nodemailer |
| `migracion/` | Migración MongoDB → Supabase (SQL + ETL) | SQL (PL/pgSQL), Node |
| `docs/` | Specs de diseño y decisiones | Markdown |
| `_trash_2026-08-08_*/` | Basura archivada (Mongo, supabase untracked) | **No tocar, no referenciar** |

Ojo: `client` está en React 19 y `admin` en React 18. No unificar sin acordarlo explícitamente — no es un salto menor, cambia hooks, refs y el compilador de React.

## Comandos

```bash
# server (puerto 8080)
cd server && npm run dev          # NODE_ENV=dev + node --watch
cd server && npm start            # sin watch
cd server && npm test             # Mocha con Express y un fixture HTTP local

# client (puerto 5173)
cd client && npm run dev
cd client && npm run lint
cd client && npm run build        # vite build --mode production

# admin (puerto 5174)
cd admin && npm run dev
cd admin && npm run lint
```

`npm run dev` del server usa sintaxis `set VAR=val &&` de **Windows cmd**. En bash/Linux hay que setear las vars a mano.

## Configuración

- `client/.env` y `admin/.env` — solo variables `VITE_*` (Vite no expone el resto). `VITE_BACKEND_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `server/src/config/.env.dev` (dev) o `.env` (prod) — se cargan con `process.loadEnvFile()` según `NODE_ENV` si el archivo existe. El servidor también acepta las variables de su proceso. Ejemplos en `server/src/config/.env.example`.
- **Nunca commitear `.env` / `.env.dev` / `.env.production`.** La `anon key` sí es pública por diseño (viaja al browser); la `service role key` es el secreto crítico y solo vive en el server.

## Autenticación

Supabase Auth es la fuente de verdad de la sesión. El Express server **no** emite JWTs propios.

1. El browser hace `signInWithPassword` contra Supabase directo.
2. `useAxiosInstance` engancha el `access_token` en `Authorization: Bearer <token>` de cada request.
3. El server valida el token con la `service role key` y opera sobre Postgres vía `@supabase/supabase-js`.
4. En 401, el interceptor refresca la sesión y reintenta **una** vez; si falla, signOut + redirect a `/login`.

`profiles` se crea por trigger sobre `auth.users` (ver `server/supabase/04_triggers.sql`). Cada solicitud privada valida una membresía activa de `club_memberships` para el club de la URL. La membresía determina el rol `socio` o `admin`. El alta desde el portal concede el rol de socio. El administrador inicial se asigna mediante una operación privilegiada del club.

## Data model

El esquema base vive en `server/supabase/01_schema.sql`. Las migraciones incrementales de `server/supabase/migrations/` agregan `clubs`, `club_memberships`, `court_schedules` y el alcance por `club_id` al catálogo, las reservas y los eventos.

Lo importante:

- **`reservations` tiene un `EXCLUDE USING gist` sobre `court_id` + `tstzrange(start_time, end_time)`**. El double-booking es estructuralmente imposible a nivel Postgres. No reimplementar esa chequea en JS: es la garantía central del sistema.
- `courts.name` es un identificador de URL único dentro de cada club. El deporte se guarda en `courts.sport`. Las canchas pueden repetir deporte y tener sus propios horarios.
- `events` y `activity_categories` guardan campos legacy en `jsonb` a propósito, para no forzar migraciones.
- RLS vive en `02_rls.sql`; funciones RPC en `03_rpc.sql`. **Cambiar tablas sin revisar RLS es el error más caro posible acá.**

## API

`server/src/dependencies/index.js` resuelve el club en `/clubs/:clubSlug` y monta los routers del club. Los aliases raíz se vinculan únicamente a Ranelagh. Las apps usan `/clubes/:clubSlug` y sus bases de URL correspondientes.

| Mount | Endpoints |
|---|---|
| `/users` | `POST /register`, `POST /login`, `GET /getAll`, `GET /user/:id`, `DELETE /eliminar/:id`, `PUT /update`, `PUT /update/:id`, `PUT /reserves/delete`, `PUT /reserves/:username` |
| `/courts` | `GET /`, `GET /:name`, `POST /createCourt`, `DELETE /delete/:id`, `PUT /reserve`, `PUT /reserve/delete`, `PUT /reserve/deleteByUsername`, `PUT /reserve/clean`, `PUT /reserve/userUpdate` |
| `/activities` | ver `routes/activities.js` |
| `/events` | ver `routes/events.js` |
| `/health` | `{ ok: true, ts }` |

Convenciones del server:

- Orden fijo: `validate.<tipo>` → `IsAuthenticated.checkJwt` → controller. El `router.use(IsAuthenticated.checkJwt)` se aplica a todo lo que sigue en el archivo, así que un endpoint público tiene que declararse **antes** de esa línea.
- En rutas administrativas, usar `IsAdmin.requireAdmin` después de validar la sesión y antes del controller. Esto también aplica cuando el DAO usa la credencial de servicio.
- Las rutas no cuelgan de `/api`; son `/users`, `/courts`, etc. directo.
- Los middlewares viven en `src/middlewares/`, no en `src/routes/middlewares/` (el router dinámico los excluye por nombre).

## Sistema de diseño

**`client/src/styles/tokens.css` es la fuente de verdad de la paleta.** `DESIGN.md` y el spec de `docs/` son registros de decisión; si se contradicen con `tokens.css`, gana `tokens.css`.

Paleta vigente (enfoque "Ranelagh Vivo", spec aprobado 2026-08-08):

| Token | Hex | Rol |
|---|---|---|
| `--c-bg` | `#FAF5EC` | crema cálido, fondo principal |
| `--c-brand` | `#0F4F3F` | verde club |
| `--c-accent` | `#C26A4A` | terracota, acento |
| `--c-mustard` | `#C9A24A` | **solo** badges (permanente, staff) |
| `--c-ink` | `#1A1F1B` | texto |
| `--c-line` | `#E4D8BF` | bordes |

Prefijo de tokens: `--c-*` (no `--color-*`). Tipografías: **Outfit** display, **Inter** body/UI, cuerpo mínimo 16px, inputs 16px (evita zoom en iOS).

Prohibiciones vinculantes: sin glassmorphism decorativo, sin gradientes sobre texto, sin `border-left` de color (excepción: toasts), sin sombras azules, sin texto gris puro `#888`, sin inventar fotos (solo las reales de `src/assets/`), sin `prefers-reduced-motion` ignorado.

## Convenciones

**Cliente (client y admin)**

- CSS co-localizado: `Foo.jsx` + `Foo.css` en la misma carpeta. Nada de `.css` central salvo `styles/`.
- `components/` agrupa por feature (`components/booking/`, `components/activities/`), `pages/` por ruta.
- Un componente parametrizable antes que N casi idénticos — así se colapsaron 4 páginas de cancha en `CourtPage`.
- Estado remoto en `hooks/use*API.jsx` (axios). Estado global en `stores/` (zustand). Sesión de Supabase en `lib/supabaseClient.js` — es un singleton, no lo re-instanciar.
- Forms con `react-hook-form`; feedback con `react-toastify` (`ToastContainer` ya está en `App.jsx`).
- Mobile-first siempre. Touch target ≥ 44×44px. Todo icono interactivo lleva `aria-label`.

**Server**

- `controllers/` → `services/` → `DAO/`. El DAO habla Supabase; el service tiene la lógica; el controller solo valida y responde.
- Errores con `utils/customError.Utils.js`, log con `utils/logger.js` (winston). No `console.log` en código nuevo.
- `NODE_ENV=prod` exige `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_ANON_KEY` al iniciar.

**Contenido**

Todo el copy de cara al usuario es **español rioplatense en voseo** ("reservá", "sumate", "anotate"). Errores específicos con solución, nunca genéricos. No fabricar testimonios, estadísticas, precios ni datos de contacto.

**Commits** — conventional commits con scope de parte: `feat(client):`, `fix(admin):`, `feat(server):`, `chore:`. Los mensajes de body van en inglés, en imperativo y explicando el porqué.

## Gotchas conocidos

- **`npm run lint` es la puerta de calidad en `client` y `admin`, y hoy está verde** (0 errores, 0 warnings, con `--max-warnings 0`). Si lo rompés, arreglalo en el mismo PR.
- **No silencies `react-hooks/exhaustive-deps` con un disable.** Si un hook devuelve funciones nuevas en cada render, memoizalo (ver `admin/src/components/activities/hooks/useActivityAPI.jsx`) y recién ahí agregá la dependencia: con el hook sin memoizar, agregar la dep que falta causa un loop infinito de fetch.
- **SQL base duplicado**. Los scripts `01` a `05` de `migracion/01_database/` son copias de `server/supabase/`. Las migraciones incrementales se mantienen en `server/supabase/migrations/`.
- **`admin` no fue reestructurado** como `client`: conserva el árbol anidado viejo (`components/courts/pages/football/`, `components/activities/components/activityCard/`). Cualquier component nuevo en admin debería seguir el patrón de `client`, no el legado.
- **`admin/src/components/oldReservesDeleted/`** es código muerto. No reanimar sin saber por qué se borró.
- `client/.env.example` tiene una `anon key` real apuntando a un proyecto real. Es pública por diseño, pero conviene dejarla como placeholder como en `admin/.env.example`.
- `client/package.json` declara `@types/react` 18 con React 19. Los tipos no matchean; si aparecen errores de tipos, es por ahí.
- `client` usa `babel-plugin-react-compiler` con `target: '19'`. Un componente que no compila puede fallar solo en runtime: probar en dev, no asumir.
- **El stack de `client` es React 19, pero varias libs se declaraban para React 18.** Ya se resolvieron (`react-toastify` 11, `react-hook-form` 7.89, y se sacaron `react-bootstrap` / `react-intersection-observer` / `million` por no usarse). Si `npm install` tira `ERESOLVE`, el problema casi siempre es un peer de React 18 colgado. No lo esquives con `--legacy-peer-deps`: subí la dependencia o borrala si no se usa.
- **Un toast es una superficie de riesgo en `client`.** Con `react-toastify` 9 + React 19, un `ToastContainer` vacío se renderizaba bien y el crash solo aparecía al dibujar el primer toast, en páginas que parecían sanas. Si algo se rompe "solo en una pantalla", sospechá de qué se dispara después del montaje.
- **`router.use(checkJwt)` responde 401 a rutas inexistentes.** No lo uses para probar si un endpoint existe: el middleware corre antes de que Express resuelva. Para eso, inspeccioná el stack (`dependencies/<file>.js` devuelve el router ya montado).
- **Un `profiles` faltante falla en silencio.** Si el trigger `on_auth_user_created` no está aplicado en el proyecto real de Supabase, el signup crea la fila en `auth.users` y nada más. El login funciona, "Mi cuenta" se ve bien (el endpoint devuelve `200 []`), y recién al reservar explota con `500 Profile missing` (el RPC `create_reservation` lee el rol de `profiles`). Diagnóstico: `GET /users/user/:id` con tu propio token devuelve 404. Reparación idempotente en `server/supabase/repair_missing_profiles.sql`.
- **Los triggers de `auth.users` abortan el signup si fallan.** `handle_new_user` inserta en `profiles`, cuyas columnas tienen `CHECK` estrictos (`first_name`/`last_name` con longitud >= 1, `age` entre 12 y 99). Un `coalesce(..., '')` o un age fuera de rango hace fallar el AFTER INSERT trigger y el usuario ni se registra.
- `PRODUCT.md` y `DESIGN.md` tienen secciones desactualizadas (stack, paleta). El spec de `docs/superpowers/specs/2026-08-08-ranelagh-vivo-redesign.md` es el documento de diseño aprobado.
