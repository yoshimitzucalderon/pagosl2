# 🔧 Configuración del Workflow de n8n para Sugerencias de Proveedores

## 📋 Requisitos Previos

1. **Instancia de n8n funcionando** en `https://n8n.ycm360.com`
2. **Credenciales de Supabase** configuradas en n8n
3. **Acceso a la tabla** `erp_proveedor_alta_de_proveedor`

## 🚀 Pasos de Configuración

### 1. Importar el Workflow

1. Abrir n8n en tu navegador
2. Ir a **Workflows** → **Import from file**
3. Seleccionar el archivo `provider-suggestions.json`
4. Hacer clic en **Import**

### 2. Configurar Credenciales de Supabase

1. En el nodo **Supabase Query**, hacer clic en **Add Credential**
2. Seleccionar **Supabase API**
3. Configurar:
   - **URL**: `https://bmcscxzddfyttjdudkeh.supabase.co`
   - **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY3NjeHpkZGZ5dHRqZHVka2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTU1NTYsImV4cCI6MjA2NjA3MTU1Nn0.Lk55d_BURUc9VXvpQIAJtZeGr9S2nQSi51PYerIbgmI`

### 3. Verificar Configuración de Nodos

#### Nodo: Webhook
- **Path**: `provider-suggestions`
- **HTTP Method**: `POST`
- **Response Mode**: `responseNode`

#### Nodo: Validate Input
- **JavaScript Code**: Ya configurado
- Valida que el término de búsqueda tenga al menos 2 caracteres

#### Nodo: Supabase Query
- **Operation**: `getAll`
- **Table**: `erp_proveedor_alta_de_proveedor`
- **Limit**: `10`
- **Query**: `proveedor.ilike.%{{ $json.search_term }}%`

#### Nodo: AI Processing
- **JavaScript Code**: Ya configurado
- Calcula similitud y filtra resultados

#### Nodo: Response
- **Respond With**: `json`
- **Response Body**: `={{ $json }}`

### 4. Activar el Workflow

1. Hacer clic en **Save** para guardar la configuración
2. Hacer clic en **Activate** para activar el workflow
3. Copiar la URL del webhook que aparece en el nodo Webhook

## 🧪 Probar el Workflow

### Usando el Script de Prueba
```bash
node test-provider-suggestions.js "Microsoft"
```

### Usando curl
```bash
curl -X POST https://n8n.ycm360.com/webhook/provider-suggestions \
  -H "Content-Type: application/json" \
  -d '{"search_term": "Microsoft", "max_results": 3}'
```

### Usando Postman
- **Method**: POST
- **URL**: `https://n8n.ycm360.com/webhook/provider-suggestions`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "search_term": "Microsoft",
  "max_results": 3
}
```

## 📊 Respuesta Esperada

### Respuesta Exitosa
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "123",
      "proveedor": "Microsoft Corporation",
      "confidence": 0.95
    },
    {
      "id": "456",
      "proveedor": "Microsoft Azure",
      "confidence": 0.85
    }
  ],
  "search_term": "microsoft",
  "total_found": 2
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Search term must be at least 2 characters"
}
```

## 🔍 Monitoreo y Debugging

### Logs del Workflow
1. En n8n, ir a **Executions**
2. Buscar ejecuciones del workflow
3. Hacer clic en una ejecución para ver los logs

### Métricas Importantes
- **Tiempo de respuesta**: Debe ser < 5 segundos
- **Tasa de éxito**: Debe ser > 95%
- **Número de sugerencias**: Promedio por búsqueda

### Errores Comunes

#### Error: "Table not found"
- Verificar nombre de la tabla en Supabase
- Comprobar permisos de acceso

#### Error: "Invalid credentials"
- Verificar credenciales de Supabase
- Comprobar que la API key sea válida

#### Error: "Webhook not found"
- Verificar que el workflow esté activo
- Comprobar la URL del webhook

## 🛠️ Personalización

### Cambiar Número de Resultados
En el nodo **Supabase Query**:
- Cambiar **Limit** de `10` a `20`

### Cambiar Umbral de Similitud
En el nodo **AI Processing**:
```javascript
.filter(item => item.confidence > 0.5) // Cambiar de 0.3 a 0.5
```

### Agregar Más Campos
En el nodo **AI Processing**:
```javascript
const suggestions = providers
  .map(provider => ({
    id: provider.id,
    proveedor: provider.proveedor,
    // Agregar más campos
    categoria: provider.categoria,
    confidence: calculateSimilarity(searchTerm, provider.proveedor)
  }))
```

## 🔒 Seguridad

### Rate Limiting
Considerar agregar rate limiting para evitar spam:
- Máximo 10 requests por minuto por IP
- Bloquear IPs que excedan el límite

### Validación de Entrada
El workflow ya incluye validación básica:
- Mínimo 2 caracteres
- Sanitización de entrada
- Límite de resultados

### Logs de Auditoría
Considerar agregar logging para auditoría:
- IP del cliente
- Término de búsqueda
- Timestamp
- Resultado

## 📞 Soporte

Para problemas con el workflow:
1. Revisar logs en n8n
2. Verificar conectividad con Supabase
3. Probar con el script de prueba
4. Revisar esta documentación

---

**¡El workflow está listo para usar! 🎉** 