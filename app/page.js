'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import Header from '../components/Header';
import OptionSelector from '../components/OptionSelector';
import UploadForm from '../components/UploadForm';
import ManualForm from '../components/ManualForm';
import ConfirmationForm from '../components/ConfirmationForm';
import PaymentHistory from '../components/PaymentHistory';
import StatsWidget from '../components/StatsWidget';
import StatusMessage from '../components/StatusMessage';
import { ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [mode, setMode] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Verificar autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setProcessedData(null);
    setSuccess(false);
    setError(null);
  };

  const handleBackToOptions = () => {
    setMode(null);
    setProcessedData(null);
    setSuccess(false);
    setError(null);
  };

  const handleUploadSuccess = (data) => {
    setProcessedData(data);
    setMode('confirm');
  };

  const handleConfirmSuccess = () => {
    setSuccess(true);
    setMode(null);
    setProcessedData(null);
    // Aquí se podría refrescar el historial y estadísticas
  };

  const handleManualSuccess = () => {
    setSuccess(true);
    setMode(null);
    // Aquí se podría refrescar el historial y estadísticas
  };

  const renderContent = () => {
    switch (mode) {
      case 'upload':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={handleBackToOptions}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a opciones
              </button>
            </div>
            <UploadForm onSuccess={handleUploadSuccess} onError={setError} />
          </div>
        );

      case 'manual':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={handleBackToOptions}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a opciones
              </button>
            </div>
            <ManualForm onSuccess={handleManualSuccess} onError={setError} />
          </div>
        );

      case 'confirm':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={handleBackToOptions}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a opciones
              </button>
            </div>
            <ConfirmationForm 
              data={processedData} 
              onConfirm={handleConfirmSuccess} 
              onCancel={handleBackToOptions}
            />
          </div>
        );

      case 'history':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={handleBackToOptions}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a opciones
              </button>
            </div>
            <PaymentHistory />
          </div>
        );

      case 'stats':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <button
                onClick={handleBackToOptions}
                className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a opciones
              </button>
            </div>
            <StatsWidget />
          </div>
        );

      default:
        return <OptionSelector onModeChange={handleModeChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Mensajes de estado */}
        {success && (
          <StatusMessage 
            type="success" 
            message="Operación completada exitosamente" 
            onClose={() => setSuccess(false)}
          />
        )}
        
        {error && (
          <StatusMessage 
            type="error" 
            message={error} 
            onClose={() => setError(null)}
          />
        )}

        {/* Contenido principal */}
        {renderContent()}
      </main>
    </div>
  );
} 