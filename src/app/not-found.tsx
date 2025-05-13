'use client'

import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/"
          sx={{ mt: 2 }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  )
} 