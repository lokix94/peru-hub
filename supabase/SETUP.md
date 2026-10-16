# 🦞 Configurar Supabase + Admin para Langosta Hub

## Panel de administración (`/admin`)

Ya existe un panel en **https://langosta-hub.vercel.app/admin**

### Acceso por contraseña

1. En Vercel → Project → **Settings** → **Environment Variables**
2. Añade:

| Name | Value |
|------|-------|
| `ADMIN_PASSWORD` | *una clave fuerte que solo tú conozcas* |

3. Redeploy.

4. Entra a `/admin` e introduce esa contraseña.

**Desarrollo local (sin env):** la clave demo es `langosta2026!admin`  
**Producción:** si no defines `ADMIN_PASSWORD`, el login admin se rechaza (más seguro).

---

## Roles en base de datos (Supabase)

Además del login por contraseña de `/admin`, el schema incluye `profiles.role`:

- `user` (por defecto)
- `admin`

### Promover tu cuenta a admin en SQL

1. Regístrate en la web con tu email.
2. En Supabase → **SQL Editor**:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'tu-email@ejemplo.com';
```

3. Cierra sesión y vuelve a entrar.

Los usuarios con `role = 'admin'` pueden ver listados globales (políticas RLS).

---

## 1. Crear proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión.
2. **New project** → nombre, región, contraseña de DB.
3. Espera a que esté listo.

## 2. Ejecutar el schema

1. **SQL Editor** → **New query**.
2. Copia todo `supabase/schema.sql`.
3. **Run** → debe decir Success.

Crea: `profiles` (con `role` y `balance`), `agents`, `installed_skills`, `purchases`, RLS y triggers.

## 3. Configurar Auth URLs

**Authentication** → **URL Configuration**

- **Site URL:** `https://langosta-hub.vercel.app` (o localhost en dev)
- **Redirect URLs:**
  ```
  https://langosta-hub.vercel.app/auth/callback
  https://langosta-hub.vercel.app/auth/confirm
  http://localhost:3000/auth/callback
  http://localhost:3000/auth/confirm
  ```

## 4. Variables de entorno (Vercel + local)

| Name | Notas |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (solo servidor) |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` |

Local:
```bash
cp .env.example .env.local
# edita los valores
npm run dev
```

## 5. Verificar

1. Registro / login en la web.
2. Supabase → Authentication → Users.
3. Table Editor → `profiles`.
4. `/admin` con tu `ADMIN_PASSWORD`.

## Seguridad

- Nunca subas `.env.local` al repo.
- Cambia `ADMIN_PASSWORD` a algo fuerte en producción.
- `SUPABASE_SERVICE_ROLE_KEY` no debe llegar al navegador.
- Los usuarios no pueden auto-promoverse a `admin` (política RLS).
