import axiosInstance from '@/lib/axios'
import config from '@/config/config'
import { useState } from 'react';

const endpoints = config.endpoints;

interface ApiUser {
  id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'creator'
}

interface AuthResponse {
  code: number
  message: string
  data: {
    user: ApiUser
    accessToken: string
  }
  requestId: string
  success: boolean
}


interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (error: unknown) => {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      setError(axiosError.response.data.message)
    } else {
      setError('An unexpected error occurred')
    }
    throw error
  }

  const login = async (credentials: LoginCredentials): Promise<{ user: ApiUser; accessToken: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.post<AuthResponse>(endpoints.auth.login, credentials)
      localStorage.setItem('accessToken', response.data.data.accessToken)
      return {
        user: response.data.data.user,
        accessToken: response.data.data.accessToken
      }
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axiosInstance.post(endpoints.auth.register, credentials)
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (token: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axiosInstance.get(`${endpoints.auth.verifyEmail}?token=${token}`)
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async (email: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axiosInstance.post(endpoints.auth.resendVerification, { email })
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<{ accessToken: string }> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.post<{ accessToken: string }>(endpoints.auth.refreshToken);
      return response.data
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axiosInstance.post(endpoints.auth.forgotPassword, { email })
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      await axiosInstance.post(endpoints.auth.resetPassword, { token, newPassword, confirmPassword })
    } catch (error) {
      return handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    resendVerification,
    refreshToken,
    forgotPassword,
    resetPassword
  }
} 