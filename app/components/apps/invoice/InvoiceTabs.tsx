"use client";
import React from 'react';
import { Tabs } from "flowbite-react";
import { useRouter, usePathname } from 'next/navigation';

const InvoiceTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/invoice/create')) return 'create';
    if (pathname.includes('/invoice/edit')) return 'edit';
    if (pathname.includes('/invoice/detail')) return 'detail';
    if (pathname.includes('/invoice/list')) return 'list';
    return 'list';
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'create':
        router.push('/invoice/create');
        break;
      case 'edit':
        // Si estamos en una página de edición específica, mantenemos la URL
        if (pathname.includes('/invoice/edit/')) {
          return; // No navegamos, ya estamos en la página correcta
        }
        // Si no, redirigimos a la lista donde pueden seleccionar qué editar
        router.push('/invoice/list');
        break;
      case 'detail':
        // Si estamos en una página de detalle específica, mantenemos la URL
        if (pathname.includes('/invoice/detail/')) {
          return; // No navegamos, ya estamos en la página correcta
        }
        // Si no, redirigimos a la lista donde pueden seleccionar qué ver
        router.push('/invoice/list');
        break;
      case 'list':
        router.push('/invoice/list');
        break;
      default:
        router.push('/invoice/list');
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <Tabs 
        aria-label="Invoice navigation tabs" 
        variant="underline"
        style="underline"
        onActiveTabChange={(tab) => handleTabChange(tab)}
      >
        <Tabs.Item
          active={getActiveTab() === 'create'}
          title="Crear"
          icon={() => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        />
        
        <Tabs.Item
          active={getActiveTab() === 'edit'}
          title="Editar"
          icon={() => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4A2 2 0 0 0 2 6V20A2 2 0 0 0 4 22H18A2 2 0 0 0 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5A2.121 2.121 0 0 1 21 5L11 15H8V12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        />
        
        <Tabs.Item
          active={getActiveTab() === 'detail'}
          title="Detalle"
          icon={() => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        />
        
        <Tabs.Item
          active={getActiveTab() === 'list'}
          title="Listado"
          icon={() => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        />
      </Tabs>
    </div>
  );
};

export default InvoiceTabs; 