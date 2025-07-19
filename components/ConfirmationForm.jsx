'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { confirmAndSave, checkDuplicatePayment, getProjectsList } from '../lib/api';
import { confirmationSchema } from '../lib/validations';
import { CheckCircle, AlertTriangle, Edit3, Save, X } from 'lucide-react';
import { formatCurrencyMXN, formatCurrencyUSD, formatDate } from '../utils/formatters';

export default function ConfirmationForm({ data, onConfirm, onCancel, loading: parentLoading }) {
  const [editedData, setEditedData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setEditedData(data);
    }
  }, [data]);

  useEffect(() => {
    // Cargar lista de proyectos
    const loadProjects = async () => {
      try {
        const projectsList = await getProjectsList();
        setProjects(projectsList);
      } catch (error) {
        console.error('Error cargando proyectos:', error);
      }
    };
    loadProjects();
  }, []);

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    try {
      confirmationSchema.parse(editedData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const checkDuplicates = async () => {
    try {
      const duplicatesFound = await checkDuplicatePayment(editedData, user);
      setDuplicates(duplicatesFound);
      setShowDuplicates(duplicatesFound.length > 0);
      return duplicatesFound.length > 0;
    } catch (error) {
      console.error('Error verificando duplicados:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Verificar duplicados antes de confirmar
      const hasDuplicates = await checkDuplicates();
      
      if (hasDuplicates) {
        // Mostrar advertencia de duplicados pero permitir continuar
        if (!confirm('Se encontraron pagos similares. ¿Deseas continuar de todas formas?')) {
          setLoading(false);
          return;
        }
      }

      await confirmAndSave(editedData, user);
      onConfirm();
      
    } catch (error) {
      console.error('Error confirmando datos:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'USD') {
      return formatCurrencyUSD(amount);
    }
    return formatCurrencyMXN(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📄 Datos extraídos del documento
          </h2>
          <p className="text-gray-600">
            Revisa y edita los datos si es necesario antes de confirmar
          </p>
        </div>

        {/* Advertencia de duplicados */}
        {showDuplicates && duplicates.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">
                Se encontraron pagos similares
              </h3>
            </div>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Se encontraron {duplicates.length} pagos con datos similares:</p>
              <ul className="mt-1 space-y-1">
                {duplicates.slice(0, 3).map((dup, index) => (
                  <li key={index}>
                    • {dup.proveedor_proceso_l2} - {formatCurrency(dup.pagado_proceso_l2, dup.moneda)} - {formatDate(dup.fecha_de_pago_proceso_l2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor *
              </label>
              <input
                type="text"
                value={editedData.proveedor_proceso_l2 || ''}
                onChange={(e) => handleChange('proveedor_proceso_l2', e.target.value)}
                className={`input-field ${errors.proveedor_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Nombre del proveedor"
              />
              {errors.proveedor_proceso_l2 && (
                <p className="mt-1 text-sm text-red-600">{errors.proveedor_proceso_l2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concepto *
              </label>
              <input
                type="text"
                value={editedData.concepto_proceso_l2 || ''}
                onChange={(e) => handleChange('concepto_proceso_l2', e.target.value)}
                className={`input-field ${errors.concepto_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Concepto del pago"
              />
              {errors.concepto_proceso_l2 && (
                <p className="mt-1 text-sm text-red-600">{errors.concepto_proceso_l2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                value={editedData.pagado_proceso_l2 || ''}
                onChange={(e) => handleChange('pagado_proceso_l2', parseFloat(e.target.value))}
                className={`input-field ${errors.pagado_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.pagado_proceso_l2 && (
                <p className="mt-1 text-sm text-red-600">{errors.pagado_proceso_l2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Pago *
              </label>
              <input
                type="date"
                value={editedData.fecha_de_pago_proceso_l2 || ''}
                onChange={(e) => handleChange('fecha_de_pago_proceso_l2', e.target.value)}
                className={`input-field ${errors.fecha_de_pago_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.fecha_de_pago_proceso_l2 && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha_de_pago_proceso_l2}</p>
              )}
            </div>
          </div>

          {/* Campos adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concepto Adicional
              </label>
              <input
                type="text"
                value={editedData.concepto || ''}
                onChange={(e) => handleChange('concepto', e.target.value)}
                className="input-field"
                placeholder="Concepto adicional (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moneda
              </label>
              <select
                value={editedData.moneda || 'MXN'}
                onChange={(e) => handleChange('moneda', e.target.value)}
                className="input-field"
              >
                <option value="MXN">Peso Mexicano (MXN)</option>
                <option value="USD">Dólar Americano (USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proyecto
              </label>
              <select
                value={editedData.proyecto || ''}
                onChange={(e) => handleChange('proyecto', e.target.value)}
                className="input-field"
              >
                <option value="">Seleccionar proyecto</option>
                {projects.map((project) => (
                  <option key={project.nombre} value={project.nombre}>
                    {project.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor Adicional
              </label>
              <input
                type="text"
                value={editedData.proveedor || ''}
                onChange={(e) => handleChange('proveedor', e.target.value)}
                className="input-field"
                placeholder="Proveedor adicional (opcional)"
              />
            </div>
          </div>

          {/* Información del procesamiento */}
          {data?.confidence_score && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                📊 Información del procesamiento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                <div>
                  <strong>Confianza:</strong> {(data.confidence_score * 100).toFixed(1)}%
                </div>
                {data.ocr_version && (
                  <div>
                    <strong>Versión OCR:</strong> {data.ocr_version}
                  </div>
                )}
                <div>
                  <strong>Procesado por:</strong> {user?.email}
                </div>
              </div>
            </div>
          )}

          {/* Error de envío */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || parentLoading}
              className="btn-primary flex-1 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  ✅ Confirmar y Guardar
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || parentLoading}
              className="btn-outline flex-1 flex justify-center items-center"
            >
              <X className="h-5 w-5 mr-2" />
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 