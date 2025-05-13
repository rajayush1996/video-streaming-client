'use client'

import { createTheme } from '@mui/material/styles'

// Utility function to convert HSL to RGB

// Utility function to convert RGB to hex

// Utility function to convert HSL string to hex

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED', // Purple
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444', // Red
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    background: {
      default: '#18181b', // Updated background color
      paper: '#1E293B', // Slate 800
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#94A3B8', // Slate 400
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#F8FAFC',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#F8FAFC',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#F8FAFC',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#F8FAFC',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#F8FAFC',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#F8FAFC',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#F8FAFC',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#94A3B8',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: '#7C3AED',
          '&:hover': {
            backgroundColor: '#6D28D9',
          },
        },
        outlined: {
          borderColor: '#7C3AED',
          color: '#7C3AED',
          '&:hover': {
            borderColor: '#6D28D9',
            backgroundColor: 'rgba(124, 58, 237, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7C3AED',
          },
        },
      },
    },
  },
})

// Extend theme with custom colors
declare module '@mui/material/styles' {
  interface Palette {
    reelPurple: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
  }
  interface PaletteOptions {
    reelPurple?: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
  }
}

// Add custom colors
theme.palette.reelPurple = {
  main: '#6d28d9',
  light: '#8b5cf6',
  dark: '#4c1d95',
  contrastText: '#ffffff',
}

export default theme 