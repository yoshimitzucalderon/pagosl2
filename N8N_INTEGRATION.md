# Integración con n8n - Sistema de Pagos L2

## Resumen del Flujo Completo

Este sistema conecta tu frontend con n8n para procesar documentos de pago de forma automática:

### Flujo de Trabajo
1. **Upload de archivo** → UploadForm envía archivo a n8n
2. **Procesamiento OCR** → n8n extrae datos con GPT-4O
3. **Detección RAG** → n8n identifica proyecto automáticamente
4. **Revisión manual** → Frontend muestra datos para editar
5. **Guardado** → n8n confirma y guarda en Supabase
6. **Notificación** → Telegram recibe notificación automática

## Configuración Implementada

### 1. Servicio n8n (`app/services/n8nService.ts`)
- ✅ Clase `N8NService` para comunicación con webhooks
- ✅ Hook `useN8NService` para componentes React
- ✅ Manejo de errores y estados de carga
- ✅ Validación de conectividad

### 2. Componente UploadForm Actualizado (`components/UploadForm.jsx`)
- ✅ Integración con servicio n8n
- ✅ Barra de progreso en tiempo real
- ✅ Manejo de errores mejorado
- ✅ Validación de archivos
- ✅ Drag & drop interface

### 3. Componente Create Actualizado (`app/components/apps/invoice/Add-invoice/create.tsx`)
- ✅ Integración con n8n para guardado
- ✅ Detección automática de proyectos (RAG)
- ✅ Alertas informativas
- ✅ Estados de carga y error

## Endpoints de n8n Utilizados

### POST `/webhook/process-document`
Procesa archivos con OCR y detección RAG
```javascript
// Parámetros enviados
{
  file: File,
  user_email: string,
  user_id: string
}

// Respuesta esperada
{
  success: boolean,
  processing_type: 'image' | 'document',
  proveedor_proceso_l2: string,
  concepto_proceso_l2: string,
  pagado_proceso_l2: number,
  fecha_de_pago_proceso_l2: string,
  moneda: string,
  proyecto: string,
  nota_proceso_l2: string,
  rag_detection?: {
    original_mention: string,
    detected_project: string,
    confidence_score: number,
    method: string,
    version: string
  }
}
```

### POST `/webhook/confirm-save`
Guarda datos procesados por OCR
```javascript
// Parámetros enviados
{
  fechaPago: string,
  proveedor: string,
  concepto: string,
  moneda: string,
  importe: number,
  notas: string,
  proyecto: string,
  userId: string,
  userEmail: string,
  processingType: 'ocr_processed',
  ocrData: object,
  ragDetection: object,
  timestamp: string
}
```

### POST `/webhook/manual-entry`
Guarda datos de entrada manual
```javascript
// Parámetros enviados
{
  fechaPago: string,
  proveedor: string,
  concepto: string,
  moneda: string,
  importe: number,
  notas: string,
  proyecto: string,
  userId: string,
  userEmail: string,
  processingType: 'manual_entry',
  timestamp: string
}
```

## Variables de Entorno Configuradas

```env
# URL base de n8n
NEXT_PUBLIC_N8N_BASE_URL=https://n8n.ycm360.com

# Webhooks específicos
NEXT_PUBLIC_N8N_WEBHOOK_PROCESS_DOCUMENT=/webhook/process-document
NEXT_PUBLIC_N8N_WEBHOOK_CONFIRM_SAVE=/webhook/confirm-save
NEXT_PUBLIC_N8N_WEBHOOK_MANUAL_ENTRY=/webhook/manual-entry
```

## Características Implementadas

### ✅ Validación de Archivos
- Tipos soportados: JPEG, PNG, WebP, GIF, BMP, TIFF, HEIC, AVIF, SVG, ICO, WebM, PDF
- Tamaño máximo: 25MB
- Validación en tiempo real

### ✅ Drag & Drop Interface
- Interfaz intuitiva para subir archivos
- Feedback visual durante el drag
- Manejo de errores de archivo

### ✅ Barra de Progreso
- Progreso en tiempo real del procesamiento
- Mensajes informativos por etapa
- Estados de carga y error

### ✅ Manejo de Errores
- Errores de red y servidor
- Errores de validación de archivo
- Mensajes de error informativos

### ✅ Detección Inteligente de Proyectos
- Integración con sistema RAG
- Detección automática de proyectos
- Puntuación de confianza

### ✅ Integración con Autenticación
- Obtiene datos del usuario desde localStorage
- Envía información de usuario a n8n
- Trazabilidad de operaciones

### ✅ Notificaciones en Tiempo Real
- Alertas de éxito y error
- Información de detección RAG
- Estados de procesamiento

## Uso del Sistema

### 1. Carga Automática
```javascript
// El usuario arrastra un archivo
// UploadForm envía a n8n automáticamente
// n8n procesa con OCR y RAG
// Los datos se muestran en el formulario para revisión
```

### 2. Carga Manual
```javascript
// El usuario ingresa datos manualmente
// Se envían directamente a n8n para guardado
// n8n guarda en Supabase y envía notificación
```

### 3. Guardado
```javascript
// Los datos se envían a n8n
// n8n valida y guarda en Supabase
// Se envía notificación a Telegram
// Se redirige al usuario a la lista
```

## Próximos Pasos

1. **Configurar n8n** con los webhooks correspondientes
2. **Probar la integración** con archivos de prueba
3. **Configurar notificaciones** de Telegram
4. **Optimizar el procesamiento** según necesidades
5. **Implementar logging** para debugging

## Troubleshooting

### Error de Conexión
- Verificar que n8n esté corriendo en la URL configurada
- Revisar variables de entorno
- Verificar firewall y CORS

### Error de Procesamiento
- Revisar logs de n8n
- Verificar formato de archivo
- Comprobar tamaño del archivo

### Error de Guardado
- Verificar conexión con Supabase
- Revisar permisos de base de datos
- Verificar formato de datos enviados 