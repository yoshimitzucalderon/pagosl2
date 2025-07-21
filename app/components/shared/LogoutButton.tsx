"use client";
import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 p-3 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200 ease-in-out z-50 shadow-sm hover:shadow-md"
      title="Cerrar sesión"
    >
      <LogOut size={20} />
    </button>
  );
};

export default LogoutButton; 