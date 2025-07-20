"use client";
import React, { useContext } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import MobileSidebar from "../sidebar/MobileSidebar";
import { CustomizerContext } from "@/app/context/CustomizerContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isCollapse } = useContext(CustomizerContext);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Body Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-in-out ${
            isCollapse === "mini-sidebar" ? "xl:ml-16" : "xl:ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 