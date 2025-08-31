import { Inter } from 'next/font/google'
import './globals.css'
import ParticleSystem from '../components/ParticleSystem'
import DiscoveryTracker from '../components/DiscoveryTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Happy Birthday Jerze! 🎂',
  description: 'A special surprise for My Looove',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleSystem />
        <DiscoveryTracker />
        {children}
      </body>
    </html>
  )
}