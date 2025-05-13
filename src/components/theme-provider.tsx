'use client'

import * as React from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#7C3AED',
            light: '#9F7AEA',
            dark: '#6B46C1',
          },
          secondary: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
          },
          background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          h1: { fontWeight: 700, fontSize: '2.5rem' },
          h2: { fontWeight: 600, fontSize: '2rem' },
          h3: { fontWeight: 600, fontSize: '1.75rem' },
          h4: { fontWeight: 600, fontSize: '1.5rem' },
          h5: { fontWeight: 600, fontSize: '1.25rem' },
          h6: { fontWeight: 600, fontSize: '1rem' },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), ' +
                  '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 6,
              },
            },
          },
        },
      }),
    []
  )

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
