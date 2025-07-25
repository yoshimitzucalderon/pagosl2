import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type');
    console.log('🧪 Headers:', req.headers);
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type debe ser application/json' }, { status: 400 });
    }

    // Leer el body crudo para debug
    const rawBody = await req.text();
    console.log('🧪 Raw body:', rawBody);
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: 'Body no es JSON válido', rawBody }, { status: 400 });
    }

    if (!body.search_term) {
      return NextResponse.json({ error: 'Falta search_term' }, { status: 400 });
    }

    // Lógica original, forzando respuesta sin compresión
    const n8nResponse = await fetch('https://n8n.ycm360.com/webhook/provider-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity', // 👈 Forzar sin compresión
      },
      body: JSON.stringify(body),
    });

    const text = await n8nResponse.text();
    console.log('📥 Texto recibido de n8n:', text);

    if (!n8nResponse.ok) {
      return NextResponse.json({ 
        success: false, 
        message: `n8n error: ${n8nResponse.status}`,
        error: text 
      }, { status: 500 });
    }

    if (!text || text.trim() === '') {
      return NextResponse.json({
        success: true,
        suggestions: [],
        message: 'No se encontraron proveedores similares',
        total_found: 0
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Respuesta inválida de n8n',
        error: e.message
      }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error interno:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 