"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from '@/app/context/AuthContext';
import HorizontalHeader from './horizontal/HorizontalHeader';
import HorizontalNavigation from './horizontal/HorizontalNavigation';

export default function HorizontalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="page-wrapper flex w-full">
        <div className="body-wrapper w-full">
          {/* Top Header */}
          <HorizontalHeader isSticky={isSticky} user={user} />
          
          {/* Horizontal Navigation */}
          <div className="xl:border-y xl:border-gray-200">
            <div className="container mx-auto">
              <HorizontalNavigation />
            </div>
          </div>

          {/* Body Content */}
          <div className="container mx-auto py-8 px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 