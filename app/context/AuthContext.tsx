"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Tipos
interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

// Crear cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar sesión al cargar
  useEffect(() => {
    console.log('🔗 AuthContext: Iniciando verificación de sesión');
    console.log('🔗 AuthContext: Supabase URL:', supabaseUrl);
    console.log('🔗 AuthContext: Supabase Key:', supabaseAnonKey ? 'Configurada' : 'NO CONFIGURADA');
    
    const checkUser = async () => {
      try {
        console.log('🔍 AuthContext: Verificando sesión actual...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔍 AuthContext: Resultado de getSession:', { session: !!session, error });
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ AuthContext: Usuario encontrado en sesión:', session.user.email);
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
          };
          setUser(userData);
        } else {
          console.log('❌ AuthContext: No hay sesión activa');
        }
      } catch (error) {
        console.error('Error in checkUser:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthContext: Evento detectado:', event);
        console.log('🔄 AuthContext: Session:', session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ AuthContext: Usuario firmado');
          console.log('📍 AuthContext: URL actual:', window.location.href);
          
          const userData: User = {
            id: session.user.id,
            email: session.user.email!,
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
          };
          
          console.log('👤 AuthContext: Estableciendo usuario:', userData);
          setUser(userData);
          console.log('✅ AuthContext: Usuario establecido en estado');
          // NO redirigir automáticamente - dejar que el usuario decida
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 AuthContext: Usuario cerrado');
          setUser(null);
          // NO redirigir automáticamente
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  // Función de inicio de sesión
  const signIn = async (email: string, password: string) => {
    console.log('🔍 AuthContext: Iniciando signIn con Supabase');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔍 AuthContext: Respuesta de Supabase:', { error });

      if (error) {
        console.error('❌ AuthContext: Error de Supabase:', error.message);
        return { error: error.message };
      }

      console.log('✅ AuthContext: SignIn exitoso');
      return { error: null };
    } catch (error) {
      console.error('❌ AuthContext: Error inesperado:', error);
      return { error: 'Error inesperado al iniciar sesión' };
    }
  };

  // Función de registro
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Error inesperado al crear cuenta' };
    }
  };

  // Función de cerrar sesión
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Función de reset de contraseña
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Error inesperado al enviar email de recuperación' };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 