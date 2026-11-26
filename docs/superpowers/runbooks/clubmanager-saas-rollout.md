# Preparación del lanzamiento de ClubManager

## Ensayo local de contratación

Arrancá un entorno descartable de PostgreSQL, Supabase Auth y PostgREST. Aplicá los SQL base y las migraciones en orden. Usá cuentas sintéticas y el padrón de ensayo previsto en el fixture del servidor. Para habilitar la simulación en una ejecución local, el proceso Express debe tener `NODE_ENV=test` o `NODE_ENV=dev`, `BILLING_LOCAL_SIMULATION=1` y una URL de Supabase en loopback. Express solo habilita la oferta ante solicitudes recibidas por loopback.

En el portal, abrí `/contratar`. Registrá o autenticá una cuenta con correo verificado. Guardá un club y recargá para recuperar el borrador. Prepará el pago de prueba y simulá el primer cargo. A partir de ahí el portal queda visible en `/clubes/<slug>`. El botón **Abrir panel de administración** usa `VITE_ADMIN_URL` para llevar al titular al inicio de sesión de ese club. Configurá el origen del panel al compilar la app del socio y usá la misma cuenta con la que creaste el club. Simulá una renovación y verificá la cobertura en `/clubes/<slug>/facturacion` en el panel. Después pedí y confirmá la baja. El club continúa operativo hasta el fin de la cobertura.

El test SQL `server/test/sql/billing.test.sql` usa los perfiles del fixture del ensayo. Incluye contrato ajeno, borrador idempotente y oculto, reintento de checkout, cargo duplicado, renovación y vencimiento. Ejecutalo después de aplicar las migraciones en el entorno descartable.

## Ensayo de Mercado Pago

- Confirmar aplicación de prueba, cuenta receptora, precio, moneda y política sobre devoluciones.
- Verificar el enlace de suscripción pendiente, la correlación exacta entre la referencia interna y el ID de la suscripción, y la recuperación de una creación con respuesta incierta. [API de creación](https://www.mercadopago.com.ar/developers/es/reference/online-payments/subscriptions/create-preapproval/post) · [API de búsqueda](https://www.mercadopago.com.ar/developers/es/reference/online-payments/subscriptions/search-preapproval/get).
- Validar el webhook firmado y consultar los recursos del proveedor para confirmar titular, importe, moneda, ambiente y el período que cubre cada cargo. Probar duplicados, avisos fuera de orden, primer pago, renovación, rechazo y cancelación. [Webhooks](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/notifications/webhooks).

## Corte de Ranelagh

- Contrastar el esquema, el padrón administrativo, tareas programadas y consumidores de rutas anteriores con el entorno de destino.
- Ensayar respaldo, restauración y migración en una copia aislada. Registrar reconciliación de recuentos, IDs y reservas antes de habilitar escrituras.
- Acordar una ventana que contemple Auth y otras escrituras concurrentes. Verificar enlaces, sesiones y datos de Ranelagh con la nueva API.
- Si ya existe información de varios clubes, usar una versión de recuperación compatible con el esquema multiclub y pausar nuevas contrataciones durante el incidente.
- Aplicar cambios de configuración externa con las aprobaciones específicas de `AGENTS.md`. Confirmar la compra de prueba y el corte antes de abrir la oferta.
