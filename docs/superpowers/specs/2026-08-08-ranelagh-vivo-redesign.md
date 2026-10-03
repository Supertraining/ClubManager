# Ranelagh Vivo — Design Spec

<!-- impeccable:design-schema 1 -->

**Status:** approved 2026-08-08 (rediseño end-to-end, enfoque A "Ranelagh Vivo")

## 1. Visual World

### Tesis

Un club de barrio con la prolijidad operativa de un sistema moderno. La cancha y el nombre de la gente mandan; la UI se nota lo justo. Calidez sin caer en amateur, eficiencia sin caer en frío-SaaS.

### Paleta (final)

| Token | Hex | Uso |
|---|---|---|
| `--c-bg` | `#FAF5EC` | Superficie principal (crema cálido) |
| `--c-surface` | `#FFFFFF` | Cards, modales, inputs |
| `--c-surface-alt` | `#F1E9D6` | Secciones alternadas, hover suave |
| `--c-ink` | `#1A1F1B` | Texto principal |
| `--c-ink-soft` | `#4D544E` | Texto secundario, labels |
| `--c-ink-muted` | `#7E8784` | Texto terciario, placeholders |
| `--c-line` | `#E4D8BF` | Bordes sutiles, separadores |
| `--c-brand` | `#0F4F3F` | Verde club, fondos, links, navbar |
| `--c-brand-strong` | `#0A382C` | Hover/active del primary |
| `--c-brand-soft` | `#E5EFE9` | Tints, badges suaves |
| `--c-accent` | `#C26A4A` | Acento principal (terracota apagado) |
| `--c-accent-strong` | `#9A4F35` | Hover/active del accent |
| `--c-accent-soft` | `#F4E2D6` | Tints del accent |
| `--c-mustard` | `#C9A24A` | Acento secundario (mostaza antigua, solo badges) |
| `--c-success` | `#2F8A6E` | Estados positivos |
| `--c-danger` | `#A82B1F` | Errores, eliminar reserva |
| `--c-warning` | `#B57A11` | Avisos, contraseñas débiles |
| `--c-info` | `#1F4E5F` | Información secundaria |

**Reglas de uso:**
- Verde club ocupa ~30% de la superficie (navbar, footer, CTAs hover).
- Terracota aparece solo como acento: íconos de check, tags de "profe a cargo", bordes finos de focus, hover de CTAs.
- Mostaza SOLO en badges de "permanente" o "staff del club" — nunca en CTAs.
- Crema cálido `#FAF5EC` es el fondo del 90% de la app. Nunca blanco puro en superficies grandes.
- **Prohibido:** glassmorphism, gradientes sobre texto, borders-left de color, sombras azules.

### Tipografía

- **Outfit** (display, headings, números grandes): weight 600-800, tracking `-0.02em`, line-height 1.1.
- **Inter** (body, UI, labels, inputs): weight 400-500, line-height 1.55.
- Botones: Inter 600, 0.9375rem.
- Cuerpo mínimo: 16px. Inputs: 16px (evita zoom en iOS).
- **Sin serif display.** Outfit tiene suficiente personalidad geométrica.

### Espaciado y radius

Escala 4px base, container max-width 1200px. Radius: sm 6px (tags), md 10px (inputs, botones), lg 16px (cards), xl 24px (hero cards), pill 9999px (CTAs).

### Motion

- Hover/focus: 120ms.
- Cambio de estado: 220ms.
- Entradas: 420ms con `cubic-bezier(0.16, 1, 0.3, 1)`.
- Toasts: spring `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- `prefers-reduced-motion: reduce` desactiva motion de >200ms.

### Iconografía

- `bootstrap-icons` (vía `node_modules`) como base.
- SVG inline para logos, iconos de cancha, ilustraciones puntuales.
- Tamaños: 20px UI, 24px CTAs, 32px+ features.

### Fotografía

- **Solo fotos reales del club** (ya en `src/assets/`). NO fabricar.
- Formato `.webp`, `loading="lazy"` debajo del fold.
- Overlay `rgba(15, 79, 63, 0.4)` sobre fotos con texto encima.

## 2. Microcopy (la palanca más fuerte para "cálido")

- **CTAs primarios:** "Sumate a la clase de hoy", "Anotate con Tomás", "Reservá tu cancha", "Traé a tu hijo", "Crear mi cuenta".
- **CTAs secundarios:** "Ver canchas", "Ver disponibilidad", "Cómo llegar".
- **Confirmaciones:** "Listo, te guardamos lugar en la clase de las 19h. Si no podés venir, avisanos con tiempo así otro socio lo aprovecha."
- **Cancelación:** "Cancelada. Tu lugar se libera para otra familia."
- **Errores:** específicos, en voseo, con solución. "Esa cancha ya está reservada para esa hora. Probá con el turno de las 20:30 o elegí otra cancha."
- **Empty states:** honestos, con salida. "No tenemos canchas cargadas todavía. Pedile al admin que corra el seed de Supabase."
- **404:** "Esa cancha no existe." (ya lo tenías, mantener el humor barrial)
- **Tono general:** voseo argentino, directo, cálido sin ser condescendiente, sin emojis decorativos.

## 3. Arquitectura de componentes

```
src/
├── styles/
│   ├── tokens.css          # variables CSS (paleta, type, radius, shadow, motion)
│   ├── base.css            # reset + body + typography + a + utilities
│   └── components.css      # clases reutilizables (.card, .btn, .input, .toast, .nav)
├── components/
│   ├── layout/
│   │   ├── Navbar/         # sticky con blur, logo, links, CTA
│   │   ├── Footer/         # CTA band + 4 columnas + copy
│   │   └── Container/      # container con max-width y padding consistente
│   ├── ui/
│   │   ├── Logo/           # logo tipográfico
│   │   ├── Button/         # variantes primary, ghost, danger, link
│   │   ├── Card/           # card base con hover
│   │   ├── Section/        # wrapper de sección con eyebrow + title + sub
│   │   ├── Eyebrow/        # "— Canchas" con guión y color
│   │   ├── Tag/            # pill chico (profe, día, hora)
│   │   ├── Icon/           # wrapper de bootstrap-icons con tamaño consistente
│   │   └── Spinner/        # loading state
│   ├── home/
│   │   ├── Hero/           # hero con foto + copy + CTA
│   │   ├── CourtGrid/      # grilla de canchas (4 cards)
│   │   ├── ActivitiesTeaser/  # "Esto se viene en el club" con caras de staff
│   │   ├── ElClub/         # foto + copy
│   │   └── HomeStats/      # 4 stats (canchas, actividades, años, socios)
│   ├── booking/
│   │   ├── CourtPage/      # 1 componente parametrizable (reemplaza 4 archivos)
│   │   ├── SlotGrid/       # grilla semanal con tabs Mañana/Tarde/Noche
│   │   ├── DateStrip/      # strip horizontal de días (lun-dom) con día activo
│   │   ├── BookingPanel/   # panel con initial/final time + confirm
│   │   ├── BookingInstructions/  # paso 1, 2, 3 explicado
│   │   └── NextSlotFab/    # FAB "Próximo slot libre"
│   └── activities/
│       ├── ActivityList/   # catálogo de actividades
│       ├── ActivityCard/   # card con foto + profe con cara
│       └── ActivityDetail/ # modal con info + días/horarios + CTA
├── pages/
│   ├── home/Home.jsx
│   ├── reserves/Reserves.jsx     # vacío, delega a CourtPage
│   ├── login/Login.jsx
│   ├── register/Register.jsx
│   ├── account/Account.jsx       # NUEVO — "Mi cuenta" (perfil + próximas reservas)
│   └── notFound/NotFound.jsx
└── App.jsx
```

## 4. Páginas

### Home (`/`)

1. **Hero** — foto real del club con overlay degradado verde, eyebrow "Temporada 2026 · Reservas online", titular "Tu cancha lista en dos pasos", sub-cop, CTA "Reservar una cancha" + "Ver canchas". Stats (4 canchas, 6+ actividades, 50+ años, 500+ socios) abajo.
2. **Canchas** — eyebrow "— Canchas", titular "Elegí tu deporte, elegí tu horario". Grid de 4 cards (futbol, paddle, squash, paleta) con foto, badge de superficie, descripción, pills de features. Cada card clickeable va a `/reserves?court=futbol`.
3. **El club** — sección verde (inversa) con foto a la izquierda y copy a la derecha. Tono de pertenencia barrial.
4. **Esto se viene en el club** — sección editorial con 3-4 cards de actividades/próximos eventos, cada una con la cara del profe/staff. Foto real del club, no stock.
5. **Cómo llegar** — mapa + dirección + horarios. Compacto, no compite con el resto.
6. **Footer** — CTA band verde + 4 columnas (Info / Navegación / Horarios / Contacto) + copy.

### Reservas (`/reserves?court=futbol`)

1. **Header de cancha** — foto de fondo con overlay, nombre de la cancha, pills de features (Césped sintético, Luz LED, etc).
2. **DateStrip** — strip horizontal de 7 días (Lun-Dom), día activo destacado, swipe/scroll horizontal en mobile.
3. **Tabs por franja** — Mañana (6-12) / Tarde (12-18) / Noche (18-23). Cambio instantáneo.
4. **SlotGrid** — grilla de slots de 60 min para el día+franja seleccionado. Cada slot:
   - Disponible: outline, hover fill verde, click selecciona.
   - Ocupado: bg `--c-surface-alt`, opacidad 60%, no interactivo.
   - Seleccionado: bg verde, texto crema.
   - Permanente: outline terracota + tag "Permanente" + nombre del socio.
   - Tuyo: outline mostaza + tag "Tuya" + nombre tuyo.
5. **BookingPanel** (sidebar en desktop, bottom-sheet en mobile):
   - Hora inicio (auto-llena con slot clickeado)
   - Hora fin (auto-calcula +90 min o permite override)
   - CTA "Confirmar reserva" en verde.
6. **BookingInstructions** arriba: 3 pasos numerados con copy clara.
7. **NextSlotFab** — botón flotante "Próximo slot libre" que escanea la semana y propone el más próximo.

### Login (`/login`)

Layout split: izquierda verde con copy "Bienvenido de vuelta" + tagline, derecha card crema con form. Mismo estilo que Register pero invertido (info a la izquierda en lugar de derecha).

### Register (`/register`)

Split layout ya implementado, ajustar para alinearse con la nueva paleta (crema cálido, terracota en lugar de amber).

### Mi cuenta (`/account`) — NUEVO

- Perfil: nombre, email, teléfono, edad. Editables inline.
- "Tus próximas reservas" — lista de reservas próximas con cancha + fecha + hora + botón "Cancelar".
- "Historial" — reservas pasadas, colapsable.
- Botón "Cambiar contraseña" abre modal.
- Botón "Cerrar sesión".

### 404

Mantener el actual, ajustar paleta al crema cálido.

## 5. Booking Flow (lo más importante)

### Modelo de datos

Reserva = `{ id, court_id, user_id, date, initialTime, finalTime, permanent }`.

### Flujo de 2 taps (después de login)

1. Click en card de cancha en Home → navega a `/reserves?court=futbol`.
2. SlotGrid renderiza con día actual + franja "Mañana" por default.
3. Usuario click un slot disponible → `setSelectedSlot({initialTime, finalTime})`.
4. BookingPanel muestra "19:00 — 20:30" con CTA "Confirmar reserva" verde.
5. Click CTA → `createReserve()` → toast success → slot queda como "tuyo" (outline mostaza).

### Cancelación

- Desde Mi cuenta o desde el SlotGrid (botón × en slot propio).
- Modal de confirmación: "¿Cancelar tu reserva del viernes 8 a las 19:00? Tu lugar se libera para otra familia." [Cancelar reserva] [No, dejar].

### Edge cases

- Slot clickeado que se ocupa entre la selección y la confirmación → toast warning, recargar grilla.
- Usuario no logueado intenta reservar → redirect a `/login?next=/reserves?court=futbol`.
- Sin canchas en el día → empty state "No hay canchas disponibles esta noche. Te avisamos cuando alguien cancele." con botón "Notificarme".
- Reserva permanente: tag visual + no se puede cancelar desde la app (solo admin).

## 6. Activity Card (el "profe con cara")

Cada actividad tiene `{ id, name, description, profe: {name, photo, bio}, days, hours, court }`. La card muestra:

- Foto del club/actividad (top, 4:3).
- Tag con el día ("Mar y jue").
- Título (Inter 600, 1.1rem).
- Descripción (Inter 400, 0.95rem, 2 líneas max con ellipsis).
- **Footer con avatar del profe + nombre** ("Con Tomás · profe de hockey").
- CTA "Ver días y horarios" abre modal.

## 7. Sistema de errores

- Toasts top-right en desktop, bottom-center en mobile.
- Success: border-left 3px verde club, texto "Listo, ..."
- Error: border-left 3px danger, texto específico + acción.
- Warning: border-left 3px warning.
- 4s auto-dismiss en success, 6s en error.
- `aria-live="polite"` para screen readers.

## 8. Accesibilidad

- WCAG 2.1 AA: contraste ≥ 4.5:1 en body, ≥ 3:1 en grandes.
- Focus visible: `outline: 2px solid var(--c-accent); outline-offset: 2px`.
- Touch targets ≥ 44×44 px.
- `aria-label` en todos los iconos sin texto.
- Imágenes con `alt` descriptivo.
- Formularios con `<label>` asociado, no placeholder-only.
- `prefers-reduced-motion` desactiva motion >200ms.

## 9. Out of scope

- Pagos / procesamiento de cuota.
- Notificaciones push.
- Open Matches (matchmaking entre socios).
- Spot booking con floorplan (para colonia).
- Versión nativa mobile (es web responsive).

## 10. Orden de implementación

1. `tokens.css` + `base.css` (paleta + base).
2. `components/ui/` (Button, Card, Section, Eyebrow, Tag, Icon, Spinner).
3. `components/layout/` (Container, Navbar, Footer).
4. `pages/home/` (Hero, CourtGrid, ElClub, ActivitiesTeaser, HomeStats).
5. `components/booking/` (CourtPage, DateStrip, SlotGrid, BookingPanel, BookingInstructions, NextSlotFab).
6. `components/activities/` (ActivityList, ActivityCard, ActivityDetail).
7. `pages/login/`, `pages/register/`, `pages/account/`, `pages/notFound/`.
8. `App.jsx` (rutas).
9. Build + smoke test.
