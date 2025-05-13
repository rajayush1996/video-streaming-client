'use client'

import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Fade, Container, Chip } from '@mui/material'
import { useHomeContent } from '@/hooks/useHomeContent'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { PlayCircle, Film, FileText } from 'lucide-react'

interface ContentItem {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  thumbnailUrl?: string;
  category?: string;
  createdAt: string;
}

export default function HomePage() {
  const {
    videos,
    reels,
    blogs,
    isLoading,
    error,
    hasMore,
    loadMore,
    refreshContent
  } = useHomeContent()

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && hasMore && !isLoading) {
        loadMore()
      }
    },
  })

  // Function to render content cards
  const renderContentCard = (item: ContentItem, type: 'video' | 'reel' | 'blog') => {
  return (
    <Card
      key={item.id}
      sx={{
        bgcolor: 'rgba(30,41,59,0.7)',
        borderRadius: 2.5,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 4px 24px rgba(124,58,237,0.10)',
        overflow: 'hidden',
        maxWidth: 340,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 400,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 8px 32px rgba(124,58,237,0.18)',
          borderColor: '#7C3AED',
        },
        color: '#F8FAFC',
      }}
    >
      <Link
        href={`/${type === 'blog' ? 'blog' : type + 's'}/${item._id || item.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {(type === 'video' || type === 'reel') && (
          <Box sx={{ width: '100%', height: 200, position: 'relative', bgcolor: '#000' }}>
            <Box
              component="img"
              src={item.thumbnailUrl}
              alt={item.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.18)',
                opacity: 0,
                transition: 'opacity 0.3s',
                pointerEvents: 'none',
                zIndex: 2,
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <PlayCircle size={56} color="#fff" style={{ filter: 'drop-shadow(0 2px 8px #7C3AED)' }} />
            </Box>
          </Box>
        )}

        <CardContent sx={{ p: 2, minHeight: 160 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 1, color: '#fff', fontSize: '1.1rem' }}
            noWrap
          >
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#94A3B8', mb: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}
            maxHeight={48}
          >
            {item.description || item.content?.substring(0, 150)}...
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.category && (
              <Chip
                label={item.category}
                size="small"
                sx={{
                  bgcolor: 'rgba(124,58,237,0.15)',
                  color: '#A78BFA',
                  fontWeight: 600,
                }}
              />
            )}
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  )
}


  // Custom View All Button
  const ViewAllButton = ({ href }: { href: string }) => (
    <Button
      component={Link}
      href={href}
      variant="contained"
      sx={{
        bgcolor: '#7C3AED',
        color: '#fff',
        borderRadius: 2,
        px: 3,
        py: 1,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: '1rem',
        '&:hover': {
          bgcolor: '#A78BFA',
          color: '#fff',
          boxShadow: '0 2px 8px 0 rgba(124,58,237,0.15)',
        },
      }}
    >
      View All
    </Button>
  )

  return (
    <Box sx={{ bgcolor: '#18181b', minHeight: '100vh', pb: 8, mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in>
          <Box>
            {/* Header */}
          <Box sx={{ mb: 10, textAlign: 'center'}}>
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  mb: 2,
                  color: '#fff',
                  fontSize: '2.75rem',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #fff 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 10px rgba(124,58,237,0.2)'
                }}
              >
                Discover Content
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1.1rem',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                Explore the latest videos, reels, and blog posts from our creators
              </Typography>
            </Box>

            {/* Videos Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(124,58,237,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PlayCircle size={24} className="text-reel-purple-500" />
                  </Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    sx={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Latest Videos
                  </Typography>
                </Box>
                <ViewAllButton href="/videos" />
              </Box>
              <Grid container spacing={3}>
                {videos.slice(0, 4).map((video) => (
                  <Grid component="div" size={{ xs: 12, sm: 6, md: 3 }} key={video.id}>
                    {renderContentCard(video, 'video')}
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Reels Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(124,58,237,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Film size={24} className="text-reel-purple-500" />
                  </Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    sx={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Trending Reels
                  </Typography>
                </Box>
                <ViewAllButton href="/reels" />
              </Box>
              <Grid container spacing={3}>
                {reels.slice(0, 4).map((reel) => (
                  <Grid component="div" size={{ xs: 12, sm: 6, md: 3 }} key={reel.id}>
                    {renderContentCard(reel, 'reel')}
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Blogs Section */}
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(124,58,237,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText size={24} className="text-reel-purple-500" />
                  </Box>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    sx={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontFamily: 'Inter, sans-serif',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Featured Blogs
                  </Typography>
                </Box>
                <ViewAllButton href="/blogs" />
              </Box>
              <Grid container spacing={3}>
                {blogs.slice(0, 4).map((blog) => (
                  <Grid component="div" size={{ xs: 12, sm: 6, md: 3 }} key={blog.id}>
                    {renderContentCard(blog, 'blog')}
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Loading and Error States */}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Fade in>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="span" sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#7C3AED', animation: 'pulse 1.2s infinite alternate' }} />
                    <Typography sx={{ color: '#A78BFA' }}>Loading...</Typography>
                  </Box>
                </Fade>
              </Box>
            )}

            {error && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography 
                  color="error" 
                  gutterBottom
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    color: '#EF4444'
                  }}
                >
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={refreshContent}
                  sx={{
                    color: '#7C3AED',
                    borderColor: '#7C3AED',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#6D28D9',
                      bgcolor: 'rgba(124,58,237,0.05)'
                    }
                  }}
                >
                  Try Again
                </Button>
              </Box>
            )}

            {/* Infinite Scroll Sentinel */}
            {hasMore && !error && (
              <Box ref={ref} sx={{ height: 20, mt: 4 }} />
            )}

            {/* No More Content Message */}
            {!hasMore && !isLoading && (videos.length > 0 || reels.length > 0 || blogs.length > 0) && (
              <Typography
                textAlign="center"
                sx={{ 
                  mt: 6,
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                You&apos;ve reached the end of the feed
              </Typography>
            )}

            {/* Empty State */}
            {!isLoading && videos.length === 0 && reels.length === 0 && blogs.length === 0 && !error && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 12,
                  color: 'rgba(255,255,255,0.7)',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#fff'
                  }}
                >
                  No content available
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    maxWidth: '400px',
                    mx: 'auto'
                  }}
                >
                  Check back later for new content!
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  )
} 