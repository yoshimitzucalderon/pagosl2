"use client";
import React, { createContext, useContext, useState } from "react";

interface CustomizerContextType {
  // Sidebar states
  isCollapse: string;
  setIsCollapse: (value: string) => void;
  isMobileSidebar: boolean;
  setIsMobileSidebar: (value: boolean) => void;
  
  // Layout states
  activeLayout: string;
  setActiveLayout: (value: string) => void;
  isLayout: string;
  setIsLayout: (value: string) => void;
  
  // Theme states
  activeMode: string;
  setActiveMode: (value: string) => void;
  
  // Language states
  isLanguage: string;
  setIsLanguage: (value: string) => void;
  
  // Direction states
  activeDir: string;
  setActiveDir: (value: string) => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

export const CustomizerContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState("full-sidebar");
  const [isMobileSidebar, setIsMobileSidebar] = useState(false);
  const [activeLayout, setActiveLayout] = useState("vertical");
  const [isLayout, setIsLayout] = useState("boxed");
  const [activeMode, setActiveMode] = useState("light");
  const [isLanguage, setIsLanguage] = useState("en");
  const [activeDir, setActiveDir] = useState("ltr");

  const value = {
    isCollapse,
    setIsCollapse,
    isMobileSidebar,
    setIsMobileSidebar,
    activeLayout,
    setActiveLayout,
    isLayout,
    setIsLayout,
    activeMode,
    setActiveMode,
    isLanguage,
    setIsLanguage,
    activeDir,
    setActiveDir,
  };

  return (
    <CustomizerContext.Provider value={value}>
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizer = () => {
  const context = useContext(CustomizerContext);
  if (context === undefined) {
    throw new Error("useCustomizer must be used within a CustomizerContextProvider");
  }
  return context;
};

export { CustomizerContext }; 