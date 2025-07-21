"use client";

import { useAuth } from '@/app/context/AuthContext';
import HorizontalLayout from '@/app/components/layout/HorizontalLayout';
import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('🎯 Dashboard: Página cargada');
  console.log('🎯 Dashboard: Usuario:', user);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-6 col-span-12">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
                <div className="md:w-3/5 relative z-10">
                  <h4 className="text-white text-xl font-semibold">
                    ¡Bienvenido, {user?.first_name || 'Usuario'}! 👋
                  </h4>
                  <p className="text-blue-100 text-sm font-medium mt-1">
                    Gestiona tus pagos y campañas desde tu dashboard personalizado
                  </p>
                  <div className="flex align-center rounded-full justify-between bg-white/10 w-fit mt-4">
                    <div className="py-3 px-6 text-center">
                      <h5 className="text-white text-lg leading-[normal] font-bold">156</h5>
                      <small className="text-blue-100 text-xs font-medium block">Pagos Exitosos</small>
                    </div>
                    <div className="py-3 px-6 text-center border-s border-white/20">
                      <h5 className="text-white text-lg leading-[normal] font-bold">87%</h5>
                      <small className="text-blue-100 text-xs font-medium block">Tasa de Éxito</small>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute right-8 top-8 w-16 h-16 bg-white/5 rounded-full"></div>
              </div>
            </div>

            {/* Small Cards */}
            <div className="lg:col-span-6 col-span-12">
              <div className="grid grid-cols-3 gap-4">
                {/* Sales Card */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-3 bg-white/20">
                    <Icon icon="solar:pie-chart-2-broken" height={20} />
                  </span>
                  <div className="flex items-center gap-1">
                    <h5 className="text-white text-lg font-bold">$12,450</h5>
                    <span className="font-semibold border rounded-full border-white/20 py-0.5 px-2 leading-[normal] text-xs text-white bg-white/10">
                      +23%
                    </span>
                  </div>
                  <p className="text-pink-100 text-sm mt-1 font-medium">Pagos Totales</p>
                </div>

                {/* Refunds Card */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-3 bg-white/20">
                    <Icon icon="solar:refresh-circle-line-duotone" height={20} />
                  </span>
                  <div className="flex items-center gap-1">
                    <h5 className="text-white text-lg font-bold">8</h5>
                    <span className="font-semibold border rounded-full border-white/20 py-0.5 px-2 leading-[normal] text-xs text-white bg-white/10">
                      -12%
                    </span>
                  </div>
                  <p className="text-purple-100 text-sm mt-1 font-medium">Pendientes</p>
                </div>

                {/* Earnings Card */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                  <span className="w-10 h-10 rounded-full flex items-center justify-center text-white mb-3 bg-white/20">
                    <Icon icon="solar:dollar-minimalistic-linear" height={20} />
                  </span>
                  <div className="flex items-center gap-1">
                    <h5 className="text-white text-lg font-bold">12</h5>
                    <span className="font-semibold border rounded-full border-white/20 py-0.5 px-2 leading-[normal] text-xs text-white bg-white/10">
                      +8%
                    </span>
                  </div>
                  <p className="text-green-100 text-sm mt-1 font-medium">Campañas</p>
                </div>
              </div>
            </div>

            {/* Sales Profit Chart */}
            <div className="lg:col-span-8 col-span-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Rendimiento de Pagos</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg">
                      Pagos
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-lg">
                      Gastos
                    </button>
                  </div>
                </div>
                
                {/* Simple chart placeholder */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon icon="solar:chart-2-broken" className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-blue-600 font-medium">Gráfico de Rendimiento</p>
                    <p className="text-blue-500 text-sm">$63,489.50 +8% este año</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pagos Exitosos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pagos Pendientes</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>

            {/* Product Sales */}
            <div className="lg:col-span-4 col-span-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Ventas por Categoría</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Icon icon="solar:menu-dots-bold" height={20} />
                  </button>
                </div>
                
                {/* Donut chart placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-lg">8,364</span>
                    </div>
                    <p className="text-purple-600 font-medium text-sm">Total Ventas</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Pagos Digitales</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">36%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Transferencias</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Tarjetas</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">17%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Efectivo</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">31%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-8 col-span-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Pago procesado exitosamente</p>
                      <p className="text-xs text-gray-500">Hace 2 minutos</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">$150.00</span>
                  </div>
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Nueva campaña creada</p>
                      <p className="text-xs text-gray-500">Hace 1 hora</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">Campaña #123</span>
                  </div>
                  <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Pago pendiente de confirmación</p>
                      <p className="text-xs text-gray-500">Hace 3 horas</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">$75.50</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="lg:col-span-4 col-span-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Productos Principales</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:box-bold" className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Producto A</p>
                      <p className="text-xs text-gray-500">156 ventas</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:box-bold" className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Producto B</p>
                      <p className="text-xs text-gray-500">98 ventas</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">+8%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:box-bold" className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Producto C</p>
                      <p className="text-xs text-gray-500">87 ventas</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">+15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Pagos</h2>
            <p className="text-gray-600">Aquí podrás gestionar todos tus pagos y transacciones.</p>
          </div>
        );

      case 'campaigns':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Campañas</h2>
            <p className="text-gray-600">Gestiona tus campañas de marketing y publicidad.</p>
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Visualiza estadísticas y métricas de rendimiento.</p>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>
            <p className="text-gray-600">Configura tu cuenta y preferencias.</p>
          </div>
        );
    }
  };

  return (
    <HorizontalLayout>
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen', icon: 'solar:chart-2-broken' },
              { id: 'payments', name: 'Pagos', icon: 'solar:card-bold' },
              { id: 'campaigns', name: 'Campañas', icon: 'solar:megaphone-bold' },
              { id: 'analytics', name: 'Analytics', icon: 'solar:chart-line-bold' },
              { id: 'settings', name: 'Configuración', icon: 'solar:settings-bold' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon icon={tab.icon} height={18} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </HorizontalLayout>
  );
} 