'use client'
import React from 'react'
import CssBaseline           from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { Toaster }           from '@/components/ui/toaster'
// import { Toaster as Sonner } from '@/components/ui/sonner'
// import { TooltipProvider }   from '@/components/ui/tooltip'
import { AuthProvider }      from '@/context/AuthContext'
import { Toaster } from '../ui/toaster'
import { TooltipProvider } from '@radix-ui/react-tooltip'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider theme={theme}> */}
        <CssBaseline />
        <TooltipProvider>
          <Toaster />
          <AuthProvider>{children}</AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
  )
}
