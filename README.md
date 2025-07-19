# Sistema de Gestión de Pagos - ERP L2 Full Stack

Sistema completo de gestión de pagos integrado con la tabla `erp_pagado_proceso_l2` de tu ERP, combinando autenticación robusta, procesamiento inteligente con n8n y base de datos Supabase.

## 🔐 Características de Seguridad

### Autenticación Multi-Capa
- **Supabase Auth**: Email/password con sesiones JWT
- **Middleware Next.js**: Protección automática de rutas
- **RLS (Row Level Security)**: Filtrado de datos por usuario en DB
- **Auditoría Completa**: Tracking automático con created_by/updated_by

### Control de Acceso
- Rutas protegidas: `/` (dashboard), `/dashboard/*`
- Rutas públicas: `/login`, `/register`, `/auth/callback`
- Auto-redirect a login si no autenticado
- Soft delete con deleted_at/deleted_by

## 🏗️ Arquitectura Híbrida con ERP L2

### Servidores Configurados
- **n8n**: https://n8n.ycm360.com (procesamiento + notificaciones)
- **Supabase**: https://bmcscxzddfyttjdudkeh.supabase.co (auth + DB)
- **Tabla Principal**: `public.erp_pagado_proceso_l2` (26 columnas)
- **Zona horaria**: America/Tijuana (configurada automáticamente)

### Estructura de la Tabla ERP L2
```sql
erp_pagado_proceso_l2 (26 columnas):

-- Campos Principales (Obligatorios)
├── id (uuid, PK)
├── proveedor_proceso_l2 (text, NOT NULL)      # Proveedor principal
├── concepto_proceso_l2 (text, NOT NULL)       # Concepto del pago
├── pagado_proceso_l2 (numeric 30,4, NOT NULL) # Monto principal
└── fecha_de_pago_proceso_l2 (date, NOT NULL)  # Fecha de pago

-- Campos Adicionales (Opcionales)
├── concepto (text)                            # Concepto adicional
├── moneda (text)                              # MXN/USD
├── pagado_con_iva_mn (numeric 30,4)          # Pago MXN con IVA
├── forma_de_pago_mn (text)                    # Forma pago MXN
├── fecha_de_pago_mn (date)                    # Fecha pago MXN
├── pagado_con_iva_usd (numeric 30,4)         # Pago USD con IVA
├── forma_de_pago_usd (text)                   # Forma pago USD
├── fecha_de_pago_usd (date)                   # Fecha pago USD
├── tc_pagado (numeric 30,10)                  # Tipo de cambio
├── link_anexos (text)                         # URLs de anexos
├── proyecto (text)                            # Proyecto asignado
├── proveedor (text)                           # Proveedor adicional
├── cc_no (text)                               # Centro de costo
├── no_contrato_ot_odc (text)                  # Núm. contrato/OT/ODC
└── contrato_id_logico (uuid)                  # ID lógico contrato

-- Auditoría Automática (Ya configurada)
├── created_at (timestamp, America/Tijuana)
├── created_by (uuid, auth.uid())
├── deleted_at (timestamp, soft delete)
├── deleted_by (uuid)
├── updated_at (timestamp, America/Tijuana)
└── updated_by (uuid, auth.uid())
```

### Flujo de Datos Completo
```
Usuario → Login → Supabase Auth → JWT Token
    ↓
Dashboard (protegido) ←→ erp_pagado_proceso_l2 (RLS por usuario)
    ↓
n8n (procesamiento + user context + notificaciones)
    ↓
erp_pagado_proceso_l2 (escrituras con auditoría + triggers)
```

## 🚪 Flujo de Autenticación

### Primer Acceso
1. Usuario accede a `/` → Middleware detecta no auth → Redirect `/login`
2. Usuario completa LoginForm → Supabase Auth valida
3. JWT token generado → Redirect a dashboard con datos de ERP L2
4. Usuario accede a funcionalidades con auditoría automática

### Operaciones Auditadas
- Todos los inserts automáticamente incluyen `created_by = auth.uid()`
- Todos los updates automáticamente incluyen `updated_by = auth.uid()`
- Timestamps automáticos en zona horaria America/Tijuana
- Soft delete con `deleted_at` y `deleted_by`

## ✨ Características Avanzadas con ERP L2

### 💰 Manejo Multi-Moneda
- Soporte completo MXN y USD
- Campos separados: `pagado_proceso_l2`, `pagado_con_iva_mn`, `pagado_con_iva_usd`
- Tipo de cambio automático en `tc_pagado`
- Estadísticas separadas por moneda

### 📊 Dashboard Empresarial
- Estadísticas por moneda: MXN vs USD
- Filtros por proyecto, proveedor, centro de costo
- Historial completo con soft delete
- Auditoría de quién modificó qué y cuándo

### 🔍 Autocompletado Inteligente
- Proveedores frecuentes de `proveedor_proceso_l2` y `proveedor`
- Proyectos activos de `proyecto`
- Conceptos más utilizados de `concepto_proceso_l2`
- Centros de costo de `cc_no`

### 📄 OCR Avanzado para ERP
- Extracción automática a campos específicos de ERP L2
- Mapeo inteligente: firmante → `proveedor_proceso_l2`
- Detección de moneda → `moneda`
- Links de anexos → `link_anexos`

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```
**Incluye**: Supabase Auth, Multi-moneda, Validaciones ERP

### 2. Configuración Preconfigurada
El archivo `.env.local` ya incluye:
- URLs de n8n y Supabase específicas
- Credenciales de tu servidor
- Configuración de timezone America/Tijuana

### 3. La tabla `erp_pagado_proceso_l2` ya existe con:
- ✅ Estructura completa de 26 columnas
- ✅ Auditoría automática configurada
- ✅ Timezone America/Tijuana
- ✅ Soft delete implementado

### 4. Configurar RLS (una sola vez)
```sql
-- Habilitar RLS en tabla existente
ALTER TABLE erp_pagado_proceso_l2 ENABLE ROW LEVEL SECURITY;

-- Política: ver registros activos
CREATE POLICY "Users can view active records" ON erp_pagado_proceso_l2
  FOR SELECT USING (deleted_at IS NULL);

-- Política: insertar con autenticación
CREATE POLICY "Authenticated users can insert" ON erp_pagado_proceso_l2
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: actualizar propios registros
CREATE POLICY "Users can update own records" ON erp_pagado_proceso_l2
  FOR UPDATE USING (auth.uid() = created_by);
```

### 5. Ejecutar
```bash
npm run dev
```
**Resultado**: http://localhost:3000 → Login → Dashboard ERP L2

## 🔧 Webhooks n8n para ERP L2

### 1. `/webhook/process-document` - OCR a ERP L2
```javascript
// Recibe: archivo + user context
// Procesa: OCR con GPT-4 Vision + mapeo a campos ERP L2
// Responde: JSON con estructura de erp_pagado_proceso_l2
{
  "proveedor_proceso_l2": "ACME Corp",
  "concepto_proceso_l2": "Servicios de consultoría",
  "pagado_proceso_l2": 15000.00,
  "fecha_de_pago_proceso_l2": "2025-01-15",
  "concepto": "Consultoría técnica Q1 2025",
  "moneda": "MXN",
  "proyecto": "Proyecto Alpha",
  "tc_pagado": 18.50,
  "processed_by": "user@empresa.com"
}
```

### 2. `/webhook/confirm-save` - Guardar en ERP L2
```javascript
// Recibe: datos confirmados + user context
// Guarda: En erp_pagado_proceso_l2 con auditoría completa
// Trigger: Notificaciones con detalles ERP
// Log: Auditoría automática con created_by/updated_by
```

### 3. `/webhook/manual-entry` - Entrada manual ERP L2
```javascript
// Recibe: formulario completo + user context
// Guarda: Todos los campos de erp_pagado_proceso_l2
// Trigger: Notificaciones empresariales
// Incluye: Proyecto, centro de costo, contrato, etc.
```

## 💾 Funcionalidades Frontend ERP L2

### Dashboard Empresarial
- ✅ **Estadísticas MXN vs USD** separadas
- ✅ **Filtros avanzados** por proyecto, proveedor, moneda
- ✅ **Historial completo** con soft delete
- ✅ **Auditoría visual** de quién hizo qué

### Formularios Inteligentes
- ✅ **Campos organizados** por categorías (básicos, MXN, USD, adicionales)
- ✅ **Validaciones empresariales** (montos, fechas, contratos)
- ✅ **Autocompletado ERP** basado en datos históricos
- ✅ **Multi-moneda** con conversión automática

### Búsqueda y Filtros
- ✅ **Búsqueda global** en concepto_proceso_l2 y concepto
- ✅ **Filtros por proyecto** y centro de costo
- ✅ **Rango de fechas** y montos
- ✅ **Exportación** de reportes

## 🔄 Ventajas del Sistema ERP L2

### ⚡ Integración Nativa
- Tabla existente sin migración
- Auditoría automática ya configurada
- Timezone America/Tijuana preconfigurado
- Soft delete implementado

### 🎯 Funcionalidad Empresarial
- Multi-moneda con conversiones
- Proyectos y centros de costo
- Contratos y órdenes de trabajo
- Links a anexos y documentos

### 📱 Notificaciones Contextuales
- Incluyen proyecto y centro de costo
- Información completa del proveedor
- Montos en moneda original
- Links a documentos adjuntos

### 🛡️ Compliance Empresarial
- Auditoría completa de cambios
- Trazabilidad de quién procesó qué
- Soft delete para cumplimiento
- Backup automático de modificaciones

## 🎉 Resultado Final

Un sistema ERP L2 completo que ofrece:
- **Integración nativa** con tabla existente `erp_pagado_proceso_l2`
- **Autenticación empresarial** con auditoría completa
- **Multi-moneda** (MXN/USD) con conversiones
- **Dashboard ejecutivo** con métricas por proyecto
- **OCR inteligente** mapeado a campos ERP
- **Notificaciones contextuales** con información completa
- **Compliance total** con auditoría y soft delete

### Stack Tecnológico ERP
- **Frontend**: Next.js 14 + Tailwind CSS + Middleware
- **Autenticación**: Supabase Auth + JWT + RLS
- **Base de datos**: erp_pagado_proceso_l2 (26 columnas)
- **Auditoría**: Automática con created_by/updated_by
- **Procesamiento**: n8n workflows + OCR
- **Multi-moneda**: MXN/USD + tipo de cambio
- **Notificaciones**: WhatsApp/Telegram contextuales

## 📁 Estructura del Proyecto

```
sistema-pagos-landing/
├── app/
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   ├── login/page.js
│   ├── register/page.js
│   └── auth/callback/route.js
├── components/
│   ├── auth/
│   │   ├── AuthProvider.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Header.jsx
│   ├── OptionSelector.jsx
│   ├── UploadForm.jsx
│   ├── ManualForm.jsx
│   ├── ConfirmationForm.jsx
│   ├── PaymentHistory.jsx
│   ├── StatsWidget.jsx
│   └── StatusMessage.jsx
├── lib/
│   ├── api.js
│   ├── supabase.js
│   └── validations.js
├── utils/
│   ├── formatters.js
│   └── constants.js
├── package.json
├── next.config.js
├── tailwind.config.js
├── middleware.js
└── README.md
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno
```bash
# n8n Configuration
NEXT_PUBLIC_N8N_BASE_URL=https://n8n.ycm360.com
NEXT_PUBLIC_N8N_AUTH_USER=admin
NEXT_PUBLIC_N8N_AUTH_PASSWORD=admin123

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bmcscxzddfyttjdudkeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_NAME=Sistema de Pagos
NEXT_PUBLIC_TIMEZONE=America/Tijuana
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### Scripts Disponibles
```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting del código
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema ERP L2:
- **Email**: soporte@empresa.com
- **Documentación**: [Wiki interno]
- **Issues**: [GitHub Issues]

---

**Desarrollado con ❤️ para optimizar la gestión de pagos empresariales** 