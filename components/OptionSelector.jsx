'use client';

import { useState } from 'react';
import { Upload, FileText, History, BarChart3, Settings } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

export default function OptionSelector({ onModeChange }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const { checkPermissions } = useAuth();

  const canCreate = checkPermissions('create');
  const canViewHistory = true; // Todos pueden ver historial
  const canViewStats = true; // Todos pueden ver estadísticas

  const options = [
    {
      id: 'upload',
      title: '📄 Subir Documento',
      description: 'Sube un PDF o imagen para procesamiento automático',
      icon: Upload,
      color: 'bg-primary-500 hover:bg-primary-600',
      disabled: !canCreate,
      disabledMessage: 'No tienes permisos para crear pagos'
    },
    {
      id: 'manual',
      title: '✍️ Entrada Manual',
      description: 'Registra un pago manualmente',
      icon: FileText,
      color: 'bg-secondary-500 hover:bg-secondary-600',
      disabled: !canCreate,
      disabledMessage: 'No tienes permisos para crear pagos'
    },
    {
      id: 'history',
      title: '📊 Historial',
      description: 'Ver historial de pagos registrados',
      icon: History,
      color: 'bg-blue-500 hover:bg-blue-600',
      disabled: !canViewHistory,
      disabledMessage: 'No tienes permisos para ver historial'
    },
    {
      id: 'stats',
      title: '📈 Estadísticas',
      description: 'Ver estadísticas y reportes',
      icon: BarChart3,
      color: 'bg-green-500 hover:bg-green-600',
      disabled: !canViewStats,
      disabledMessage: 'No tienes permisos para ver estadísticas'
    }
  ];

  const handleOptionClick = (option) => {
    if (option.disabled) return;
    
    setSelectedMode(option.id);
    onModeChange(option.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Qué te gustaría hacer hoy?
        </h2>
        <p className="text-lg text-gray-600">
          Selecciona una opción para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className={`relative card-hover cursor-pointer transition-all duration-300 ${
                option.disabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                  : 'hover:scale-105'
              }`}
            >
              {option.disabled && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      {option.disabledMessage}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${option.color} flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Consejos de uso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <strong>📄 Subir Documento:</strong> Ideal para facturas, recibos y documentos estructurados
            </div>
            <div>
              <strong>✍️ Entrada Manual:</strong> Perfecto para pagos informales o datos no documentados
            </div>
            <div>
              <strong>📊 Historial:</strong> Revisa todos los pagos registrados y su estado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 