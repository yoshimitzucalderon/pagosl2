import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🪄 Proxy: Recibida petición para sugerencias de proveedores');
    
    // Obtener el cuerpo de la petición
    const body = await request.json();
    console.log('📤 Datos recibidos:', body);
    
    // Validar que tengamos los datos necesarios
    if (!body.search_term || body.search_term.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      }, { status: 400 });
    }
    
         // Hacer la petición al webhook de n8n (usando la misma configuración que funcionó)
     console.log('🌐 Enviando petición a n8n...');
     const n8nResponse = await fetch('https://n8n.ycm360.com/webhook/provider-suggestions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'User-Agent': 'Test-Script/1.0'
       },
       body: JSON.stringify({
         search_term: body.search_term.trim(),
         max_results: body.max_results || 3
       })
     });
    
         console.log('📊 Status de n8n:', n8nResponse.status);
     console.log('📊 Status Text:', n8nResponse.statusText);
     console.log('📊 OK:', n8nResponse.ok);
     console.log('📊 Headers de n8n:', Object.fromEntries(n8nResponse.headers.entries()));
    
    if (!n8nResponse.ok) {
      console.error('❌ Error de n8n:', n8nResponse.status, n8nResponse.statusText);
      return NextResponse.json({
        success: false,
        message: `Error del servidor n8n: ${n8nResponse.status} ${n8nResponse.statusText}`
      }, { status: n8nResponse.status });
    }
    
    // Leer la respuesta de n8n
    const responseText = await n8nResponse.text();
    console.log('📥 Respuesta de n8n:', responseText);
    console.log('📊 Longitud:', responseText.length);
    
    if (!responseText || responseText.trim() === '') {
      console.error('❌ Respuesta vacía de n8n');
      return NextResponse.json({
        success: false,
        message: 'El servidor n8n no devolvió ninguna respuesta'
      }, { status: 500 });
    }
    
    // Parsear la respuesta JSON
    try {
      const result = JSON.parse(responseText);
      console.log('✅ Respuesta parseada correctamente:', result);
      
      // Devolver la respuesta al cliente
      return NextResponse.json(result);
      
    } catch (parseError) {
      console.error('❌ Error parseando JSON de n8n:', parseError);
      console.error('❌ Respuesta problemática:', responseText);
      
      return NextResponse.json({
        success: false,
        message: 'Error procesando la respuesta del servidor',
        error: 'Invalid JSON response'
      }, { status: 500 });
    }
    
     } catch (error) {
     console.error('💥 Error en el proxy:', error);
     console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
     
     return NextResponse.json({
       success: false,
       message: 'Error interno del servidor',
       error: error instanceof Error ? error.message : 'Unknown error',
       details: error instanceof Error ? error.stack : undefined
     }, { status: 500 });
   }
} 