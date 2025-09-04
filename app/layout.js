import { Inter } from 'next/font/google'
import './globals.css'
import ParticleSystem from '../components/ParticleSystem'
import DiscoveryTracker from '../components/DiscoveryTracker'
import { DarkModeProvider } from '../hooks/useDarkMode'
import ClientOnlyDarkModeToggle from '../components/ClientOnlyDarkModeToggle'

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
          <ClientOnlyDarkModeToggle />
          <ParticleSystem />
          <DiscoveryTracker />
          {children}
        </DarkModeProvider>
      </body>
    </html>
  )
}