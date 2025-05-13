const config = {
  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  
  // Application Information
  appName: 'Reel Blog Vibes',
  version: '1.0.0',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Endpoints
  endpoints: {
    auth: {
      login: 'api/v1/user/auth/signin',
      register: 'api/v1/user/auth/signup',
      verifyEmail: 'api/v1/user/auth/verify-email',
      resendVerification: 'api/v1/user/auth/resend-verification',
      logout: 'api/v1/user/auth/logout',
      becomeCreator: 'api/v1/user/auth/become-creator',
      refreshToken: 'api/v1/user/auth/refresh-token',
      forgotPassword: 'api/v1/user/auth/forgot-password',
      resetPassword: 'api/v1/user/auth/reset-password',
      verifyResetToken: 'api/v1/user/auth/verify-reset-token'
    },
    user: {
      getProfile: '/api/v1/user/profile/me',
      updateProfile: '/api/v1/user/profile/profile',
      updateUser: '/api/v1/user/profile/me',
    },
    media: {
      getMedia: '/api/v1/user/media',
      getReels: '/api/v1/user/reels',
      getBlogs: '/api/v1/user/blog'
    }
    // Add more endpoint categories as needed
  }
};

export default config;
