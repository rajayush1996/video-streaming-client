'use client'

import React, { useState } from 'react';
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  CardActionArea,
  IconButton,
  Fade,
} from '@mui/material'
import {
  PlayCircle,
  ThumbUp,
  Comment,
} from '@mui/icons-material'
import { Volume2, VolumeX } from 'lucide-react'

interface ReelCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: number
  likes?: number
  comments?: number
  category: string
  author: string
}

export default function ReelCard({
  id,
  title,
  thumbnail,
  duration,
  views,
  likes,
  comments,
  category,
  author,
}: ReelCardProps) {
  console.log("🚀 ~ title:", title)
  console.log("🚀 ~ id:", id);
  const [isMuted, setIsMuted] = useState(true);
  return (
      <Card
        className="h-full flex flex-col bg-black text-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000',
          color: '#fff',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-4px)' },
        }}
      >
        <CardActionArea component={Link} href={`/reels/${id}`}
          className="group">
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="300"
              image={thumbnail}
              alt={title}
              sx={{ objectFit: 'cover' }}
            />
            <IconButton
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setIsMuted(prev => !prev);
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 12,
              width: 40,
              height: 40,
              bgcolor: 'rgba(20,20,20,0.7)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s, transform 0.2s',
              '&:hover': {
                bgcolor: 'rgba(124,58,237,0.8)',
                transform: 'scale(1.1)',
              },
              zIndex: 2,
            }}
          >
            <Fade in timeout={300} key={isMuted ? 'muted' : 'unmuted'}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Box>
            </Fade>
          </IconButton>
            <Box
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            <Chip
              label={duration}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
              }}
            />
          </Box>
          <CardContent className="bg-black text-white flex flex-col gap-2 p-4 pb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-reel-purple-600 text-white text-xs font-semibold mb-1 w-fit">
              {category}
            </span>
            <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
            <div className="flex items-center text-sm text-foreground/70 gap-4">
              <span>{author}</span>
              <span className="flex items-center gap-1">
                <ThumbUp fontSize="small" className="text-reel-purple-400" />
                {likes}
              </span>
              <span className="flex items-center gap-1">
                <Comment fontSize="small" className="text-reel-purple-400" />
                {comments}
              </span>
              <span className="ml-auto">{views.toLocaleString()} views</span>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
  )
}
