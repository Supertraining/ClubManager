# Plan de implementación de ClubManager SaaS

> **Para agentes** · Después de la aprobación, usar `superpowers:executing-plans` en ejecución nativa o `superpowers:subagent-driven-development` si el usuario elige delegar. Los pasos llevan casillas para registrar su avance.

**Estado** · Diseño aprobado. Los hitos 1 y 2 están implementados y verificados en el checkout local. Quedan por validar el corte en el entorno de destino, la oferta y la integración de cobros.

**Objetivo** · Habilitar el alta y la contratación web de un club, con padrón y reservas aislados, y migrar el servicio que usa Ranelagh.

**Arquitectura** · Dos apps Vite, una API Express y un Supabase por ambiente. Express resuelve el club por URL y Postgres acota el acceso por membresía y club. Una contratación verificada habilita la operación del nuevo club.

**Stack** · Node 22, Express 4, Supabase JS 2, Postgres, Mocha 10, Vite 4 y React Router 6. `client` usa React 19 y `admin` usa React 18.

**Diseño** · [ClubManager como SaaS](../specs/2026-11-23-clubmanager-saas-design.md).

## Restricciones generales

- Seguir `AGENTS.md`. Los cambios de configuración externa requieren aprobación explícita del servicio, ambiente, variable o ajuste y valor. El turno actual cubre los documentos de planificación. La ejecución, integración y despliegue quedan sujetos a su autorización.
- Mantener las capas router, controller, service y DAO, y el montaje que usa `server/index.js`. El token de Supabase identifica a la persona. La membresía vigente determina el acceso de esa persona a cada club.
- Conservar IDs de Auth, perfiles, canchas y reservas. Crear un ID de club estable para Ranelagh. Proteger `reservations_no_overlap` y el intervalo `[inicio, fin)`. Mantener enlaces públicos de Ranelagh y las operaciones vigentes de socio.
- Las apps conservan el voseo, los tokens existentes, Outfit e Inter y controles táctiles de 44 × 44 px como mínimo. Usar fotos del propio club. La contratación se aloja en el proveedor de pago y ClubManager solo recibe identificadores y estados.
- Probar con personas, clubes y pagos sintéticos. Usar Node 22, Mocha y el `fetch` nativo. Usar la stack local de Supabase para la integración y un ambiente aprobado por separado para la prueba del proveedor. Registrar solo estados, referencias no sensibles y recuentos.

## Evidencia y ubicación del cambio

| Responsabilidad | Evidencia en el repo | Ubicación del cambio |
|---|---|---|
| Montaje y autenticación | `server/index.js` importa `src/dependencies/index.js`. `verifyAccessToken` deriva `isAdmin` de un perfil global. `IsAdmin.requireAdmin` carece de consumidores en los routers activos. | Montaje en `dependencies/index.js`, contexto de club y control de acceso en `middlewares/`. |
| Operaciones del club | `courts` usa el cliente privilegiado para varias lecturas y escrituras. `activities` y `clubEvents` también lo usan. `users` combina JWT del usuario con operaciones globales de Auth. | Modificar las cuatro cadenas controller → service → DAO. Usar cliente asociado al JWT y filtros explícitos en operaciones de socios y administradores. |
| Esquema y acceso | `server/supabase/01_schema.sql` usa `court_kind` y nombre único global. RLS y RPC se apoyan en `is_admin`. El trigger y la reparación leen el rol desde metadatos de usuario. Los SQL `01` a `05` coinciden byte por byte con la copia de `migracion/01_database`. | SQL versionado en `server/supabase/migrations/`. Mantener sincronizados los SQL existentes que se corrigen y documentar la ruta de bootstrap y actualización. |
| Marca, navegación y reservas | `client/src/components/booking/courtConfig.js` define canchas y horarios. El servidor y el panel usan `-03:00` en reservas. Los dos stores de usuario tienen un `fetch` fuera de axios. | Resolver el club desde el router en ambas apps, pasarle su contexto a axios y stores, y usar la configuración de canchas de la API. |
| Contratación | Los módulos actuales atienden usuarios, canchas, actividades y eventos. El estado de eventos del club corresponde a otro flujo. | Agregar `server/src/modules/billing/` con la misma estructura. Usar Postgres para alta, intentos de checkout, cobros y estados que requieren conciliarse. |

**Línea base verificada** · Los lints de `client` y `admin` terminaron con código 0. `npm.cmd test` en `server` falló al cargar `node-fetch`. La prueba heredada espera el contrato Mongo y requiere un servidor aparte en el puerto 8080. Se verificó Node 22 y `psql` 15.15. El CLI de Supabase no estaba en PATH. La inspección se limitó al repositorio y a documentación pública. La base y el despliegue activos quedan por contrastar.

## Casos prioritarios de revisión

- Una cuenta es admin de A y socia de B. En B solo puede operar como socia. En A solo aparecen los recursos de A. Una membresía revocada pierde acceso con su JWT existente. Tareas 2 y 3.
- Dos clubes usan el mismo identificador de cancha y el mismo horario. La reserva cruzada entre club y cancha se rechaza, el turno en otra cancha se acepta y ante dos escrituras simultáneas de la misma cancha queda una sola reserva. Tarea 4.
- Un enlace previo de Ranelagh incluye cancha, fecha o retorno de login. Abre el club correcto, conserva sus parámetros y mantiene el flujo de reservas. Una respuesta tardía de A no aparece tras navegar a B. Tareas 5 y 8.
- La creación del checkout queda con resultado incierto. El siguiente intento retoma la misma contratación y una notificación tardía se asocia por su referencia original, incluso después de liberar el slug. Tareas 6 y 7.
- Un cobro llega duplicado, fuera de orden o para otra contratación. Un pago correcto habilita exactamente un período. Al vencer el abono siguen disponibles la consulta y la cancelación de las reservas según el rol. Tarea 7.

## Cobertura de calidad

- **Contratos y consistencia** · Rutas públicas y privadas, entradas inválidas, errores específicos y efectos acotados en T2–T5. `npm.cmd test`, los dos lints y builds, y los recorridos UI cubren las entradas normales. Conservar funciones de reserva y presentación reutilizables y el contrato heredado que tenga consumidores.
- **Concurrencia y recuperación** · T3–T4 cubren escrituras atómicas, claves compuestas y reserva simultánea con la baja del socio. T6–T8 cubren reintentos de pago, caducidades, fallas parciales, migración y reversión. `checkout_recovers_in_flight_attempt` detecta la duplicación del intento y `booking_is_atomic_by_court` detecta una reserva cruzada. La capacidad de detección queda por comprobar durante la ejecución.
- **Claridad, reutilización y rendimiento** · Reusar la inyección de dependencias y el acceso Supabase por JWT. Concentrar la validación temporal y las operaciones de pago en sus módulos. Usar índices alineados con `club_id` y consultas verificadas con fixtures. Evitar estado de club compartido entre solicitudes y repositorios genéricos nuevos.
- **Límite de seguridad** · Autenticación, autorización, datos personales y cobros son sensibles. Verificar HTTP y permisos directos del Data API, incluida la ejecución de RPC. Confirmar antes de ejecutar T7 los contratos comerciales y del proveedor. No hay evidencia de ejecución de las pruebas propuestas.

## Hito 1 · Proteger Ranelagh

**Evidencia del 23 de noviembre de 2026** · Pasaron 17 pruebas del servidor, los lints de ambas apps y la verificación de permisos en PostgreSQL 17.11. La revisión independiente incorporó pruebas de edición administrativa, borrado con y sin referencias, configuración y reintento del importador histórico.

Con Docker Desktop en marcha, el ensayo descartable aplicó `01` a `05` sobre PostgreSQL 17.11.0.002 con Auth 2.197.0 y PostgREST 16.4. Express registró e inició sesión con una cuenta sintética. Un socio consultó su perfil y recibió 403 en padrón y eventos, mientras que un administrador pudo consultar el padrón y editar el teléfono del socio. PostgREST permitió leer el perfil propio y las cuatro canchas públicas, y rechazó el acceso anónimo a perfiles. Auth y PostgREST se publicaron solo en localhost y PostgreSQL quedó dentro de la red de contenedores durante el ensayo. Se retiraron los contenedores, volúmenes y redes de prueba.

### Tarea 1 · Línea base reproducible

**Archivos** · Modificar `server/package.json`, `server/test/user.test.js`, `server/src/app.js`, `server/supabase/01_schema.sql`, su copia en `migracion/01_database/` y `server/supabase/README.md`. Agregar `server/test/support/apiFixture.js`.

**Interfaces** · `createApp({ router, corsOptions })` devuelve la misma app Express que inicia `Server.start()`. El fixture de integración prepara datos sintéticos, conecta únicamente a un stack local y entrega tokens de socio y administrador. `npm.cmd test` carga `test/**/*.test.js`.

- [x] Sustituir los casos de Mongo por pruebas de salud, sesión y perfil propio. Probar el montaje real con puerto efímero, fixture HTTP en loopback y `fetch` nativo.
- [x] Probar el bootstrap SQL desde cero. Cambiar el índice parcial con `now()` por uno ordinario sobre `end_time` y declarar `btree_gist` para la exclusión por UUID. Confirmar que las copias corregidas coinciden. [Restricciones de índices en Postgres](https://www.postgresql.org/docs/current/sql-createindex.html) · [btree_gist](https://www.postgresql.org/docs/15/btree-gist.html).
- [x] Arrancar un entorno descartable de Supabase con Docker, aplicar `01` a `05` con `psql -X -v ON_ERROR_STOP=1` y verificar los flujos con cuentas sintéticas. Ejecutar `npm.cmd test` desde `server/`. El ensayo final usó Docker Compose con publicación explícita en localhost.

### Tarea 2 · Permisos del sistema actual

**Archivos** · `server/src/routes/{users,courts,activities,events}.js`, `server/src/middlewares/{isAdmin,errorHandler}.js`, `server/src/config/supabaseClient.js`, `server/src/modules/users/{DAO,services}/users.js`, `server/src/modules/users/helpers/emailNotifications.helper.js`, `server/supabase/{02_rls,03_rpc,04_triggers,repair_missing_profiles}.sql`, copias de `02` a `04` en `migracion/01_database/` y `server/test/permissions.test.js` (nuevo).

**Interfaces** · Usar `IsAdmin.requireAdmin` después de autenticar. En este hito el rol global es transitorio. El perfil editable admite nombre, apellido, edad y teléfono. Login y registro usan un cliente de Auth sin sesión compartida.

- [x] Probar el control administrativo en las rutas montadas con identidades de prueba, incluyendo 403 para un socio en padrón y eventos, y 200 con permiso administrativo. Mantener las consultas de reservas propias y el catálogo público.
- [x] Aplicar los controles y retirar contraseñas de los correos. Restringir la edición de perfiles por columna y rol. Crear perfiles sin privilegios a partir de Auth y restringir las RPC de promoción, disponibilidad y limpieza. Adaptar la reparación de perfiles y el importador histórico a esa asignación de roles.
- [x] Ejecutar la suite de `server/`, incluido el grupo `permissions`, y probar los permisos de `anon` y `authenticated` con Auth y PostgREST locales. Confirmar el acceso administrativo, la lectura del perfil propio y el acceso público al catálogo.

## Hito 2 · Aislar y migrar los clubes

**Evidencia del 23 de noviembre de 2026** · Pasaron 22 pruebas del servidor, los lints y los builds de ambas apps. El ensayo en Docker aplicó los scripts base y las tres migraciones sobre un padrón y reservas sintéticos. Conservó los IDs y los instantes de las reservas, rechazó una relación entre clubes y comprobó el cierre a las 00:00 del domingo. Con Auth y PostgREST, una cuenta tuvo roles distintos por club, dos altas simultáneas devolvieron la misma membresía y dos intentos de tomar el mismo turno devolvieron 200 y 409. También se verificaron el catálogo, los eventos y la baja de una membresía después de cancelar su reserva futura.

En Edge se probó el portal a 390 px con zona horaria de Los Ángeles y el panel en escritorio. Se verificaron un enlace original de Ranelagh, la recarga de una cancha de otro club, el retorno del login, el cambio de contraseña y el rechazo administrativo en un club ajeno. El compilador de React llegó a omitir una suscripción de Zustand entre renders cuando el selector tenía nombre de función común. Se corrigieron los consumidores para identificarlo como hook.

**Corte pendiente** · Confirmar el padrón autorizado de Ranelagh, confrontar las definiciones de la base de destino, revisar los trabajos que llamaban a la limpieza global y verificar la entrega y redirección de correos de Auth en el entorno acordado. El ensayo utilizó confirmación automática local y comprobó en SQL que una cuenta sin verificar no puede aceptar la invitación. La edición administrativa de una ficha afecta a la membresía del club. El perfil de la cuenta y su contraseña son compartidos por el titular.

### Tarea 3 · Datos, membresías y alcance de las solicitudes

**Archivos** · Nuevos `server/supabase/migrations/*_clubs_expand.sql` y `*_clubs_access.sql`, `server/src/middlewares/clubContext.js`, `server/src/dependencies/clubs.js`, `server/src/routes/clubs.js`, `server/src/modules/clubs/{controllers,services,DAO}/clubs.js` y `server/test/clubs.test.js`. Modificar `server/src/dependencies/index.js`, `server/src/middlewares/{isAuthenticated,isAdmin}.js` y la cadena de usuarios.

**Interfaces** · `GET /clubs/:clubSlug` devuelve `{ slug, name, timezone, logoUrl, coverImageUrl, contact, signupMode, bookingEnabled }`. `PUT /clubs/:clubSlug/settings` modifica `{ name, logoUrl, coverImageUrl, contact, signupMode }` con permiso de admin. `GET /clubs/:clubSlug/users/me` devuelve el perfil y el rol del club. `req.club` contiene el ID resuelto, slug y zona. `req.membership` contiene el rol de la sesión para ese club. `POST /clubs/:clubSlug/memberships/join` incorpora al usuario verificado. `POST /clubs/:clubSlug/memberships/invitations` recibe `{ email }` y devuelve 202 al admin con acceso. En operaciones privadas, JWT ausente o inválido devuelve 401, membresía insuficiente devuelve 403 y recurso ajeno al club de la URL devuelve 404.

- [x] Preparar dos clubes sintéticos con admin, socio, persona con roles distintos en ambos y cuenta sin membresía. Agregar `club_routes_use_current_membership`, `joins_are_idempotent_and_require_verified_email` y `migration_preserves_ids`. Comprobar el rol actual antes y después de suspender una membresía, manteniendo el mismo JWT.
- [x] Generar las migraciones con el CLI de Supabase en `server/`, verificando los comandos con `--help`. Crear `clubs` y `club_memberships` y agregar `club_id` a las entidades del diseño. En un ensayo legado inventariado, poblar desde Ranelagh y sus relaciones, conservar IDs y asignar roles administrativos a partir del padrón confirmado. Resolver perfiles faltantes contra el padrón antes del traspaso. Exigir integridad referencial compuesta e índices de consulta, y validar cero filas huérfanas o sin club antes de habilitar escritura multi-club. Aplicar RLS y permisos explícitos a las tablas y funciones expuestas, junto con la vigencia de la membresía. Mantener operaciones privilegiadas en funciones internas acotadas y filtros por club en Express. [Cambios de exposición en Supabase](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically).
- [x] Montar una instancia de los routers `users`, `courts`, `activities` y `events` y reutilizarla bajo `/clubs/:clubSlug` y en los alias raíz asignados a Ranelagh. Montar explícitamente `clubs` y las futuras rutas globales de contratación fuera del árbol reutilizado. Acotar listado, búsqueda, detalle y baja de socios al padrón. La baja suspende la membresía y mantiene la cuenta. Si existen reservas futuras, devolver 409 hasta cancelarlas. El titular cambia su contraseña con Supabase Auth.
- [x] Implementar aceptación de invitaciones por correo verificado y admisión abierta explícita en clubes configurados para ello. La invitación solo crea membresías `socio`. Aceptar reintentos sin duplicados ni reactivación automática de bajas. Restringir la lectura directa de invitaciones y la escritura directa de membresías. Implementar la edición de la ficha del club con lista de campos admitidos y enlaces HTTPS para las imágenes proporcionadas. Conservar la incorporación por registro en Ranelagh.
- [x] Ejecutar `npm.cmd test -- --grep "clubs"` y verificar grants efectivos y RLS por JWT en Supabase local. Esperado · los clubes, roles y pertenencias coinciden con la URL y las relaciones. Probar simultáneamente el alta del mismo socio y la baja de una membresía con reservas.

### Tarea 4 · Canchas, reservas, actividades y eventos

**Archivos** · Modificar las cadenas de `server/src/modules/{courts,activities,clubEvents}/`, `server/src/routes/{courts,activities,events}.js` y `server/src/middlewares/dataValidator.js`. Agregar `server/supabase/migrations/*_club_operations.sql` y `server/test/{clubReservations,clubCatalog}.test.js`.

**Interfaces** · `GET /clubs/:clubSlug/courts` devuelve el catálogo público. Cada cancha tiene `slug`, `sport`, `displayName`, `durationOptionsMin` y horarios por día en minutos desde medianoche. Único por `(club_id, slug)`. `PUT /clubs/:clubSlug/courts/:courtSlug` edita la cancha y sus horarios en una transacción con permiso de admin. `GET /clubs/:clubSlug/courts/:courtSlug/availability?from=YYYY-MM-DD&days=7` devuelve `[{ startTime, endTime, mine }]` para un rango de 1 a 14 días del club. `PUT /clubs/:clubSlug/courts/reserve` recibe `{ courtSlug, localDate, startMin, durationMin, memberId?, permanent? }`. El alias existente mapea su formato anterior al nuevo contrato. `DELETE /clubs/:clubSlug/users/reserves/:reserveId` conserva la baja de reserva propia y aplica el permiso de administrador del club.

- [x] Agregar `booking_is_atomic_by_court`, `midnight_uses_club_date`, `public_availability_hides_member_data` y `admin_catalog_actions_are_club_scoped`. Probar mismo slug en A y B, mismo deporte con dos canchas, dos reservas concurrentes en la misma cancha, turnos consecutivos, horario cerrado, duración inválida y fin el sábado a las 00:00 del domingo.
- [x] Guardar horarios por cancha con cierre máximo de 1440 minutos, y cargar los de Ranelagh desde `courtConfig.js`. Derivar inicio y fin en Postgres con fecha y zona del club. Usar una operación transaccional para validar club, horario, duración, titular y rol. Serializar creación de reserva y baja sobre la misma membresía. Solo el admin puede indicar otro miembro del mismo club o crear una reserva permanente. Retirar la escritura directa de reservas para `anon` y `authenticated`, dejando las mutaciones en funciones autorizadas. La política de lectura permite las reservas del socio y la gestión administrativa del club. La exclusión de Postgres devuelve 409 y conserva una única fila.
- [x] Acotar por club las operaciones CRUD de canchas, actividades con categorías y eventos. La actualización de actividad y categorías se confirma en una transacción. La limpieza de reservas exige un club explícito y los permisos correspondientes. Elaborar la disponibilidad pública con un DTO sin datos personales ni notas. Mantener el historial y los tipos de datos que consume la UI.
- [x] Ejecutar `npm.cmd test -- --grep "club reservations|club catalog"` desde `server/`. Esperado · las operaciones directas y por Express aplican los mismos permisos y preservan sus invariantes. Revisar en una segunda zona del navegador la fecha de un turno nocturno y la etiqueta de reserva propia.

### Tarea 5 · Apps y continuidad de Ranelagh

**Archivos** · Modificar `client/src/App.jsx`, `admin/src/App.jsx`, ambos `index.html`, los `hooks/useAxiosInstance.jsx`, `hooks/useUserAPI.jsx` y stores de usuario, `client/src/pages/{home,register,reserves,account}/`, `client/src/components/{booking,layout,ui/Logo}/`, `admin/src/pages/home/Home.jsx`, `admin/src/components/navigation/pages/Menu.jsx` y `admin/src/hooks/{useCourtAPI,useReservesAPI}.jsx`. Crear `client/src/components/club/ClubLayout.jsx`, `admin/src/components/club/ClubLayout.jsx` y `admin/src/pages/clubSettings/ClubSettings.jsx`.

**Interfaces** · Los layouts resuelven `/clubes/:clubSlug/*`, consumen el perfil público y pasan el slug a las consultas. El panel carga `users/me` antes de mostrar herramientas administrativas. `PUT /clubs/:clubSlug/settings` actualiza datos permitidos del club. `PUT /clubs/:clubSlug/courts/:courtSlug` modifica la configuración de una cancha y su horario. Ambas ediciones requieren administración del club.

- [x] Migrar navegación, axios y los dos `fetch` fuera de los hooks al contexto correcto. Cancelar o descartar las consultas del club anterior y recargar estado asociado en un cambio de URL. Mantener un intento de refresh en 401 y mostrar acceso restringido en 403. Validar `next` como ruta del club actual. Derivar el origen de redirects de Auth del origen autorizado.
- [x] Mostrar catálogo, horarios, actividades, logo y datos de contacto del club. Hacer que las reservas, padrón, configuración y eventos del panel consuman el mismo contexto. Admitir el alta de una cancha de otro deporte y dos canchas del mismo deporte. Ajustar el flujo administrativo de socios a invitación y baja en el padrón. Mantener comportamiento visual y assets actuales de Ranelagh y usar el nombre del club con el estilo base si faltan recursos.
- [x] Ejecutar `npm.cmd run lint` y `npm.cmd run build` en `client/` y `admin/`. Verificar en navegador el enlace original, la recarga con slug, el retorno al turno después del login y el acceso al panel de cada club. La validación de correo en el ambiente acordado sigue en la preparación del corte.

## Hito 3 · Contratación desde la web

**Estado del 23 de noviembre de 2026** · La simulación local ya permite registrar una cuenta, crear y recuperar un borrador, preparar un pago, activar el club, simular una renovación y pedir la baja desde Facturación. La vigencia se comprueba en Postgres y se conserva hasta el fin del período abonado. Los contratos y cobros simulados viven fuera de la Data API pública. El importe de la simulación es sintético.

La oferta pública permanece cerrada. Quedan pendientes el adaptador de Mercado Pago, los webhooks, la conciliación de cobros y el ensayo comercial. Para avanzar hacen falta la aplicación de prueba, la oferta aprobada y evidencias del ciclo de la suscripción del proveedor. Ver [preparación del lanzamiento](../runbooks/clubmanager-saas-rollout.md).

### Tarea 6 · Contrato del proveedor, alta y checkout recuperable

**Archivos** · Nuevos `server/src/dependencies/billing.js`, `server/src/modules/billing/{controllers,services,DAO}/billing.js`, `server/src/modules/billing/providers/mercadoPago.js`, `server/supabase/migrations/*_club_billing.sql` y `server/test/clubCheckout.test.js`. Crear `client/src/pages/subscribe/Subscribe.jsx` y montar `/contratar` en `client/src/App.jsx`.

**Interfaces** · `GET /billing/offer` devuelve `{ code, amountMinor, currency, frequency }`. `POST /billing/clubs` recibe `{ name, requestId }` y devuelve `{ clubId, slug, status }`. El servidor asigna el slug a partir del nombre y un sufijo único. El formulario muestra un botón para copiar el enlace al guardar. `POST /billing/clubs/:clubId/checkout` inicia o recupera un intento. `GET /billing/clubs/:clubId` devuelve estado y enlace vigente al titular. El adaptador `createPendingSubscription({ reference, payerEmail, offer, returnUrl })` devuelve `{ providerSubscriptionId, checkoutUrl }`. La referencia corresponde al intento interno, con restricciones únicas.

- [ ] Validar en el entorno de prueba de Mercado Pago la creación pendiente con enlace, un primer cobro, una renovación y los estados de cancelación. Confirmar cada identificador, la unidad monetaria, la fuente del período abonado y cómo resolver un resultado incierto de creación. La búsqueda documentada admite correo del pagador y devuelve la referencia externa. Verificar que permita recuperar una operación concreta antes de habilitar reintentos. Acordar precio, moneda y tratamiento de devoluciones como condición de la oferta. [API de creación](https://www.mercadopago.com.ar/developers/es/reference/online-payments/subscriptions/create-preapproval/post) · [Búsqueda de suscripciones](https://www.mercadopago.com.ar/developers/es/reference/online-payments/subscriptions/search-preapproval/get).
- [ ] Agregar `club_creation_is_atomic_and_owned` y `checkout_recovers_in_flight_attempt`. Simular doble clic, conflicto de slug, reintento con el mismo ID, intento de otro usuario y timeout con registro creado del lado del proveedor. Probar que el club pendiente no aparece en los catálogos ni acepta reservas.
- [ ] Implementar el alta con correo verificado, slug único y una transacción para club, membresía y contratación. Guardar al titular por ID de usuario y vincularlo a una membresía administradora del club. Persistir un intento antes de llamar al proveedor, usar un límite de tiempo y conservar el estado incierto hasta conciliar. Al vencer el borrador a los siete días, liberar su slug después de cerrar y verificar los intentos. Mantener las referencias históricas por ID. Usar el importe del servidor y comprobar el origen HTTPS del checkout.
- [ ] Completar `/contratar` con precio informado, registro o login, formulario del club, salida al proveedor y estado recuperable al volver. Ejecutar `npm.cmd test -- --grep "club checkout"` en `server/` y el lint y build de `client/`. Esperado · un club pendiente por alta, un intento abierto por club y reconocimiento verificable de un checkout iniciado.

### Tarea 7 · Cobros, acceso y baja

**Archivos** · Ampliar `server/src/modules/billing/`, agregar `server/src/modules/billing/services/reconcileBilling.js`, `server/supabase/migrations/*_billing_events.sql`, `server/test/clubBilling.test.js` y `admin/src/pages/billing/Billing.jsx`. Incorporar las reglas de vigencia a las políticas de club y registrar los estados de servicio.

**Interfaces** · `POST /billing/webhooks/mercado-pago` confirma la recepción autenticada y persistida. El resultado de `reconcileBilling` extiende la cobertura de un club por un pago conciliado y único. `POST /billing/clubs/:clubId/cancel` registra la baja solicitada por el titular y devuelve estado consultable. `paidThrough` en el DTO de facturación indica el fin del último período cubierto. La transferencia de titularidad es una operación interna auditada.

- [ ] Agregar `verified_payment_activates_once`, `renewal_is_monotonic_and_isolated`, `expired_club_allows_future_cancellation` y `late_payment_targets_original_club`. Incluir aviso inválido, importe o ambiente ajeno, fallo de red, reenvío, llegada fuera de orden, alta expirada, pago rechazado, cancelación al término y renovación aprobada.
- [ ] Verificar firma con el contrato del proveedor, persistir cada evento antes de responder 200 y procesarlo con reintentos y concurrencia acotada. Consultar la suscripción y el pago originales antes de confirmar vigencia. Deducir la referencia del club desde la contratación persistida. Usar un cobro único por ID y una transacción para guardar el resultado y habilitar el servicio. Guardar una señal de revisión para cobros tardíos o diferencias de conciliación. [Webhooks de Suscripciones](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/notifications/webhooks).
- [ ] Aplicar en Express y Postgres la misma regla de vigencia. Ranelagh opera como club migrado. Un club pendiente se muestra al titular en facturación. Un club publicado escribe durante los períodos pagados verificados. Fuera de ese plazo, el socio dueño o el admin del club conservan consulta y cancelación de turnos futuros según sus permisos. Preservar el historial y el acceso del titular a facturación. Confirmar la baja con el proveedor y conservar el período pagado. Ensayar recuperación de titularidad solo hacia un admin vigente del mismo club, con un registro de la operación.
- [ ] Ejecutar `npm.cmd test -- --grep "club billing"` en `server/` y los lints y builds de las apps afectadas. Verificar con cuentas de prueba el camino completo con el navegador cerrado durante la confirmación, prueba de renovación y baja, y reanudación después de reiniciar el procesador. Esperado · el período y el estado consultable coinciden con los cobros verificados. Si falta configurar el webhook o credenciales, pedir la aprobación del cambio concreto según `AGENTS.md`.

### Tarea 8 · Ensayo, corte y lanzamiento

**Archivos** · Agregar `docs/superpowers/runbooks/clubmanager-saas-rollout.md`. Actualizar `AGENTS.md`, `PRODUCT.md`, `docs/ARCHITECTURE.md` y `server/supabase/README.md` en los cambios que implementen el nuevo alcance. Conservar el spec histórico de Ranelagh.

**Interfaces** · Los enlaces públicos existentes siguen hacia Ranelagh. Los endpoints sin prefijo quedan acotados a Ranelagh durante el piloto. El alta comercial se habilita después de verificar el corte y la compra de prueba. Los mecanismos de despliegue, pausa y reversión se prueban en el ambiente de ensayo.

- [ ] Inventariar esquema, permisos, consumidores legacy, trabajos programados, recuentos, IDs y administradores autorizados del entorno de destino. Confirmar respaldo y restauración en ensayo. Registrar duraciones, bloqueos, criterios de aborto, compatibilidad temporal y pasos para manejar escrituras nuevas durante el corte, incluidas las de Auth y tareas programadas.
- [ ] Repetir la migración en una instancia descartable y verificar recuentos exactos, correspondencia de IDs y horarios, cero cruces, roles correctos y compatibilidad de URLs. Probar primero Ranelagh con los nuevos permisos y después dos clubes sintéticos. Ensayar una reversión antes de admitir escrituras de otro club, y una recuperación posterior que conserve el esquema y el aislamiento multi-club.
- [ ] Ejecutar `npm.cmd test` en `server/` y lints y builds en ambas apps. Repetir los recorridos de T5 y T7, con verificación de acceso por base y HTTP. Esperado · todas las comprobaciones pasan. Lo que dependa del entorno real queda fechado y respaldado por evidencia de ese entorno.
- [ ] Acordar la ventana que admite Ranelagh, confirmar condiciones comerciales y aplicar únicamente los despliegues y cambios externos autorizados. Habilitar `/contratar` para el primer club real después de los ensayos. Ante un incidente posterior al alta multi-club, aplicar la pausa de nuevas contrataciones y la recuperación compatible ensayada. Conservar operaciones de cobro y reservas durante la recuperación.

## Ejecución y revisión

- Al aprobar el diseño, confirmar la forma de ejecución. Usar `code` y TDD para cambios de producto. Invocar Supabase y OWASP en datos y permisos, la guía de React y la de UI en pantallas, y pruebas de integración HTTP y webhooks cuando se conecte el proveedor. Invocar verificación antes de informar cada cierre.
- Cada tarea inicia con los casos indicados, comprueba que detectan su regresión y termina con su verificación. Nombrar los grupos `describe` de Mocha según el texto de cada `--grep`. Aplicar commits con scope de la parte solo si la ejecución los autoriza. Revisar la cobertura y los contratos en el cierre de cada hito.
- La revisión independiente del diseño añadió ventana de corte, cancelación de reservas durante la mora, recuperación de titularidad y conciliación de cobros tardíos. Los casos quedaron en T5, T6, T7 y T8. El término de devolución y el ensayo del proveedor continúan pendientes. T1–T5 pueden revisarse e implementarse con su autorización sin esperar la aprobación comercial.
