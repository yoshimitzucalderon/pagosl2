// Script de debug para verificar Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - usando las mismas variables que la aplicación
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bmcscxzddfyttjdudkeh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY3NjeHpkZGZ5dHRqZHVka2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTU1NTYsImV4cCI6MjA2NjA3MTU1Nn0.Lk55d_BURUc9VXvpQIAJtZeGr9S2nQSi51PYerIbgmI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSupabase() {
  console.log('🔍 Iniciando debug de Supabase...');
  console.log('🔗 URL:', supabaseUrl);
  console.log('🔑 Key configurada:', !!supabaseKey);

  try {
    // 1. Verificar conexión básica
    console.log('\n1️⃣ Probando conexión básica...');
    const { data: testData, error: testError } = await supabase
      .from('erp_proyectos')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    }

    console.log('✅ Conexión exitosa');
    console.log('📊 Datos de prueba:', testData);

    // 2. Verificar estructura de la tabla
    console.log('\n2️⃣ Verificando estructura de la tabla erp_proyectos...');
    const { data: structureData, error: structureError } = await supabase
      .from('erp_proyectos')
      .select('*');

    if (structureError) {
      console.error('❌ Error obteniendo estructura:', structureError);
      return;
    }

    console.log('📊 Total de registros:', structureData.length);
    console.log('📊 Primer registro:', structureData[0]);
    console.log('📊 Campos disponibles:', Object.keys(structureData[0] || {}));

    // 3. Verificar si existe la columna 'proyecto'
    console.log('\n3️⃣ Verificando columna "proyecto"...');
    if (structureData.length > 0) {
      const firstRecord = structureData[0];
      console.log('📊 ¿Existe columna "proyecto"?', 'proyecto' in firstRecord);
      console.log('📊 Valor de "proyecto":', firstRecord.proyecto);
    }

    // 4. Obtener solo la columna proyecto
    console.log('\n4️⃣ Obteniendo solo columna "proyecto"...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('erp_proyectos')
      .select('proyecto')
      .order('proyecto');

    if (projectsError) {
      console.error('❌ Error obteniendo proyectos:', projectsError);
      return;
    }

    console.log('📊 Proyectos obtenidos:', projectsData);
    console.log('📊 Número de proyectos:', projectsData.length);

    // 5. Listar todos los proyectos
    if (projectsData.length > 0) {
      console.log('\n5️⃣ Lista de proyectos:');
      projectsData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.proyecto}`);
      });
    } else {
      console.log('\n⚠️ No se encontraron proyectos en la tabla');
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el debug
debugSupabase(); 