import './globals.css'

export const metadata = {
  title: 'Payment Management System',
  description: 'Complete payment management system with authentication and intelligent processing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 