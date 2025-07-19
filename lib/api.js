// Configuración para tu servidor n8n
const N8N_BASE_URL = 'https://n8n.ycm360.com';
const N8N_AUTH = btoa('admin:admin123'); // Codificación base64 para auth básica

// Función para subir documento a n8n
export async function uploadDocument(file, user) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', new Date().toISOString());
  formData.append('timezone', 'America/Tijuana');
  formData.append('user_id', user?.id || '');
  formData.append('user_email', user?.email || '');
  formData.append('user_role', user?.user_metadata?.role || 'visor');
  formData.append('user_department', user?.user_metadata?.department || 'Administración');
  
  const response = await fetch(`${N8N_BASE_URL}/webhook/upload-document`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${N8N_AUTH}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error en upload: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Función para enviar entrada manual a n8n
export async function submitManualEntry(data, user) {
  const payload = {
    ...data,
    timestamp: new Date().toISOString(),
    timezone: 'America/Tijuana',
    tipo_registro: 'manual',
    user_id: user?.id || '',
    user_email: user?.email || '',
    user_role: user?.user_metadata?.role || 'visor',
    user_department: user?.user_metadata?.department || 'Administración'
  };

  const response = await fetch(`${N8N_BASE_URL}/webhook/manual-entry`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Basic ${N8N_AUTH}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error en entrada manual: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Función para confirmar y guardar datos procesados
export async function confirmAndSave(data, user) {
  const payload = {
    ...data,
    timestamp: new Date().toISOString(),
    timezone: 'America/Tijuana',
    tipo_registro: 'ocr_confirmado',
    user_id: user?.id || '',
    user_email: user?.email || '',
    user_role: user?.user_metadata?.role || 'visor',
    user_department: user?.user_metadata?.department || 'Administración'
  };

  const response = await fetch(`${N8N_BASE_URL}/webhook/confirm-save`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Basic ${N8N_AUTH}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error al confirmar: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Función de prueba de conexión
export async function testConnection() {
  try {
    const response = await fetch(`${N8N_BASE_URL}/webhook/test`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${N8N_AUTH}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error conectando con n8n:', error);
    return false;
  }
}

// Funciones para Supabase
import { supabase } from './supabase.js';

// Obtener pagos recientes del usuario
export async function getRecentPayments(user, limit = 10) {
  const { data, error } = await supabase
    .from('erp_pagado_proceso_l2')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Obtener estadísticas de pagos
export async function getPaymentStats(user) {
  const { data, error } = await supabase
    .from('erp_pagado_proceso_l2')
    .select('pagado_proceso_l2, moneda, created_at')
    .is('deleted_at', null);

  if (error) throw error;

  const stats = {
    total_mxn: 0,
    total_usd: 0,
    count: data?.length || 0,
    this_month: 0,
    last_month: 0
  };

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  data?.forEach(payment => {
    const amount = parseFloat(payment.pagado_proceso_l2) || 0;
    const paymentDate = new Date(payment.created_at);
    
    if (payment.moneda === 'USD') {
      stats.total_usd += amount;
    } else {
      stats.total_mxn += amount;
    }

    if (paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear) {
      stats.this_month += amount;
    }
  });

  return stats;
}

// Verificar duplicados
export async function checkDuplicatePayment(paymentData, user) {
  const { data, error } = await supabase
    .from('erp_pagado_proceso_l2')
    .select('*')
    .eq('proveedor_proceso_l2', paymentData.proveedor_proceso_l2)
    .eq('concepto_proceso_l2', paymentData.concepto_proceso_l2)
    .eq('pagado_proceso_l2', paymentData.pagado_proceso_l2)
    .eq('fecha_de_pago_proceso_l2', paymentData.fecha_de_pago_proceso_l2)
    .is('deleted_at', null)
    .limit(5);

  if (error) throw error;
  return data || [];
}

// Obtener lista de proyectos
export async function getProjectsList() {
  const { data, error } = await supabase
    .from('proyectos_master')
    .select('nombre, descripcion, departamento')
    .eq('activo', true)
    .order('nombre');

  if (error) throw error;
  return data || [];
}

// Obtener proveedores frecuentes
export async function getFrequentProviders(user, limit = 10) {
  const { data, error } = await supabase
    .from('erp_pagado_proceso_l2')
    .select('proveedor_proceso_l2')
    .is('deleted_at', null)
    .not('proveedor_proceso_l2', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  // Obtener valores únicos
  const providers = [...new Set(data?.map(p => p.proveedor_proceso_l2) || [])];
  return providers.slice(0, limit);
}

// Obtener conceptos frecuentes
export async function getFrequentConcepts(user, limit = 10) {
  const { data, error } = await supabase
    .from('erp_pagado_proceso_l2')
    .select('concepto_proceso_l2')
    .is('deleted_at', null)
    .not('concepto_proceso_l2', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  // Obtener valores únicos
  const concepts = [...new Set(data?.map(p => p.concepto_proceso_l2) || [])];
  return concepts.slice(0, limit);
}

// Buscar pagos
export async function searchPayments(query, user, filters = {}) {
  let queryBuilder = supabase
    .from('erp_pagado_proceso_l2')
    .select('*')
    .is('deleted_at', null);

  // Búsqueda por texto
  if (query) {
    queryBuilder = queryBuilder.or(`proveedor_proceso_l2.ilike.%${query}%,concepto_proceso_l2.ilike.%${query}%`);
  }

  // Filtros adicionales
  if (filters.proyecto) {
    queryBuilder = queryBuilder.eq('proyecto', filters.proyecto);
  }
  if (filters.moneda) {
    queryBuilder = queryBuilder.eq('moneda', filters.moneda);
  }
  if (filters.fecha_desde) {
    queryBuilder = queryBuilder.gte('fecha_de_pago_proceso_l2', filters.fecha_desde);
  }
  if (filters.fecha_hasta) {
    queryBuilder = queryBuilder.lte('fecha_de_pago_proceso_l2', filters.fecha_hasta);
  }

  const { data, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
} 