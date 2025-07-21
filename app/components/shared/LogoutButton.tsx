"use client";
import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const handleLogout = () => {
    // Aquí puedes agregar la lógica de logout
    console.log('Logout clicked');
    // Por ejemplo: router.push('/auth/signin');
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