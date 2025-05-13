// LoginPage.tsx — Converted to MUI
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password);
      router.push('/');
    } catch {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#18181b',
        color: '#fff'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'rgba(255,255,255,0.05)',
          p: 4,
          borderRadius: 4,
          boxShadow: 4
        }}
      >
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
          Sign in to your account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} color="#ccc" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} color="#ccc" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#ccc' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1
            }}
          >
            <FormControlLabel
              control={<Checkbox sx={{ color: '#7C3AED' }} />}
              label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
            />
            <Link href="/forgot-password" passHref>
              <Typography variant="body2" sx={{ color: '#7C3AED', cursor: 'pointer' }}>
                Forgot password?
              </Typography>
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link href="/register" passHref>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: '#7C3AED', cursor: 'pointer' }}
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </Box>
  );
}