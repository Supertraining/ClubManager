# Design

<!-- impeccable:design-schema 1 -->

> ## ⚠️ Documento superseded (2026-10-03)
>
> Este archivo describe un **borrador temprano** del diseño visual y ya **no refleja lo implementado**. Queda como registro histórico de la primera iteración.
>
> Lo que está en producción:
>
> - **Paleta y tokens reales:** `client/src/styles/tokens.css` (prefijo `--c-*`) — esta es la fuente de verdad, sin excepción.
> - **Decisión de diseño aprobada:** `docs/superpowers/specs/2026-08-08-ranelagh-vivo-redesign.md` (enfoque "Ranelagh Vivo", aprobado 2026-08-08).
>
> **Diferencias principales con lo de abajo**, que fue lo que quedó obsoleto:
>
> | | Este doc (obsoleto) | Implementado |
> |---|---|---|
> | Acento | ámbar `#E8A33D` | terracota `#C26A4A` |
> | Fondo | blanco hueso `#FAF8F4` | crema cálido `#FAF5EC` |
> | Tokens | `--color-*` | `--c-*` |
> | Acento secundario | — | mostaza `#C9A24A`, **solo** badges |
>
> Al agregar o cambiar estilos, leé `tokens.css` y el spec, no este archivo. Las prohibiciones de diseño (sin glassmorphism, sin gradientes sobre texto, sin `border-left` de color salvo toasts, sin sombras azules, fotos reales únicamente) **siguen vigentes** y están mejor especificadas en el spec.

## Visual World

**THESIS** — Una herramienta operativa para reservar canchas con la calidez de un club de barrio. La cancha y el horario son el centro; el resto se acomoda alrededor. Ni frío-SaaS ni cliché-deportivo: verde profundo, tipografía geométrica apretada, una sola acción primaria por pantalla.

**OWN-WORLD** — Verde césped profundo (`#0F4F3F`) como primario, blanco hueso (`#FAF8F4`) como superficie, tinta casi-negra (`#0E1410`) para texto y un acento ámbar (`#E8A33D`) para CTAs primarios y marcadores. Display en **Outfit** (geométrica, con peso, sin ser grotesca), body en **Inter** para legibilidad. Cards con radio generoso (16px), sombras con offset real, sin gradientes, sin vidrios decorativos, sin borders-left de color. Iconografía en línea con bootstrap-icons (ya disponible vía CDN); SVG inline cuando se necesita algo más preciso.

**STORY** — El socio recurrente abre la app, ve la disponibilidad de la semana, toca un día y reserva en dos pasos. La familia con chicos en actividades navega la grilla, se entera de horarios y contacta al club. El club Ranelagh se siente presente en cada detalle: la paleta, las fotos reales, el microcopy en rioplatense, el logo tipográfico.

**FIRST VIEWPORT** — Navbar translúcida con blur y logo "Ranelagh" a la izquierda, accesos directos (Actividades, Reservar, Mi cuenta) y un botón "Iniciar sesión" a la derecha. Hero a 70vh: imagen real de cancha/actividad con overlay degradado, un titular fuerte ("Reservá tu cancha en dos pasos"), un sub-cop y un CTA dorado. Debajo, una franja de 4 stats (canchas, actividades, años del club, socios). A partir de ahí, scroll por secciones: deportes, actividades, ubicación.

**FORM** — Modo **Operate** (la app hace una tarea, no vende). Layout: 2-3 columnas en desktop que colapsan a 1 en mobile. Densidad media. Un acento de color por vista. Tipografía display con tracking negativo, body a 16px/1.55.

## Color

**Estrategia:** Committed (un color saturado carga ~40% de la superficie, el acento dorado guía la acción).

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#FAF8F4` | Superficie principal (blanco hueso) |
| `--color-surface` | `#FFFFFF` | Cards, modales, inputs |
| `--color-surface-alt` | `#F2EEE6` | Secciones alternadas, hover suave |
| `--color-ink` | `#0E1410` | Texto principal |
| `--color-ink-soft` | `#4B5450` | Texto secundario, labels |
| `--color-ink-muted` | `#7E8784` | Texto terciario, placeholders |
| `--color-line` | `#E5E0D5` | Bordes sutiles, separadores |
| `--color-primary` | `#0F4F3F` | Verde club, fondos, links, navbar |
| `--color-primary-strong` | `#0A3B2F` | Hover/active del primary |
| `--color-primary-soft` | `#E6EFEB` | Tints, badges suaves |
| `--color-accent` | `#E8A33D` | CTA primario (Reservar, Confirmar) |
| `--color-accent-strong` | `#C9821A` | Hover/active del accent |
| `--color-success` | `#0F4F3F` | Estados positivos (verde club) |
| `--color-danger` | `#A82B1F` | Errores, eliminar reserva |
| `--color-warning` | `#B57A11` | Avisos, contraseñas débiles |
| `--color-info` | `#1F4E5F` | Información secundaria |

**Reglas de contraste:**
- Texto sobre `--color-bg`: usar `--color-ink` (≥13:1) o `--color-ink-soft` (≥7:1).
- Texto sobre `--color-primary`: usar `--color-bg` o blanco puro (≥7:1).
- Texto sobre `--color-accent`: usar `--color-ink` (≥5:1) — el dorado no admite texto claro encima.

**Prohibiciones:**
- Texto en gradiente.
- Glass / blur como decoración.
- Borders-left o borders-right de color arriba de 1px.
- Texto secundario gris puro (`#888`): siempre tintar desde el hue del foreground o desde el verde.

## Typography

**Estrategia:** dos familias. Outfit para display/headings (geométrica, con peso, no sobre-usada en interfaces deportivas). Inter para body y UI (legibilidad probada, sistema nativo).

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | `'Outfit', system-ui, sans-serif` | h1, h2, h3, números grandes |
| `--font-body` | `'Inter', system-ui, sans-serif` | body, botones, labels, inputs |
| `--weight-regular` | `400` | Body, párrafos |
| `--weight-medium` | `500` | Labels, nav, sub-headings |
| `--weight-semibold` | `600` | Botones, h3-h4 |
| `--weight-bold` | `700` | h1-h2, números destacados |
| `--tracking-tight` | `-0.04em` | Display, headings |
| `--tracking-normal` | `0` | Body, UI |
| `--tracking-wide` | `0.02em` | Labels pequeñas, eyebrows |

**Escala (rem, mobile-first):**
- `xs`: 0.75rem (12px) — eyebrows, captions
- `sm`: 0.875rem (14px) — labels, helper text
- `base`: 1rem (16px) — body, inputs
- `md`: 1.125rem (18px) — body destacado
- `lg`: 1.25rem (20px) — h4, lead
- `xl`: 1.5rem (24px) — h3
- `2xl`: 2rem (32px) — h2
- `3xl`: 2.75rem (44px) — h1 mobile
- `4xl`: 3.5rem (56px) — h1 desktop
- `5xl`: 4.5rem (72px) — hero display

**Line-height:**
- Display: 1.05–1.1
- Headings: 1.15–1.2
- Body: 1.55
- UI denso (formularios, listas): 1.4

**Prohibiciones:**
- Texto italic para emphasis visual.
- Letter-spacing positivo en headings.
- Texto monoespaciado como "técnico" — solo para código o datos numéricos tabulares.

## Spacing

Escala 4px base.

| Token | Valor |
|---|---|
| `--space-0` | `0` |
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.5rem` (24px) |
| `--space-6` | `2rem` (32px) |
| `--space-7` | `3rem` (48px) |
| `--space-8` | `4rem` (64px) |
| `--space-9` | `6rem` (96px) |
| `--space-10` | `8rem` (128px) |

**Reglas de ritmo:**
- Más espacio arriba del heading que debajo (`--space-5` arriba, `--space-3` debajo).
- Sección a sección: mínimo `--space-7` (48px) en mobile, `--space-8` (64px) en desktop.
- Card padding: `--space-5` (24px) en mobile, `--space-6` (32px) en desktop.
- Container max-width: 1200px con padding lateral `--space-5` mobile, `--space-6` desktop.

## Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `6px` | Tags, badges, inputs pequeños |
| `--radius-md` | `10px` | Inputs, botones |
| `--radius-lg` | `16px` | Cards, modales |
| `--radius-xl` | `24px` | Hero cards, secciones destacadas |
| `--radius-full` | `9999px` | Avatares, pills, FABs |

## Depth (Sombras)

Sombras con offset real, no halos planos.

```css
--shadow-xs: 0 1px 2px rgba(14, 20, 16, 0.04);
--shadow-sm: 0 2px 4px rgba(14, 20, 16, 0.06), 0 1px 2px rgba(14, 20, 16, 0.04);
--shadow-md: 0 6px 16px -4px rgba(14, 20, 16, 0.10), 0 2px 4px rgba(14, 20, 16, 0.05);
--shadow-lg: 0 16px 40px -8px rgba(14, 20, 16, 0.16), 0 4px 8px rgba(14, 20, 16, 0.05);
--shadow-xl: 0 24px 64px -12px rgba(14, 20, 16, 0.22), 0 8px 16px rgba(14, 20, 16, 0.06);
```

## Motion

**Estrategia:** una entrada orquestada, micro-interacciones en CTAs, sin motion por el motion mismo.

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | `120ms` | Hover, focus |
| `--duration-base` | `220ms` | Cambio de estado (modal, dropdown) |
| `--duration-slow` | `420ms` | Entradas, transiciones de página |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default para entradas |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Toggle, swap |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Confirmaciones, toasts (suave rebote) |

**Orquestación de entrada (Home):**
1. Navbar: 0ms
2. Hero título: 80ms
3. Hero subtítulo: 160ms
4. Hero CTA: 240ms
5. Hero stats: 320ms
6. Secciones siguientes: cuando entran en viewport (intersection observer)

**Reglas:**
- Una sola curva ease-out en entradas, no alternar easings.
- Transición por defecto en hover: `--duration-fast --ease-out`.
- `prefers-reduced-motion: reduce` desactiva todas las transiciones de >200ms.

## Layout

- **Grid:** 12 columnas en desktop (>=1024px), 6 columnas en tablet, 4 columnas en mobile. Gutter: `--space-5`.
- **Container:** `max-width: 1200px` centrado.
- **Breakpoints:**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Mobile-first** en todo el CSS.

## Components

### Button

- Altura: 44px (touch target).
- Padding: `0 --space-5`.
- Radius: `--radius-md`.
- Font: `--font-body --weight-semibold` 0.9375rem.
- Estados: default, hover (lift -1px + shadow-md), active (lift 0), focus (ring 2px `--color-accent` con offset 2px), disabled (opacity 0.5).
- Variantes:
  - **Primary**: bg `--color-accent`, color `--color-ink`. CTA principal.
  - **Primary-strong**: bg `--color-primary`, color `--color-bg`.
  - **Ghost**: border 1px `--color-line`, color `--color-ink`, hover bg `--color-surface-alt`.
  - **Danger**: bg `--color-danger`, color blanco.
  - **Link**: sin border, color `--color-primary`, underline en hover.

### Card

- Padding: `--space-5` mobile, `--space-6` desktop.
- Radius: `--radius-lg`.
- Background: `--color-surface`.
- Shadow: `--shadow-sm` default, `--shadow-md` hover.
- Transición: `--duration-base --ease-out` en shadow y transform.
- Hover (cuando es interactiva): `translateY(-2px)` + `--shadow-md`.

### Input

- Altura: 44px.
- Padding: `0 --space-4`.
- Radius: `--radius-md`.
- Border: 1px `--color-line`, focus 2px `--color-primary`.
- Background: `--color-surface`.
- Font: `--font-body` 0.9375rem `--color-ink`.
- Label encima, 0.875rem `--color-ink-soft` `--weight-medium`.
- Helper text debajo, 0.8125rem `--color-ink-muted`.
- Error state: border `--color-danger`, helper text en `--color-danger`.

### Modal

- Overlay: `rgba(14, 20, 16, 0.6)` con `backdrop-filter: blur(4px)`.
- Card: bg `--color-surface`, radius `--radius-lg`, padding `--space-6`, max-width 560px, shadow `--shadow-xl`.
- Entrada: scale 0.96→1 + opacity 0→1 en `--duration-base`.

### Toast

- Posición: bottom-center mobile, top-right desktop.
- Padding: `--space-4 --space-5`.
- Radius: `--radius-md`.
- Success: border-left 3px `--color-primary` (única excepción permitida al "no border-left").
- Error: border-left 3px `--color-danger`.
- Warning: border-left 3px `--color-warning`.

### Navbar

- Top, sticky, `backdrop-filter: blur(12px) saturate(180%)`.
- Background: `rgba(250, 248, 244, 0.85)`.
- Border-bottom: 1px `--color-line`.
- Altura: 64px.
- Container interno: max-width 1200px, padding `--space-4`.
- Logo: "Ranelagh" en `--font-display --weight-bold` 1.25rem tracking-tight, color `--color-ink`.
- Links: `--font-body --weight-medium` 0.9375rem, color `--color-ink-soft`, hover color `--color-ink`.
- CTA: variant Primary-strong, compacto (altura 36px).

### Footer

- Background: `--color-primary` (verde club, cierre fuerte).
- Color de texto: `--color-bg` con 80% de opacidad.
- 4 columnas en desktop (Info / Navegación / Contacto / Mapa), stack en mobile.
- Padding: `--space-8` arriba y abajo.
- Logo arriba en blanco.

## Iconografía

- `bootstrap-icons` (ya cargado vía CDN en `index.html`) para iconos estándar.
- SVG inline para logos, iconos de cancha, ilustraciones puntuales.
- Tamaño default: 20px en UI, 24px en CTAs, 32px+ en features.

## Imagery

- **Fotos reales** del club y de las canchas/actividades (ya en `src/assets/`).
- Optimización: usar formato `.webp` existente, agregar `loading="lazy"` en todas las imágenes debajo del fold.
- Overlay oscuro `rgba(14, 20, 16, 0.4)` sobre fotos con texto encima.
- **No fabricar** fotos: usar solo las que existen en el repo.

## Accessibility

- Mínimo 16px en body.
- Targets táctiles ≥ 44×44 px.
- Contraste de texto ≥ 4.5:1.
- Foco visible con `outline: 2px solid var(--color-accent); outline-offset: 2px`.
- `prefers-reduced-motion: reduce` desactiva motion de >200ms.
- `aria-label` en todos los iconos interactivos sin texto.
- Imágenes con `alt` descriptivo.
- Formularios con `<label>` asociado, no placeholder-only.
