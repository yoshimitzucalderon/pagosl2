"use client";
import React, { useContext } from "react";
import { Drawer } from "flowbite-react";
import { Icon } from "@iconify/react";
import { sidebarData } from "@/app/data/sidebarData";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SideProfile from "./SideProfile";
import { CustomizerContext } from "@/app/context/CustomizerContext";

const MobileSidebar = () => {
  const { isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);

  const handleClose = () => setIsMobileSidebar(false);

  return (
    <Drawer open={isMobileSidebar} onClose={handleClose} position="left" className="w-80">
      <Drawer.Header>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon icon="solar:circle-dollar-sign-bold-duotone" className="text-white" height={20} />
          </div>
          <span className="text-lg font-bold text-gray-900">Sistema de Pagos</span>
        </div>
      </Drawer.Header>
      
      <Drawer.Body className="p-0">
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 p-4">
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
      </Drawer.Body>
    </Drawer>
  );
};

export default MobileSidebar; 