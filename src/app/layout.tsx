// app/layout.tsx
import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import MainLayout from '@/components/layouts/MainLayout'
import Providers from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Video Streaming Platform',
  description: 'A modern video streaming platform built with Next.js and Material-UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
