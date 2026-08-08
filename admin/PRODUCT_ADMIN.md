# Admin Product Context

> Companion to `/PRODUCT.md` (covers the `client/` app). This file
> captures the durable product truth for the **`admin/`** panel —
> the back-office used by Club Ranelagh staff.

## Platform

web

## Users

- **Administradores del club** (1–3 personas). Operan la app a diario: crean canchas, actividades, gestionan usuarios, limpian historial de reservas. Son los que más tiempo pasan dentro.
- **Operador de mesa** (1 persona). Persona en la entrada del club que crea usuarios en el momento y resuelve problemas de reservas. Usa la app desde una tablet/computadora en la mesa de entrada.
- No abierto a socios.

## Product Purpose

El back-office del Club Ranelagh. Permite al personal:

- Iniciar sesión con credenciales de administrador.
- Crear, listar, editar y eliminar **canchas** (fútbol, paddle, squash, paleta).
- Crear, listar, editar y eliminar **actividades** (fútbol infantil, gimnasia, patín, functional).
- Crear, listar, editar y eliminar **eventos** del club.
- Gestionar **usuarios** socios (ver, editar, eliminar; ver sus reservas; cancelarles reservas).
- Limpiar el **historial de reservas** eliminadas o pasadas.
- Cerrar sesión.

Es la contracara operativa de la app pública `client/`: lo que el socio hace en su teléfono, el personal lo gestiona desde esta consola.

## Positioning

- **Uso interno, no SaaS**: este panel es solo para el club. No hay login público, no hay landing, no hay "registrarme".
- **Velocidad operativa**: el operador de mesa crea un socio en menos de 30 segundos. Cada acción tiene feedback inmediato (toast + refresh de la lista).
- **Densidad alta, pero no dashboard saturado**: el admin necesita ver mucha info en una pantalla (tabla con 50+ usuarios, formulario con 8+ campos), pero sin caer en el "dashboard de métricas" que confunde.

## Operating Context

- **Dispositivo primario**: desktop o tablet en orientación landscape. Móvil existe pero es secundario (emergencias).
- **Idioma**: español rioplatense.
- **Pantalla típica**: el operador de mesa tiene la app abierta todo el día. Las pantallas no se "cierran", se cambia entre secciones.
- **Sesión persistente**: checkbox "Recordarme" — si el operador está en la PC del club, no quiere re-loggear cada mañana.
- **Concurrencia**: rara vez más de 1–2 personas operando al mismo tiempo. No hay UX de "tiempo real" tipo Google Docs.

## Capabilities and Constraints

### Capacidades confirmadas
- Login con JWT y rol `admin`.
- CRUD completo de canchas, actividades, eventos.
- Listar todos los usuarios y ver/editar/eliminar individualmente.
- Ver las reservas de cada usuario y cancelarlas.
- Eliminar el historial completo de reservas.
- Cerrar sesión.

### Restricciones técnicas confirmadas
- Stack: React 18 + Vite + React Router 6 + Zustand + react-hook-form + react-toastify.
- Persistencia: el store de usuario combina `localStorage` y `sessionStorage` (toggle vía checkbox "Recordarme").
- Calendar: `react-full-year-scheduler` para vista anual, `react-datepicker` para fechas puntuales.
- Backend: ver `server/`. Esta redesign **no toca la API**.

### Decisiones de producto abiertas
- **No crear landings, ni CTAs de "registrarme"**: el público es solo staff.
- **Densidad de UI**: alta en tablas y formularios; baja en empty states.
- **Mobile**: el panel no está optimizado para mobile-first, pero no rompe en mobile.

## Brand Commitments

- **Nombre**: "Club Ranelagh" + sufijo "Admin" en el logo de la app.
- **Tono de voz**: directo, profesional, sin florituras. Es un panel de operaciones, no una tienda online.
- **Idioma**: español rioplatense.
- **Sin testimonios ni marketing**: el admin no vende nada.

## Evidence on Hand

- Toda la evidencia (dirección, teléfono, redes) está en `/PRODUCT.md` (compartida con `client/`).

## Product Principles

1. **Una pantalla, una tarea principal.** Cada ruta resuelve una operación clara: listar, crear, editar, eliminar. Sin wizards.
2. **Tablas densas, formularios anchos.** Los datos del club son la materia prima; la UI los pone a la vista sin ornamento.
3. **Operación rápida > estética.** El operador de mesa crea usuarios todo el día. Cada campo y cada botón está donde la mano lo espera.
4. **Confirmaciones explícitas para lo destructivo.** Eliminar usuario, eliminar cancha, borrar historial — todo con doble confirmación y consecuencias visibles.
5. **Calma operativa.** Un solo accent (el dorado) reservado para "acción primaria". El verde del club como color de marca, no de acción.

## Accessibility & Inclusion

- WCAG 2.1 AA mínimo (mismo piso que `client/`).
- Foco visible en todo interactivo.
- Tablas navegables por teclado.
- Mensajes de error específicos en español.
