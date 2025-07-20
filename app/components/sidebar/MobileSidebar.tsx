"use client";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { sidebarData } from "@/app/data/sidebarData";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SideProfile from "./SideProfile";
import { CustomizerContext } from "@/app/context/CustomizerContext";

const MobileSidebar = () => {
  const { isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const handleClose = () => setIsMobileSidebar(false);

  if (!isMobileSidebar) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon icon="solar:circle-dollar-sign-bold-duotone" className="text-white" height={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">Sistema de Pagos</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Icon icon="solar:close-circle-line-duotone" height={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {sidebarData.map((item) => (
                <React.Fragment key={item.id}>
                  {item.children ? (
                    <NavCollapse item={item} />
                  ) : (
                    <NavItems item={item} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <SideProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar; 