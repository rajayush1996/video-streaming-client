'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  IconButton, 
  Divider,
  alpha,
  useTheme
} from '@mui/material'
import { Film } from 'lucide-react'

const socialLinks = [
  { 
    label: 'Twitter', 
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: '#',
    color: '#1DA1F2'
  },
  { 
    label: 'Instagram', 
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    href: '#',
    color: '#E4405F'
  },
  { 
    label: 'Facebook', 
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    href: '#',
    color: '#1877F2'
  },
  { 
    label: 'YouTube', 
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    href: '#',
    color: '#FF0000'
  },
]

const SocialIcon = ({ icon, label, href, color }: { icon: React.ReactNode; label: string; href: string; color: string }) => (
  <IconButton
    component={Link}
    href={href}
    aria-label={label}
    sx={{
      width: 40,
      height: 40,
      bgcolor: alpha('#fff', 0.1),
      color: color,
      '&:hover': {
        bgcolor: alpha('#fff', 0.2),
      }
    }}
  >
    {icon}
  </IconButton>
)

const QuickLink = React.memo(({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    style={{ textDecoration: 'none' }}
  >
    <Typography
      sx={{
        color: alpha('#fff', 0.9),
        '&:hover': {
          color: '#fff'
        },
        transition: 'color 0.2s ease'
      }}
    >
      {children}
    </Typography>
  </Link>
))

QuickLink.displayName = 'QuickLink'

const FooterContent = React.memo(() => {
  const currentYear = React.useMemo(() => new Date().getFullYear(), [])
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'black',
        color: 'white',
        pt: 10,
        pb: 6,
        borderTop: '1px solid',
        borderColor: alpha('#fff', 0.1),
        mt: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Film size={32} style={{ color: theme.palette.primary.main, marginRight: 8 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ReelVibes
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
              The ultimate platform for video content creators and enthusiasts to discover, share, and engage with short-form videos and in-depth blog articles.
            </Typography>
          </Grid>
          <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Navigation
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& > li': { mb: 1 } }}>
              <li><QuickLink href="/">Home</QuickLink></li>
              <li><QuickLink href="/reels">Reels</QuickLink></li>
              <li><QuickLink href="/videos">Videos</QuickLink></li>
              <li><QuickLink href="/blog">Blog</QuickLink></li>
            </Box>
          </Grid>
          <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, '& > li': { mb: 1 } }}>
              <li><QuickLink href="#">Privacy Policy</QuickLink></li>
              <li><QuickLink href="#">Terms of Service</QuickLink></li>
              <li><QuickLink href="#">Cookies Policy</QuickLink></li>
            </Box>
          </Grid>
          <Grid component="div" sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 1 }}>
              Email: hello@reelvibes.com
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {socialLinks.map((link) => (
                <SocialIcon key={link.label} icon={link.icon} label={link.label} href={link.href} color={link.color} />
              ))}
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, bgcolor: alpha('#fff', 0.1) }} />
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), textAlign: 'center' }}>
          © {currentYear} ReelVibes. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
})

FooterContent.displayName = 'FooterContent'

export default function Footer() {
  return <FooterContent />
}
