import axios from 'axios'
import config from '@/config/config'

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip refresh token logic for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/signin') || 
                          originalRequest.url?.includes('/auth/signup') ||
                          originalRequest.url?.includes('/auth/forgot-password') ||
                          originalRequest.url?.includes('/auth/reset-password')
    
    // Handle unverified email case during login
    if (
      error.response?.status === 403 &&
      error.response?.data?.data?.isEmailNotVerified &&
      originalRequest.url?.includes('/auth/signin')
    ) {
      // Store the email for the verify-email page
      const email = error.response.data.data.email
      if (email) {
        localStorage.setItem('unverifiedEmail', email)
      }
      window.location.href = '/verify-email'
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        const response = await axiosInstance.post('/auth/refresh-token')
        const { accessToken } = response.data as { accessToken: string }
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh token fails, clear auth data
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance 