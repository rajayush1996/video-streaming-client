// app/activate-account/ActivateAccountInner.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Box,
  Typography,
  Alert,
  Fade,
  Button
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'

interface ErrorResponse {
  response?: { data?: { message?: string } }
  message?: string
}

export default function ActivateAccountInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyEmail } = useAuth()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('Verifying your email...')
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const token = searchParams?.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing verification token.')
      return
    }

    const verify = async () => {
      try {
        await verifyEmail(token)
        setStatus('success')
        setMessage('Your email has been successfully verified!')
      } catch (err: unknown) {
        const error = err as ErrorResponse
        setStatus('error')
        setMessage(error?.response?.data?.message || error?.message || 'Failed to verify email.')
      }
    }

    verify()
  }, [searchParams, verifyEmail])

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
        p: 2,
      }}
    >
      <Fade in>
        <Box sx={{ maxWidth: 500, width: '100%', p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {status === 'pending' && <HourglassEmptyIcon sx={{ fontSize: 48, color: '#7C3AED' }} />}
            {status === 'success' && <VerifiedIcon sx={{ fontSize: 48, color: '#22c55e' }} />}
            {status === 'error' && <ErrorOutlineIcon sx={{ fontSize: 48, color: '#ef4444' }} />}
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
            Email Verification
          </Typography>
          <Alert severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'} sx={{ mt: 2 }}>
            {message}
          </Alert>
          {status !== 'pending' && (
            <Button onClick={handleLoginRedirect} fullWidth variant="contained" sx={{ mt: 4, bgcolor: '#7C3AED' }}>
              Go to Login
            </Button>
          )}
        </Box>
      </Fade>
    </Box>
  )
}
