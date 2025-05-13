'use client'

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Button,
  Fade
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  ArrowBack
} from '@mui/icons-material';
import { useMediaApi } from '@/hooks/useMediaApi';

interface Media {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  mediaFileUrl: string;
  category: string;
  status: string;
  admin: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ReelDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { fetchMediaById, isLoading, error } = useMediaApi();
  const [media, setMedia] = useState<Media | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadMedia = async () => {
      try {
        const data = (await fetchMediaById(id)) as unknown as Media;
        setMedia(data);
      } catch (err) {
        console.error('Error loading media:', err);
      }
    };

    loadMedia();
  }, [id, fetchMediaById]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const updateProgress = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#18181b">
        <CircularProgress sx={{ color: '#7C3AED' }} />
      </Box>
    );
  }

  if (error || !media) {
    return (
      <Box minHeight="100vh" bgcolor="#18181b" color="white" display="flex" alignItems="center" justifyContent="center">
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={600} mb={2}>
              {error || 'Media not found'}
            </Typography>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/reels')}
              sx={{ color: '#A78BFA', fontWeight: 600, '&:hover': { color: '#C4B5FD' } }}
            >
              Back to Reels
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#18181b" color="white">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/reels')}
          sx={{
            mb: 4,
            color: '#A78BFA',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { color: '#C4B5FD' }
          }}
        >
          Back to Reels
        </Button>

        <Grid container spacing={4}>
          <Box sx={{ flexBasis: { xs: '100%', lg: '66.666%' }, flexGrow: 1, maxWidth: { xs: '100%', lg: '66.666%' } }}>
            {/* Video Player */}
            <Paper elevation={3} sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: '#18181b' }}>
              <video
                ref={videoRef}
                src={media.mediaFileUrl}
                poster={media.thumbnailUrl}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'contain' }}
                onTimeUpdate={updateProgress}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Controls Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 2,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  transition: 'opacity 0.3s',
                }}
              >
                {/* Progress Bar */}
                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    overflow: 'hidden',
                    mb: 2,
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickPos = (e.clientX - rect.left) / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime = clickPos * videoRef.current.duration;
                    }
                  }}
                >
                  <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: '#7C3AED' }} />
                </Box>

                {/* Buttons */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2}>
                    <IconButton sx={{ color: 'white' }} onClick={togglePlay}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>

                    <IconButton sx={{ color: 'white' }} onClick={toggleMute}>
                      <Fade in timeout={200} key={isMuted ? 'muted' : 'unmuted'}>
                        <Box>{isMuted ? <VolumeOff /> : <VolumeUp />}</Box>
                      </Fade>
                    </IconButton>
                  </Box>

                  <IconButton sx={{ color: 'white' }} onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Box>
              </Box>
            </Paper>

            {/* Info Section */}
            <Box mt={6}>
              <Typography variant="h4" fontWeight="bold">
                {media.title}
              </Typography>
              <Typography variant="body2" color="gray" mt={1}>
                {new Date(media.createdAt).toLocaleDateString()}
              </Typography>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: '#7C3AED', width: 40, height: 40 }}>
                  {media.admin?.charAt(0) || 'A'}
                </Avatar>
                <Typography variant="subtitle1" fontWeight="500">
                  {media.admin || 'Anonymous'}
                </Typography>
              </Box>

              <Box mt={4}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {media.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
