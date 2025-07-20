"use client";
import React, { useContext } from "react";
import { ChildItem } from "@/app/data/sidebarData";
import { Sidebar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CustomizerContext } from "@/app/context/CustomizerContext";

interface NavItemsProps {
  item: ChildItem;
}

const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const pathname = usePathname();
  const { setIsMobileSidebar } = useContext(CustomizerContext);
  
  const handleMobileSidebar = () => {
    setIsMobileSidebar(false);
  };

  return (
    <>
      <Sidebar.Item
        href={item.url}
        as={Link}
        className={`${
          item.url === pathname
            ? "!text-primary bg-lightprimary"
            : "text-link bg-transparent group/link"
        }`}
      >
        <span
          onClick={handleMobileSidebar}
          className="flex gap-3 align-center items-center"
        >
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color}`} height={18} />
          ) : (
            <span
              className={`${
                item.url === pathname
                  ? "dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary !bg-primary h-[6px] w-[6px]"
                  : "h-[6px] w-[6px] bg-darklink dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary"
              }`}
            ></span>
          )}
          <span className="max-w-36 overflow-hidden">{item.name}</span>
        </span>
      </Sidebar.Item>
    </>
  );
};

export default NavItems; 