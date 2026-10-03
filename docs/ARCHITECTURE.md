# Arquitectura — Club Manager

Mapa de los módulos y de dónde viene cada cosa. Para las convenciones y comandos ver `AGENTS.md` en la raíz.

## Flujo de una request

```
Browser (client/ o admin/)
  │
  ├─ supabase.auth  ──────────────► Supabase Auth      (login, sesión, refresh)
  │                                        │
  │                                 access_token
  │                                        ▼
  ├─ hooks/use*API.jsx  ──►  useAxiosInstance  ──►  Authorization: Bearer <token>
  │                                        │
  │                                        ▼
  └─────────────────────────────►  server/  Express 4  :8080
                                         │
                        routes/<file>.js  (auto-montado en /<file>)
                                         │
                        validate.*  ──►  IsAuthenticated.checkJwt  ──►  controller
                                                                       │
                                                                  service/  (lógica)
                                                                       │
                                                                    DAO/  (Supabase)
                                                                       │
                                                          Supabase Postgres (RLS + RPC)
```

## server/ — Express

```
server/
├── index.js                     bootstrap
├── src/
│   ├── app.js                   clase Server (helmet, cors, json, /health, router, errorHandler)
│   ├── config/
│   │   ├── config.js            lee .env / .env.dev según NODE_ENV, expone port + credenciales
│   │   ├── supabaseClient.js    cliente Supabase con service role
│   │   └── .env.example
│   ├── routes/                  ← cada archivo se auto-monta en /<nombre>
│   │   ├── index.js             router dinámico
│   │   ├── users.js             /users
│   │   ├── courts.js            /courts
│   │   ├── activities.js        /activities
│   │   └── events.js            /events
│   ├── middlewares/
│   │   ├── dataValidator.js     schemas de express-validator
│   │   ├── isAuthenticated.js   valida el JWT de Supabase
│   │   ├── isAdmin.js           chequeo de rol
│   │   └── errorHandler.js
│   ├── modules/                 ← lógica por dominio, en capas
│   │   ├── users/          {controllers,DAO,services,helpers}
│   │   ├── courts/         {controllers,DAO,services}
│   │   ├── activities/     {controllers,DAO,services}
│   │   └── clubEvents/     {controllers,DAO,services}
│   ├── dependencies/            inyección de dependencias (index.js arma el grafo)
│   ├── core/dao/                supabase.dao.js — acceso base
│   ├── utils/                   customError.Utils.js, logger.js
│   └── log/                     error.log, warn.log
├── supabase/                    01→05 SQL, fuente canónica del schema
└── test/                        user.test.js, user.data.js (mocha + chai)
```

**Orden de las capas:** `DAO` (habla Supabase, sin reglas) → `service` (reglas de negocio) → `controller` (valida y responde). Los controllers se arman en `dependencies/` y se inyectan al router; los routers nunca instancian controllers solos.

## client/ — app del socio

Rutas en `client/src/App.jsx`:

| Ruta | Página | Auth |
|---|---|---|
| `/` | `pages/home/Home` | pública |
| `/reserves` | `pages/reserves/Reserves` | delega en `CourtPage` |
| `/activities` | `pages/activities/Activities` | pública |
| `/login` | `pages/login/Login` | pública |
| `/register` | `pages/register/Register` | pública |
| `/account` | `pages/account/Account` | privada |
| `*` | `pages/notFound/NotFound` | — |

```
client/src/
├── styles/                 tokens.css (paleta real) · base.css · components.css
├── lib/supabaseClient.js   singleton: cliente supabase + API_BASE
├── hooks/
│   ├── useAxiosInstance.jsx  Bearer token + refresh en 401
│   ├── useUserAPI.jsx · useCourtAPI.jsx · useReservesAPI.jsx
│   ├── useNotifications.jsx  react-toastify
│   └── useFetch.jsx
├── stores/                 zustand: User.Store.js, actions.js
└── components/
    ├── layout/             Navbar/ · Footer/
    ├── ui/                 Logo/ (+ el resto de primitivas)
    ├── home/               CourtCard.jsx · ActivityTeaserCard.jsx
    ├── booking/            CourtPage (parametrizada) · SlotGrid · DateStrip
    │                       TimeTabs · BookingPanel · BookingInstructions · NextSlotFab
    │                       courtConfig.js (las 4 canchas) · helpers.js
    ├── activities/         ActivityCard.jsx
    └── spinner/
```

**El corazón del producto es `components/booking/`.** `CourtPage` recibe la cancha por prop desde `pages/reserves/Reserves.jsx` (lee `?court=futbol`), y de ahí cuelgan la grilla de slots, el strip de días, las tabs de franja y el panel de confirmación. Agregar una cancha nueva debería ser una entrada en `courtConfig.js`, no un componente nuevo.

## admin/ — panel del club

```
admin/src/
├── styles/                 tokens.css · base.css
├── lib/supabaseClient.js
├── hooks/                  mismo juego que client
├── stores/                 user.Store.js · session.storage.js
├── pages/                  home/ · auth/{login,failLogin}
└── components/
    ├── navigation/         menú lateral
    ├── main/               shell
    ├── user/               getAllUsers · user/{userData,userReserves,userActivities} · createUser
    ├── courts/             getAllCourts · CreateCourt · {football,paddle,squash,palotaPaleta}
    ├── activities/         getAllActivities · createActivity · updateActivities
    ├── events/             EventsTable · eventsForm
    └── oldReservesDeleted/ ← CÓDIGO MUERTO
```

**Asimetría conocida:** `admin` conserva el árbol anidado anterior al rediseño (`components/courts/pages/football/`, `components/activities/components/activityCard/`), mientras `client` ya está aplanado por feature. Lo nuevo en `admin` debería seguir el patrón de `client`. Ojo: `admin` está en **React 18** y no usa `react-bootstrap` (solo el CSS de `bootstrap`).

## Base de datos

Schema en `server/supabase/`, en este orden:

| Archivo | Qué crea |
|---|---|
| `01_schema.sql` | extensiones, enums, tablas, índices, `is_admin()` |
| `02_rls.sql` | políticas de Row Level Security |
| `03_rpc.sql` | funciones RPC que usa la app |
| `04_triggers.sql` | `auth.users` → `profiles`, bookkeeping de slots |
| `05_seed.sql` | admin inicial + las 4 canchas |

```
profiles ──┬─< reservations >── courts
           │         (EXCLUDE gist: no se solapan)
           └─< activity_categories >── activities

events   (independiente, SoftBook)
```

Dos detalles que sostienen el sistema:

1. **`reservations_no_overlap`** — `EXCLUDE USING gist (court_id WITH =, tstzrange(start_time, end_time) WITH &&)`. El double-booking no se puede escribir a la base. Es la garantía central; no duplicar esa lógica en el cliente ni en un service.
2. **`profiles.role`** + `public.is_admin(uid)` como `SECURITY DEFINER` — es lo que consulta la mayoría de las políticas de RLS. Cambiar el nombre o la firma rompe las políticas silenciosamente.

**`migracion/01_database/*.sql` es copia byte-idéntica de `server/supabase/*.sql`.** La fuente canónica es `server/supabase/`. Editar una implica copiar a la otra, o borrar la duplicada.

`migracion/02_etl/` tiene el ETL de la migración desde MongoDB: `01_extract_mongo.js` → `02_transform.js` → `03_load_postgres.js`. Corre una sola vez, no es parte del runtime.
