/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useBlogApi } from '@/hooks/useBlogApi'
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Chip,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button
} from '@mui/material'
import { FileText } from 'lucide-react'

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

export default function BlogPage() {
  const { fetchBlogs, isLoading, error } = useBlogApi()
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data: any = await fetchBlogs()
        setBlogs(data.results)
      } catch (err) {
        console.error('Error loading blogs:', err)
      }
    }

    loadBlogs()
  }, [])

  if (isLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#18181b">
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box minHeight="100vh" bgcolor="#18181b" color="white" display="flex" alignItems="center" justifyContent="center">
        <Container maxWidth="md">
          <Box textAlign="center">
            <FileText size={48} color="#7C3AED" />
            <Typography variant="h4" fontWeight={600} sx={{ mt: 2 }}>Error Loading Blogs</Typography>
            <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.7)' }}>{error}</Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box minHeight="100vh" bgcolor="#18181b" color="#fff">
      <Box py={8} textAlign="center">
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Latest Blog Posts
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Discover insightful articles about video content creation and trends
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {blogs.length === 0 ? (
          <Box textAlign="center" py={8} color="rgba(255,255,255,0.7)">
            <Typography variant="h6" gutterBottom>No blog posts available</Typography>
            <Typography>Check back later for new content!</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {blogs.map((post) => (
              <Grid component="div" size= {{ xs: 12, sm:6 , md:4 }} key={post._id}>
                <Card
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.08)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <CardContent>
                    <Box mb={2} display="flex" gap={1} flexWrap="wrap">
                      <Chip label={post.category} size="small" sx={{ bgcolor: '#7C3AED22', color: '#a78bfa' }} />
                      <Chip label={`${Math.ceil(post.content.length / 1000)} min read`} size="small" sx={{ bgcolor: '#fff1', color: '#fff9' }} />
                    </Box>

                    <Typography variant="h6" gutterBottom noWrap>
                      {post.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
                      {post.description || post.content.substring(0, 150)}...
                    </Typography>

                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ bgcolor: '#7C3AED22', color: '#a78bfa' }}>
                          {post.admin ? post.admin.charAt(0) : 'A'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{post.admin || 'Anonymous'}</Typography>
                          <Typography variant="caption" color="#aaa">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      <Link href={`/blog/${post._id}`} passHref>
                        <Button size="small" sx={{ color: '#a78bfa', textTransform: 'none' }}>
                          Read More →
                        </Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
