"use client";
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import LogoutConfirmModal from './LogoutConfirmModal';

const LogoutButton = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="fixed top-4 right-4 p-3 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-200 ease-in-out z-50 shadow-sm hover:shadow-md"
        title="Cerrar sesión"
      >
        <LogOut size={20} />
      </button>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onClose={handleLogoutCancel}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default LogoutButton; 