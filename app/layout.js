import { Inter } from 'next/font/google'
import './globals.css'
import { DarkModeProvider } from '../hooks/useDarkMode'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Happy Birthday! 🎂',
  description: 'A special surprise for someone special',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  )
}