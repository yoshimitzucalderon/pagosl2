'use client';

import { useAuth } from './auth/AuthProvider';
import { LogOut, User, Building, Shield, Settings } from 'lucide-react';
import { formatRole, formatDepartment, getRoleColor, getDepartmentColor } from '../utils/formatters';

export default function Header() {
  const { user, logout, getUserRole, getUserDepartment } = useAuth();

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  const userRole = getUserRole();
  const userDepartment = getUserDepartment();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Gestión de Pagos
              </h1>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {/* Información del usuario */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Badge de rol */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>{formatRole(userRole)}</span>
                </div>
              </div>

              {/* Badge de departamento */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(userDepartment)}`}>
                <div className="flex items-center space-x-1">
                  <Building className="h-3 w-3" />
                  <span>{formatDepartment(userDepartment)}</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-2">
              {/* Botón de configuración (solo para administradores) */}
              {userRole === 'administrador' && (
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Configuración"
                >
                  <Settings className="h-5 w-5" />
                </button>
              )}

              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 