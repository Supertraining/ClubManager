# Frontend client — Supabase edition

Esta carpeta contiene los archivos del `client/` que cambian al migrar a Supabase.

## Archivos modificados / nuevos

| Archivo | Cambio | Acción |
|---|---|---|
| `src/lib/supabaseClient.js` | **Nuevo**. Singleton del cliente Supabase con persistencia | Copiar |
| `src/stores/user/User.Store.js` | Mantiene la API actual (`user`, `loading`, `error`, `setUser`, `ACTIONS`). Auth state viene de `supabase.auth.onAuthStateChange` | Reemplazar |
| `src/hooks/useUserAPI.js` | `userLogin` usa `supabase.auth.signInWithPassword`. Resto va al backend Express con el JWT de Supabase | Reemplazar |
| `src/hooks/useCourtAPI.js` | Misma API, ahora con `Authorization: Bearer <jwt-de-supabase>` | Reemplazar |
| `src/hooks/useReservesAPI.js` | Misma API, `createReserve` ahora va al RPC `create_reservation` que tiene el EXCLUDE constraint | Reemplazar |

## Archivos que podés borrar (cuando todo funcione)

- `src/hooks/useAxiosInstance.js` — ya no se usa
- `src/hooks/useFetch.js` — los hooks específicos (`useUserAPI`, `useCourtAPI`, `useReservesAPI`) hacen sus propios fetch

## Cambios en `client/.env`

Agregá:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_BACKEND_URL=http://localhost:8080
```

`VITE_BACKEND_URL` apunta a tu server Express, que sigue existiendo (es la capa que habla con Supabase en nombre del frontend con `service_role`).

## Lo que NO cambia

- Los componentes (`pages/`, `components/`, etc.) — siguen leyendo de `userStore` y los hooks igual que antes
- El sistema de rutas
- El sistema de estilos
- El build (`npm run build` sigue funcionando)

## Verificación

```bash
# Instalar la nueva dep
npm install @supabase/supabase-js

# Build
npm run build
```

El build tiene que pasar sin errores.

## Si algo no funciona

1. **"Invalid API key" o "supabase is not configured"**
   - Verificá que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén en `client/.env`
   - Reiniciá el dev server después de cambiar variables de entorno
2. **Login queda en loading infinito**
   - Abrí la consola del browser y mirá los errores de red
   - Si ves CORS errors, agregá el origen del client a las settings de Supabase
3. **"permission denied" al hacer una reserva**
   - El JWT no se está enviando correctamente
   - Verificá en el backend que `verifyAccessToken` esté usando el header correcto
