'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage and system preference on mount
    const checkDarkMode = () => {
      try {
        const saved = localStorage.getItem('darkMode')
        if (saved !== null) {
          const isDark = saved === 'true'
          setIsDarkMode(isDark)
        } else {
          // Default to light mode instead of system preference
          setIsDarkMode(false)
        }
      } catch (error) {
        console.log('Error loading dark mode preference:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Ensure this runs on client-side only
    if (typeof window !== 'undefined') {
      checkDarkMode()
    }
  }, [])

  useEffect(() => {
    // Apply dark mode class to html element
    if (!isLoading && typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
        document.body.style.setProperty('--scroll-bg', '#1f2937')
        document.body.style.setProperty('--scroll-thumb', 'linear-gradient(to bottom, #ec4899, #a855f7)')
        document.body.style.setProperty('--scroll-thumb-hover', 'linear-gradient(to bottom, #d946aa, #9333ea)')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
        document.body.style.setProperty('--scroll-bg', '#f1f1f1')
        document.body.style.setProperty('--scroll-thumb', 'linear-gradient(to bottom, #ec4899, #a855f7)')
        document.body.style.setProperty('--scroll-thumb-hover', 'linear-gradient(to bottom, #d946aa, #9333ea)')
      }

      // Save preference
      try {
        localStorage.setItem('darkMode', isDarkMode.toString())
      } catch (error) {
        console.log('Error saving dark mode preference:', error)
      }
    }
  }, [isDarkMode, isLoading])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const value = {
    isDarkMode,
    toggleDarkMode,
    isLoading
  }

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

export default useDarkMode