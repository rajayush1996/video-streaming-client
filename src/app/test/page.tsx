'use client'

import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Paper,
  alpha,
  useTheme
} from '@mui/material'
import { keyframes } from '@mui/system'

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const scaleIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

export default function TestPage() {
  const theme = useTheme()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section with Gradient */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff 0%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Testing MUI Components
          </Typography>
          <Typography sx={{ opacity: 0.8 }}>
            This page demonstrates all our custom MUI configurations
          </Typography>
        </Paper>

        {/* Color Palette Display */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { title: 'Primary', color: 'primary.main' },
            { title: 'Secondary', color: 'secondary.main' },
            { title: 'Accent', color: 'info.main' },
            { title: 'Custom', color: '#7c4dff' }
          ].map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: '#7c4dff', fontWeight: 600, mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Box
                    sx={{
                      height: 80,
                      bgcolor: item.color,
                      borderRadius: 1
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Card Hover Effects */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3].map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item}>
              <Card
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: 'primary.main'
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Hover Card {item}
                  </Typography>
                  <Typography color="text.secondary">
                    This card has hover effects and glass morphism
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Animation Tests */}
        <Box sx={{ '& > *': { mb: 4 } }}>
          <Box sx={{ animation: `${fadeIn} 0.3s ease-out` }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Fade In Animation
            </Typography>
            <Typography color="text.secondary">
              This section fades in when the page loads
            </Typography>
          </Box>

          <Box sx={{ animation: `${scaleIn} 0.2s ease-out` }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Scale In Animation
            </Typography>
            <Typography color="text.secondary">
              This section scales in when the page loads
            </Typography>
          </Box>

          <Box sx={{ animation: `${slideUp} 0.3s ease-out` }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
              Slide Up Animation
            </Typography>
            <Typography color="text.secondary">
              This section slides up when the page loads
            </Typography>
          </Box>
        </Box>

        {/* Button Tests */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.9)
              }
            }}
          >
            Primary Button
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.secondary.main, 0.9)
              }
            }}
          >
            Secondary Button
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: alpha(theme.palette.info.main, 0.9)
              }
            }}
          >
            Accent Button
          </Button>
          <Button
            variant="contained"
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: '#7c4dff',
              '&:hover': {
                bgcolor: '#6e32f5'
              }
            }}
          >
            Custom Button
          </Button>
        </Box>
      </Container>
    </Box>
  )
} 