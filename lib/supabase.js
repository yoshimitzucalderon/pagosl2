import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Helper para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Helper para obtener la sesión actual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Helper para obtener el rol del usuario
export const getUserRole = (user) => {
  return user?.user_metadata?.role || 'visor'
}

// Helper para obtener el departamento del usuario
export const getUserDepartment = (user) => {
  return user?.user_metadata?.department || 'Administración'
}

// Helper para verificar permisos
export const checkPermissions = (user, action) => {
  const role = getUserRole(user)
  
  switch (action) {
    case 'create':
      return ['administrador', 'editor'].includes(role)
    case 'edit':
      return ['administrador', 'editor'].includes(role)
    case 'delete':
      return role === 'administrador'
    case 'view_all':
      return role === 'administrador'
    case 'export':
      return ['administrador', 'editor'].includes(role)
    default:
      return false
  }
} 