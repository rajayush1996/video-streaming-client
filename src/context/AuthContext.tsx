/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'creator',
  avatar?: string,
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const convertRole = (role: string): 'user' | 'admin' | 'creator' => {
  const lowerRole = role.toLowerCase()
  if (lowerRole === 'user' || lowerRole === 'admin' || lowerRole === 'creator') {
    return lowerRole
  }
  return 'user' // default role
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { 
    error, 
    login: apiLogin, 
    register: apiRegister, 
    verifyEmail: apiVerifyEmail,
    resendVerification: apiResendVerification,
    // refreshToken: apiRefreshToken
  } = useAuthApi()
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('accessToken')

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser)
          setUser({
            ...parsedUser,
            role: convertRole(parsedUser.role)
          })
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user, accessToken } = await apiLogin({ email, password })
      setUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('accessToken', accessToken)
    } catch (error) {
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      await apiRegister({ username, email, password })
    } catch (error) {
      throw error
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      await apiVerifyEmail(token)
    } catch (error) {
      throw error
    }
  }

  const resendVerification = async (email: string) => {
    try {
      await apiResendVerification(email)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    router.push('/login')
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        error,
        login, 
        register, 
        verifyEmail,
        resendVerification,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 