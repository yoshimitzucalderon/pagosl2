# Sistema de Pagos

Landing page para registrar pagos en efectivo, conectada con Supabase y n8n para automatizaci�n de procesos.

--- 

## ?? Instrucciones de instalaci�n

1. **Clona este repositorio**

```bash
git clone https://github.com/yoshimitzucalderon/pagosl2.git
cd pagosl2
```

2. **Instala dependencias**

```bash
npm install
```

3. **Copia el archivo `.env.example` a `.env`**

```bash
cp .env.example .env
```

> Luego, edita `.env` con tus claves reales de Supabase, n8n y NextAuth.

4. **Ejecuta en modo desarrollo**

```bash
npm run dev
```

--- 

## ?? Variables de entorno

Todas las variables necesarias est�n en `.env.example`.
Aseg�rate de configurar al menos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_N8N_BASE_URL`
- `NEXT_PUBLIC_N8N_AUTH_USER` y `NEXT_PUBLIC_N8N_AUTH_PASSWORD`

--- 

## ??? Tecnolog�as usadas

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [n8n](https://n8n.io/)
- TailwindCSS

--- 

## ?? Seguridad

**Nunca subas el archivo `.env` al repositorio.**
Est� en `.gitignore` para evitar exponer datos sensibles.
- - -  
 