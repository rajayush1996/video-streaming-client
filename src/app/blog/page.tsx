/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useBlogApi } from '@/hooks/useBlogApi'
import { Box, Typography, CircularProgress, Container } from '@mui/material'
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
        setBlogs(data.results);
      } catch (err) {
        console.error('Error loading blogs:', err)
      }
    }

    loadBlogs()
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'black'
      }}>
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'black', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <FileText size={48} className="text-reel-purple-500 mx-auto mb-4" />
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}
            >
              Error Loading Blogs
            </Typography>
            <Typography 
              sx={{ 
                mb: 4,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {error}
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="hero-gradient py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Latest Blog Posts</h1>
            <p className="text-lg text-white/90">
              Discover insightful articles about video content creation and trends
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          {blogs.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center',
              py: 8,
              color: 'rgba(255,255,255,0.7)'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No blog posts available
              </Typography>
              <Typography>
                Check back later for new content!
              </Typography>
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article 
                  key={post._id}
                  className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 text-sm rounded-full bg-reel-purple-500/20 text-reel-purple-400">
                        {post.category}
                      </span>
                      <span className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/70">
                        {Math.ceil(post.content.length / 1000)} min read
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-reel-purple-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-white/70 mb-4 line-clamp-3">
                      {post.description || post.content.substring(0, 150)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-reel-purple-500/20 flex items-center justify-center text-reel-purple-400">
                          {post.admin ? post.admin.charAt(0) : 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{post.admin || 'Anonymous'}</p>
                          <p className="text-xs text-white/50">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/blog/${post._id}`}
                        className="inline-flex items-center gap-1 text-reel-purple-400 hover:text-reel-purple-300 transition-colors"
                      >
                        Read More
                        <svg 
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 