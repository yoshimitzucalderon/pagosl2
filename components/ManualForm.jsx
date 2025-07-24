'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { submitManualEntry, getProjectsList, getFrequentProviders, getFrequentConcepts } from '../lib/api';
import { paymentExtendedSchema, formasPagoOptions, monedasOptions } from '../lib/validations';
import { FileText, Save, AlertCircle } from 'lucide-react';
import { getCurrentDateForInput } from '../utils/formatters';
import ProviderSuggestions from './ProviderSuggestions';

export default function ManualForm({ onSuccess, onError }) {
  const [formData, setFormData] = useState({
    proveedor_proceso_l2: '',
    concepto_proceso_l2: '',
    pagado_proceso_l2: '',
    fecha_de_pago_proceso_l2: getCurrentDateForInput(),
    concepto: '',
    moneda: 'MXN',
    pagado_con_iva_mn: '',
    forma_de_pago_mn: '',
    fecha_de_pago_mn: '',
    pagado_con_iva_usd: '',
    forma_de_pago_usd: '',
    fecha_de_pago_usd: '',
    tc_pagado: '',
    link_anexos: '',
    proyecto: '',
    proveedor: '',
    cc_no: '',
    no_contrato_ot_odc: '',
    contrato_id_logico: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [frequentProviders, setFrequentProviders] = useState([]);
  const [frequentConcepts, setFrequentConcepts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Cargar datos de autocompletado
    const loadData = async () => {
      try {
        const [projectsList, providersList, conceptsList] = await Promise.all([
          getProjectsList(),
          getFrequentProviders(user),
          getFrequentConcepts(user)
        ]);
        
        setProjects(projectsList);
        setFrequentProviders(providersList);
        setFrequentConcepts(conceptsList);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
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

  const handleAutocomplete = (field, value) => {
    handleChange(field, value);
  };

  const validateForm = () => {
    try {
      paymentExtendedSchema.parse(formData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Limpiar campos vacíos antes de enviar
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      );

      await submitManualEntry(cleanedData, user);
      onSuccess();
      
    } catch (error) {
      console.error('Error en entrada manual:', error);
      onError(error.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-secondary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ✍️ Entrada Manual
          </h2>
          <p className="text-gray-600">
            Registra un pago manualmente con todos los detalles
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección: Campos Básicos */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.proveedor_proceso_l2}
                    onChange={(e) => handleChange('proveedor_proceso_l2', e.target.value)}
                    className={`input-field flex-1 ${errors.proveedor_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nombre del proveedor"
                    list="providers-list"
                  />
                  {/* Botón Mágico */}
                  <ProviderSuggestions
                    currentValue={formData.proveedor_proceso_l2}
                    onSelect={(provider) => {
                      handleChange('proveedor_proceso_l2', provider);
                    }}
                  />
                </div>
                <datalist id="providers-list">
                  {frequentProviders.map((provider, index) => (
                    <option key={index} value={provider} />
                  ))}
                </datalist>
                {errors.proveedor_proceso_l2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.proveedor_proceso_l2}</p>
                )}
                {/* Indicador visual cuando el campo tiene sugerencias disponibles */}
                {formData.proveedor_proceso_l2 && formData.proveedor_proceso_l2.length >= 2 && (
                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                    <span>✨</span>
                    Haz clic en la varita mágica para buscar proveedores similares
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  value={formData.concepto_proceso_l2}
                  onChange={(e) => handleChange('concepto_proceso_l2', e.target.value)}
                  className={`input-field ${errors.concepto_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Concepto del pago"
                  list="concepts-list"
                />
                <datalist id="concepts-list">
                  {frequentConcepts.map((concept, index) => (
                    <option key={index} value={concept} />
                  ))}
                </datalist>
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
                  value={formData.pagado_proceso_l2}
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
                  value={formData.fecha_de_pago_proceso_l2}
                  onChange={(e) => handleChange('fecha_de_pago_proceso_l2', e.target.value)}
                  className={`input-field ${errors.fecha_de_pago_proceso_l2 ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.fecha_de_pago_proceso_l2 && (
                  <p className="mt-1 text-sm text-red-600">{errors.fecha_de_pago_proceso_l2}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Información Adicional */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📝 Información Adicional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto Adicional
                </label>
                <input
                  type="text"
                  value={formData.concepto}
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
                  value={formData.moneda}
                  onChange={(e) => handleChange('moneda', e.target.value)}
                  className="input-field"
                >
                  {monedasOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto
                </label>
                <select
                  value={formData.proyecto}
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
                  value={formData.proveedor}
                  onChange={(e) => handleChange('proveedor', e.target.value)}
                  className="input-field"
                  placeholder="Proveedor adicional (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Sección: Pago MXN */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💰 Pago en MXN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto con IVA (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pagado_con_iva_mn}
                  onChange={(e) => handleChange('pagado_con_iva_mn', parseFloat(e.target.value))}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pago (MXN)
                </label>
                <select
                  value={formData.forma_de_pago_mn}
                  onChange={(e) => handleChange('forma_de_pago_mn', e.target.value)}
                  className="input-field"
                >
                  <option value="">Seleccionar forma de pago</option>
                  {formasPagoOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago (MXN)
                </label>
                <input
                  type="date"
                  value={formData.fecha_de_pago_mn}
                  onChange={(e) => handleChange('fecha_de_pago_mn', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Sección: Pago USD */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💵 Pago en USD
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto con IVA (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pagado_con_iva_usd}
                  onChange={(e) => handleChange('pagado_con_iva_usd', parseFloat(e.target.value))}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pago (USD)
                </label>
                <select
                  value={formData.forma_de_pago_usd}
                  onChange={(e) => handleChange('forma_de_pago_usd', e.target.value)}
                  className="input-field"
                >
                  <option value="">Seleccionar forma de pago</option>
                  {formasPagoOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago (USD)
                </label>
                <input
                  type="date"
                  value={formData.fecha_de_pago_usd}
                  onChange={(e) => handleChange('fecha_de_pago_usd', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Sección: Control */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Control y Referencias
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cambio
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.tc_pagado}
                  onChange={(e) => handleChange('tc_pagado', parseFloat(e.target.value))}
                  className="input-field"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Centro de Costo
                </label>
                <input
                  type="text"
                  value={formData.cc_no}
                  onChange={(e) => handleChange('cc_no', e.target.value)}
                  className="input-field"
                  placeholder="CC-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Contrato/OT/ODC
                </label>
                <input
                  type="text"
                  value={formData.no_contrato_ot_odc}
                  onChange={(e) => handleChange('no_contrato_ot_odc', e.target.value)}
                  className="input-field"
                  placeholder="CON-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Lógico del Contrato
                </label>
                <input
                  type="text"
                  value={formData.contrato_id_logico}
                  onChange={(e) => handleChange('contrato_id_logico', e.target.value)}
                  className="input-field"
                  placeholder="UUID del contrato"
                />
              </div>
            </div>
          </div>

          {/* Sección: Anexos */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📎 Anexos y Documentos
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de Anexos
              </label>
              <input
                type="url"
                value={formData.link_anexos}
                onChange={(e) => handleChange('link_anexos', e.target.value)}
                className="input-field"
                placeholder="https://ejemplo.com/documento.pdf"
              />
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-secondary flex items-center px-8 py-3"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Registrar Pago
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 