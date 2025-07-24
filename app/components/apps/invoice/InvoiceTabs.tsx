"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const tabData = [
  {
    key: 'create',
    label: 'Crear',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    path: '/invoice/create',
    match: '/invoice/create',
  },
  {
    key: 'edit',
    label: 'Editar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M3 17.25V21h3.75l11.06-11.06a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.76 3.76 1.83-1.83z" fill="currentColor"/></svg>
    ),
    path: '/invoice/edit',
    match: '/invoice/edit',
  },
  {
    key: 'detail',
    label: 'Detalle',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    path: '/invoice/detail',
    match: '/invoice/detail',
  },
  {
    key: 'list',
    label: 'Listado',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle"><path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    path: '/invoice/list',
    match: '/invoice/list',
  },
];

const InvoiceTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.includes('/invoice/create')) return 0;
    if (pathname.includes('/invoice/edit')) return 1;
    if (pathname.includes('/invoice/detail')) return 2;
    if (pathname.includes('/invoice/list')) return 3;
    return 3; // default to list
  };

  const handleTabClick = (tab) => {
    const tabObj = tabData[tab];
    if (tabObj) {
      if (tabObj.key === 'edit' && pathname.includes('/invoice/edit/')) {
        // Ya estamos en la edición específica
        return;
      }
      if (tabObj.key === 'detail' && pathname.includes('/invoice/detail/')) {
        return;
      }
      router.push(tabObj.path);
    }
  };

  const activeTab = getActiveTab();

  return (
    <div className="mb-6 mt-0">
      <nav className="flex space-x-6">
        {tabData.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(idx)}
              className={`flex items-center gap-2 px-0 py-2 text-base font-medium transition-colors relative bg-transparent border-none outline-none
                ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
              `}
              style={{ minHeight: '40px', background: 'none' }}
            >
              <span className="flex items-center gap-2">
                {React.cloneElement(tab.icon, { color: isActive ? '#2563eb' : '#94a3b8' })}
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500 rounded transition-all" style={{width:'100%'}}></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default InvoiceTabs; 