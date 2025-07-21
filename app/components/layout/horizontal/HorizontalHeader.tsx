"use client";

import React, { useState } from "react";
import { Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from '@/app/context/AuthContext';
import LogoutModal from './LogoutModal';

interface HorizontalHeaderProps {
  isSticky: boolean;
  user: any;
}

export default function HorizontalHeader({ isSticky, user }: HorizontalHeaderProps) {
  const { signOut } = useAuth();
  const [mobileMenu, setMobileMenu] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleMobileMenu = () => {
    if (mobileMenu === "active") {
      setMobileMenu("");
    } else {
      setMobileMenu("active");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await signOut();
      if (result.error) {
        console.error('Error al cerrar sesión:', result.error);
        setIsLoggingOut(false);
        setShowLogoutModal(false);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const closeLogoutModal = () => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[5] ${
          isSticky
            ? "bg-white shadow-md fixed w-full"
            : "bg-transparent"
        }`}
      >
        <Navbar
          fluid
          className="rounded-none bg-transparent py-4 sm:px-8 px-4 container mx-auto"
        >
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon icon="solar:money-bag-bold" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Sistema de Pagos</span>
            </div>
          </div>

          {/* Mobile Toggle Icon */}
          <span
            onClick={handleMobileMenu}
            className="h-10 w-10 flex text-black text-opacity-65 xl:hidden hover:text-blue-600 hover:bg-blue-50 rounded-full justify-center items-center cursor-pointer"
          >
            <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
          </span>

          <Navbar.Collapse className="xl:block hidden">
            <div className="flex gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="solar:magnifer-line-duotone" className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar..."
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="h-10 w-10 hover:text-blue-600 hover:bg-blue-50 rounded-full flex justify-center items-center cursor-pointer text-gray-600">
                  <Icon icon="solar:bell-line-duotone" width="20" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* Profile */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.first_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || 'usuario@ejemplo.com'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="h-8 w-8 hover:text-red-600 hover:bg-red-50 rounded-full flex justify-center items-center cursor-pointer text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cerrar Sesión"
                  >
                    {isLoggingOut ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Icon icon="solar:logout-2-line-duotone" width="16" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Navbar>

        {/* Mobile Menu */}
        <div
          className={`w-full xl:hidden block mobile-header-menu ${mobileMenu}`}
        >
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'usuario@ejemplo.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-2 text-red-600 hover:bg-red-50 p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <Icon icon="solar:logout-2-line-duotone" width="16" />
                )}
                <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
} 