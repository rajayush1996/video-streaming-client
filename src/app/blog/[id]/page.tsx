/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'
import { useBlogApi } from '@/hooks/useBlogApi'
import { Box, Typography, CircularProgress, Container, Paper, Button, Chip, Avatar } from '@mui/material'
import { FileText, ArrowLeft } from 'lucide-react'

interface Blog {
  _id: string
  title: string
  content: string
  description: string
  category: string
  status: string
  admin: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const { fetchBlogById, isLoading, error } = useBlogApi()
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    const loadBlog = async () => {
      if (!params?.id) return;
      
      try {
        const data = await fetchBlogById(params.id as string)
        setBlog(data)
      } catch (err) {
        console.error('Error loading blog:', err)
      }
    }

    loadBlog()
  }, [params?.id ])

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#0F172A'
      }}>
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    )
  }

  if (error || !blog) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#0F172A', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <FileText size={48} color="#A78BFA" style={{ marginBottom: 16 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}
            >
              {error || 'Blog not found'}
            </Typography>
            <Button
              onClick={() => router.push('/blog')}
              startIcon={<ArrowLeft size={20} />}
              sx={{
                color: '#A78BFA',
                fontWeight: 600,
                textTransform: 'none',
                mt: 2,
                '&:hover': { color: '#C4B5FD', bgcolor: 'transparent' },
                bgcolor: 'transparent',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Back to Blogs
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#18181b', color: '#fff', mt: 2 }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          onClick={() => router.push('/blog')}
          startIcon={<ArrowLeft size={20} />}
          sx={{
            color: '#A78BFA',
            fontWeight: 600,
            textTransform: 'none',
            mb: 4,
            bgcolor: 'transparent',
            fontFamily: 'Inter, sans-serif',
            '&:hover': { color: '#C4B5FD', bgcolor: 'transparent' },
          }}
        >
          Back to Blogs
        </Button>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 6 },
            bgcolor: 'rgba(30,41,59,0.7)',
            borderRadius: 2.5,
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)',
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Chip
              label={blog.category}
              sx={{
                bgcolor: 'rgba(124,58,237,0.15)',
                color: '#A78BFA',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                borderRadius: 2,
              }}
            />
            <Chip
              label={`${Math.ceil(blog.content.length / 1000)} min read`}
              sx={{
                bgcolor: 'rgba(255,255,255,0.10)',
                color: '#F8FAFC',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                borderRadius: 2,
              }}
            />
          </Box>

          <Typography 
            variant="h3" 
            sx={{ 
              mb: 4,
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            {blog.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(124,58,237,0.15)',
                color: '#A78BFA',
                width: 40,
                height: 40,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.2rem',
              }}
            >
              {blog.admin ? blog.admin.charAt(0) : 'A'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#fff' }}>
                {blog.admin || 'Anonymous'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box>
            {blog.content.split('\n').map((paragraph, index) => (
              <Typography 
                key={index}
                sx={{ 
                  mb: 3,
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.1rem',
                  lineHeight: 1.8
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
} 