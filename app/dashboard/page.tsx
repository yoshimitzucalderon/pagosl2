"use client";

import { useAuth } from '@/app/context/AuthContext';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('🎯 Dashboard: Página cargada');
  console.log('🎯 Dashboard: Usuario:', user);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Bienvenido, {user?.first_name || 'Usuario'}! 👋
              </h1>
              <p className="text-gray-600">
                Gestiona tus pagos y campañas desde tu dashboard personalizado.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pagos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pagos Exitosos</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Campañas Activas</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Pago procesado exitosamente</p>
                    <p className="text-xs text-gray-500">Hace 2 minutos</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">$150.00</span>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Nueva campaña creada</p>
                    <p className="text-xs text-gray-500">Hace 1 hora</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Campaña #123</span>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Pago pendiente de confirmación</p>
                    <p className="text-xs text-gray-500">Hace 3 horas</p>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">$75.50</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Pagos</h2>
            <p className="text-gray-600">Aquí podrás gestionar todos tus pagos y transacciones.</p>
          </div>
        );

      case 'campaigns':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campañas</h2>
            <p className="text-gray-600">Gestiona tus campañas de marketing y publicidad.</p>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Visualiza estadísticas y métricas de rendimiento.</p>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Configura tu cuenta y preferencias.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen', icon: '📊' },
              { id: 'payments', name: 'Pagos', icon: '💳' },
              { id: 'campaigns', name: 'Campañas', icon: '📢' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'settings', name: 'Configuración', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </DashboardLayout>
  );
} 