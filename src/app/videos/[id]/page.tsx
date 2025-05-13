/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Paper,
  Grid,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  VolumeMute,
  VolumeUp,
} from '@mui/icons-material';
import Navbar from '@/components/Navbar';
import { useMediaApi } from '@/hooks/useMediaApi';

export default function VideoPlayer() {
  const params = useParams();
  const id = params?.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const { fetchMediaById, isLoading, error } = useMediaApi();
  const [video, setVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoData = await fetchMediaById(id);
        setVideo(videoData);
      } catch (err) {
        console.error('Failed to fetch video:', err);
      }
    };
    loadVideo();
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
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography>Loading video...</Typography>
      </Box>
    );
  }

  if (error || !video) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography color="error">{error || 'Video not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor={theme.palette.background.default}>
      <Navbar />
      <Box flexGrow={1} pt={8}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            <Grid component="div" size={{ xs: 12, lg: 8 }}>
              {/* Video Player */}
              <Paper elevation={4} sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: 'black' }}>
                <video
                  ref={videoRef}
                  src={video.mediaFileUrl}
                  poster={video.thumbnailUrl}
                  onTimeUpdate={updateProgress}
                  onEnded={() => setIsPlaying(false)}
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'contain',
                    backgroundColor: 'black',
                  }}
                />

                {/* Video Controls */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {/* Progress Bar */}
                  <Box
                    onClick={(e) => {
                      if (videoRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPos = (e.clientX - rect.left) / rect.width;
                        videoRef.current.currentTime = clickPos * videoRef.current.duration;
                      }
                    }}
                    sx={{
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${progress}%`,
                        bgcolor: theme.palette.primary.main,
                        transition: 'width 0.2s',
                      }}
                    />
                  </Box>

                  {/* Buttons */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" gap={2} alignItems="center">
                      <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                        {isPlaying ? <Pause /> : <PlayArrow />}
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.muted = !isMuted;
                            setIsMuted(!isMuted);
                          }
                        }}
                        sx={{ color: 'white' }}
                      >
                        {isMuted ? <VolumeMute /> : <VolumeUp />}
                      </IconButton>
                    </Box>
                    <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Video Info */}
              <Box mt={3}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {video.description}
                </Typography>
                <Box display="flex" gap={3} fontSize={14} color="text.secondary">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>{video.category}</span>
                </Box>
              </Box>
            </Grid>

            {/* Recommended Videos Placeholder */}
            <Grid component="div" size={{ xs: 12, lg: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommended Videos
              </Typography>
              {/* Add component here later */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
