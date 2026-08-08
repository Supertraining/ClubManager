# Frontend admin — Supabase edition

Esta carpeta contiene los archivos del `admin/` que cambian al migrar a Supabase.

## Archivos modificados / nuevos

| Archivo | Cambio | Acción |
|---|---|---|
| `src/lib/supabaseClient.js` | **Nuevo**. Singleton con storage key separado del client | Copiar |
| `src/stores/user/user.Store.js` | Mantiene la API actual. Auth via Supabase + chequeo de `role = 'admin'` | Reemplazar |
| `src/hooks/useUserAPI.js` | Login con `supabase.auth.signInWithPassword`. Resto contra Express con JWT de Supabase | Reemplazar |

## Cómo se aplica la autorización de admin

Hay dos capas de defensa:

1. **En el cliente** (`useUserAPI.userLogin`): después de `signInWithPassword`, chequea `data.user.role === 'admin'`. Si no, cierra sesión inmediatamente y avisa al operador.

2. **En el backend** (`migracion/03_backend/src/middlewares/isAuthenticated.js`): el middleware `requireAdmin` valida que el JWT tenga `isAdmin: true` (que viene de `profiles.role` en Supabase). Si no, devuelve 403.

3. **En la DB** (`migracion/01_database/02_rls.sql`): las políticas RLS en cada tabla dicen "admin puede hacer X, socio solo puede hacer Y". Si el frontend intenta saltarse el middleware del backend, la DB lo rechaza igual.

Esto es redundante a propósito. La defensa en profundidad es la idea detrás de Supabase RLS.

## Verificación

```bash
npm install @supabase/supabase-js
npm run build
```

El build tiene que pasar. Para probarlo necesitás un proyecto Supabase real y un usuario con `role = 'admin'` en la tabla `profiles` (usá `select public.promote_to_admin('tu@email');` en el SQL Editor).

## Si algo no funciona

1. **"Invalid API key"**
   - Verificá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `admin/.env`
   - Reiniciá el dev server
2. **Login funciona pero todas las requests devuelven 403**
   - El usuario no es admin. Corré `select public.promote_to_admin('tu@email');`
3. **Login funciona pero se cierra sesión sola**
   - El `signInWithPassword` devolvió OK pero el chequeo de `role === 'admin'` falló
   - Verificá en el dashboard de Supabase que el profile del usuario tenga `role = 'admin'`
