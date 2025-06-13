'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link as MUILink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { setAlert } from '../../store/slices/alertSlice';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormData } from '../../types';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      dispatch(setAlert('Login successful', 'success'));
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error as { msg?: string };
      dispatch(setAlert(errorMessage.msg || 'Login failed', 'error'));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign into your account to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              size="large"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <MUILink component={Link} href="/register" color="primary">
                  Create one here
                </MUILink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
