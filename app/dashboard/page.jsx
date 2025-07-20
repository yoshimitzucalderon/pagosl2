'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import StatsWidget from '@/components/StatsWidget';
import PaymentHistory from '@/components/PaymentHistory';
import OptionSelector from '@/components/OptionSelector';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    pendingPayments: 0,
    processedPayments: 0,
  });
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      setUser(user);
      await loadStats();
      setLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('erp_pagado_proceso_l2')
        .select('*');

      if (error) throw error;

      const totalPayments = data.length;
      const totalAmount = data.reduce((sum, payment) => sum + (payment.monto || 0), 0);
      const pendingPayments = data.filter(p => p.estado === 'pendiente').length;
      const processedPayments = data.filter(p => p.estado === 'procesado').length;

      setStats({
        totalPayments,
        totalAmount,
        pendingPayments,
        processedPayments,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-gray-600">
            Manage your payment processing system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsWidget
            title="Total Payments"
            value={stats.totalPayments}
            icon="📊"
            color="blue"
          />
          <StatsWidget
            title="Total Amount"
            value={`$${stats.totalAmount.toLocaleString()}`}
            icon="💰"
            color="green"
          />
          <StatsWidget
            title="Pending"
            value={stats.pendingPayments}
            icon="⏳"
            color="yellow"
          />
          <StatsWidget
            title="Processed"
            value={stats.processedPayments}
            icon="✅"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <OptionSelector />
        </div>

        {/* Recent Payments */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <PaymentHistory limit={5} />
        </div>
      </main>
    </div>
  );
} 