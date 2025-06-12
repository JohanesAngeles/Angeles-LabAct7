import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LoginRounded
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserService from '../services/UserService';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '16px',
          padding: '12px 24px',
        },
      },
    },
  },
});

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const userData = await UserService.login({ email, password });
      if (userData) {
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
        // Navigate based on user role
        if (userData.role === 'admin') {
          navigate('/users');
        } else {
          navigate('/articles');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(
        error.response?.data?.message || 
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f0f2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
          <Card 
            sx={{ 
              maxWidth: 450, 
              mx: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(25, 118, 210, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                  }}
                >
                  <LoginRounded fontSize="large" />
                </Avatar>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                  Sign In
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  MERN Lab Activity 7 - Johan Angeles
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              {/* Error Alert */}
              {message && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(220, 38, 127, 0.2)',
                  }}
                  onClose={() => setMessage('')}
                >
                  {message}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={submitHandler} noValidate>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !email || !password}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #115293 30%, #1976d2 90%)',
                      boxShadow: '0 12px 20px rgba(25, 118, 210, 0.5)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Signing In...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Box>

              {/* Test Credentials */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'rgba(245, 245, 245, 0.8)',
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Test Credentials (Johan - Admin):</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: johan@test.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Password: password123
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '11px' }}>
                  Other test accounts: editor@test.com, user@test.com (same password)
                </Typography>
              </Box>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  MERN Stack Development © 2024
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;