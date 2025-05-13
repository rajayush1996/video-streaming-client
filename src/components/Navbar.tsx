'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Avatar,
} from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Film, UserRound, Menu as MenuIcon, X as CloseIcon, LogOut } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Videos', href: '/videos' },
  { label: 'Reels', href: '/reels' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [, setIsLoading] = React.useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    router.push('/')
  }

  const handleProfile = () => {
    router.push('/profile')
    handleClose()
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={scrolled ? 'bg-black/70 backdrop-blur-md transition-all duration-300' : 'bg-black transition-all duration-300'}
      sx={{
        bgcolor: 'transparent',
        borderBottom: '1px solid #232323',
        boxShadow: 'none',
        zIndex: 1300,
        borderRadius: '0 !important',
        left: 0,
        right: 0,
        width: '100vw',
        maxWidth: '100vw',
      }}
    >
      <Toolbar sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 1}}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Link href="/" passHref legacyBehavior>
            <Box component="a" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <Film size={32} className="text-reel-purple-500" style={{ marginRight: 8 }} />
              <Typography variant="h6" fontWeight={700} color="#fff" sx={{ letterSpacing: 1 }}>
                ReelVibes
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* Desktop Nav */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          {navLinks.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              color="inherit"
              sx={{ fontSize: 16, fontWeight: 500, textTransform: 'none', color: 'rgba(255,255,255,0.85)' }}
            >
              {link.label}
            </Button>
          ))}
          
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenu}
                sx={{
                  width: 40,
                  height: 40,
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': { borderColor: '#7c4dff', background: 'rgba(124,77,255,0.08)' },
                }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.username}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#2d2150',
                    color: '#fff',
                    mt: 1,
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                  <UserRound size={20} style={{ marginRight: 8 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <LogOut size={20} style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href="/login"
              variant="contained"
              sx={{
                bgcolor: '#7c4dff',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 16,
                px: 3,
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': { bgcolor: '#6241ea' },
              }}
            >
              Login
            </Button>
          )}
        </Stack>

        {/* Mobile Nav */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={() => setIsMenuOpen(true)} sx={{ color: '#fff' }}>
            <MenuIcon size={28} />
          </IconButton>
        </Box>

        <Drawer
          anchor="right"
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: '#2d2150',
              color: '#fff',
              width: 260,
              pt: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
            <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon size={24} />
            </IconButton>
          </Box>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton component={Link} href={link.href} onClick={() => setIsMenuOpen(false)}>
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontSize: 16, fontWeight: 500 }} />
                </ListItemButton>
              </ListItem>
            ))}
            {isAuthenticated ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <UserRound size={22} style={{ marginRight: 8 }} /> Profile
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                    <LogOut size={22} style={{ marginRight: 8 }} /> Logout
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Typography fontWeight={600} color="#7c4dff">Login</Typography>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}
