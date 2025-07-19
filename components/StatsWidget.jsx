'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { getPaymentStats } from '../lib/api';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';
import { formatCurrencyMXN, formatCurrencyUSD, formatNumber } from '../utils/formatters';

export default function StatsWidget() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, [user, selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getPaymentStats(user);
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'this_month':
        return 'Este mes';
      case 'last_month':
        return 'Mes pasado';
      case 'this_year':
        return 'Este año';
      default:
        return 'Este mes';
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (current, previous) => {
    if (current > previous) {
      return 'text-green-600';
    } else if (current < previous) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner mr-3"></div>
        <span className="text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📈 Estadísticas y Reportes
          </h2>
          <p className="text-gray-600">
            Resumen de pagos y métricas del sistema
          </p>
        </div>

        {/* Selector de período */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {[
              { value: 'this_month', label: 'Este mes' },
              { value: 'last_month', label: 'Mes pasado' },
              { value: 'this_year', label: 'Este año' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total MXN */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total MXN</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrencyMXN(stats?.total_mxn || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats?.total_mxn || 0, 0)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats?.total_mxn || 0, 0)}`}>
              {stats?.total_mxn > 0 ? 'Crecimiento' : 'Sin datos'}
            </span>
          </div>
        </div>

        {/* Total USD */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total USD</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrencyUSD(stats?.total_usd || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats?.total_usd || 0, 0)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats?.total_usd || 0, 0)}`}>
              {stats?.total_usd > 0 ? 'Crecimiento' : 'Sin datos'}
            </span>
          </div>
        </div>

        {/* Cantidad de pagos */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Cantidad de Pagos</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats?.count || 0)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats?.count || 0, 0)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats?.count || 0, 0)}`}>
              {stats?.count > 0 ? 'Activo' : 'Sin registros'}
            </span>
          </div>
        </div>

        {/* Promedio por pago */}
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Promedio por Pago</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.count > 0 
                  ? formatCurrencyMXN((stats.total_mxn + (stats.total_usd * 18.5)) / stats.count)
                  : formatCurrencyMXN(0)
                }
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-gray-600">
              MXN + USD (TC: 18.5)
            </span>
          </div>
        </div>
      </div>

      {/* Gráficos y métricas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por moneda */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💱 Distribución por Moneda
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Peso Mexicano (MXN)</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrencyMXN(stats?.total_mxn || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {stats?.total_mxn > 0 && stats?.total_usd > 0
                    ? `${((stats.total_mxn / (stats.total_mxn + stats.total_usd * 18.5)) * 100).toFixed(1)}%`
                    : '100%'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Dólar Americano (USD)</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrencyUSD(stats?.total_usd || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {stats?.total_usd > 0 && stats?.total_mxn > 0
                    ? `${((stats.total_usd * 18.5 / (stats.total_mxn + stats.total_usd * 18.5)) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Actividad Reciente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">Pagos este mes</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrencyMXN(stats?.this_month || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">Total registros</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatNumber(stats?.count || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">Promedio diario</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {stats?.count > 0 
                  ? formatCurrencyMXN((stats.total_mxn + (stats.total_usd * 18.5)) / Math.max(stats.count, 1))
                  : formatCurrencyMXN(0)
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="card">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <strong>Período:</strong> {getPeriodLabel()}
            </div>
            <div>
              <strong>Usuario:</strong> {user?.email}
            </div>
            <div>
              <strong>Última actualización:</strong> {new Date().toLocaleString('es-MX')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 