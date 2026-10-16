# 🦞 Configurar Supabase para Langosta Hub

Sigue estos pasos para activar autenticación real y persistencia de datos.

## 1. Crear proyecto

1. Ve a [supabase.com](https://supabase.com) e inicia sesión.
2. **New project** → elige nombre (ej. `langosta-hub`), región cercana, contraseña de DB.
3. Espera a que el proyecto esté listo (1–2 minutos).

## 2. Ejecutar el schema

1. En el dashboard: **SQL Editor** → **New query**.
2. Copia todo el contenido de `supabase/schema.sql`.
3. Pega y pulsa **Run**.
4. Debe mostrar “Success”.

Esto crea:
- `profiles` (usuarios)
- `agents` (agentes IA vinculados)
- `installed_skills`
- `purchases`
- Políticas RLS (cada usuario solo ve lo suyo)
- Trigger que crea el perfil automáticamente al registrarse

## 3. Configurar Auth URLs

1. Ve a **Authentication** → **URL Configuration**.
2. **Site URL**:  
   - Producción: `https://langosta-hub.vercel.app`  
   - Local: `http://localhost:3000`
3. **Redirect URLs** (añade ambas):
   ```
   https://langosta-hub.vercel.app/auth/callback
   https://langosta-hub.vercel.app/auth/confirm
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/confirm
   ```

## 4. Variables de entorno

### En Vercel
1. Project → **Settings** → **Environment Variables**.
2. Añade:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Project Settings → API → service_role (solo server) |

3. Redeploy el proyecto.

### En local
```bash
cp .env.example .env.local
# Edita .env.local con tus valores
npm run dev
```

## 5. Verificar

1. Abre la web.
2. Ve a **Registro / Login**.
3. Crea una cuenta.
4. En Supabase → **Authentication** → **Users** deberías ver el nuevo usuario.
5. En **Table Editor** → `profiles` debe existir una fila con ese usuario.

## 6. (Opcional) Email confirmation

Por defecto Supabase puede exigir confirmación de email.
- Para desarrollo: **Authentication** → **Providers** → Email → desactiva “Confirm email”.
- En producción: déjalo activado y configura un SMTP personalizado si quieres.

## Seguridad

- Las políticas RLS garantizan que un usuario **solo** lee/escribe sus propios datos.
- `SUPABASE_SERVICE_ROLE_KEY` **nunca** debe exponerse al navegador.
- Las API keys de agentes se pueden guardar en `agents.api_key` (considera cifrarlas en un futuro).

## Fallback

Si las variables de Supabase **no** están definidas, la app sigue funcionando con el modo local (localStorage + in-memory). Ideal para demos rápidas sin cuenta de Supabase.
