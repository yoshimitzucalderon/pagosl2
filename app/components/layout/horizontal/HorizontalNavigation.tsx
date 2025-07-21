"use client";

import { useState } from 'react';
import { Navbar } from 'flowbite-react';
import { Icon } from "@iconify/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HorizontalMenuData from './HorizontalMenuData';

const HorizontalNavigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [active, setActive] = useState(HorizontalMenuData[0].id);
  const pathname = usePathname();

  const handleDropdownEnter = (itemId: string) => {
    setActiveDropdown(itemId);
    setActive(itemId);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleChildClick = (parentId: string) => {
    setActive(parentId);
  };

  return (
    <Navbar fluid={true} rounded={true} className="horizontal-nav bg-transparent sm:px-0 xl:py-4 py-0">
      <Navbar.Collapse className="xl:block">
        <ul className="flex items-center space-x-3">
          {HorizontalMenuData.map((item) => {
            let isActive = false;
            item.children?.find((child: any) => {
              if (child?.children) {
                let nestedvalue = child.children.find((value: any) => value.href === pathname);
                if (nestedvalue) { isActive = true; }
              } else {
                let value = child.href === pathname;
                if (value) { isActive = true; }
              }
            });
            
            return (
              <li key={item.id} className="relative group">
                {item.children ? (
                  <div
                    className="relative group"
                    onMouseEnter={() => handleDropdownEnter(item.id)}
                  >
                    <p
                      className={`w-full ${isActive
                        ? 'text-white bg-blue-600 shadow-lg'
                        : 'group-hover:bg-blue-50 group-hover:text-blue-600'
                        } py-2.5 px-3.5 rounded-full flex gap-3 cursor-pointer items-center text-sm font-medium transition-all duration-200`}
                    >
                      <Link href={item.href}>
                        <span className="flex gap-2 items-center w-full">
                          <Icon icon={`${item.icon}`} height={18} />
                          <span>{item.title}</span>
                          {item.children && <Icon icon="solar:alt-arrow-down-line-duotone" height={18} className='ms-auto' />}
                        </span>
                      </Link>
                    </p>
                    {activeDropdown === item.id && (
                      <div
                        className="absolute left-0 rtl:right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 w-52 z-50"
                        onMouseEnter={() => handleDropdownEnter(item.id)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <ul className="p-3 text-sm gap-2 flex flex-col">
                          {item.children.map((child) => (
                            <li key={child.id} className="mb-1">
                              <Link href={child.href}>
                                <p
                                  className={`w-full py-2 px-3 rounded-md flex gap-3 items-center text-sm transition-all duration-200 ${
                                    child.href === pathname
                                      ? "text-blue-600 bg-blue-50"
                                      : "hover:bg-gray-50 hover:text-blue-600"
                                  }`}
                                  onClick={() => handleChildClick(item.id)}
                                >
                                  <Icon icon={`${child.icon}`} height={16} />
                                  <span>{child.title}</span>
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href}>
                    <p className={`py-2 px-3 rounded-md flex gap-3 items-center text-sm font-medium transition-all duration-200 ${
                      active === item.id || item.href === pathname
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-blue-50 hover:text-blue-600'
                    }`}>
                      <Icon icon={`${item.icon}`} height={18} />
                      <span>{item.title}</span>
                    </p>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HorizontalNavigation; 