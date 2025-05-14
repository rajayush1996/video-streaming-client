'use client'

import React, { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
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

interface VideoCardProps {
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
  mediaFileUrl: string
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  duration,
  views,
  likes,
  comments,
  category,
  author,
}: VideoCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const router = useRouter();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/videos/${id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#000',
        color: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px) scale(1.03)' },
      }}
    >
      <CardActionArea component={Link} href={`/videos/${id}`}
        className="group">
        <Box sx={{ position: 'relative', height: 240, width: '100%' }}>
          <CardMedia
            component="img"
            height="240"
            image={thumbnail}
            alt={title}
            sx={{
              objectFit: 'cover',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              width: '100%',
              height: '100%',
              display: 'block',
            }}
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
            <IconButton
              onClick={handlePlayClick}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <PlayCircle sx={{ fontSize: 60 }} />
            </IconButton>
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
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: '#7C3AED',
              color: '#fff',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 0.5,
              fontSize: '0.85rem',
              width: 'fit-content',
            }}
          />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#fff', fontSize: '1.1rem', lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#A78BFA', fontSize: '1rem', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>{author}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUp fontSize="small" sx={{ color: '#A78BFA' }} />
              <Typography variant="body2" sx={{ color: '#A78BFA' }}>{likes}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Comment fontSize="small" sx={{ color: '#A78BFA' }} />
              <Typography variant="body2" sx={{ color: '#A78BFA' }}>{comments}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#fff', marginLeft: 'auto' }}>{views.toLocaleString()} views</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
