// Converted to MUI version
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material'

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')
      await registerUser(data.username, data.email, data.password)
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor= '#18181b'>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.02)', color: 'white' }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" gutterBottom color="gray">
            Join our community of content creators
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Username"
                fullWidth
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Email"
                fullWidth
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Password"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Confirm Password"
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
              </Button>

              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link href="/login" style={{ color: '#7C3AED', textDecoration: 'none' }}>Sign in</Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}
