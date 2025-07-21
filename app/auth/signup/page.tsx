"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Debes aceptar los términos de servicio');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      if (signUpError) {
        setError(signUpError);
      } else {
        // La redirección se maneja automáticamente en el AuthContext
        router.push('/dashboard');
      }
    } catch (error) {
      setError('Error inesperado al crear cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Formulario */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Crea tu cuenta
                  </h1>
                  <p className="text-gray-600">
                    Únete a nosotros y comienza a gestionar tus pagos
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input form-input-email"
                        placeholder="Ingresa tu correo electrónico"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input form-input-password"
                        placeholder="Ingresa tu contraseña"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" strokeWidth="2" />
                            <circle cx="12" cy="16" r="1" strokeWidth="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <line x1="2" x2="22" y1="2" y2="22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmarContraseña"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input form-input-password"
                        placeholder="Confirma tu contraseña"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" strokeWidth="2" />
                            <circle cx="12" cy="16" r="1" strokeWidth="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <line x1="2" x2="22" y1="2" y2="22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      id="aceptarTérminos"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="aceptarTérminos" className="ml-2 block text-sm text-gray-600">
                      Acepto los{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                        Términos de Servicio
                      </Link>{' '}
                      y la{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                        Política de Privacidad
                      </Link>
                    </label>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creando cuenta...
                      </div>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                      href="/auth/signin"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Panel de Bienvenida */}
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white flex-col justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6v2m0 8v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">Crea tu cuenta</h2>
                <h3 className="text-4xl font-bold mb-6 text-white">¡Únete a nosotros!</h3>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Comienza tu viaje con Sistema de Pagos creando tu cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 