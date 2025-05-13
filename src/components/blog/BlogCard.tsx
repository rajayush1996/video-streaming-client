'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardMedia, CardActionArea } from '@mui/material'

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  thumbnail: string
  author: string
  date: string
  category: string
  readTime?: string
}

export default function BlogCard({
  id,
  title,
  excerpt,
  thumbnail,
  author,
  date,
  category,
  readTime,
}: BlogCardProps) {
  return (
    <Card
      className="bg-black rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-white/10"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardActionArea component={Link} href={`/blog/${id}`}> 
        <CardMedia
          component="img"
          height="200"
          image={thumbnail}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent className="flex flex-col gap-2 p-5 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-reel-purple-700 text-white text-xs font-semibold">
              {category}
            </span>
            {readTime && <span className="text-xs text-white/70">{readTime} read</span>}
          </div>
          <h3 className="font-bold text-xl mb-1 text-white line-clamp-2">{title}</h3>
          <p className="text-white/80 mb-4 line-clamp-3">{excerpt}</p>
          <div className="flex items-center justify-between text-sm text-white/60 mt-auto">
            <span>By {author}</span>
            <span>{date}</span>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
