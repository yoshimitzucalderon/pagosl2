// Script para verificar y solucionar políticas RLS en Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://bmcscxzddfyttjdudkeh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY3NjeHpkZGZ5dHRqZHVka2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0OTU1NTYsImV4cCI6MjA2NjA3MTU1Nn0.Lk55d_BURUc9VXvpQIAJtZeGr9S2nQSi51PYerIbgmI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLSPolicies() {
  console.log('🔍 Verificando políticas RLS para erp_proyectos...');

  try {
    // 1. Verificar si RLS está habilitado
    console.log('\n1️⃣ Verificando estado de RLS...');
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('get_table_rls_status', { table_name: 'erp_proyectos' });

    if (rlsError) {
      console.log('⚠️ No se pudo verificar RLS directamente, continuando...');
    } else {
      console.log('📊 Estado RLS:', rlsData);
    }

    // 2. Intentar consulta con autenticación
    console.log('\n2️⃣ Probando consulta autenticada...');
    const { data: authData, error: authError } = await supabase
      .from('erp_proyectos')
      .select('proyecto')
      .order('proyecto');

    if (authError) {
      console.error('❌ Error con consulta autenticada:', authError);
    } else {
      console.log('✅ Consulta autenticada exitosa');
      console.log('📊 Proyectos encontrados:', authData.length);
      if (authData.length > 0) {
        console.log('📋 Lista de proyectos:');
        authData.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.proyecto}`);
        });
      }
    }

    // 3. Verificar políticas existentes
    console.log('\n3️⃣ Verificando políticas existentes...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'erp_proyectos');

    if (policiesError) {
      console.log('⚠️ No se pudieron verificar políticas directamente');
    } else {
      console.log('📊 Políticas encontradas:', policies.length);
      policies.forEach((policy, index) => {
        console.log(`   ${index + 1}. ${policy.policyname} - ${policy.cmd}`);
      });
    }

    // 4. Solución temporal: Crear política de acceso público
    console.log('\n4️⃣ Creando política de acceso público...');
    
    // SQL para crear política de acceso público
    const createPolicySQL = `
      CREATE POLICY "Allow public read access" ON "public"."erp_proyectos"
      FOR SELECT USING (true);
    `;

    const { data: policyResult, error: policyError } = await supabase
      .rpc('exec_sql', { sql: createPolicySQL });

    if (policyError) {
      console.log('⚠️ No se pudo crear política automáticamente');
      console.log('💡 Solución manual:');
      console.log('   1. Ve al dashboard de Supabase');
      console.log('   2. Navega a Authentication > Policies');
      console.log('   3. Selecciona la tabla "erp_proyectos"');
      console.log('   4. Crea una política con:');
      console.log('      - Name: "Allow public read access"');
      console.log('      - Operation: SELECT');
      console.log('      - Target roles: public');
      console.log('      - Using expression: true');
    } else {
      console.log('✅ Política creada exitosamente');
    }

    // 5. Verificar nuevamente después de crear política
    console.log('\n5️⃣ Verificando acceso después de crear política...');
    const { data: finalData, error: finalError } = await supabase
      .from('erp_proyectos')
      .select('proyecto')
      .order('proyecto');

    if (finalError) {
      console.error('❌ Error final:', finalError);
    } else {
      console.log('✅ Acceso verificado');
      console.log('📊 Proyectos encontrados:', finalData.length);
      if (finalData.length > 0) {
        console.log('📋 Lista final de proyectos:');
        finalData.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.proyecto}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
checkRLSPolicies(); 