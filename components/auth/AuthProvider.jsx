'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Obtener sesión inicial
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error obteniendo sesión inicial:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          // Redirigir a dashboard después del login
          router.push('/');
        } else if (event === 'SIGNED_OUT') {
          // Redirigir a login después del logout
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            department: userData.department,
            role: userData.role || 'visor'
          }
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
      
      setUser(data.user);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user && !!session;
  };

  // Obtener rol del usuario
  const getUserRole = () => {
    return user?.user_metadata?.role || 'visor';
  };

  // Obtener departamento del usuario
  const getUserDepartment = () => {
    return user?.user_metadata?.department || 'Administración';
  };

  // Verificar permisos
  const checkPermissions = (action) => {
    const role = getUserRole();
    
    switch (action) {
      case 'create':
        return ['administrador', 'editor'].includes(role);
      case 'edit':
        return ['administrador', 'editor'].includes(role);
      case 'delete':
        return role === 'administrador';
      case 'view_all':
        return role === 'administrador';
      case 'export':
        return ['administrador', 'editor'].includes(role);
      default:
        return false;
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    isAuthenticated,
    getUserRole,
    getUserDepartment,
    checkPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 