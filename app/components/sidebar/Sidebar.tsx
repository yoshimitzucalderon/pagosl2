"use client";
import React from "react";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { id: 'payments', name: 'Pagos', icon: '💳', href: '/dashboard?tab=payments' },
    { id: 'campaigns', name: 'Campañas', icon: '📢', href: '/dashboard?tab=campaigns' },
    { id: 'analytics', name: 'Analytics', icon: '📈', href: '/dashboard?tab=analytics' },
    { id: 'settings', name: 'Configuración', icon: '⚙️', href: '/dashboard?tab=settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Sistema de Pagos</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      router.push(item.href);
                      if (onClose) onClose();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <span>🚪</span>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 