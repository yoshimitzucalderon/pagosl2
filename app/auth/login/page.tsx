import React from "react";
import AuthLogin from "../../../components/auth/AuthLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - Sistema de Pagos",
  description: "Accede a tu cuenta en el Sistema de Pagos",
};

const Login = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-gray-900">
          <div className="col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <h3 className="text-2xl font-bold my-3">Iniciar Sesión</h3>
                <p className="text-blue-600 text-sm font-medium">
                  Sistema de Pagos
                </p>
                <AuthLogin />
                <div className="flex gap-2 text-base text-gray-600 font-medium mt-6 items-center justify-center">
                  <p>¿Nuevo en Sistema de Pagos?</p>
                  <a
                    href="/auth/register"
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Crear una cuenta
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 