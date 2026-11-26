# ClubManager como SaaS

**Estado** · Diseño aprobado el 23 de noviembre de 2026.

ClubManager ofrecerá reservas, actividades y gestión de socios como un servicio web para clubes. Cada club tendrá su página, sus canchas, sus horarios y su panel. Ranelagh será el primer club migrado y sus socios conservarán sus cuentas, reservas y enlaces.

## Cómo se incorpora un club

El primer lanzamiento comercial incluye **autoservicio**, según la elección del usuario. La persona responsable inicia sesión o crea una cuenta, verifica su correo, elige el nombre y la URL del club, ve el precio y pasa al sitio del proveedor para contratar. Si vuelve con el pago pendiente, puede consultar el estado o retomar el mismo intento desde ClubManager. Cuando el servidor confirma el primer cobro, la persona puede entrar al panel, configurar el club e incorporar socios. El despliegue de otro club se convierte en un alta de datos.

La propuesta inicial es **un abono mensual por club en Argentina**. El precio, la moneda, la cuenta comercial y el tratamiento de devoluciones quedan por validar antes de publicar la contratación. Mercado Pago Suscripciones es el candidato para el cobro alojado. La documentación describe la creación de una suscripción pendiente con enlace de pago y las notificaciones del ciclo de cobro. La aptitud de la cuenta y el comportamiento del flujo se verifican con una compra de prueba. [Suscripciones con pago pendiente](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-no-associated-plan/pending-payments) · [Compra de prueba](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-test/payment-approval).

## Arquitectura propuesta

| Opción | Implicancia para ClubManager |
|---|---|
| Apps y Supabase compartidos, con aislamiento por club | Una versión para todos y alta inmediata. Las consultas, políticas y relaciones deben respetar el club. La recuperación de un solo club exige exportar y validar sus datos. |
| Apps compartidas y un proyecto Supabase por club | Permite respaldos por club. Requiere automatizar la creación de proyectos, la selección del backend de Auth y las migraciones. |
| Un despliegue completo por club | Aísla el despliegue de cada club. Agrega trabajo de provisión, monitoreo y actualización a cada alta. |

Se propone la primera opción para aprovechar el monolito actual, sus dos apps React y sus operaciones en Postgres. La identidad de Supabase Auth sigue siendo común. La pertenencia a un club y el rol se guardan en una membresía de ese club. [Modelos de aislamiento y recuperación](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data).

### Identidad y datos

- `clubs` tendrá un ID estable, un `slug` único, datos públicos de identidad y contacto, zona horaria y modalidad de alta de socios. `profiles` conserva el ID de Supabase Auth. `club_memberships` relaciona `(club_id, user_id)` con rol `socio` o `admin` y estado activo o suspendido. Una misma cuenta puede administrar un club y ser socia de otro.
- Las canchas, horarios, reservas, actividades, categorías y eventos tendrán `club_id` obligatorio. Las referencias compuestas impedirán asociar una reserva con una cancha o un socio de otro club, y una categoría con una actividad de otro club. El identificador de cada cancha será único dentro de su club. Un club puede ofrecer `tenis-1` y `tenis-2`, y ambos clubes pueden tener una cancha con el mismo identificador. [Claves foráneas compuestas en Postgres](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK).
- Las apps usarán `/clubes/:clubSlug`, cada una en su origen actual. Express resolverá el club en `/clubs/:clubSlug` y las operaciones privadas comprobarán un JWT válido y la membresía vigente. Se preservan los enlaces públicos de Ranelagh. Los alias de API previos son exclusivos de Ranelagh durante el piloto y pasan por los mismos controles. Una URL de club inexistente devuelve 404.
- Los DAO acotarán sus consultas al club de la URL. Las operaciones del usuario usarán su JWT y políticas de seguridad por fila (RLS). Se limitará el cliente privilegiado a operaciones internas justificadas. Los permisos de tablas y RPC se declaran junto con RLS. El catálogo público muestra el perfil, las canchas y las actividades publicadas del club. La disponibilidad pública muestra horas ocupadas sin datos de socios. El padrón y los eventos privados se consultan con permiso del club. [RLS de Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Permisos de la Data API](https://supabase.com/docs/guides/api/securing-your-api).
- Ranelagh conserva su alta abierta de socios. El ensayo comprueba cómo se confirma hoy el correo en el entorno y qué requiere el nuevo flujo. Los clubes nuevos empiezan con alta por invitación, configurable desde su panel. El administrador registra el correo y comparte el enlace de registro del club. La invitación se acepta con la cuenta verificada de ese correo y habilita el rol socio del club elegido. Un administrador modifica el padrón de su club. La persona titular gestiona su contraseña y su perfil global.

### Canchas y reservas

El panel permite configurar nombre, contacto, logo o foto provista por el club, canchas y horarios semanales. La marca de Ranelagh usa sus recursos actuales. Si un club publica sin foto, la UI usa su nombre y el estilo base.

La grilla utiliza horarios y duraciones de la cancha. El piloto usa pasos de 30 minutos y la zona IANA `America/Argentina/Buenos_Aires`. Ranelagh conserva las duraciones de 60, 90 y 120 minutos y sus horarios actuales, incluido el cierre a medianoche. El servidor valida el horario y deriva el día local a partir de los instantes guardados. Postgres conserva `reservations_no_overlap` para rechazar reservas solapadas de la misma cancha y permitir turnos consecutivos. Un socio ve y cancela sus propias reservas. El administrador gestiona las de su club. Se conserva el dato de reserva permanente y se verifica su comportamiento actual durante el ensayo.

### Contratación y vigencia

- El alta crea en una transacción un club pendiente, la membresía administradora de su responsable y su registro de contratación. El correo verificado y el ID de la sesión identifican al responsable. El servidor fija importe y moneda desde su oferta, y registra una referencia única antes de llamar al proveedor. Un único intento de checkout abierto por club evita carreras por doble clic. Se propone reservar la URL del borrador durante siete días. Si se inició un checkout, el plazo se extiende hasta confirmar que terminó sin cargo. Un aviso tardío se vincula a la contratación original por ID. Si el club ya había expirado, soporte revisa el cargo.
- El retorno del comprador muestra el estado guardado por la API. El servidor valida la notificación, consulta al proveedor y coteja la suscripción, el pago, el importe, la moneda, la cuenta receptora y el ambiente. El primer pago confirmado publica el club y habilita el panel. La autorización de débitos futuros tiene su propio estado. Se guardan notificaciones y pagos de forma idempotente, y se reconcilian las operaciones que quedaron pendientes. [Webhooks de Suscripciones](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/notifications/webhooks) · [Glosario de Suscripciones](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/resources/glossary).
- La persona titular de la contratación puede ver el estado y pedir la baja desde el panel. La propuesta mantiene la vigencia hasta el fin del período abonado. Al vencer, los miembros y el personal conservan la consulta según sus permisos y pueden cancelar reservas futuras dentro de esos permisos. El titular conserva el acceso a contratación. La confirmación de una renovación amplía la vigencia con el período conciliado. Ranelagh queda habilitado por su condición de club migrado.
- Si el titular pierde acceso o deja el club, soporte puede transferir la contratación a un administrador vigente del mismo club tras verificar identidad y autorización. La operación registra quién la realizó y conserva el historial de cobros.

## Hitos y criterio de salida

1. **Proteger el servicio actual.** Completar los controles administrativos en Express y revisar los permisos, el trigger de alta y las RPC heredadas. Tener pruebas reproducibles del stack actual. En el repositorio, `IsAdmin.requireAdmin` existe pero los routers montados no lo usan, y parte de los DAO opera con el cliente privilegiado. El despliegue real queda por contrastar.
2. **Probar dos clubes.** Migrar una copia controlada de la estructura de Ranelagh y preparar un club sintético con dos canchas del mismo deporte. Demostrar que un administrador de A solo gestiona A, que una persona con dos membresías ve el club correcto y que registros y reservas existentes conservan identidad y acceso. Verificar el catálogo, el panel, la sesión y las reservas en ambos clubes. Probar el corte con cronómetro y acordar la ventana que admite Ranelagh antes de migrar el entorno activo.
3. **Abrir la contratación.** Ejecutar una compra de prueba de punta a punta, incluidos abandono del checkout, pago pendiente, confirmación duplicada, renovación y baja. Habilitar la contratación comercial después del ensayo de migración, la confirmación de condiciones comerciales y la verificación del proveedor en su entorno de prueba.

Dominios personalizados, cobro de cuotas de socios, planes múltiples, otros mercados y cobro por turno quedan para ampliaciones posteriores. La autorización de este turno cubre este diseño y el plan. Una implementación, una migración en un entorno externo y cualquier ajuste de Supabase, hosting o Mercado Pago siguen su autorización aplicable.
