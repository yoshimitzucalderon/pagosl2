'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { getRecentPayments, searchPayments } from '../lib/api';
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { formatCurrencyMXN, formatCurrencyUSD, formatDate, formatDateTime } from '../utils/formatters';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    proyecto: '',
    moneda: '',
    fecha_desde: '',
    fecha_hasta: ''
  });
  const { user, checkPermissions } = useAuth();

  const canEdit = checkPermissions('edit');
  const canDelete = checkPermissions('delete');
  const canExport = checkPermissions('export');

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getRecentPayments(user, 50);
      setPayments(data);
    } catch (error) {
      console.error('Error cargando pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchPayments(searchQuery, user, filters);
      setPayments(data);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount, currency) => {
    if (currency === 'USD') {
      return formatCurrencyUSD(amount);
    }
    return formatCurrencyMXN(amount);
  };

  const handleExport = () => {
    // Implementar exportación de datos
    alert('Función de exportación en desarrollo');
  };

  const handleView = (payment) => {
    // Implementar vista detallada
    alert(`Viendo pago: ${payment.proveedor_proceso_l2}`);
  };

  const handleEdit = (payment) => {
    // Implementar edición
    alert(`Editando pago: ${payment.proveedor_proceso_l2}`);
  };

  const handleDelete = (payment) => {
    if (confirm(`¿Estás seguro de eliminar el pago de ${payment.proveedor_proceso_l2}?`)) {
      // Implementar eliminación
      alert(`Eliminando pago: ${payment.proveedor_proceso_l2}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📊 Historial de Pagos
          </h2>
          <p className="text-gray-600">
            Revisa todos los pagos registrados en el sistema
          </p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por proveedor o concepto..."
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </button>
            {canExport && (
              <button
                onClick={handleExport}
                className="btn-outline flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
            )}
          </div>

          {/* Filtros avanzados */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proyecto
              </label>
              <select
                value={filters.proyecto}
                onChange={(e) => handleFilterChange('proyecto', e.target.value)}
                className="input-field"
              >
                <option value="">Todos los proyectos</option>
                <option value="Torre Residencial A">Torre Residencial A</option>
                <option value="Fraccionamiento Los Alamos">Fraccionamiento Los Alamos</option>
                <option value="Plaza Comercial Centro">Plaza Comercial Centro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                value={filters.moneda}
                onChange={(e) => handleFilterChange('moneda', e.target.value)}
                className="input-field"
              >
                <option value="">Todas las monedas</option>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Desde
              </label>
              <input
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => handleFilterChange('fecha_desde', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hasta
              </label>
              <input
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => handleFilterChange('fecha_hasta', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner mr-3"></div>
            <span className="text-gray-600">Cargando pagos...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron pagos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moneda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.proveedor_proceso_l2}
                      </div>
                      {payment.proveedor && (
                        <div className="text-sm text-gray-500">
                          {payment.proveedor}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {payment.concepto_proceso_l2}
                      </div>
                      {payment.concepto && (
                        <div className="text-sm text-gray-500">
                          {payment.concepto}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.pagado_proceso_l2, payment.moneda)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.fecha_de_pago_proceso_l2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(payment.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.proyecto || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.moneda === 'USD' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {payment.moneda}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(payment)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(payment)}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(payment)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 