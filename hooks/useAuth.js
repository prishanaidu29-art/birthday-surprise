'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook for authentication management
 * Centralizes authentication logic and eliminates duplicate code
 */
export function useAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const authenticated = sessionStorage.getItem('birthday_authenticated')
        const isAuth = authenticated === 'true'
        
        setIsAuthenticated(isAuth)
        setIsLoading(false)
        
        if (!isAuth) {
          router.push('/')
          return false
        }
        
        return true
      }
      return false
    }

    checkAuth()
  }, [router])

  const login = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('birthday_authenticated', 'true')
      setIsAuthenticated(true)
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('birthday_authenticated')
      setIsAuthenticated(false)
      router.push('/')
    }
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  }
}