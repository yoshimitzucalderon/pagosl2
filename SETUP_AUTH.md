# Configuración de Autenticación con Supabase

## Pasos para configurar la autenticación:

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Configurar autenticación en Supabase
1. Ve a Authentication > Settings en tu dashboard de Supabase
2. Habilita Email auth
3. Configura las URLs de redirección:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Configurar políticas de seguridad (opcional)
En Supabase, ve a Authentication > Policies y configura las políticas necesarias para tu aplicación.

## Funcionalidades implementadas:

✅ **Registro de usuarios** - Formulario completo con validaciones
✅ **Inicio de sesión** - Autenticación con email y contraseña
✅ **Recuperación de contraseña** - Envío de email de recuperación
✅ **Protección de rutas** - Redirección automática según estado de autenticación
✅ **Cerrar sesión** - Función completa de logout
✅ **Persistencia de sesión** - La sesión se mantiene al recargar la página
✅ **Dashboard protegido** - Solo usuarios autenticados pueden acceder

## Flujo de autenticación:

1. **Usuario no autenticado** → Redirigido a `/auth/signin`
2. **Registro exitoso** → Redirigido automáticamente a `/dashboard`
3. **Login exitoso** → Redirigido automáticamente a `/dashboard`
4. **Usuario autenticado** → Acceso directo al dashboard
5. **Cerrar sesión** → Redirigido a `/auth/signin`

## Archivos principales:

- `app/context/AuthContext.tsx` - Contexto de autenticación
- `app/components/auth/ProtectedRoute.tsx` - Componente de protección de rutas
- `app/auth/signin/page.tsx` - Página de inicio de sesión
- `app/auth/signup/page.tsx` - Página de registro
- `app/auth/forgot-password/page.tsx` - Página de recuperación de contraseña
- `app/dashboard/page.tsx` - Dashboard protegido
- `app/components/layout/DashboardLayout.tsx` - Layout del dashboard
- `app/components/sidebar/Header.tsx` - Header con información del usuario 