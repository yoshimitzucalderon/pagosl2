import React from "react";
import AuthRegister from "../../../components/auth/AuthRegister";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro de Usuario",
  description: "Crear nueva cuenta en Sistema de Pagos",
};

const Register = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen">
        <div className="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-gray-900">
          <div className="col-span-12 sm:px-12 px-4">
            <div className="flex h-screen items-center px-3 justify-center">
              <div className="max-w-[420px] w-full mx-auto">
                <h3 className="text-2xl font-bold my-3">Crear Cuenta</h3>
                <p className="text-blue-600 text-sm font-medium">
                  Sistema de Pagos
                </p>
                <AuthRegister />
                <div className="flex gap-2 text-base text-gray-600 font-medium mt-6 items-center justify-center">
                  <p>¿Ya tienes una cuenta?</p>
                  <a
                    href="/auth/login"
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Iniciar sesión
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

export default Register; 