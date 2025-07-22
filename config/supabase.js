import { createClient } from '@supabase/supabase-js';

// 🔄 REEMPLAZA CON TUS DATOS REALES DE SUPABASE
const supabaseUrl = 'https://TU-PROYECTO.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Tu ANON KEY

export const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ URLs REALES DE TU N8N (YCM360)
export const n8nEndpoints = {
  processDocument: 'https://n8n.ycm360.com/webhook/process-document',
  confirmSave: 'https://n8n.ycm360.com/webhook/confirm-save',
  manualEntry: 'https://n8n.ycm360.com/webhook/manual-entry'
};

// Función para subir documento
export const uploadDocument = async (file, userEmail = 'usuario@ycm360.com', userId = '1') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_email', userEmail);
  formData.append('user_id', userId);

  try {
    console.log('📤 Enviando documento a:', n8nEndpoints.processDocument);
    
    const response = await fetch(n8nEndpoints.processDocument, {
      method: 'POST',
      body: formData
    });

    console.log('📡 Respuesta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Documento procesado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    throw error;
  }
};

// Función para confirmar guardado
export const confirmSave = async (paymentData) => {
  try {
    console.log('💾 Guardando pago:', paymentData);
    console.log('📤 Enviando a:', n8nEndpoints.confirmSave);

    const response = await fetch(n8nEndpoints.confirmSave, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...paymentData,
        user_email: 'usuario@ycm360.com', // 🔄 Cambia por el usuario real
        user_id: '1'
      })
    });

    console.log('📡 Respuesta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Pago guardado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('❌ Error confirming save:', error);
    throw error;
  }
};

// Función para entrada manual
export const manualEntry = async (paymentData) => {
  try {
    console.log('✍️ Creando entrada manual:', paymentData);
    console.log('📤 Enviando a:', n8nEndpoints.manualEntry);

    const response = await fetch(n8nEndpoints.manualEntry, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    console.log('📡 Respuesta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Entrada manual exitosa:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in manual entry:', error);
    throw error;
  }
};

// Función para obtener pagos desde Supabase
export const fetchPayments = async (filters = {}) => {
  try {
    console.log('📊 Obteniendo pagos con filtros:', filters);

    let query = supabase
      .from('erp_pagado_proceso_l2')
      .select('*')
      .order('fecha_de_pago_proceso_l2', { ascending: false });

    // Aplicar filtros
    if (filters.dateFrom) {
      query = query.gte('fecha_de_pago_proceso_l2', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('fecha_de_pago_proceso_l2', filters.dateTo);
    }
    if (filters.proveedor) {
      query = query.ilike('proveedor_proceso_l2', `%${filters.proveedor}%`);
    }
    if (filters.proyecto) {
      query = query.ilike('proyecto', `%${filters.proyecto}%`);
    }
    if (filters.minAmount) {
      query = query.gte('pagado_proceso_l2', filters.minAmount);
    }
    if (filters.maxAmount) {
      query = query.lte('pagado_proceso_l2', filters.maxAmount);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching payments:', error);
      throw error;
    }

    console.log(`✅ Obtenidos ${data?.length || 0} pagos desde Supabase`);
    return data || [];
  } catch (error) {
    console.error('❌ Error en fetchPayments:', error);
    throw error;
  }
};

// Función de prueba de conectividad
export const testConnections = async () => {
  console.log('🧪 Probando conexiones del sistema...');
  
  try {
    // Probar Supabase
    console.log('🔍 Probando conexión a Supabase...');
    const { data, error } = await supabase
      .from('erp_pagado_proceso_l2')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Error en Supabase:', error);
      throw error;
    }
    console.log('✅ Supabase conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a Supabase:', error.message);
  }

  // Mostrar endpoints de n8n
  console.log('🔗 Endpoints de n8n configurados:');
  console.log('📄 Process Document:', n8nEndpoints.processDocument);
  console.log('💾 Confirm Save:', n8nEndpoints.confirmSave);
  console.log('✍️ Manual Entry:', n8nEndpoints.manualEntry);

  // Probar endpoint básico
  try {
    console.log('🧪 Probando conectividad de n8n...');
    const response = await fetch(n8nEndpoints.manualEntry, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: true,
        proveedor_proceso_l2: 'TEST',
        concepto_proceso_l2: 'Prueba de conectividad',
        pagado_proceso_l2: 1,
        fecha_de_pago_proceso_l2: '2025-01-21'
      })
    });

    if (response.ok) {
      console.log('✅ n8n responde correctamente');
    } else {
      console.log('⚠️ n8n responde con error HTTP:', response.status);
    }
  } catch (error) {
    console.error('❌ Error probando n8n:', error.message);
  }
}; 