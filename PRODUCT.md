# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Socios del club** que reservan canchas con frecuencia (varias veces por semana). Valoran velocidad, ver sus reservas y re-reservar rápido sin fricción.
- **Familias con chicos en actividades** (fútbol infantil, gimnasia, patín, functional) que consultan la grilla de actividades, horarios y datos del club.
- Ambos perfiles conviven en la misma app: el socio frecuente necesita densidad y atajos, la familia necesita claridad y pedagogía visual.

## Product Purpose

Club Manager es el sistema de autogestión del **Club Ranelagh** (Ranelagh, Gran Buenos Aires). Permite a los socios:

- Registrarse y mantener su cuenta (datos personales, contraseña).
- Ver la grilla de actividades del club (infantiles y adultos).
- Reservar canchas de fútbol, paddle, squash y paleta en franjas horarias.
- Ver y cancelar sus propias reservas.
- Contactar al club por WhatsApp y redes sociales.

El objetivo es **reemplazar la gestión manual** (planilla, llamados, WhatsApp) por una experiencia digital que el socio use por iniciativa propia, varias veces por semana.

## Positioning

Un sistema **propio del club** (no un SaaS genérico): la identidad visual, las canchas, los horarios y las actividades están modeladas a la medida del Club Ranelagh, no a un multi-tenant. La app es el canal directo socio ↔ club, sin intermediarios.

## Operating Context

- **Dispositivo primario**: web responsive. La mayoría de los socios abre la app desde el celular antes o después de entrenar.
- **Momento de uso típico**: socio parado en el club o camino al club, mirando disponibilidad en 30-60 segundos.
- **Idiomas**: español (Argentina). Textos en rioplatense ("sumate", "reservá", "registrarme").
- **Zona horaria**: America/Argentina/Buenos_Aires.
- **Pago**: la app no procesa pagos (todavía); las reservas se confirman sin cargo.

## Capabilities and Constraints

### Capacidades confirmadas
- Registro de socios (email + datos personales + contraseña con requisitos).
- Login con JWT.
- Reserva de canchas con fecha + hora de inicio + hora de fin.
- Vista semanal de disponibilidad por cancha.
- Cancelación de reservas propias.
- Edición de datos de cuenta y cambio de contraseña.
- Reserva "permanente" (reservas fijas recurrentes) marcada visualmente.
- Notificaciones toast de éxito/error.
- Mapa del club en el footer.

### Restricciones técnicas confirmadas
- Stack cliente: React 18 + Vite + React Router 6 + Zustand + react-hook-form.
- Stack servidor: ver `server/` (no se modifica en este redesign).
- API REST: ver `useUserAPI`, `useCourtAPI`, `useReservesAPI` en `client/src/hooks/`.
- Calendario: actualmente `react-date-time-picker-popup`. El rediseño lo reemplaza por un picker nativo más limpio.
- 4 canchas: `futbol`, `paddle`, `squash`, `paleta`.

### Decisiones de producto abiertas
- Estilo visual: **a definir en DESIGN.md** (no hay branding previo; propongo uno).
- Mobile-first vs. desktop-first: el rediseño apunta a **mobile-first** porque el uso real es desde el celular.
- Pagos/cuota: fuera de scope.
- Notificaciones push: fuera de scope.

## Brand Commitments

- **Nombre del club**: "Club Ranelagh" (o "Ranelagh Club" según contexto).
- **Tono de voz**: cercano, deportivo, argentino. Nada corporativo-frío. Mensajes cortos y claros.
- **Idioma**: español rioplatense.
- **Logo**: no existe como asset. Se propone logo tipográfico + marca isotipo en DESIGN.md.
- **Colores de marca**: no definidos. Se proponen en DESIGN.md.
- **Restricción vinculante**: el club es real y existe, no se inventan testimonios, direcciones o números que no estén en el código o que el usuario no confirme.

## Evidence on Hand

- **Actividades existentes** (en `src/assets/home/`): fútbol infantil, gimnasia, patín, functional.
- **Canchas** (en `src/assets/{football,paddle,squash,paleta}/`): imágenes reales de cada cancha.
- **Dirección física**: Av. Dr. A. Sabin 1751, B1886 Gran Buenos Aires, Provincia de Buenos Aires (en `Footer.jsx`).
- **Teléfono/WhatsApp**: +54 9 11 3838-6877.
- **Redes**: Instagram `@ranelagh.club`, Facebook (perfil 100064211970969).
- **Horarios visibles**: el club abre todos los días menos domingo; la grilla muestra 7 días × 14 franjas.
- **Inactivos / sin evidencia**: testimonios de socios, fotos de eventos, estadísticas de uso, planes de cuota. **No fabricar.**

## Product Principles

1. **El socio es recurrente, no visitante.** Optimizar para la segunda, tercera y décima reserva — el socio ya sabe qué quiere; la app debe llevarlo en dos clics.
2. **La cancha y el horario son el centro.** Toda la información secundaria (perfil, contacto, actividades) orbita alrededor de poder reservar más rápido.
3. **Movimiento real = contexto real.** El socio usa la app parado en el club o camino a él; la UI debe ser legible bajo sol, sin scroll horizontal, sin letras pequeñas.
4. **Calma visual, no decoración.** Inspirarse en apps como Playtomic, Eversports y Alquila Tu Cancha: superficies limpias, tipografía fuerte, una sola acción primaria por pantalla.
5. **El club manda.** La identidad visual debe sentirse del Club Ranelagh, no de un SaaS genérico. Esto se construye con paleta, tipografía, fotografía real y microcopy, no con un logo pegado encima.

## Accessibility & Inclusion

- **WCAG 2.1 AA mínimo**: contraste de texto ≥ 4.5:1 en cuerpo, ≥ 3:1 en tipografía grande; foco visible en todos los interactivos; navegación por teclado completa.
- **Mobile-first**: targets táctiles ≥ 44×44 px.
- **Lectura clara**: tipografía mínima 16px en cuerpo, interlineado generoso, sin bloques de texto densos.
- **Iconos con etiqueta**: todo icono interactivo debe tener `aria-label` o texto visible adyacente.
- **Mensajes de error**: en español, específicos ("La contraseña debe tener una mayúscula y un número"), nunca genéricos.
