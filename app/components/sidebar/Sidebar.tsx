"use client";
import React, { useContext } from "react";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { Icon } from "@iconify/react";
import { sidebarData } from "@/app/data/sidebarData";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SideProfile from "./SideProfile";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { isCollapse, setIsCollapse } = useContext(CustomizerContext);
  const pathname = usePathname();

  const handleToggleSidebar = () => {
    if (isCollapse === "full-sidebar") {
      setIsCollapse("mini-sidebar");
    } else {
      setIsCollapse("full-sidebar");
    }
  };

  return (
    <div
      className={`sidebar-wrapper ${
        isCollapse === "mini-sidebar" ? "mini-sidebar" : "full-sidebar"
      }`}
    >
      <FlowbiteSidebar
        aria-label="Sidebar with logo branding example"
        className={`${
          isCollapse === "mini-sidebar"
            ? "w-16 min-w-16"
            : "w-64 min-w-64"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Logo Section */}
        <FlowbiteSidebar.Logo
          href="/dashboard"
          img="/images/logo.svg"
          imgAlt="Sistema de Pagos logo"
          className="flex items-center justify-center py-4"
        >
          {isCollapse === "full-sidebar" && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon icon="solar:circle-dollar-sign-bold-duotone" className="text-white" height={20} />
              </div>
              <span className="text-lg font-bold text-gray-900">Sistema de Pagos</span>
            </div>
          )}
        </FlowbiteSidebar.Logo>

        {/* Navigation Items */}
        <FlowbiteSidebar.Items className="flex-1">
          <FlowbiteSidebar.ItemGroup>
            {sidebarData.map((item) => (
              <React.Fragment key={item.id}>
                {item.children ? (
                  <NavCollapse item={item} />
                ) : (
                  <NavItems item={item} />
                )}
              </React.Fragment>
            ))}
          </FlowbiteSidebar.ItemGroup>
        </FlowbiteSidebar.Items>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <SideProfile />
        </div>
      </FlowbiteSidebar>
    </div>
  );
};

export default Sidebar; 