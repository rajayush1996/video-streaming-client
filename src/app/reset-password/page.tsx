/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
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
import VpnKeyIcon from '@mui/icons-material/VpnKey'

// Client component for the form
function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(true)
  const { resetPassword, isLoading } = useAuthApi()

  useEffect(() => {
    const t = searchParams?.get('token')
    if (!t) {
      setError('Invalid or missing reset token.')
      setShowForm(false)
    } else {
      setToken(t)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      await resetPassword(token, newPassword, confirmPassword)
      setMessage('Password has been reset successfully. You can now log in.')
      setShowForm(false)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reset password.')
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
            <VpnKeyIcon sx={{ fontSize: 48, mb: 1, color: '#7C3AED' }} />
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="inherit" align="center">
              Enter your new password below.
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
                label="New Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Fade>
        </div>
      </Fade>
    </Box>
  )
}

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          height: '100vh',
          bgcolor: '#18181b',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
} 