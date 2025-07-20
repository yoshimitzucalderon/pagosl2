import { Sidebar } from "flowbite-react";
import React from "react";
import { ChildItem } from "@/app/data/sidebarData";
import NavItems from "./NavItems";
import { Icon } from "@iconify/react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

interface NavCollapseProps {
  item: ChildItem;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item }) => {
  const pathname = usePathname();
  const activeDD = item.children?.find((t) => t.url === pathname);

  return (
    <Sidebar.Collapse
      label={item.name}
      open={activeDD ? true : false}
      icon={() => <Icon icon={item.icon || ""} height={18} />}
      className={activeDD ? "!text-primary bg-lightprimary" : ""}
    >
      {item.children && (
        <Sidebar.ItemGroup className="sidebar-dropdown">
          {item.children.map((child) => (
            <React.Fragment key={child.id}>
              {child.children ? (
                <NavCollapse item={child} />
              ) : (
                <NavItems item={child} />
              )}
            </React.Fragment>
          ))}
        </Sidebar.ItemGroup>
      )}
    </Sidebar.Collapse>
  );
};

export default NavCollapse; 