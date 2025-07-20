import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomizerContextProvider } from "./context/CustomizerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Pagos",
  description: "Sistema de gestión de pagos y campañas sociales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <CustomizerContextProvider>
          {children}
        </CustomizerContextProvider>
      </body>
    </html>
  );
} 