// Script para insertar proyectos de ejemplo en Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://bmcscxzddfyttjdudkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY3NjeHpkZGZ5dHRqZHVka2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTU1NTYsImV4cCI6MjA2NjA3MTU1Nn0.Lk55d_BURUc9VXvpQIAJtZeGr9S2nQSi51PYerIbgmI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Proyectos de ejemplo
const sampleProjects = [
  { proyecto: 'General' },
  { proyecto: 'Everett' },
  { proyecto: 'Nueva la Tierra' },
  { proyecto: 'Showroom EV/NLT' },
  { proyecto: 'A1' },
  { proyecto: 'A2' },
  { proyecto: 'Oficina' },
  { proyecto: 'Arboreta' },
  { proyecto: 'Otros' }
];

async function insertProjects() {
  console.log('🚀 Iniciando inserción de proyectos...');
  console.log('📊 Proyectos a insertar:', sampleProjects.map(p => p.proyecto));

  try {
    // Insertar proyectos
    const { data, error } = await supabase
      .from('erp_proyectos')
      .insert(sampleProjects);

    if (error) {
      console.error('❌ Error insertando proyectos:', error);
      return;
    }

    console.log('✅ Proyectos insertados exitosamente');
    console.log('📊 Datos insertados:', data);

    // Verificar que se insertaron correctamente
    console.log('\n🔍 Verificando inserción...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('erp_proyectos')
      .select('proyecto')
      .order('proyecto');

    if (verifyError) {
      console.error('❌ Error verificando inserción:', verifyError);
      return;
    }

    console.log('✅ Verificación exitosa');
    console.log('📊 Proyectos en la base de datos:');
    verifyData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.proyecto}`);
    });

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar la inserción
insertProjects(); 