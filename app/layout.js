import './globals.css'
import { AuthProvider } from '../components/auth/AuthProvider'

export const metadata = {
  title: 'Sistema de Gestión de Pagos',
  description: 'Sistema completo de gestión de pagos con autenticación y procesamiento inteligente',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 