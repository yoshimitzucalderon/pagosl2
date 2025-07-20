'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AuthRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Datos del formulario:', formData)
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Formulario de Registro */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo Sistema de Pagos */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">💰</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Pagos</h2>
            <p className="text-gray-600">Crear Cuenta</p>
          </div>

          {/* Botón Google */}
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200 mb-6">
            <span className="mr-3">🔍</span>
            Registrarse con Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O regístrate con correo electrónico</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
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
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
                  placeholder="Ingresa tu correo electrónico"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">✉️</span>
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
                  className="block w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
                  placeholder="Crea una contraseña segura"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">🔒</span>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="text-sm">{showPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800"
                  placeholder="Confirma tu contraseña"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">🔒</span>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="text-sm">{showConfirmPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-600">
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
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Panel de Bienvenida */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Crea tu cuenta</h2>
            <h3 className="text-4xl font-bold mb-6">¡Únete a nosotros!</h3>
            <p className="text-lg text-blue-100 leading-relaxed">
              Comienza tu viaje con Sistema de Pagos creando tu cuenta. Obtén acceso a potentes funciones de dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 