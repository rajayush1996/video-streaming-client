'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Fade,
  CircularProgress
} from '@mui/material'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'
import { useAuthApi } from '@/hooks/useAuthApi'

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { resendVerification } = useAuthApi()

  useEffect(() => {
    // Get stored email from localStorage
    const storedEmail = localStorage.getItem('unverifiedEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      await resendVerification(email)
      setMessage('Verification email has been sent. Please check your inbox.')
    } catch (err: unknown) {
      const error = err as ErrorResponse
      setError(error?.response?.data?.message || error?.message || 'Failed to resend verification email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push('/login')
  }
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#18181b',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        p: 2,
      }}
    >
      <Fade in>
        <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <MarkEmailUnreadIcon sx={{ fontSize: 48, mb: 1, color: '#7C3AED' }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Verify Your Email
            </Typography>
            <Typography variant="body2" color="inherit" align="center">
              Your account is not active. Please verify your email to continue.
            </Typography>
          </Box>
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Fade in>
            <form onSubmit={handleResendVerification}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{
                  style: { color: '#fff' },
                }}
                sx={{
                  '& label.Mui-focused': { color: '#7C3AED' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: '#7C3AED' },
                    '& fieldset': { borderColor: '#fff' },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: '#7C3AED',
                  '&:hover': { bgcolor: '#6D28D9' },
                  color: '#fff'
                }}
                disabled={isLoading}
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <Button
                type="button"
                onClick={handleLoginRedirect}
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  color: '#fff',
                  borderColor: '#7C3AED',
                  '&:hover': { borderColor: '#6D28D9', color: '#7C3AED', bgcolor: '#fff1' }
                }}
              >
                Back to Login
              </Button>
            </form>
          </Fade>
        </div>
      </Fade>
    </Box>
  )
} 