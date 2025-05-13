/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { useAuthApi } from '@/hooks/useAuthApi'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Fade,
  CircularProgress
} from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { forgotPassword, isLoading } = useAuthApi()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await forgotPassword(email)
      setMessage('A password reset link has been sent to your email.')
      setShowForm(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send reset link.')
    }
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
            <LockResetIcon sx={{ fontSize: 48, mb: 1, color: '#7C3AED' }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body2" color="inherit" align="center">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Fade in={showForm}>
            <form onSubmit={handleSubmit} style={{ display: showForm ? 'block' : 'none' }}>
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Fade>
        </div>
      </Fade>
    </Box>
  )
} 