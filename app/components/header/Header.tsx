"use client";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { CustomizerContext } from "@/app/context/CustomizerContext";

const Header = () => {
  const { isCollapse, setIsCollapse, setIsMobileSidebar } = useContext(CustomizerContext);

  const handleToggleSidebar = () => {
    if (isCollapse === "full-sidebar") {
      setIsCollapse("mini-sidebar");
    } else {
      setIsCollapse("full-sidebar");
    }
  };

  const handleMobileSidebar = () => {
    setIsMobileSidebar(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileSidebar}
            className="xl:hidden h-10 w-10 hover:bg-gray-100 rounded-lg flex justify-center items-center cursor-pointer"
          >
            <Icon icon="solar:hamburger-menu-line-duotone" height={20} />
          </button>

          {/* Desktop Toggle Button */}
          <button
            onClick={handleToggleSidebar}
            className="hidden xl:flex h-10 w-10 hover:bg-gray-100 rounded-lg justify-center items-center cursor-pointer"
          >
            <Icon icon="solar:hamburger-menu-line-duotone" height={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
            <span>Dashboard</span>
            <Icon icon="solar:alt-arrow-right-line-duotone" height={16} />
            <span className="text-blue-600">Inicio</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="h-10 w-10 hover:bg-gray-100 rounded-lg flex justify-center items-center cursor-pointer">
            <Icon icon="solar:magnifer-line-duotone" height={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="h-10 w-10 hover:bg-gray-100 rounded-lg flex justify-center items-center cursor-pointer">
              <Icon icon="solar:bell-bing-line-duotone" height={20} />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@sistemapagos.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 