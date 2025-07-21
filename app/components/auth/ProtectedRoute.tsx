"use client";

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('🛡️ ProtectedRoute: Estado actual:', { 
    user: !!user, 
    loading, 
    userEmail: user?.email,
    userId: user?.id 
  });

  useEffect(() => {
    console.log('🛡️ ProtectedRoute: useEffect ejecutado:', { user: !!user, loading });
    
    if (!loading && !user) {
      console.log('🛡️ ProtectedRoute: Usuario no autenticado, redirigiendo a signin');
      window.location.href = '/auth/signin';
    } else if (!loading && user) {
      console.log('🛡️ ProtectedRoute: Usuario autenticado, permitiendo acceso');
      console.log('🛡️ ProtectedRoute: Usuario:', user);
    }
  }, [user, loading]);

  if (loading) {
    console.log('🛡️ ProtectedRoute: Cargando...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: No hay usuario, no renderizando');
    return null;
  }

  console.log('🛡️ ProtectedRoute: Renderizando contenido protegido');
  return <>{children}</>;
} 