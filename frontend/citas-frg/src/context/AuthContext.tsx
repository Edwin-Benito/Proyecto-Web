'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User } from '@/app/types'
import { authService } from '@/services'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsLoading(false)

      // Redirigir al login
      window.location.href = '/'
    }
  }, [])

  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true)

      if (!authService.isAuthenticated()) {
        setUser(null)
        return
      }

      // Intentar obtener el usuario actual
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)

        // Verificar con el servidor que el token sigue siendo válido
        try {
          const response = await authService.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
            // Actualizar datos en localStorage si han cambiado
            localStorage.setItem('user', JSON.stringify(response.data))
          }
        } catch (error) {
          // Si falla la verificación, cerrar sesión
          console.error('Token verification failed:', error)
          await logout()
        }
      } else {
        await logout()
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      await logout()
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await authService.login({ email, password })
      
      if (response.success && response.data) {
        setUser(response.data.user)
        
        // Redirigir al dashboard
        window.location.href = '/dashboard'
      } else {
        throw new Error(response.message || 'Error en el inicio de sesión')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // Si falla, cerrar sesión
      await logout()
    }
  }

  // Ejecutar verificación de autenticación al montar (checkAuthStatus está memoizado)
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC para proteger rutas que requieren autenticación
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = '/'
      }
    }, [isAuthenticated, isLoading])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // Se redirigirá automáticamente
    }

    return <Component {...props} />
  }
}