"use client";

import React, { useState } from "react";
import { Navbar } from "flowbite-react";

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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Sistema de Pagos</span>
            </div>
          </div>

          {/* Mobile Toggle Icon */}
          <span
            onClick={handleMobileMenu}
            className="h-10 w-10 flex text-black text-opacity-65 xl:hidden hover:text-blue-600 hover:bg-blue-50 rounded-full justify-center items-center cursor-pointer"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>

          <Navbar.Collapse className="xl:block hidden">
            <div className="flex gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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